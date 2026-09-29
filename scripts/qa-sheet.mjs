// Combines QA screenshots into contact sheets: node scripts/qa-sheet.mjs <prefix> [cols]
import { readdirSync } from "node:fs";
import sharp from "sharp";

const prefix = process.argv[2] ?? "1440-";
const cols = Number(process.argv[3] ?? 3);
const files = readdirSync("qa").filter((f) => f.startsWith(prefix) && f.endsWith(".png")).sort();
const meta = await sharp(`qa/${files[0]}`).metadata();
const tw = Math.round(1440 / cols);
const th = Math.round((tw * meta.height) / meta.width);
const per = cols * Math.max(1, Math.floor(1350 / th));
for (let s = 0, n = 0; s < files.length; s += per, n++) {
  const chunk = files.slice(s, s + per);
  const tiles = await Promise.all(chunk.map((f) => sharp(`qa/${f}`).resize(tw, th).toBuffer()));
  const rows = Math.ceil(chunk.length / cols);
  await sharp({ create: { width: tw * cols, height: th * rows, channels: 3, background: "#444" } })
    .composite(tiles.map((t, i) => ({ input: t, left: (i % cols) * tw, top: Math.floor(i / cols) * th })))
    .png()
    .toFile(`qa/sheet-${prefix}${n}.png`);
  console.log(`qa/sheet-${prefix}${n}.png`, chunk[0], "..", chunk.at(-1));
}
