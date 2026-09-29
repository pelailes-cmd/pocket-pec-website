"use client";

import { useRef } from "react";
import { HomeScreen } from "@/components/app-ui/screens";
import { PhoneRig } from "@/components/phone/PhoneRig";
import { Cta } from "@/components/ui/Cta";
import { copy } from "@/config/content";
import { links, site } from "@/config/site";
import { MQ, gsap, useGSAP } from "@/lib/gsap";

/** Back to the void: the device fades away and only the name remains. */
export function FinalCta() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current!;
      const q = gsap.utils.selector(section);
      const mm = gsap.matchMedia();
      mm.add(`${MQ.desktop}, ${MQ.mobile}`, () => {
        gsap.set(q(".fc-word, .fc-line, .fc-ctas"), { autoAlpha: 0, y: 30 });
        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: { trigger: section, start: "top top", end: "+=160%", pin: true, scrub: 0.8 },
        });
        tl.fromTo(q(".fc-sizer"), { "--phone-zoom": 1 }, { "--phone-zoom": 0.82, duration: 1 }, 0)
          .to(q(".fc-rig"), { rotationY: 20, duration: 1.2 }, 0)
          .to(q(".fc-sizer"), { autoAlpha: 0, duration: 0.8 }, 0.9)
          .to(q(".fc-grid"), { autoAlpha: 0, duration: 0.8 }, 0.9)
          .to(q(".fc-word"), { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out" }, 1.5)
          .to(q(".fc-line"), { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" }, 2.1)
          .to(q(".fc-ctas"), { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" }, 2.5)
          .to({}, { duration: 0.6 });
      });
      mm.add(MQ.reduce, () => gsap.set(q(".fc-sizer"), { autoAlpha: 0 }));
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative overflow-hidden bg-black" aria-labelledby="final-title">
      <div className="relative flex h-[100svh] min-h-[600px] w-full items-center justify-center overflow-hidden">
        <div className="fc-grid fx-grid fx-grid-fade absolute inset-0 opacity-30" aria-hidden />
        <PhoneRig className="fc-sizer" rigClassName="fc-rig" backlight style={{ "--phone-s": "min(calc(var(--vhpx, 900) * 0.66 / 800), calc(var(--vwpx, 1440) * 0.66 / 380))" } as React.CSSProperties}>
          <HomeScreen />
        </PhoneRig>
        <div className="relative z-10 flex flex-col items-center px-6 text-center">
          <h2 id="final-title" className="fc-word display text-metal pb-2 text-[clamp(60px,14vw,240px)]">
            {site.wordmark}
          </h2>
          <p className="fc-line headline mt-4 text-[clamp(22px,3vw,44px)] text-white">
            {copy.final.headline[0]} <span className="block text-steel-500 sm:inline">{copy.final.headline[1]}</span>
          </p>
          <div className="fc-ctas mt-10 flex flex-wrap items-center justify-center gap-3">
            <Cta href={links.download}>{copy.final.primary}</Cta>
            <Cta href={links.features} variant="secondary">
              {copy.final.secondary}
            </Cta>
          </div>
        </div>
      </div>
    </section>
  );
}
