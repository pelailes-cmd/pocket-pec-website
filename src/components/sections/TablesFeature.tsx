"use client";

import { Info } from "lucide-react";
import { useRef } from "react";
import { TableLandscape, TableScreen } from "@/components/app-ui/screens";
import { PhoneRig } from "@/components/phone/PhoneRig";
import { copy } from "@/config/content";
import { setChapter } from "@/lib/chapter-store";
import { MQ, gsap, useGSAP } from "@/lib/gsap";

/** CH 06: the device turns to landscape and the camera pushes into the table. */
export function TablesFeature() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current!;
      const q = gsap.utils.selector(section);
      const mm = gsap.matchMedia();
      mm.add(`${MQ.desktop}, ${MQ.mobile}`, () => {
        const mobile = window.matchMedia(MQ.mobile).matches;
        const rows = q(".tf-land .js-row");
        gsap.set(q(".tf-land"), { autoAlpha: 0 });
        gsap.set(q(".tf-rig"), { rotationY: -18, rotationX: 10 });
        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=220%",
            pin: true,
            scrub: 0.7,
            onToggle: (self) => self.isActive && setChapter(5),
          },
        });
        tl.fromTo(q(".tf-head > *"), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.6 }, 0)
          .fromTo(q(".tf-sizer"), { "--phone-zoom": 0.8 }, { "--phone-zoom": 1, duration: 1 }, 0)
          // Rotate to landscape; the landscape layout takes over mid-turn
          .to(q(".tf-rig"), { rotationZ: -90, rotationY: 0, rotationX: 0, duration: 1.4 }, 1)
          .to(q(".tf-port"), { autoAlpha: 0, duration: 0.3 }, 1.5)
          .to(q(".tf-land"), { autoAlpha: 1, duration: 0.3 }, 1.5)
          // Camera push
          .to(q(".tf-sizer"), { "--phone-zoom": mobile ? 1.1 : 1.12, duration: 1.2 }, 2.5)
          .to(q(".tf-rig"), { rotationX: 8, duration: 1.2 }, 2.5)
          .fromTo(q(".tf-note"), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 2.8);
        // A highlight scans down the rows
        rows.forEach((r, i) => {
          tl.call(() => rows.forEach((x, j) => x.classList.toggle("is-hl", i === j)), undefined, 2.6 + i * 0.16);
        });
        tl.to({}, { duration: 0.8 });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative overflow-hidden bg-graphite-950" aria-labelledby="tables-title">
      <div className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
        <div className="fx-grid absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_at_center,#000_15%,transparent_65%)]" aria-hidden />
        <div className="fx-pool left-1/2 top-[55%] h-[70vmin] w-[110vmin] -translate-x-1/2 -translate-y-1/2 opacity-60" aria-hidden />

        <div className="tf-head relative z-10 px-6 pt-24 lg:absolute lg:left-[7vw] lg:top-[14vh] lg:max-w-[36rem] lg:px-0 lg:pt-0">
          <p className="eyebrow mb-4 flex items-center gap-3">
            <span className="ph-rule" aria-hidden />
            {copy.tables.label}
          </p>
          <h2 id="tables-title" className="headline text-[clamp(30px,4.4vw,68px)] text-white">
            {copy.tables.headline}
          </h2>
          <p className="mt-4 max-w-md text-[16px] leading-relaxed text-steel-400 lg:text-[18px]">{copy.tables.body}</p>
        </div>

        <PhoneRig
          className="tf-sizer lg:!left-[58%]"
          rigClassName="tf-rig"
          float={false}
          backlight
          style={{ "--phone-s": "min(calc(var(--vhpx, 900) * 0.72 / 800), calc(var(--vwpx, 1440) * 0.8 / 800))", top: "60%" } as React.CSSProperties}
          label="Pocket PEC table screen with sample data"
        >
          <div className="screen-stack">
            <TableScreen className="tf-port" />
            <div className="tf-land absolute" style={{ width: 780, height: 360, left: -210, top: 210, transform: "rotate(90deg)" }}>
              <TableLandscape />
            </div>
          </div>
        </PhoneRig>

        <p className="tf-note absolute bottom-[4vh] left-1/2 z-10 flex w-[min(92vw,40rem)] -translate-x-1/2 items-start gap-2 text-center text-[12.5px] leading-relaxed text-steel-400 lg:bottom-[5vh] lg:left-auto lg:right-[5vw] lg:w-[22rem] lg:translate-x-0 lg:text-left">
          <Info size={14} className="mt-0.5 shrink-0 text-gold-300" aria-hidden />
          {copy.tables.demoNote}
        </p>
      </div>
    </section>
  );
}
