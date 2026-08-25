"use client";

import React from "react";
import { useTranslation } from "react-i18next";

import { appHref } from "@/lib/hosts";
import ClosingCta from "../_components/ClosingCta";

/**
 * The home page's closing band.
 *
 * Nine sections have argued the case on the product's own surfaces — canvas,
 * card, hairline. This is where the page stops arguing and asks. The band itself
 * lives in `ClosingCta`, which every other page ends with too; this file is only
 * the home page's copy and its two destinations.
 */
const POINTS = ["point1", "point2", "point3"] as const;

export default function CallToAction() {
  const { t } = useTranslation();

  return (
    <ClosingCta
      id="cta"
      title={t("landing.cta.title")}
      subtitle={t("landing.cta.subtitle")}
      primary={{ label: t("landing.cta.primary"), href: appHref("/signup"), raw: true }}
      secondary={{ label: t("landing.cta.secondary"), href: "/#how-it-works" }}
      points={POINTS.map((key) => t(`landing.cta.${key}`))}
    />
  );
}
