"use client";

import { BookOpen, Bookmark, FileText, Search, Table2 } from "lucide-react";
import { useRef } from "react";
import { HomeScreen } from "@/components/app-ui/screens";
import { PhoneRig } from "@/components/phone/PhoneRig";
import { copy } from "@/config/content";
import { site } from "@/config/site";
import { MQ, gsap, useGSAP } from "@/lib/gsap";
import { sound } from "@/lib/sound";

const ICONS = [FileText, Table2, Search, BookOpen, Bookmark];

/** Labels orbit the device, collapse into it, and resolve into the wordmark. */
export function ProductMoment() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current!;
      const q = gsap.utils.selector(section);
      const labels = q(".pm-label");
      const state = { radius: 1, spin: 0 };
      const mm = gsap.matchMedia();

      mm.add(`${MQ.desktop}, ${MQ.mobile}`, () => {
        const mobile = window.matchMedia(MQ.mobile).matches;
        // Orbit: positions computed per frame on an ellipse; labels behind the
        // device sit underneath it and dim.
        const orbit = () => {
          const rx = (mobile ? 0.42 : 0.3) * innerWidth * state.radius;
          const ry = (mobile ? 0.2 : 0.2) * innerHeight * state.radius;
          const t = performance.now() / 1000;
          labels.forEach((el, i) => {
            const a = (i / labels.length) * Math.PI * 2 + t * 0.22 + state.spin;
            const depth = Math.sin(a);
            gsap.set(el, {
              x: Math.cos(a) * rx,
              y: depth * ry * 0.55 - ry * 0.1,
              scale: 0.82 + depth * 0.18,
              opacity: (0.45 + depth * 0.55) * Math.min(1, state.radius * 1.4),
              zIndex: depth > 0 ? 30 : 5,
            });
          });
        };
        gsap.ticker.add(orbit);

        gsap.set(q(".pm-final > *"), { autoAlpha: 0, y: 30 });
        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: { trigger: section, start: "top top", end: "+=200%", pin: true, scrub: 0.8 },
        });
        tl.fromTo(q(".pm-sizer"), { "--phone-zoom": 0.85 }, { "--phone-zoom": 1, duration: 1 }, 0)
          .to(state, { spin: Math.PI, duration: 1.4 }, 0)
          .to(state, { radius: 0, duration: 1, ease: "power3.in" }, 1.2)
          .to(q(".pm-core"), { autoAlpha: 1, scale: 1.6, duration: 0.5, ease: "power2.out" }, 2)
          .call(() => sound.pulse(), undefined, 2.1)
          .to(q(".pm-sizer"), { "--phone-zoom": 0.6, autoAlpha: 0, duration: 0.8, ease: "power3.in" }, 2.3)
          .to(q(".pm-core"), { autoAlpha: 0, scale: 2.4, duration: 0.8 }, 2.5)
          .to(q(".pm-final > *"), { autoAlpha: 1, y: 0, stagger: 0.15, duration: 0.8, ease: "power3.out" }, 2.8)
          .to({}, { duration: 0.8 });
        return () => gsap.ticker.remove(orbit);
      });
      // Reduced motion: just the resolved wordmark.
      mm.add(MQ.reduce, () => gsap.set(q(".pm-sizer"), { autoAlpha: 0 }));
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative overflow-hidden bg-black" aria-labelledby="moment-title">
      <div className="relative h-[100svh] min-h-[620px] w-full overflow-hidden">
        <div className="fx-grid fx-grid-fade absolute inset-0 opacity-30" aria-hidden />
        <div className="fx-floor opacity-30" aria-hidden />
        <div className="pm-core fx-pool left-1/2 top-1/2 h-[50vmin] w-[50vmin] -translate-x-1/2 -translate-y-1/2 opacity-0" aria-hidden />

        <div className="absolute inset-0 z-10">
          <PhoneRig
            className="pm-sizer"
            backlight
            style={{ "--phone-s": "min(calc(var(--vhpx, 900) * 0.7 / 800), calc(var(--vwpx, 1440) * 0.62 / 380))" } as React.CSSProperties}
          >
            <HomeScreen />
          </PhoneRig>
        </div>

        <ul className="absolute left-1/2 top-1/2 motion-reduce:hidden" aria-label="Pocket PEC features">
          {copy.moment.labels.map((l, i) => {
            const Icon = ICONS[i];
            return (
              <li key={l} className="pm-label glass absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2.5 whitespace-nowrap rounded-full px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.22em] text-white lg:px-5 lg:py-3 lg:text-[12px]">
                <Icon size={15} className="text-electric-300" aria-hidden />
                {l}
              </li>
            );
          })}
        </ul>

        <div className="pm-final pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center">
          <h2 id="moment-title" className="display text-metal pb-2 text-[clamp(56px,13vw,220px)]">
            {site.wordmark}
          </h2>
          <p className="headline mt-3 text-[clamp(24px,3.4vw,52px)] text-white">
            {copy.moment.line[0]} <span className="text-steel-500">{copy.moment.line[1]}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
