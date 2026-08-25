"use client";

import i18next, { type i18n as I18nInstance } from "i18next";
import { initReactI18next } from "react-i18next";

import {
  defaultLanguage,
  resources,
  supportedLanguages,
  type AppLanguage,
} from "./resources";

/**
 * One i18next instance per language, not one instance that changes language.
 *
 * This module has been wrong twice, in opposite directions, and both failures
 * were silent enough to be worth recording here.
 *
 * **First shape — one global instance, initialised at import with the default
 * language, switched from `localStorage` after hydration.** Fine while the site
 * was one page and the server only ever produced English. It stops being fine
 * the moment language lives in the URL: `/ru/pricing` is server-rendered in
 * Russian, so the first *client* render has to already be Russian or React
 * reconciles a Russian tree against an English one.
 *
 * **Second shape — one global instance, initialised with the URL's language, and
 * `changeLanguage()` when it already existed at another language.** Two bugs,
 * one on each side of the wire:
 *
 *   - On the client, that `changeLanguage` ran from `Providers`' `useState`
 *     initialiser — during render. `changeLanguage` emits `languageChanged`
 *     synchronously and every mounted `useTranslation` answers with a
 *     `setState`, so React threw "Cannot update a component while rendering a
 *     different component".
 *   - On the server, `"use client"` does not mean *only* on the client: these
 *     components are still SSR'd, where the module is a **per-process singleton
 *     shared by every request**. Once any request had initialised it, a later
 *     request for another language found `isInitialized` true and rendered in
 *     whatever language happened to be loaded first. Under load that is a page
 *     served in the wrong language; in dev it showed up as a hydration mismatch
 *     on `/ru` after `/` had been visited.
 *
 * **This shape.** `getI18n(lang)` returns the instance *for that language*,
 * creating it on first use. Nothing is ever mutated after creation, so there is
 * no cross-request leakage on the server and no synchronous event storm on the
 * client. A new instance has no subscribers, so creating one during render
 * notifies nobody. At most three exist.
 *
 * The tree reads it through `I18nextProvider`. Anything that can render *outside*
 * that provider — `app/global-not-found.tsx` — must use `tServer` instead; see
 * `src/i18n/server.ts`.
 */
const instances = new Map<AppLanguage, I18nInstance>();

export function getI18n(lang: AppLanguage): I18nInstance {
  const existing = instances.get(lang);
  if (existing) return existing;

  const instance = i18next.createInstance();

  void instance.use(initReactI18next).init({
    resources,
    lng: lang,
    fallbackLng: defaultLanguage,
    supportedLngs: [...supportedLanguages],
    interpolation: {
      escapeValue: false,
    },
    react: {
      // Every catalog is bundled, so there is nothing to load and no boundary to
      // suspend against; leaving this on makes a navigation flash empty.
      useSuspense: false,
    },
  });

  instances.set(lang, instance);
  return instance;
}
