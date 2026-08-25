"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import {
  defaultLanguage,
  resources,
  supportedLanguages,
  type AppLanguage,
} from "./resources";

/**
 * The client i18next instance, initialised from the URL.
 *
 * This module used to init at import time with `lng: defaultLanguage`, and
 * `Providers` then switched to whatever was in `localStorage`. That is a
 * client-side language toggle, and it was fine while the site was one page: the
 * markup the server sent was always English, and the browser corrected it after
 * hydration.
 *
 * It stops being fine the moment language lives in the URL. `/ru/pricing` is
 * server-rendered in Russian, so the first client render has to *already* be
 * Russian or React reconciles a Russian tree against an English one and
 * hydration mismatches on every visible string. Hence `initI18n(lang)`, called
 * from the render body of `Providers` before any child renders — the resources
 * are bundled, so there is nothing to await.
 *
 * The URL is the only source of truth now. There is no stored preference: a
 * saved language that silently rewrites `/pricing` into Russian would give one
 * URL two contents, which is precisely what the canonical/hreflang setup exists
 * to prevent. `LanguageSwitcher` navigates instead.
 */
export function initI18n(lang: AppLanguage) {
  if (!i18n.isInitialized) {
    void i18n.use(initReactI18next).init({
      resources,
      lng: lang,
      fallbackLng: defaultLanguage,
      supportedLngs: [...supportedLanguages],
      interpolation: {
        escapeValue: false,
      },
      react: {
        // Nothing is loaded asynchronously, so there is no boundary to suspend
        // against; leaving this on makes a client navigation flash empty.
        useSuspense: false,
      },
    });
  } else if (i18n.language !== lang) {
    void i18n.changeLanguage(lang);
  }

  return i18n;
}

export default i18n;
