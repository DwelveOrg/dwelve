"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * The opening of every page that is not the home page.
 *
 * The home page opens with a hero: two columns, a 3D object, a badge with a live
 * dot. Repeating that on `/terms` would be absurd, and giving each of the six
 * pages its own opening would give the site six different first impressions.
 *
 * So: one eyebrow, one `<h1>`, one lead paragraph, optional actions — centred on
 * the page, which is the same axis `SectionHeading` already puts every home-page
 * section on. Left-aligning these read as a different site the moment you
 * navigated to one, because nothing else on the site opens off-axis.
 *
 * The `<h1>` uses the hero's own clamp one step down, which keeps a sub-page
 * recognisably part of the same document without competing with the page that
 * has to do the selling. Each element carries its own measure — the heading is
 * allowed to be wider than the lead — so a centred column does not collapse into
 * one ragged block.
 */
export default function PageHeader({
  eyebrow,
  title,
  lead,
  children,
  className,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  /** Actions, a price, a status line — anything that belongs above the fold. */
  children?: React.ReactNode;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className={cn("w-full px-4 pb-4 pt-14 sm:px-6 md:pt-20", className)}>
      <motion.div
        className="mx-auto w-full max-w-6xl text-center"
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
        ) : null}

        <h1
          className={cn(
            "mx-auto max-w-3xl text-balance text-[clamp(2.1rem,4.6vw,3.1rem)] font-bold leading-[1.08] tracking-[-0.02em] text-foreground",
            eyebrow && "mt-4",
          )}
        >
          {title}
        </h1>

        {lead ? (
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {lead}
          </p>
        ) : null}

        {children ? <div className="mt-8 flex flex-wrap justify-center gap-3">{children}</div> : null}
      </motion.div>
    </section>
  );
}
