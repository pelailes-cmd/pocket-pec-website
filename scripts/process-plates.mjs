// Converts environment plates (large PNG/JPG renders) into responsive AVIF + WebP.
//
//   node scripts/process-plates.mjs <source-dir>
//
// Expects <source-dir>/{office,site,design,inspection}.png and writes
// public/images/field/<name>-{1024,1920}.{avif,webp}. The plates used by the
// "Built for the field" section were generated with Higgsfield (prompts in README).
import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = process.argv[2];
if (!src) {
  console.error("Usage: node scripts/process-plates.mjs <source-dir>");
  process.exit(1);
}

const out = path.join(root, "public/images/field");
await mkdir(out, { recursive: true });

const files = (await readdir(src)).filter((f) => /\.(png|jpe?g|webp)$/i.test(f));
for (const file of files) {
  const name = path.parse(file).name;
  const img = sharp(path.join(src, file));
  for (const w of [1024, 1920]) {
    const resized = img.clone().resize({ width: w, withoutEnlargement: true });
    await resized.clone().avif({ quality: 52, effort: 5 }).toFile(path.join(out, `${name}-${w}.avif`));
    await resized.clone().webp({ quality: 74 }).toFile(path.join(out, `${name}-${w}.webp`));
  }
  console.log("processed", name);
}
