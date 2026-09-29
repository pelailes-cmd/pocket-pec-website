"use client";

import { useRef } from "react";
import { MQ, gsap, useGSAP } from "@/lib/gsap";

/** Parallax for the QR section's device and a reveal for its copy. */
export function QrAnimator() {
  const ref = useRef<HTMLSpanElement>(null);
  useGSAP(() => {
    const section = ref.current?.closest(".qr-section");
    if (!section) return;
    const q = gsap.utils.selector(section);
    const mm = gsap.matchMedia();
    mm.add(`${MQ.desktop}, ${MQ.mobile}`, () => {
      gsap.fromTo(
        q(".qr-rig"),
        { rotationY: 28, rotationX: 8, y: 120 },
        { rotationY: 8, rotationX: 2, y: -60, ease: "none", scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true } },
      );
      gsap.from(q(".qr-copy > *"), { autoAlpha: 0, y: 30, stagger: 0.1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: section, start: "top 60%" } });
    });
    return () => mm.revert();
  });
  return <span ref={ref} hidden />;
}
