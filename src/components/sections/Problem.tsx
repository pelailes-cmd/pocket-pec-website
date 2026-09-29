"use client";

import { useRef } from "react";
import { HomeScreen } from "@/components/app-ui/screens";
import { PhoneRig } from "@/components/phone/PhoneRig";
import { copy } from "@/config/content";
import { setChapter } from "@/lib/chapter-store";
import { MQ, gsap, useGSAP } from "@/lib/gsap";

/** Paper objects: position (vw/vh from centre), depth, rotation. */
const OBJECTS = [
  { cls: "paper-book", x: -39, y: 14, z: -80, rx: 18, ry: 34, rz: -8, tabs: true },
  { cls: "paper-sheet paper-hl", x: -22, y: -30, z: 40, rx: -10, ry: -18, rz: 9 },
  { cls: "paper-table", x: 28, y: -28, z: -60, rx: 14, ry: -28, rz: -6 },
  { cls: "paper-sheet paper-circle", x: 34, y: 18, z: 60, rx: -16, ry: -24, rz: 12 },
  { cls: "paper-sheet", x: -18, y: 34, z: -160, rx: 22, ry: 20, rz: -14 },
  { cls: "paper-note", x: 16, y: 34, z: 120, rx: 8, ry: 12, rz: 10 },
  { cls: "paper-note", x: -42, y: -34, z: -300, rx: -8, ry: 18, rz: -16 },
  { cls: "paper-sheet", x: 12, y: -8, z: -900, rx: 10, ry: -34, rz: 6 },
  { cls: "paper-table", x: -8, y: 10, z: -1100, rx: 30, ry: 6, rz: 4 },
];

