# Pocket PEC website

Cinematic landing and download site for the Pocket PEC app. It is a separate
project inside `pocket-pec/`; it only **reads** the app's logo files and does not
touch the Flutter project.

Next.js 16 (static export) · React 19 · TypeScript · Tailwind CSS 4 · GSAP +
ScrollTrigger · Lenis · Motion · Lucide.

```sh
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in ./out (host anywhere)
npm run preview    # serve ./out at http://localhost:4173
npm run typecheck
npm run qa         # screenshots into ./qa (see "QA" below)
```

## What to edit

| Change | Where |
|---|---|
| Marketing copy (every section) | `src/config/content.ts` |
| Store links, QR destination, contact, social links, disclaimer, site URL | `src/config/site.ts` (or env vars below) |
| Phone screen content, real screenshots | `src/config/screens.ts` |
| Brand colours, fonts | `@theme` block in `src/app/globals.css` |
| Logo | replace the sources listed in `scripts/prepare-assets.mjs`, then `npm run assets` |
| Field environment photos | `public/images/field/` (`scripts/process-plates.mjs`) |

### Download links and QR (set these before launch)

The site never claims availability it does not have. With no links configured,
store buttons render as clearly marked **"Coming soon"** placeholders and the QR
code is blurred and labelled **"Download link coming soon"**.

Set any of these at build time (e.g. in `.env.local`), then rebuild:

```sh
NEXT_PUBLIC_SITE_URL=https://your-domain.ph
NEXT_PUBLIC_GOOGLE_PLAY_URL=https://play.google.com/store/apps/details?id=...
NEXT_PUBLIC_APP_STORE_URL=https://apps.apple.com/app/...
NEXT_PUBLIC_DOWNLOAD_URL=https://...        # QR target; defaults to the first store link
NEXT_PUBLIC_CONTACT_EMAIL=hello@your-domain.ph
NEXT_PUBLIC_BASE_PATH=/pocket-pec           # only if served from a sub-path
```

A store button becomes live, and "Available for Android/iOS" appears, only when
its URL is set. When the app is live, consider swapping the button glyphs for
the official Apple / Google badges per their guidelines
(`src/components/ui/StoreButtons.tsx`).

### Real app screenshots

The phones show live HTML mockups of the app's dark theme, so they can animate
(typing, results, scrolling). To use real screenshots instead, put images
(9 : 19.5, e.g. 1080 x 2340) in `public/screens/` and map them in
`screenshots` in `src/config/screens.ts`.

## Content rules the site follows

* Headings, table numbers, chapter titles and printed page numbers on the
  mockups come from the app's content database (PEC 2017 Part 1) and are real
  references. Body text is labelled "Sample text" and describes the app; table
  values are generated sample numbers, watermarked "SAMPLE" and captioned as
  not PEC values.
* The brief's example "Table 3.10.1.16" does not exist in PEC 2017. The search
  demo uses the actual ampacity table, **Table 3.10.2.6(B)(16)**.
* No "official", "approved", "compliant" or speed claims. The footer
  disclaimer (in `site.ts`) states it is not the official publication of the
  Code.
* The app is moving to one-time access-code activation, so the site does not
  say "free" and makes no unconditional offline claim.

## How it is built

* **One device everywhere.** `src/components/phone/` is a CSS-3D smartphone
  (front glass, back with camera island, extruded titanium edge made of lit
  facets). Every scene uses it, so proportions and lighting always match.
* **Chapters.** Each section in `src/components/sections/` pins and scrubs a
  GSAP timeline, with separate desktop, mobile (simpler, shorter) and
  reduced-motion (static, final state) versions via `gsap.matchMedia()`.
* **Hero intro** is pure CSS, so it plays at first paint without waiting for
  JavaScript.
* **Sound** (`src/lib/sound.ts`) is synthesised with Web Audio: a 60 Hz mains
  hum with harmonics, soft room tone, interface blips and low pulses. It is off
  by default and nothing loads until the visitor turns it on.
* **Philippines map** is generated from Natural Earth 1:10m (public domain)
  into `src/data/ph-map.json` and rendered server-side.
* **QR code** is generated at build time (static SVG, no client JavaScript).

### Field environment photos

`public/images/field/{office,site,design,inspection}` were generated with
Higgsfield (`z_image`, 16:9) from these prompts, then darkened and graded in
CSS. They contain no devices, so the site's own phone stays consistent:

* **office**: low-key cinematic photograph of an electrical engineer's desk at
  night: printed electrical construction blueprints, a white safety hard hat and
  a digital multimeter, warm desk-lamp glow and cool blue shadows. No people, no
  readable text, no logos.
* **site**: dark electrical room, a row of closed grey steel switchgear cabinets,
  conduits and cable trays, cool electric-blue rim light, haze. No people, no
  text.
* **design**: top-down low-key photograph of white technical linework on deep
  navy blueprint paper, drafting scale ruler and pencil, raking light.
* **inspection**: industrial electrical facility at night, a power transformer
  and closed switchboards behind a yellow safety railing, dim work lights, teal
  and electric-blue grade. No people, no text.

## QA

`npm run qa -- http://localhost:4173/ --widths=1920,1440,1280,834,430,390`
takes screenshots through the film at each width (add `--reduce` for
reduced motion). `node scripts/qa-sections.mjs --width=834` captures every
chapter at points inside its own pin. Both use the locally installed Chrome
or Edge.

## Deploy

**GitHub Pages (set up):** `.github/workflows/deploy.yml` builds and publishes on
every push to `main`. The base path and site URL are read from the Pages
settings, so the same workflow serves `https://<user>.github.io/<repo>/` or a
custom domain (`pocketpec.space`) at the root. After changing the domain in
Settings → Pages, re-run the workflow. Store/QR/contact/APK links can be set
as repository *variables* (`APK_URL`, `GOOGLE_PLAY_URL`, `APP_STORE_URL`,
`DOWNLOAD_URL`, `CONTACT_EMAIL`).

**Android APK:** the download button links to
`releases/latest/download/pocket-pec.apk`, i.e. the file named `pocket-pec.apk`
in the newest GitHub Release. To ship an update: create a new release (e.g.
`v1.0.1`), attach the new APK named exactly `pocket-pec.apk`, then update `apk`
in `src/config/site.ts` (version, size, SHA-256) and push. The QR code points at
`/download/`, so it never needs reprinting.

**Elsewhere:** 
`npm run build` and upload `out/` to any static host (Vercel, Netlify,
Cloudflare Pages, GitHub Pages, S3). Set the env vars above in the host's build
settings.
