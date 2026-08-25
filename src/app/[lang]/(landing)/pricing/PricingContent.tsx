"use client";

import React from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "motion/react";
import { Check, Info } from "lucide-react";

import Button from "@/components/ui/Button";
import Surface from "@/components/ui/Surface";
import { cn } from "@/lib/utils";
import { appHref } from "@/lib/hosts";
import ClosingCta from "../_components/ClosingCta";
import FaqList, { type FaqItem } from "../_components/FaqList";
import PageHeader from "../_components/PageHeader";
import { LANDING_HEADING } from "../_components/SectionHeading";

/**
 * Pricing, while there is no price.
 *
 * Dwelve is in early access and costs nothing. The temptation on a page like
 * this is to invent a ladder anyway — a greyed-out "Pro £29" beside a "Contact
 * sales" — because three columns look like a business and one looks like a
 * hobby. That would be a made-up number on the one page a school administrator
 * reads most carefully, and the first thing they would do is quote it back.
 *
 * So: one plan, the real one, with what it includes and an honest paragraph
 * about what happens when it ends. The FAQ answers the questions that a free
 * plan actually raises — *will you start charging me without warning, what
 * happens to my tests, is my data the product* — which is the anxiety a missing
 * price creates and the thing the page has to resolve.
 *
 * The included list is capability, not quota. Every limit named here is one the
 * product genuinely has; there are no invented seat counts.
 */

const INCLUDED = ["i1", "i2", "i3", "i4", "i5", "i6", "i7"] as const;
const FAQ_KEYS = ["q1", "q2", "q3", "q4", "q5", "q6"] as const;

export default function PricingContent() {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  const faqItems: FaqItem[] = FAQ_KEYS.map((key) => ({
    key,
    question: t(`landing.pricing.faq.${key}.question`),
    answer: t(`landing.pricing.faq.${key}.answer`),
  }));

  return (
    <>
      <PageHeader
        eyebrow={t("landing.pricing.eyebrow")}
        title={t("landing.pricing.title")}
        lead={t("landing.pricing.lead")}
      />

      <section className="w-full px-4 py-14 sm:px-6">
        <motion.div
          className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start"
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45 }}
        >
          {/* The plan. `elevation={2}` rather than 1: this is the one panel on
              the page that is being offered, and the rest of the page rests. */}
          <Surface padding="lg" radius="lg" elevation={2} className="p-6 sm:p-8">
            <p className="type-micro text-primary">{t("landing.pricing.plan.name")}</p>

            <div className="mt-4 flex items-end gap-3">
              <span className="text-5xl font-bold leading-none tracking-[-0.03em] text-foreground">
                {t("landing.pricing.plan.price")}
              </span>
              <span className="pb-1 text-sm text-muted-foreground">
                {t("landing.pricing.plan.period")}
              </span>
            </div>

            <p className="mt-4 text-15 leading-relaxed text-muted-foreground">
              {t("landing.pricing.plan.description")}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild variant="brand" size="xl">
                <Link href={appHref("/signup")}>{t("landing.pricing.plan.cta")}</Link>
              </Button>
            </div>

            <p className="mt-3 text-xs text-muted-foreground">
              {t("landing.pricing.plan.ctaNote")}
            </p>

            <ul className="mt-8 space-y-3.5 border-t border-border/60 pt-7">
              {INCLUDED.map((key) => (
                <li key={key} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground"
                  >
                    <Check className="size-3.5" strokeWidth={3} />
                  </span>
                  <span className="text-15 leading-relaxed text-muted-foreground">
                    {t(`landing.pricing.plan.included.${key}`)}
                  </span>
                </li>
              ))}
            </ul>
          </Surface>

          {/* What a missing price actually leaves unanswered. A `muted` surface
              so it reads as a note beside the offer, not a second offer, and
              sticky so it stays beside the plan rather than leaving a column of
              dead space next to the included list. */}
          <Surface
            variant="muted"
            padding="lg"
            radius="lg"
            elevation={0}
            className="p-6 sm:p-8 lg:sticky lg:top-24"
          >
            <div className="flex items-center gap-2.5">
              <Info aria-hidden className="size-4 text-primary" />
              <h2 className="text-base font-semibold text-foreground">
                {t("landing.pricing.note.title")}
              </h2>
            </div>

            <div className="mt-4 space-y-4 text-15 leading-relaxed text-muted-foreground">
              <p>{t("landing.pricing.note.p1")}</p>
              <p>{t("landing.pricing.note.p2")}</p>
              <p>{t("landing.pricing.note.p3")}</p>
            </div>
          </Surface>
        </motion.div>
      </section>

      <section className="w-full px-4 py-14 sm:px-6">
        <div className="mx-auto w-full max-w-3xl">
          <h2 className={cn(LANDING_HEADING, "text-center")}>{t("landing.pricing.faq.title")}</h2>
          <FaqList items={faqItems} className="mt-8" />
        </div>
      </section>

      <ClosingCta
        title={t("landing.pricing.cta.title")}
        subtitle={t("landing.pricing.cta.subtitle")}
        primary={{
          label: t("landing.pricing.cta.primary"),
          href: appHref("/signup"),
          raw: true,
        }}
        secondary={{ label: t("landing.pricing.cta.secondary"), href: "/contact" }}
      />
    </>
  );
}
