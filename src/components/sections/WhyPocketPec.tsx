"use client";

import { useRef } from "react";
import { copy } from "@/config/content";
import { MQ, gsap, useGSAP } from "@/lib/gsap";

/** Four words, large type, minimal support text. Each word fills with light as it passes. */
export function WhyPocketPec() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root.current);
      const mm = gsap.matchMedia();
      mm.add(`${MQ.desktop}, ${MQ.mobile}`, () => {
        q(".why-row").forEach((row) => {
          const word = row.querySelector(".why-word");
          gsap.fromTo(
            word,
            { backgroundPosition: "100% 0" },
            { backgroundPosition: "0% 0", ease: "none", scrollTrigger: { trigger: row, start: "top 85%", end: "top 40%", scrub: true } },
          );
          gsap.fromTo(
            row.querySelectorAll(".why-sub"),
            { autoAlpha: 0, y: 20 },
            { autoAlpha: 1, y: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: row, start: "top 70%" } },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="why" className="relative bg-black px-6 py-[18vh] lg:px-[7vw]" aria-labelledby="why-title">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-[8vh] flex items-end justify-between gap-6">
          <h2 id="why-title" className="eyebrow">
            {copy.why.eyebrow}
          </h2>
          <span className="ph-rule" aria-hidden />
        </div>
        <ol>
          {copy.why.items.map((item, i) => (
            <li key={item.word} className="why-row relative border-t border-white/10 py-[4.5vh] lg:grid lg:grid-cols-[120px_1fr_minmax(0,26rem)] lg:items-end lg:gap-10">
              <span className="why-sub font-mono text-[11px] tracking-[0.24em] text-steel-500">0{i + 1}</span>
              <h3
                className="why-word display mt-2 pb-2 text-[clamp(64px,13vw,220px)] uppercase lg:mt-0"
                style={{
                  backgroundImage: "linear-gradient(90deg, #fff 0%, #dfe4ea 45%, #22262c 55%, #22262c 100%)",
                  backgroundSize: "220% 100%",
                  backgroundPosition: "0% 0",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                {item.word}
              </h3>
              <p className="why-sub mt-2 max-w-sm text-[17px] leading-relaxed text-steel-400 lg:mb-[2.2vw] lg:mt-0 lg:text-[19px]">{item.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
