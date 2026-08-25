"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "motion/react";

import FaqList, { type FaqItem } from "../_components/FaqList";
import { LANDING_HEADING } from "../_components/SectionHeading";

/** The eight questions the home page answers. Pricing has its own set. */
const ITEM_KEYS = [
  "item1",
  "item2",
  "item3",
  "item4",
  "item5",
  "item6",
  "item7",
  "item8",
] as const;

export default function LandingAccordion() {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  const items: FaqItem[] = ITEM_KEYS.map((key) => ({
    key,
    question: t(`landing.accordion.${key}.question`),
    answer: t(`landing.accordion.${key}.answer`),
  }));

  return (
    <section id="accordion" className="w-full scroll-mt-24 py-20">
      <div className="mx-auto w-full max-w-5xl px-4">
        <motion.div
          className="mb-10 text-center"
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className={LANDING_HEADING}>{t("landing.accordion.title")}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground">
            {t("landing.accordion.subtitle")}
          </p>
        </motion.div>

        <FaqList items={items} />
      </div>
    </section>
  );
}