export function Problem() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current!;
      const q = gsap.utils.selector(section);
      const mm = gsap.matchMedia();
      const counter = q(".js-page")[0];
      const crumb = q(".js-crumb")[0];

      mm.add(`${MQ.desktop}, ${MQ.mobile}`, () => {
        const mobile = window.matchMedia(MQ.mobile).matches;
        const objs = q(".paper");
        objs.forEach((el, i) => {
          const o = OBJECTS[i];
          gsap.set(el, {
            x: `${o.x * (mobile ? 1.4 : 1)}vw`,
            y: `${o.y}vh`,
            z: o.z,
            rotationX: o.rx,
            rotationY: o.ry,
            rotationZ: o.rz,
            scale: mobile ? 0.62 : 1,
            filter: `brightness(${Math.max(0.28, Math.min(0.85, 0.62 + o.z / 900))})`,
          });
        });
        gsap.set(q(".prob-phone"), { autoAlpha: 0, "--phone-zoom": 0.7 });
        gsap.set(q(".prob-resolve > *"), { autoAlpha: 0, y: 30 });

        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: mobile ? "+=170%" : "+=230%",
            pin: true,
            scrub: 0.8,
            onToggle: (self) => self.isActive && setChapter(2),
            onUpdate: (self) => {
              // Page hunting: the counter flips through pages as you scroll.
              if (counter) counter.textContent = String(1 + Math.floor(Math.min(self.progress / 0.5, 1) * 1145)).padStart(4, "0");
              if (crumb) crumb.textContent = copy.problem.ticker[Math.floor(self.progress * 24) % copy.problem.ticker.length];
            },
          },
        });

        // Drift: the paper world slowly turns
        tl.to(q(".prob-world"), { rotationY: -8, rotationX: 4, duration: 3 }, 0)
          .fromTo(q(".prob-head > *"), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, stagger: 0.2, duration: 0.8 }, 0)
          .to(q(".prob-hunt"), { autoAlpha: 1, duration: 0.5 }, 0.3)
          // Everything converges into the device
          .to(q(".prob-head > *"), { autoAlpha: 0, y: -30, stagger: 0.1, duration: 0.6 }, 2.4)
          .to(q(".prob-hunt"), { autoAlpha: 0, duration: 0.4 }, 2.4)
          .to(objs, { x: 0, y: 0, z: 0, rotationX: 0, rotationY: 0, rotationZ: 0, scale: 0.12, autoAlpha: 0, stagger: 0.06, duration: 1.4, ease: "power3.in" }, 2.6)
          .to(q(".prob-phone"), { autoAlpha: 1, "--phone-zoom": 1, duration: 1.2, ease: "power3.out" }, 3.6)
          .to(q(".prob-flash"), { autoAlpha: 1, scale: 1, duration: 0.4, ease: "power2.out" }, 3.8)
          .to(q(".prob-flash"), { autoAlpha: 0, scale: 1.6, duration: 0.8 }, 4.2)
          .to(q(".prob-resolve > *"), { autoAlpha: 1, y: 0, stagger: 0.15, duration: 0.8, ease: "power3.out" }, 4.4)
          .to({}, { duration: 1 });
      });

      mm.add(MQ.reduce, () => gsap.set(q(".prob-phone"), { autoAlpha: 0 }));
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative overflow-hidden bg-graphite-950" aria-labelledby="problem-title">
      <div className="relative h-[100svh] min-h-[600px] w-full overflow-hidden">
        <div className="fx-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,#000_20%,transparent_70%)]" aria-hidden />
        <div className="fx-pool fx-pool-warm left-1/2 top-1/2 h-[70vmin] w-[90vmin] -translate-x-1/2 -translate-y-1/2 opacity-70" aria-hidden />

        {/* Paper world */}
        <div className="absolute inset-0 motion-reduce:hidden" style={{ perspective: "1400px" }} aria-hidden>
          <div className="prob-world absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
            {OBJECTS.map((o, i) => (
              <div key={i} className={`paper ${o.cls}`}>
                {o.tabs && (
                  <>
                    <span className="paper-tab" style={{ top: 40, background: "var(--color-ph-gold)" }} />
                    <span className="paper-tab" style={{ top: 96, background: "var(--color-ph-red)" }} />
                    <span className="paper-tab" style={{ top: 152, background: "var(--color-electric-500)" }} />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Page-hunting readout */}
        <div className="prob-hunt pointer-events-none absolute bottom-[8vh] left-1/2 z-10 flex -translate-x-1/2 items-center gap-4 font-mono text-[11px] uppercase tracking-[0.24em] text-steel-400 opacity-0 motion-reduce:hidden" aria-hidden>
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ph-red" />
          <span>Searching</span>
          <span className="text-white">
            p. <span className="js-page">0001</span>
          </span>
          <span className="js-crumb w-20 text-steel-500">Index</span>
        </div>

        {/* Headline */}
        <div className="prob-head pointer-events-none absolute inset-x-0 top-1/2 z-20 -translate-y-1/2 px-6 text-center motion-reduce:static motion-reduce:translate-y-0 motion-reduce:pt-28">
          <p className="eyebrow mb-5">{copy.problem.eyebrow}</p>
          <h2 id="problem-title" className="headline mx-auto max-w-5xl text-[clamp(32px,5.6vw,84px)] text-white">
            {copy.problem.headline[0]}
            <span className="block text-steel-500">{copy.problem.headline[1]}</span>
          </h2>
        </div>

        {/* Resolution: the device */}
        <div className="prob-flash fx-pool pointer-events-none left-1/2 top-1/2 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 scale-50 opacity-0" aria-hidden />
        <PhoneRig className="prob-phone" style={{ "--phone-s": "min(calc(var(--vhpx, 900) * 0.62 / 800), calc(var(--vwpx, 1440) * 0.7 / 380))", top: "46%" } as React.CSSProperties} float>
          <HomeScreen />
        </PhoneRig>
        <div className="prob-resolve pointer-events-none absolute inset-x-0 bottom-[5vh] z-10 px-6 text-center">
          <p className="headline mx-auto max-w-3xl text-[clamp(20px,2.4vw,34px)] text-white">
            {copy.problem.resolution[0]} <span className="text-steel-400">{copy.problem.resolution[1]}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
