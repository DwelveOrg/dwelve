"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "motion/react";
import { Bug, Mail, School } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import Surface from "@/components/ui/Surface";
import { SUPPORT_EMAIL } from "@/constants/brand";
import { appHref } from "@/lib/hosts";
import ClosingCta from "../_components/ClosingCta";
import PageHeader from "../_components/PageHeader";
import { LANDING_HEADING } from "../_components/SectionHeading";

/**
 * Contact, with no contact form.
 *
 * This repository has no backend and, per `AGENTS.md`, is never getting one — a
 * form here would either post nowhere or need an API route that the marketing
 * site is explicitly not allowed to own. More to the point, a form is a worse
 * answer than an address: it hides where the message goes, gives the sender no
 * copy of what they wrote, and cannot carry the screenshot that makes a bug
 * report actionable.
 *
 * So the page routes by intent instead — general questions, a school evaluating
 * Dwelve, a bug — and each route is a real destination. The subject lines are
 * prefilled because a mailbox with one address and no triage is sorted by
 * subject, and asking the sender to type the right one never works.
 *
 * "What to include" exists for the same reason: the difference between a report
 * that can be acted on today and one that costs three round-trips is four facts,
 * and this is the only place to ask for them before they are omitted.
 */

type Channel = {
  key: string;
  Icon: LucideIcon;
  href: string;
  /** Shown under the description as the literal destination, when there is one. */
  address: string;
};

const CHANNELS: Channel[] = [
  {
    key: "general",
    Icon: Mail,
    href: `mailto:${SUPPORT_EMAIL}`,
    address: SUPPORT_EMAIL,
  },
  {
    key: "schools",
    Icon: School,
    href: `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("Dwelve for our school")}`,
    address: SUPPORT_EMAIL,
  },
  {
    key: "bug",
    Icon: Bug,
    href: appHref("/dashboard"),
    address: "",
  },
];

const INCLUDE_KEYS = ["i1", "i2", "i3", "i4"] as const;

export default function ContactContent() {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      <PageHeader
        eyebrow={t("landing.contact.eyebrow")}
        title={t("landing.contact.title")}
        lead={t("landing.contact.lead")}
      />

      <section className="w-full px-4 py-12 sm:px-6">
        <div className="mx-auto grid w-full max-w-6xl gap-5 lg:grid-cols-3">
          {CHANNELS.map((channel, index) => (
            <motion.a
              key={channel.key}
              href={channel.href}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.35, delay: shouldReduceMotion ? 0 : index * 0.06 }}
              className="rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
            >
              <Surface
                padding="lg"
                radius="lg"
                elevation={1}
                className="h-full p-6 transition-colors hover:border-primary/40"
              >
                <span
                  aria-hidden="true"
                  className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground"
                >
                  <channel.Icon className="size-5" />
                </span>
                <h2 className="mt-5 text-base font-semibold text-foreground">
                  {t(`landing.contact.channels.${channel.key}.title`)}
                </h2>
                <p className="mt-2.5 text-15 leading-relaxed text-muted-foreground">
                  {t(`landing.contact.channels.${channel.key}.body`)}
                </p>
                <p className="mt-4 text-sm font-medium text-primary">
                  {channel.address || t(`landing.contact.channels.${channel.key}.action`)}
                </p>
              </Surface>
            </motion.a>
          ))}
        </div>
      </section>

      <section className="w-full px-4 py-12 sm:px-6">
        <div className="mx-auto w-full max-w-6xl">
          <Surface variant="muted" padding="lg" radius="lg" elevation={0} className="p-6 sm:p-10">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className={LANDING_HEADING}>{t("landing.contact.include.title")}</h2>
              <p className="mt-4 text-15 leading-relaxed text-muted-foreground">
                {t("landing.contact.include.subtitle")}
              </p>
            </div>

            {/* The steps stay left-aligned inside the centred block: a numbered
                list whose numbers do not share a left edge is not a list. */}
            <ol className="mx-auto mt-9 grid max-w-3xl gap-4 sm:grid-cols-2">
              {INCLUDE_KEYS.map((key, index) => (
                <li key={key} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="numeric mt-px flex size-6 shrink-0 items-center justify-center rounded-full bg-accent text-3xs font-bold text-accent-foreground"
                  >
                    {index + 1}
                  </span>
                  <span className="text-15 leading-relaxed text-muted-foreground">
                    {t(`landing.contact.include.${key}`)}
                  </span>
                </li>
              ))}
            </ol>

            <p className="mx-auto mt-8 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground">
              {t("landing.contact.include.response")}
            </p>
          </Surface>
        </div>
      </section>

      <ClosingCta
        title={t("landing.contact.cta.title")}
        subtitle={t("landing.contact.cta.subtitle")}
        primary={{
          label: t("landing.contact.cta.primary"),
          href: appHref("/signup"),
          raw: true,
        }}
        secondary={{ label: t("landing.contact.cta.secondary"), href: "/pricing" }}
      />
    </>
  );
}
