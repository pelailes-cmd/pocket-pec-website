// Visual QA: screenshots of the page at several viewports and scroll positions.
//
//   npm run qa -- [url] [--widths=1440,390] [--stops=0,0.1,0.2] [--reduce]
//
// Uses the locally installed Chrome (or Edge) through playwright-core, so no
// browser download is needed. Output goes to ./qa (git-ignored).
import { mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const url = args.find((a) => !a.startsWith("--")) ?? "http://localhost:3000/";
const opt = (name, fallback) => args.find((a) => a.startsWith(`--${name}=`))?.split("=")[1] ?? fallback;

const SIZES = {
  1920: [1920, 1080],
  1440: [1440, 900],
  1280: [1280, 720],
  834: [834, 1112],
  430: [430, 932],
  390: [390, 844],
};
const widths = opt("widths", "1440,390").split(",").map(Number);
const stops = opt("stops", "0,0.05,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1").split(",").map(Number);
const reduce = args.includes("--reduce");

const candidates = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
].filter(Boolean);
const executablePath = candidates.find((p) => existsSync(p));
if (!executablePath) throw new Error("No Chrome/Edge found; set CHROME_PATH.");

const out = path.join(root, "qa");
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ executablePath, args: ["--disable-gpu-sandbox", "--hide-scrollbars"] });

for (const w of widths) {
  const [width, height] = SIZES[w] ?? [w, 900];
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
    reducedMotion: reduce ? "reduce" : "no-preference",
    isMobile: width < 700,
    hasTouch: width < 700,
  });
  const page = await context.newPage();
  page.on("pageerror", (e) => console.log(`[${w}] pageerror:`, e.message));
  page.on("console", (m) => m.type() === "error" && console.log(`[${w}] console:`, m.text()));
  await page.goto(url, { waitUntil: "networkidle" });
  // Wait until every pinned chapter exists (page height stops growing).
  let prev = -1;
  for (let i = 0; i < 20; i++) {
    await page.waitForTimeout(800);
    const hgt = await page.evaluate(() => document.documentElement.scrollHeight);
    if (hgt === prev) break;
    prev = hgt;
  }
  await page.waitForTimeout(1500);
  const total = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  for (const s of stops) {
    const y = Math.round(total * s);
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(1300);
    const file = path.join(out, `${w}${reduce ? "-reduce" : ""}-${String(Math.round(s * 1000)).padStart(4, "0")}.png`);
    await page.screenshot({ path: file });
  }
  console.log(`${w}: ${stops.length} shots, scroll height ${total}px`);
  await context.close();
}
await browser.close();
