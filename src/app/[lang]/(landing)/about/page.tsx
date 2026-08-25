import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { isSupportedLanguage } from "@/i18n/resources";
import { pageMetadata } from "@/lib/page-metadata";
import AboutContent from "./AboutContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isSupportedLanguage(lang)) notFound();
  return pageMetadata("/about", lang);
}

export default function AboutPage() {
  return <AboutContent />;
}
