"use client";

import Link from "next/link";
import { House } from "lucide-react";
import { useTranslation } from "react-i18next";

import ShellBackdrop from "@/components/Custom/ShellBackdrop";
import { Button } from "@/components/ui/Button";

/**
 * The global 404 boundary must render a page rather than throwing a redirect.
 *
 * Application URLs never reach this boundary: the proxy 308s every app route
 * family to app.dwelve.uz before rendering, so a 404 here is a genuinely
 * mistyped marketing URL — and home is the only sensible way out.
 */
export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="relative isolate min-h-dvh">
      <ShellBackdrop anchor="viewport" />

      <main className="relative z-10 mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-[1180px] items-center justify-center px-4 py-6 md:px-8 md:py-8">
        <div className="flex max-w-md flex-col items-center gap-2 text-center">
          <h1 className="text-lg font-semibold text-foreground">
            {t("root.notFound.title")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("root.notFound.description")}
          </p>
          <Button asChild className="mt-4">
            <Link href="/">
              <House className="size-4" />
              {t("root.notFound.home")}
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
