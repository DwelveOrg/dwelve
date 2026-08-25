import type { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";

import MainPage from "./_sections/MainPage";
import AiGeneration from "./_sections/AiGeneration";
import TeacherControl from "./_sections/TeacherControl";
import HowItWorks from "./_sections/HowItWorks";
import Feature from "./_sections/Features";
import Roles from "./_sections/Roles";
import Analytics from "./_sections/Analytics";
import LandingAccordion from "./_sections/Accordion";
import CallToAction from "./_sections/CallToAction";
import { isSupportedLanguage } from "@/i18n/resources";
import { homeStructuredData, jsonLd, pageMetadata } from "@/lib/page-metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isSupportedLanguage(lang)) notFound();
  return pageMetadata("/", lang);
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isSupportedLanguage(lang)) notFound();

  return (
    <>
      {/* Emitted server-side in the page's own language, which is the whole
          reason the language is in the URL: a crawler reading /ru/ gets Russian
          structured data, not English that a `useEffect` corrects later. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(homeStructuredData(lang)) }}
      />
      <MainPage />
      <AiGeneration />
      <TeacherControl />
      <Feature />
      <Roles />
      <HowItWorks />
      <Analytics />
      <LandingAccordion />
      <CallToAction />
    </>
  );
}
