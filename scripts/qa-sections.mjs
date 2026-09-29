// Per-chapter QA: screenshots each section at points within its own scroll range.
//
//   node scripts/qa-sections.mjs [url] --width=834 [--at=0.15,0.55,0.95] [--only=3,4]
import { mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { chromium } from "playwright-core";

const args = process.argv.slice(2);
const url = args.find((a) => !a.startsWith("--")) ?? "http://localhost:4173/";
const opt = (n, d) => args.find((a) => a.startsWith(`--${n}=`))?.split("=")[1] ?? d;
const width = Number(opt("width", "1440"));
const height = Number(opt("height", width < 700 ? "844" : width < 1100 ? "1112" : "900"));
const at = opt("at", "0.15,0.55,0.95").split(",").map(Number);
const only = opt("only", "")
  .split(",")
  .filter(Boolean)
  .map(Number);
const exe = ["C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", process.env.CHROME_PATH].find(
  (p) => p && existsSync(p),
);

await mkdir("qa", { recursive: true });
const browser = await chromium.launch({ executablePath: exe });
const page = await browser.newPage({ viewport: { width, height }, isMobile: width < 700, hasTouch: width < 700 });
page.on("pageerror", (e) => console.log("pageerror:", e.message));
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(4000);
const ranges = await page.evaluate(() =>
  [...document.querySelectorAll("main > section, main > .pin-spacer > section")].map((s) => {
    const box = s.parentElement?.classList.contains("pin-spacer") ? s.parentElement : s;
    const top = box.getBoundingClientRect().top + scrollY;
    return { id: s.id || s.getAttribute("aria-labelledby") || s.className.split(" ")[0], top, h: box.offsetHeight };
  }),
);
for (const [i, r] of ranges.entries()) {
  if (only.length && !only.includes(i)) continue;
  for (const f of at) {
    const y = Math.round(r.top + Math.max(0, r.h - height) * f);
    await page.evaluate((t) => scrollTo(0, t), y);
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `qa/sec-${width}-${String(i).padStart(2, "0")}-${Math.round(f * 100)}.png` });
  }
  console.log(i, r.id, Math.round(r.top), r.h);
}
await browser.close();
