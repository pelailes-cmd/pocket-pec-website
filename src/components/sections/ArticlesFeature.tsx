"use client";

import { Check } from "lucide-react";
import { useRef } from "react";
import { ArticleScreen } from "@/components/app-ui/screens";
import { PhoneRig } from "@/components/phone/PhoneRig";
import { copy } from "@/config/content";
import { articles } from "@/config/screens";
import { setChapter } from "@/lib/chapter-store";
import { MQ, gsap, useGSAP } from "@/lib/gsap";

/** CH 05: a large reader close-up that reads itself as you scroll. */
export function ArticlesFeature() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current!;
      const q = gsap.utils.selector(section);
      const mm = gsap.matchMedia();
      mm.add(`${MQ.desktop}, ${MQ.mobile}`, () => {
        const mobile = window.matchMedia(MQ.mobile).matches;
        gsap.set(q(".af-rig"), { rotationY: mobile ? 0 : 18, rotationX: 4 });
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=160%",
            pin: true,
            scrub: 0.7,
            onToggle: (self) => self.isActive && setChapter(4),
          },
        });
        tl.fromTo(q(".af-copy > *"), { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.5, ease: "power3.out" }, 0)
          .fromTo(q(".af-rig"), { rotationY: mobile ? 0 : 30, z: -200 }, { rotationY: mobile ? 0 : 10, z: 0, duration: 2 }, 0)
          .to(q(".af-phone .js-reader"), { y: -520, duration: 2 }, 0.2)
          .fromTo(q(".af-phone .js-progress"), { scaleX: 0.04 }, { scaleX: 0.3, duration: 2 }, 0.2)
          .fromTo(q(".af-point"), { autoAlpha: 0, x: -16 }, { autoAlpha: 1, x: 0, stagger: 0.25, duration: 0.4 }, 0.6);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative overflow-hidden bg-black" aria-labelledby="articles-title">
      <div className="relative flex h-[100svh] min-h-[640px] w-full flex-col overflow-hidden lg:flex-row lg:items-center">
        <div className="fx-pool fx-pool-warm left-[30%] top-1/2 h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 opacity-40" aria-hidden />

        <div className="relative order-2 h-[58svh] lg:order-none lg:h-full lg:w-[52%]">
          <PhoneRig
            className="af-sizer"
            rigClassName="af-rig"
            backlight
            style={{ top: "58%" } as React.CSSProperties}
          >
            <div className="af-phone screen-stack">
              <ArticleScreen article={articles.groundingTop} />
            </div>
          </PhoneRig>
        </div>

        <div className="af-copy relative z-10 px-6 pt-24 lg:w-[40%] lg:px-0 lg:pt-0">
          <p className="eyebrow mb-5 flex items-center gap-3">
            <span className="ph-rule" aria-hidden />
            {copy.articles.label}
          </p>
          <h2 id="articles-title" className="headline text-[clamp(32px,4.6vw,72px)] text-white">
            {copy.articles.headline}
          </h2>
          <p className="mt-5 max-w-md text-[16px] leading-relaxed text-steel-400 lg:text-[18px]">{copy.articles.body}</p>
          <ul className="mt-8 hidden space-y-3 lg:block">
            {copy.articles.points.map((p) => (
              <li key={p} className="af-point flex items-center gap-3 text-[15px] text-steel-300">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-white/5 ring-1 ring-white/10">
                  <Check size={13} className="text-electric-300" aria-hidden />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
