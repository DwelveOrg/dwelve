import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import "react-toastify/dist/ReactToastify.css";
import "@/components/ui/toast.css";
import { FONT_VARIABLES } from "../fonts";
import Providers from "./providers";
import Toaster from "@/components/ui/toaster";
import { BRAND_NAME } from "@/constants/brand";
import {
  isSupportedLanguage,
  LANGUAGE_TAGS,
  supportedLanguages,
  type AppLanguage,
} from "@/i18n/resources";
import { tServer } from "@/i18n/server";
import { SITE_URL } from "@/lib/seo";
import { cn } from "@/lib/utils";

/**
 * The three languages are the whole route space above the root layout, so they
 * are known at build time and every page can be prerendered per language.
 *
 * `dynamicParams = false` makes any other segment a routing-level 404, served by
 * `app/global-not-found.tsx` as real server HTML — rather than reaching the
 * layout below and throwing `notFound()`, which renders an empty document. The
 * proxy already rewrites unknown prefixes into `/en/...`, so this is the second
 * lock on the same door.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return supportedLanguages.map((lang) => ({ lang }));
}

/**
 * Layout-level defaults only. Each page supplies its own title, description,
 * canonical and `hreflang` set through `pageMetadata()` — this exists so that a
 * page which forgets still inherits a correct base URL, brand name and icons.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const language: AppLanguage = isSupportedLanguage(lang) ? lang : "en";

  return {
    metadataBase: new URL(SITE_URL),
    applicationName: BRAND_NAME,
    title: {
      default: tServer(language, "seo.home.title"),
      template: `%s | ${BRAND_NAME}`,
    },
    description: tServer(language, "seo.home.description"),
    category: "education",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    icons: {
      icon: [
        { url: "/logo/favicon/favicon.svg", type: "image/svg+xml" },
        { url: "/logo/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/logo/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      ],
      apple: "/logo/app-icons/apple-touch-icon.png",
    },
  };
}

/**
 * The root layout, and the first place the language becomes real.
 *
 * `<html lang>` gets the BCP-47 tag rather than the URL segment: Uzbek ships in
 * Latin script and `uz-Latn` says so, which is what a screen reader needs to
 * pick a voice and what a translation tool needs to not offer a translation of a
 * page already in the reader's language.
 *
 * An unrecognised segment 404s rather than falling back to English. The proxy
 * only ever produces `en`, `ru` or `uz`, so anything else is a hand-typed URL —
 * and answering `/de/pricing` with the English page would put an unbounded set
 * of duplicate URLs into the index.
 */
export default async function LocalizedRootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  if (!isSupportedLanguage(lang)) notFound();

  return (
    <html
      lang={LANGUAGE_TAGS[lang]}
      suppressHydrationWarning
      className={cn("font-sans", ...FONT_VARIABLES)}
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        {/* Toaster lives inside Providers so it can read the resolved theme. */}
        <Providers lang={lang}>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
