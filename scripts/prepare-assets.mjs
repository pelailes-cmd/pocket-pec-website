// Builds the website's optimised brand assets from the app's original artwork.
//
//   npm run assets
//
// Sources are only read, never modified:
//   ../assets/logo/icon.png                          supplied logo (glow on black)
//   ../assets/generated/branding/logo_mark.png       colour mark, transparent
//   ../assets/generated/icons/adaptive_monochrome_1024.png   monochrome mark
//   ../assets/generated/icons/icon_square_1024.png   launcher icon
//
// To change the logo, replace these sources (or point SOURCES below at new files)
// and run the script again.
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const app = path.resolve(root, "..");

const SOURCES = {
  glow: path.join(app, "assets/logo/icon.png"),
  color: path.join(app, "assets/generated/branding/logo_mark.png"),
  mono: path.join(app, "assets/generated/icons/adaptive_monochrome_1024.png"),
  square: path.join(app, "assets/generated/icons/icon_square_1024.png"),
};

const brandDir = path.join(root, "public/brand");
const appDir = path.join(root, "src/app");
await mkdir(brandDir, { recursive: true });
await mkdir(appDir, { recursive: true });

async function trimmed(file) {
  // Trim transparent padding so the mark sits tight in layouts.
  return sharp(await sharp(file).trim({ threshold: 1 }).png().toBuffer());
}

// Monochrome mark (nav, footer): white glyph on transparent.
{
  const img = await trimmed(SOURCES.mono);
  await img.clone().resize({ height: 128 }).png({ compressionLevel: 9 }).toFile(path.join(brandDir, "mark-mono.png"));
  await img.clone().resize({ height: 128 }).webp({ quality: 90 }).toFile(path.join(brandDir, "mark-mono.webp"));
}

// Colour mark (in-app header tile, favicons of the mock screens).
{
  const img = await trimmed(SOURCES.color);
  for (const w of [128, 256, 512]) {
    await img.clone().resize({ width: w }).webp({ quality: 88 }).toFile(path.join(brandDir, `mark-color-${w}.webp`));
  }
  await img.clone().resize({ width: 256 }).png({ compressionLevel: 9 }).toFile(path.join(brandDir, "mark-color-256.png"));
}

// Original glowing logo (large brand moments on black).
{
  const img = sharp(SOURCES.glow);
  for (const w of [640, 1200]) {
    await img.clone().resize({ width: w }).webp({ quality: 82 }).toFile(path.join(brandDir, `logo-glow-${w}.webp`));
  }
}

// Favicons from the launcher icon (Next.js picks up app/icon.png and app/apple-icon.png).
{
  const img = sharp(SOURCES.square);
  await img.clone().resize(256, 256).png({ compressionLevel: 9 }).toFile(path.join(appDir, "icon.png"));
  await img.clone().resize(180, 180).png({ compressionLevel: 9 }).toFile(path.join(appDir, "apple-icon.png"));
}

console.log("Brand assets written to public/brand and src/app.");
