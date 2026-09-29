"use client";

import Lenis from "lenis";
import { type ReactNode, useEffect } from "react";
import { subscribeChapter } from "@/lib/chapter-store";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { setLenis } from "@/lib/scroll";
import { sound } from "@/lib/sound";

/**
 * Lenis smooth scrolling driven by GSAP's ticker (so ScrollTrigger and Lenis
 * share one frame loop). Disabled for reduced motion and on touch devices,
 * where native scrolling is kept.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Viewport size as unitless numbers, for CSS math (phone scale).
    const root = document.documentElement;
    let lastW = 0;
    let lastH = 0;
    const measure = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      // Ignore small height changes from mobile address bars.
      if (w !== lastW || Math.abs(h - lastH) > 150) {
        lastW = w;
        lastH = h;
        root.style.setProperty("--vwpx", String(w));
        root.style.setProperty("--vhpx", String(h));
      }
    };
    measure();
    window.addEventListener("resize", measure, { passive: true });

    const onVisibility = () => sound.setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    const offChapter = subscribeChapter(() => sound.blip());

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lenis: Lenis | null = null;
    let tick: ((time: number) => void) | null = null;
    if (!reduce) {
      lenis = new Lenis({ lerp: 0.09, smoothWheel: true, syncTouch: false, anchors: { duration: 1.8 } });
      setLenis(lenis);
      lenis.on("scroll", ScrollTrigger.update);
      tick = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    // Recalculate pinned chapters once fonts and images have settled.
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("load", refresh);
      document.removeEventListener("visibilitychange", onVisibility);
      offChapter();
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
      setLenis(null);
    };
  }, []);

  return <>{children}</>;
}
