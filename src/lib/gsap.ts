import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  // Mobile browsers resize the viewport when the address bar shows/hides; do not
  // recalculate every pinned chapter for that.
  ScrollTrigger.config({ ignoreMobileResize: true });
  gsap.defaults({ ease: "power2.out", duration: 1 });
}

export { gsap, ScrollTrigger, useGSAP };

/** Breakpoints for gsap.matchMedia(): full cinematic, simplified, or static. */
export const MQ = {
  desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
  mobile: "(max-width: 1023.98px) and (prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
} as const;

/** Types `text` into `el` as `progress` goes from 0 to 1 (used inside scrubbed timelines). */
export function typeInto(el: Element | null, text: string, onChar?: () => void) {
  const state = { n: 0 };
  let last = -1;
  return {
    state,
    update() {
      if (!el) return;
      const n = Math.round(state.n);
      if (n === last) return;
      last = n;
      el.textContent = text.slice(0, n);
      onChar?.();
    },
  };
}
