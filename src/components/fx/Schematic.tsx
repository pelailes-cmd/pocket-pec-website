import { cn } from "@/lib/cn";

/**
 * Electrical schematic traces radiating from a device at the centre of a
 * 1600 x 1000 canvas. Each trace has a dim base line (always visible, like a
 * blueprint), a glow + core line that GSAP "draws" (stroke-dashoffset 1 -> 0,
 * via pathLength=1), and a travelling pulse once `.is-live` is set.
 */
const TRACES = [
  "M 690 360 H 560 L 520 320 H 300",
  "M 690 430 H 480 L 440 470 H 170",
  "M 690 560 H 600 L 560 600 V 760 H 380",
  "M 690 640 H 640 L 600 680 H 520 L 480 720 H 250",
  "M 910 340 H 1060 L 1100 300 H 1330",
  "M 910 420 H 1180 L 1220 460 H 1450",
  "M 910 580 H 1000 L 1040 620 V 800 H 1250",
  "M 910 660 H 980 L 1020 700 H 1120 L 1160 740 H 1380",
  "M 800 240 V 150 L 840 110 H 1010",
  "M 800 760 V 860 L 760 900 H 570",
];

const NODES: [number, number][] = [
  [300, 320],
  [170, 470],
  [250, 720],
  [1330, 300],
  [1450, 460],
  [1380, 740],
  [1010, 110],
  [570, 900],
  [560, 360],
  [1180, 420],
];

const LABELS: { x: number; y: number; t: string; anchor?: "end" | "start" }[] = [
  { x: 300, y: 306, t: "PNL-A", anchor: "start" },
  { x: 170, y: 456, t: "BUS 1", anchor: "start" },
  { x: 1330, y: 286, t: "CKT 01", anchor: "end" },
  { x: 1450, y: 446, t: "CKT 02", anchor: "end" },
  { x: 1380, y: 726, t: "FDR", anchor: "end" },
  { x: 1010, y: 96, t: "REF", anchor: "end" },
  { x: 390, y: 752, t: "GND", anchor: "start" },
];

export function Schematic({ className, compact = false }: { className?: string; compact?: boolean }) {
  const traces = compact ? TRACES.filter((_, i) => i % 2 === 0 || i >= 8) : TRACES;
  return (
    <svg className={cn("sch", className)} viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <g>
        {traces.map((d, i) => (
          <path key={`b${i}`} d={d} className="sch-base" />
        ))}
      </g>
      <g>
        {traces.map((d, i) => (
          <path key={`g${i}`} d={d} pathLength={1} className="sch-glow sch-draw" strokeDasharray="1 1" strokeDashoffset={1} />
        ))}
        {traces.map((d, i) => (
          <path key={`c${i}`} d={d} pathLength={1} className="sch-core sch-draw" strokeDasharray="1 1" strokeDashoffset={1} />
        ))}
        {traces.map((d, i) => (
          <path key={`p${i}`} d={d} pathLength={1} className="sch-pulse" style={{ animationDelay: `${-i * 0.37}s` }} />
        ))}
      </g>
      <g className="sch-nodes">
        {NODES.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={4} className="sch-node" />
        ))}
        {/* ground symbol */}
        <path d="M 380 760 v 12 M 366 772 h 28 M 371 779 h 18 M 376 786 h 8" className="sch-core" />
        {/* breaker */}
        <path d="M 1250 800 a 14 14 0 0 1 28 0 M 1278 800 H 1320" className="sch-core" />
        {LABELS.map((l) => (
          <text key={l.t} x={l.x} y={l.y} textAnchor={l.anchor}>
            {l.t}
          </text>
        ))}
      </g>
    </svg>
  );
}
