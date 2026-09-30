/**
 * Site-wide settings: brand, links, downloads and the QR destination.
 *
 * Values marked "env" can also be set without editing code, via environment
 * variables at build time (e.g. in `.env.local`), because the site is exported
 * as static HTML:
 *
 *   NEXT_PUBLIC_SITE_URL           canonical URL, used for social previews
 *   NEXT_PUBLIC_GOOGLE_PLAY_URL    Google Play listing (enables the button)
 *   NEXT_PUBLIC_APP_STORE_URL      App Store listing (enables the button)
 *   NEXT_PUBLIC_DOWNLOAD_URL       where the QR code points (defaults to the
 *                                  first published store link)
 *   NEXT_PUBLIC_CONTACT_EMAIL      contact address in the footer
 *   NEXT_PUBLIC_APK_URL            direct Android download (enables the APK button)
 */

const env = (value: string | undefined) => (value ?? "").trim();

/** Prefix for files in /public when the site is served from a sub-path. */
export const asset = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;

export const site = {
  name: "Pocket PEC",
  wordmark: "POCKET PEC",
  /** env: NEXT_PUBLIC_SITE_URL (the GitHub Pages workflow sets it from the Pages domain). */
  url: env(process.env.NEXT_PUBLIC_SITE_URL) || "https://pocketpec.space",
  title: "Pocket PEC: The Philippine Electrical Code. In your pocket.",
  description:
    "Pocket PEC is a mobile reference app that makes the Philippine Electrical Code faster to search and easier to read. Articles, tables, and references for Electrical Practitioners in the Philippines.",
  locale: "en_PH",
  /** Code edition covered by the app's content. */
  edition: "PEC 2017 · Part 1",
  logo: {
    /** White monochrome mark for the dark site chrome (nav, footer). */
    mono: "/brand/mark-mono.webp",
    /** Full-colour mark (used inside the app mockups). */
    color: "/brand/mark-color-256.webp",
    /** The supplied logo with its glow, for large brand moments. */
    glow: "/brand/logo-glow-1200.webp",
    alt: "Pocket PEC logo",
  },
  /** Shown in the footer. Keep this accurate to Pocket PEC's actual status. */
  disclaimer:
    "Pocket PEC is a digital reference companion for the Philippine Electrical Code. It is not the official publication of the Code, and no endorsement by any government agency or professional organization is implied. Always confirm critical requirements against the official edition.",
} as const;

export type Store = {
  id: "google-play" | "app-store";
  platform: "Android" | "iOS";
  eyebrow: string;
  name: string;
  /** Empty until the app is actually published on this store. */
  url: string;
};

export const downloads = {
  stores: [
    {
      id: "google-play",
      platform: "Android",
      eyebrow: "Get it on",
      name: "Google Play",
      url: env(process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL),
    },
    {
      id: "app-store",
      platform: "iOS",
      eyebrow: "Download on the",
      name: "App Store",
      url: env(process.env.NEXT_PUBLIC_APP_STORE_URL),
    },
  ] satisfies Store[],
  comingSoon: "Coming soon",
  /** Shown while no store link is set, so nobody is promised availability. */
  pendingNote: "Store links will appear here as soon as Pocket PEC is published.",
};

/**
 * Direct Android download (APK), outside the app stores. The button, the
 * /download page link and "Available for Android" appear only once `url` is set
 * (env: NEXT_PUBLIC_APK_URL). Update the details with every new build; they were
 * read from dist/pocket-pec-1.0.0-build1.apk.
 */
export const apk = {
  // Always the newest GitHub Release asset named "pocket-pec.apk".
  url: env(process.env.NEXT_PUBLIC_APK_URL) || "https://github.com/pelailes-cmd/pocket-pec-website/releases/latest/download/pocket-pec.apk",
  version: "1.0.0 (build 1)",
  size: "367 MB",
  requires: "Android 7.0 or later",
  sha256: "4c2997348127fe07bd28d1a66c5db88f9f48fa2b3ac2286145590b72102e0c1f",
  /** The app asks for an access code on first launch (internet needed once). */
  activation: "Activation needs an access code and an internet connection the first time you open the app.",
};

/** A store button is live only when it has a real URL. */
export const isPublished = (store: Store) => store.url.length > 0;

export const publishedPlatforms = [
  ...new Set([...(apk.url ? ["Android"] : []), ...downloads.stores.filter(isPublished).map((s) => s.platform)]),
];

/** The site's own download page (install steps + APK link). */
export const downloadPage = `${site.url}${asset("/download/")}`;

/**
 * QR destination. env: NEXT_PUBLIC_DOWNLOAD_URL; otherwise the site's /download
 * page when an APK is published, else the first store link. When empty the QR
 * section shows a clearly marked placeholder.
 */
export const qrUrl =
  env(process.env.NEXT_PUBLIC_DOWNLOAD_URL) ||
  (apk.url && downloadPage.startsWith("http") ? downloadPage : "") ||
  downloads.stores.find(isPublished)?.url ||
  "";

/** Privacy Policy and Terms of Use. Change `effective` whenever either is revised. */
export const legal = {
  effective: "1 October 2026",
};

/** Public contact details (footer, download page, legal pages). */
export const contact = {
  email: env(process.env.NEXT_PUBLIC_CONTACT_EMAIL) || "x.ailespel@gmail.com",
  phone: "0960 379 8503",
  phoneHref: "tel:+639603798503",
};

export const links = {
  download: "#download",
  howItWorks: "#how-it-works",
  features: "#features",
  about: "#why",
  privacy: asset("/privacy/"),
  terms: asset("/terms/"),
  contact: `mailto:${contact.email}`,
  phone: contact.phoneHref,
};

/** Add social profiles here; the footer lists them automatically. */
export const social: { label: string; href: string }[] = [
  // { label: "Facebook", href: "https://facebook.com/..." },
];

/**
 * Facts about the app's content, from the Pocket PEC content database
 * (assets/generated/pec_content.db, content version 78aa74115e646fc4,
 * generated 2026-09-29). Update if the content changes.
 */
export const contentFacts = [
  { value: "10", label: "Chapters" },
  { value: "193", label: "Articles" },
  { value: "3,433", label: "Sections" },
  { value: "297", label: "Tables" },
];

/** Chapter markers shown in the corner HUD as the page plays. */
export const chapters = [
  "Phone appears",
  "Phone approaches",
  "Screen activates",
  "Search",
  "Article",
  "Table",
  "Field",
  "Download",
] as const;

