import map from "@/data/ph-map.json";
import { copy } from "@/config/content";
import { PhilippinesAnimator } from "./PhilippinesAnimator";

type City = { name: string; lat: number; lon: number; region: string; x: number; y: number };
const cities = map.cities as City[];
const byName = (n: string) => cities.find((c) => c.name === n)!;

// Technical links between regional centres (a backbone, not a real grid map).
const LINKS: [string, string][] = [
  ["Laoag", "Baguio"],
  ["Tuguegarao", "Baguio"],
  ["Baguio", "Metro Manila"],
  ["Metro Manila", "Legazpi"],
  ["Metro Manila", "Puerto Princesa"],
  ["Metro Manila", "Iloilo"],
  ["Legazpi", "Tacloban"],
  ["Iloilo", "Cebu"],
  ["Cebu", "Tacloban"],
  ["Cebu", "Cagayan de Oro"],
  ["Cagayan de Oro", "Davao"],
  ["Cagayan de Oro", "Zamboanga"],
  ["Davao", "General Santos"],
];

// Gentle arcs between two points.
function arc(a: City, b: City) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const k = 0.18;
  return `M${a.x} ${a.y} Q${mx - dy * k} ${my + dx * k} ${b.x} ${b.y}`;
}

const REGION_LABELS = [
  { name: "Luzon", city: "Metro Manila", dx: -150, dy: -210 },
  { name: "Visayas", city: "Cebu", dx: 70, dy: -60 },
  { name: "Mindanao", city: "Davao", dx: 40, dy: 90 },
];

// Dots as one path of tiny circles: cheap to render, crisp at any size.
const dotPath = map.dots.map(([x, y]) => `M${x - 1.5} ${y}a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0-3 0`).join("");

/** Server-rendered map (no client JS for the geometry); a small island animates it. */
export function Philippines() {
  return (
    <section className="ph-section relative overflow-hidden bg-black px-6 py-[14vh] lg:px-[7vw]" aria-labelledby="ph-title">
      <div className="fx-pool left-[68%] top-1/2 h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 opacity-40" aria-hidden />
      <div className="relative mx-auto grid max-w-[1500px] items-center gap-12 lg:grid-cols-[1fr_1.05fr]">
        <div className="ph-copy">
          <p className="eyebrow mb-5 flex items-center gap-3">
            <span className="ph-rule" aria-hidden />
            {copy.philippines.eyebrow}
          </p>
          <h2 id="ph-title" className="headline text-[clamp(32px,4.4vw,68px)] text-white">
            {copy.philippines.headline}
          </h2>
          <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-steel-400 lg:text-[19px]">{copy.philippines.body}</p>
          <ul className="mt-10 flex flex-wrap gap-2">
            {copy.philippines.work.map((w) => (
              <li key={w} className="rounded-full border border-white/10 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-steel-300">
                {w}
              </li>
            ))}
          </ul>
          <dl className="mt-12 grid max-w-md grid-cols-3 gap-6">
            {copy.philippines.regions.map((r, i) => (
              <div key={r}>
                <dt className="spec">{String(i + 1).padStart(2, "0")}</dt>
                <dd className="mt-2 text-[18px] font-medium tracking-tight text-white">{r}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative mx-auto w-full max-w-[560px]">
          <svg viewBox={`0 0 ${map.width} ${map.height}`} className="ph-map h-auto w-full overflow-visible" role="img" aria-label="Map of the Philippines with lines connecting Luzon, the Visayas and Mindanao">
            <defs>
              <linearGradient id="ph-line" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="var(--color-electric-300)" />
                <stop offset="1" stopColor="var(--color-electric-500)" />
              </linearGradient>
            </defs>
            <path d={map.outline} fill="rgba(59,130,255,0.035)" stroke="rgba(156,194,255,0.22)" strokeWidth="0.8" />
            <path className="ph-dots" d={dotPath} fill="rgba(156,194,255,0.34)" />
            <g fill="none" strokeLinecap="round">
              {LINKS.map(([a, b]) => (
                <path key={`${a}-${b}`} className="ph-link" d={arc(byName(a), byName(b))} stroke="url(#ph-line)" strokeWidth="1.4" pathLength={1} strokeDasharray="1 1" strokeDashoffset={0} />
              ))}
            </g>
            {cities.map((c) => {
              const hub = c.name === "Metro Manila" || c.name === "Cebu" || c.name === "Davao";
              return (
                <g key={c.name} className="ph-city" transform={`translate(${c.x} ${c.y})`}>
                  {hub && <circle r="14" fill="none" stroke="rgba(252,209,22,0.35)" className="ph-ring" />}
                  <circle r={hub ? 5 : 3.2} fill={hub ? "var(--color-ph-gold)" : "#fff"} />
                </g>
              );
            })}
            {REGION_LABELS.map((l) => {
              const c = byName(l.city);
              return (
                <g key={l.name} className="ph-label" transform={`translate(${c.x + l.dx} ${c.y + l.dy})`}>
                  <text fontFamily="var(--font-mono)" fontSize="15" letterSpacing="3" fill="#fff">
                    {l.name.toUpperCase()}
                  </text>
                  <text y="20" fontFamily="var(--font-mono)" fontSize="11" letterSpacing="1.5" fill="rgba(156,194,255,0.7)">
                    {c.lat.toFixed(2)}°N {c.lon.toFixed(2)}°E
                  </text>
                </g>
              );
            })}
          </svg>
          <p className="spec mt-4 text-center text-steel-500">Map: Natural Earth</p>
        </div>
      </div>
      <PhilippinesAnimator />
    </section>
  );
}
