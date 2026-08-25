"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "motion/react";
import { Clock, Globe, Laptop, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import Surface from "@/components/ui/Surface";
import { appHref } from "@/lib/hosts";
import ClosingCta from "../_components/ClosingCta";
import PageHeader from "../_components/PageHeader";
import { LANDING_HEADING } from "../_components/SectionHeading";

/**
 * About, without the founding myth.
 *
 * The genre expects a story: a dorm room, a frustrated teacher, a number of
 * schools already on board. Dwelve is in early access and none of those numbers
 * exist yet, so writing them would be inventing a company. The repository has a
 * documented allergy to exactly that — one of its releases is literally
 * "Rebuild onboarding one screen at a time, drop the invented numbers".
 *
 * What is left when you refuse to invent is what the product is actually for and
 * the four commitments its code visibly keeps. Every principle below can be
 * checked against the product in a browser, which is the only kind of claim this
 * page is allowed to make.
 */

const PRINCIPLES: { key: string; Icon: LucideIcon }[] = [
  { key: "control", Icon: ShieldCheck },
  { key: "hardware", Icon: Laptop },
  { key: "language", Icon: Globe },
  { key: "honesty", Icon: Clock },
];

export default function AboutContent() {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      <PageHeader
        eyebrow={t("landing.about.eyebrow")}
        title={t("landing.about.title")}
        lead={t("landing.about.lead")}
      />

      {/* The argument, at reading measure rather than page width. Prose set to
          the 6xl frame is unreadable; `max-w-2xl` is roughly 70 characters. */}
      <section className="w-full px-4 py-12 sm:px-6">
        <motion.div
          className="mx-auto w-full max-w-6xl"
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45 }}
        >
          <div className="mx-auto max-w-2xl space-y-5 text-center text-base leading-relaxed text-muted-foreground">
            <p>{t("landing.about.story.p1")}</p>
            <p>{t("landing.about.story.p2")}</p>
            <p>{t("landing.about.story.p3")}</p>
          </div>
        </motion.div>
      </section>

      <section className="w-full px-4 py-12 sm:px-6">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className={LANDING_HEADING}>{t("landing.about.principles.title")}</h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              {t("landing.about.principles.subtitle")}
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {PRINCIPLES.map(({ key, Icon }, index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.35, delay: shouldReduceMotion ? 0 : index * 0.06 }}
              >
                <Surface padding="lg" radius="lg" elevation={1} className="h-full p-6">
                  <span
                    aria-hidden="true"
                    className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground"
                  >
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-5 text-base font-semibold text-foreground">
                    {t(`landing.about.principles.${key}.title`)}
                  </h3>
                  <p className="mt-2.5 text-15 leading-relaxed text-muted-foreground">
                    {t(`landing.about.principles.${key}.body`)}
                  </p>
                </Surface>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Where the product actually is. This is the section an about page
          usually replaces with a customer logo wall. */}
      <section className="w-full px-4 py-12 sm:px-6">
        <div className="mx-auto w-full max-w-6xl">
          <Surface variant="muted" padding="lg" radius="lg" elevation={0} className="p-6 text-center sm:p-10">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {t("landing.about.status.title")}
            </h2>
            <div className="mx-auto mt-5 max-w-2xl space-y-4 text-15 leading-relaxed text-muted-foreground">
              <p>{t("landing.about.status.p1")}</p>
              <p>{t("landing.about.status.p2")}</p>
            </div>
          </Surface>
        </div>
      </section>

      <ClosingCta
        title={t("landing.about.cta.title")}
        subtitle={t("landing.about.cta.subtitle")}
        primary={{
          label: t("landing.about.cta.primary"),
          href: appHref("/signup"),
          raw: true,
        }}
        secondary={{ label: t("landing.about.cta.secondary"), href: "/contact" }}
      />
    </>
  );
}
