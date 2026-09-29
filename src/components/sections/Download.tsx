"use client";

import { useRef } from "react";
import { SplashScreen } from "@/components/app-ui/screens";
import { PhoneRig } from "@/components/phone/PhoneRig";
import { StoreButtons } from "@/components/ui/StoreButtons";
import { copy } from "@/config/content";
import { asset, site } from "@/config/site";
import { setChapter } from "@/lib/chapter-store";
import { MQ, gsap, useGSAP } from "@/lib/gsap";
import { sound } from "@/lib/sound";

/** CH 08: the device rushes toward the viewer and opens onto the download panel. */
export function Download() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current!;
      const q = gsap.utils.selector(section);
      const mm = gsap.matchMedia();
      mm.add(`${MQ.desktop}, ${MQ.mobile}`, () => {
        gsap.set(q(".dl-content > *"), { autoAlpha: 0, y: 40 });
        gsap.set(q(".dl-rig"), { rotationY: -24, rotationX: 10 });
        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=150%",
            pin: true,
            scrub: 0.7,
            onToggle: (self) => self.isActive && setChapter(7),
          },
        });
        tl.fromTo(q(".dl-sizer"), { "--phone-zoom": 0.55 }, { "--phone-zoom": 1, duration: 1 }, 0)
          .to(q(".dl-rig"), { rotationY: 0, rotationX: 0, duration: 1 }, 0)
          .call(() => sound.whoosh(), undefined, 1)
          .to(q(".dl-sizer"), { "--phone-zoom": 2.6, duration: 1, ease: "power3.in" }, 1)
          .to(q(".dl-sizer"), { autoAlpha: 0, duration: 0.35 }, 1.65)
          .fromTo(q(".dl-bloom"), { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1.2, duration: 0.8 }, 1.4)
          .to(q(".dl-content > *"), { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.8, ease: "power3.out" }, 1.9)
          .to({}, { duration: 0.8 });
      });
      mm.add(MQ.reduce, () => gsap.set(q(".dl-sizer"), { autoAlpha: 0 }));
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="download" className="relative overflow-hidden bg-black" aria-labelledby="download-title">
      <div className="relative flex h-[100svh] min-h-[640px] w-full items-center justify-center overflow-hidden">
        <div className="dl-bloom absolute inset-0 bg-[radial-gradient(ellipse_at_50%_55%,rgba(23,58,115,0.75),rgba(10,27,61,0.5)_35%,transparent_70%)] opacity-0" aria-hidden />
        <div className="fx-grid fx-grid-fade absolute inset-0 opacity-30" aria-hidden />

        <PhoneRig className="dl-sizer z-10" rigClassName="dl-rig" backlight style={{ "--phone-s": "min(calc(var(--vhpx, 900) * 0.7 / 800), calc(var(--vwpx, 1440) * 0.7 / 380))" } as React.CSSProperties}>
          <SplashScreen />
        </PhoneRig>

        <div className="dl-content relative z-20 flex flex-col items-center px-6 text-center">
          <img src={asset("/brand/logo-glow-640.webp")} alt="" width={200} height={133} className="mb-2 w-[150px] lg:w-[200px]" loading="lazy" />
          <h2 id="download-title" className="display text-metal pb-2 text-[clamp(52px,11vw,180px)]">
            {site.wordmark}
          </h2>
          <p className="headline mt-2 max-w-3xl text-[clamp(22px,3vw,44px)] text-white">{copy.download.headline}</p>
          <p className="eyebrow mt-10 text-steel-300">{copy.download.cta}</p>
          <StoreButtons className="mt-5" />
        </div>
      </div>
    </section>
  );
}
