import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { isSupportedLanguage } from "@/i18n/resources";
import { tLegalSectionsServer, tServer } from "@/i18n/server";
import { pageMetadata } from "@/lib/page-metadata";
import LegalDocument from "../_components/LegalDocument";
import PageHeader from "../_components/PageHeader";

/**
 * Server-rendered, and the only pages here that ship no JavaScript of their own.
 * Their body is data in the message catalogs (`landing.legal.privacy.sections`),
 * read through `tLegalSectionsServer` — see `LegalDocument` for why.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isSupportedLanguage(lang)) notFound();
  return pageMetadata("/privacy", lang);
}

export default async function PrivacyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isSupportedLanguage(lang)) notFound();

  return (
    <>
      <PageHeader
        eyebrow={tServer(lang, "landing.legal.eyebrow")}
        title={tServer(lang, "landing.legal.privacy.title")}
        lead={tServer(lang, "landing.legal.privacy.lead")}
      />
      <LegalDocument
        updated={tServer(lang, "landing.legal.privacy.updated")}
        intro={tServer(lang, "landing.legal.privacy.intro")}
        sections={tLegalSectionsServer(lang, "landing.legal.privacy.sections")}
      />
    </>
  );
}
