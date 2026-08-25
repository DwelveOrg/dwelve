"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Check } from "lucide-react";

import LocaleLink from "@/components/Custom/LocaleLink";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/**
 * The violet closing band, as a component rather than as one section's markup.
 *
 * The home page's closing CTA owned this treatment. Every new page needs the
 * same ending — a page that argues a case and then simply stops leaves the
 * reader at the footer with no offer — and the alternative was six copies of the
 * band's markup, six chances for one of them to drift, and six places to edit
 * when `.cta-band` changes.
 *
 * It is a split, not a centred stack. The centred heading-subtitle-buttons block
 * is the default shape of every SaaS closing CTA, and it leaves the last
 * objections — *what does it cost, what do I have to install, how long is this
 * going to take* — unanswered at the exact moment they are loudest. The right
 * column answers them before the visitor has to ask, which is worth more than
 * the symmetry it costs. Pass `points` when a page has three such answers; omit
 * it and the heading takes the full width.
 *
 * The band is the same slab in both themes; see the note on `.cta-band` in
 * globals.css for why the copy on it is plain white rather than a theme token.
 */
export type CtaAction = {
  label: string;
  /** Unprefixed internal path, an in-page hash, or an absolute `appHref()` URL. */
  href: string;
  /**
   * The href is already final — skip `LocaleLink`.
   *
   * Two callers need this: absolute `appHref()` URLs, which must never be
   * language-prefixed, and the 404, which renders outside the layout tree where
   * `useParams()` has nothing to read and so localizes its own paths on the
   * server before passing them in.
   */
  raw?: boolean;
};

export default function ClosingCta({
  id,
  title,
  subtitle,
  primary,
  secondary,
  points,
  className,
}: {
  id?: string;
  title: string;
  subtitle: string;
  primary: CtaAction;
  secondary?: CtaAction;
  points?: readonly string[];
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();
  const hasPoints = !!points?.length;

  const renderAction = (action: CtaAction, variant: "inverse" | "inverse-ghost") => {
    const content = (
      <>
        {action.label}
        {variant === "inverse-ghost" ? (
          <ArrowRight className="transition-transform duration-[var(--dur-2)] group-hover/button:translate-x-0.5" />
        ) : null}
      </>
    );

    return (
      <Button asChild variant={variant} size="xl">
        {action.raw ? (
          <Link href={action.href}>{content}</Link>
        ) : (
          <LocaleLink href={action.href}>{content}</LocaleLink>
        )}
      </Button>
    );
  };

  return (
    <section id={id} className={cn("w-full scroll-mt-24 px-4 py-24 sm:px-6 md:py-32", className)}>
      <motion.div
        className="cta-band relative mx-auto max-w-6xl overflow-hidden rounded-3xl px-6 py-14 sm:px-12 sm:py-16 lg:px-16 lg:py-20"
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.5 }}
      >
        {/* Ruled paper, masked so it dies before every edge. */}
        <div aria-hidden="true" className="cta-rules pointer-events-none absolute inset-0" />

        <div
          className={cn(
            "relative grid gap-10",
            hasPoints && "lg:grid-cols-[1.15fr_minmax(0,0.85fr)] lg:items-center lg:gap-16",
          )}
        >
          <div>
            <h2 className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[2.6rem] lg:leading-[1.08]">
              {title}
            </h2>

            <p className="mt-4 max-w-lg text-base leading-relaxed text-white/75">{subtitle}</p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              {renderAction(primary, "inverse")}
              {secondary ? renderAction(secondary, "inverse-ghost") : null}
            </div>
          </div>

          {hasPoints ? (
            // A hairline rather than a card: a panel here would read as a second
            // surface on a surface, and the band is meant to be one plane.
            <ul className="space-y-4 border-t border-white/15 pt-8 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
              {points!.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-white/15"
                  >
                    <Check className="size-3 text-white" strokeWidth={3} />
                  </span>
                  <span className="text-sm leading-relaxed text-white/85">{point}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </motion.div>
    </section>
  );
}
