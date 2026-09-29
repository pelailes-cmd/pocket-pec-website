import type { CSSProperties } from "react";

/** Device dimensions in CSS px (must match styles/phone.css). */
export const PHONE = { w: 380, h: 800, r: 58, t: 12, bezel: 10 } as const;

type Facet = { w: number; x: number; y: number; angle: number; shade: number };

// Studio lighting for the metal frame: a key light from the upper left and a
// cooler rim light from the right. Directions are in screen space (y down).
const KEY = normalize(-0.55, -0.83);
const RIM = normalize(0.92, 0.3);

function normalize(x: number, y: number): [number, number] {
  const l = Math.hypot(x, y);
  return [x / l, y / l];
}

/** Brightness (0..1) of an edge whose outward normal points at `phi` degrees. */
function shadeFor(phi: number) {
  const p = (phi * Math.PI) / 180;
  const nx = Math.cos(p);
  const ny = Math.sin(p);
  const key = Math.max(0, nx * KEY[0] + ny * KEY[1]);
  const rim = Math.max(0, nx * RIM[0] + ny * RIM[1]);
  return Math.min(1, 0.12 + 0.6 * Math.pow(key, 1.4) + 0.32 * Math.pow(rim, 3));
}

/**
 * The device edge, approximated by flat facets: four straight sides plus
 * `segments` facets per rounded corner. Each facet is a (width x thickness)
 * rectangle stood up by rotateX(90deg) and turned to face outwards.
 */
function buildFacets(segments: number): Facet[] {
  const { w: W, h: H, r: R } = PHONE;
  const facets: Facet[] = [
    { w: W - 2 * R + 1, x: 0, y: -H / 2, angle: 0, shade: shadeFor(-90) },
    { w: W - 2 * R + 1, x: 0, y: H / 2, angle: 180, shade: shadeFor(90) },
    { w: H - 2 * R + 1, x: W / 2, y: 0, angle: 90, shade: shadeFor(0) },
    { w: H - 2 * R + 1, x: -W / 2, y: 0, angle: -90, shade: shadeFor(180) },
  ];
  const corners = [
    { cx: W / 2 - R, cy: -H / 2 + R, from: -90 },
    { cx: W / 2 - R, cy: H / 2 - R, from: 0 },
    { cx: -W / 2 + R, cy: H / 2 - R, from: 90 },
    { cx: -W / 2 + R, cy: -H / 2 + R, from: 180 },
  ];
  const step = 90 / segments;
  const half = ((step / 2) * Math.PI) / 180;
  const chord = 2 * R * Math.sin(half);
  const inset = R * Math.cos(half);
  for (const c of corners) {
    for (let i = 0; i < segments; i++) {
      const phi = c.from + step * (i + 0.5);
      const rad = (phi * Math.PI) / 180;
      facets.push({
        w: chord + 1.2,
        x: c.cx + inset * Math.cos(rad),
        y: c.cy + inset * Math.sin(rad),
        angle: phi + 90,
        shade: shadeFor(phi),
      });
    }
  }
  return facets;
}

const DARK = [18, 20, 24];
const LIGHT = [222, 227, 234];
const mix = (a: number[], b: number[], t: number) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
const rgb = (c: number[]) => `rgb(${c[0]},${c[1]},${c[2]})`;

/** Brushed-titanium gradient across the thickness: back edge, body, polished front chamfer. */
function metal(shade: number) {
  const back = mix(DARK, LIGHT, shade * 0.4);
  const body = mix(DARK, LIGHT, shade);
  const front = mix(DARK, LIGHT, Math.min(1, shade * 1.3 + 0.1));
  const chamfer = mix(front, [255, 255, 255], 0.35);
  return `linear-gradient(180deg, ${rgb(back)} 0%, ${rgb(body)} 48%, ${rgb(front)} 86%, ${rgb(chamfer)} 100%)`;
}

function facetStyle(f: Facet, thickness: number = PHONE.t): CSSProperties {
  return {
    width: `${f.w.toFixed(2)}px`,
    height: `${thickness}px`,
    left: `${(PHONE.w / 2 - f.w / 2).toFixed(2)}px`,
    top: `${(PHONE.h / 2 - thickness / 2).toFixed(2)}px`,
    transform: `translate3d(${f.x.toFixed(2)}px,${f.y.toFixed(2)}px,0) rotateZ(${f.angle.toFixed(2)}deg) rotateX(90deg)`,
    background: metal(f.shade),
  };
}

export const FACET_STYLES = buildFacets(7).map((f) => facetStyle(f));

/** Power key and volume rocker, standing just proud of the right edge. */
export const BUTTON_STYLES: CSSProperties[] = [
  { y: -178, len: 58 },
  { y: -70, len: 112 },
].map(({ y, len }) => ({
  ...facetStyle({ w: len, x: PHONE.w / 2 + 1.6, y, angle: 90, shade: shadeFor(0) + 0.12 }, PHONE.t * 0.56),
}));
