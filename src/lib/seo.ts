import type { Metadata } from "next";

/**
 * The one production origin. `next.config.ts` imports this for its canonical
 * host redirects, so this module must stay free of `@/` alias imports and of
 * anything that drags the message catalogs in — the config loader resolves it
 * outside the app's module graph.
 *
 * Page titles and descriptions live in the message catalogs under `seo.*` and
 * are assembled per language by `src/lib/page-metadata.ts`.
 */
export const SITE_URL = "https://dwelve.uz" as const;

export const PRIVATE_ROBOTS: Metadata["robots"] = {
  index: false,
  follow: false,
  nocache: true,
  googleBot: {
    index: false,
    follow: false,
    noimageindex: true,
  },
};

/**
 * What an indexable marketing page tells a crawler it may do. Large previews and
 * unlimited snippets are the point of a marketing page — the defaults truncate
 * both.
 */
export const PUBLIC_ROBOTS: Metadata["robots"] = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    noimageindex: false,
    "max-video-preview": -1,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
};

/** Social card art, shared by every page until a page earns its own. */
export const OG_IMAGE = {
  url: "/logo/social/og-image.png",
  width: 1200,
  height: 630,
} as const;

export const TWITTER_IMAGE = "/logo/social/twitter-card.png" as const;
