"use client";

import { useRef } from "react";
import { MQ, gsap, useGSAP } from "@/lib/gsap";

/** Draws the regional links and lights the cities when the map enters view. */
export function PhilippinesAnimator() {
  const ref = useRef<HTMLSpanElement>(null);
  useGSAP(() => {
    const section = ref.current?.closest(".ph-section");
    if (!section) return;
    const q = gsap.utils.selector(section);
    const mm = gsap.matchMedia();
    mm.add(`${MQ.desktop}, ${MQ.mobile}`, () => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: section, start: "top 65%" } });
      tl.from(q(".ph-copy > *"), { autoAlpha: 0, y: 30, stagger: 0.1, duration: 1, ease: "power3.out" }, 0)
        .from(q(".ph-dots"), { autoAlpha: 0, duration: 1.4 }, 0.1)
        .from(q(".ph-city"), { autoAlpha: 0, scale: 0, transformOrigin: "50% 50%", stagger: 0.05, duration: 0.5, ease: "back.out(2)" }, 0.5)
        .from(q(".ph-link"), { strokeDashoffset: 1, stagger: 0.08, duration: 1, ease: "power2.inOut" }, 0.8)
        .from(q(".ph-label"), { autoAlpha: 0, y: 10, stagger: 0.15, duration: 0.8 }, 1.4);
      gsap.to(q(".ph-ring"), { scale: 1.8, autoAlpha: 0, transformOrigin: "50% 50%", duration: 2.2, repeat: -1, ease: "power2.out", stagger: 0.7 });
    });
    return () => mm.revert();
  });
  return <span ref={ref} hidden />;
}
