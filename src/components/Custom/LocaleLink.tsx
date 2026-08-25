"use client";

import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

import { useLocalizedHref } from "@/lib/routing";

/**
 * `next/link` that keeps the reader in the language they are already reading.
 *
 * Every internal marketing link goes through this. Written as a wrapper rather
 * than as a lint rule because the failure is silent: a plain `<Link href="/about">`
 * renders and navigates perfectly well, it just drops a Russian reader onto the
 * English page — and then that URL is the one they share.
 *
 * Absolute URLs (`appHref()` results), `mailto:` and bare hashes are passed
 * straight through, so this is safe to use for every link in a list without
 * sorting them first.
 */
export default function LocaleLink({
  href,
  ...props
}: Omit<ComponentPropsWithoutRef<typeof Link>, "href"> & { href: string }) {
  const localize = useLocalizedHref();
  return <Link href={localize(href)} {...props} />;
}
