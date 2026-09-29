"use client";

import { useRef } from "react";
import { ArticleScreen, HomeScreen, SavedScreen, TableScreen } from "@/components/app-ui/screens";
import { PhoneRig } from "@/components/phone/PhoneRig";
import { copy } from "@/config/content";
import { articles } from "@/config/screens";
import { asset } from "@/config/site";
import { setChapter } from "@/lib/chapter-store";
import { MQ, gsap, useGSAP } from "@/lib/gsap";

// Environment plates live in /public/images/field (see README for how they were made).
const SCREENS = [
  <ArticleScreen key="a" article={articles.groundingTop} />,
  <TableScreen key="t" />,
  <HomeScreen key="h" />,
  <SavedScreen key="s" />,
];

/** CH 07: the same device in front of four working environments. */
export function Field() {
  const root = useRef<HTMLElement>(null);
  const scenes = copy.field.scenes;

  useGSAP(
    () => {
      const section = root.current!;
      const q = gsap.utils.selector(section);
      const mm = gsap.matchMedia();
      mm.add(`${MQ.desktop}, ${MQ.mobile}`, () => {
        const mobile = window.matchMedia(MQ.mobile).matches;
        const plates = q(".fd-plate");
        const lines = q(".fd-line");
        const screens = q(".fd-screen");
        gsap.set([...plates.slice(1), ...screens.slice(1)], { autoAlpha: 0 });
        gsap.set(lines, { autoAlpha: 0.22 });
        gsap.set(q(".fd-rig"), { rotationY: mobile ? -6 : -14, rotationX: 5 });
        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=300%",
            pin: true,
            scrub: 0.8,
            onToggle: (self) => self.isActive && setChapter(6),
          },
        });
        tl.fromTo(q(".fd-head > :not(.fd-closing)"), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.6 }, 0).to(lines[0], { autoAlpha: 1, duration: 0.4 }, 0.2);
        plates.forEach((p, i) => {
          tl.fromTo(p, { scale: 1.12 }, { scale: 1, duration: 1.6, ease: "none" }, i * 1.2);
          if (i === 0) return;
          const t = i * 1.2;
          tl.to(plates[i - 1], { autoAlpha: 0, duration: 0.5 }, t)
            .to(p, { autoAlpha: 1, duration: 0.5 }, t)
            .to(screens[i - 1], { autoAlpha: 0, duration: 0.3 }, t + 0.1)
            .to(screens[i], { autoAlpha: 1, duration: 0.3 }, t + 0.1)
            .to(lines[i - 1], { autoAlpha: 0.22, duration: 0.3 }, t)
            .to(lines[i], { autoAlpha: 1, duration: 0.3 }, t)
            .to(q(".fd-caption"), { textContent: `0${i + 1} / ${scenes[i].caption}`, duration: 0.01 }, t)
            .to(q(".fd-rig"), { rotationY: (mobile ? -6 : -14) + (i % 2 ? 6 : 0), duration: 1 }, t);
        });
        tl.to(q(".fd-closing"), { autoAlpha: 1, y: 0, duration: 0.6 }, plates.length * 1.2 - 0.2).to({}, { duration: 0.8 });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative overflow-hidden bg-black" aria-labelledby="field-title">
      <div className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
        {scenes.map((s, i) => (
          <picture key={s.id} className="fd-plate absolute inset-0 block" style={{ visibility: i === 0 ? "visible" : "hidden" }}>
            <source type="image/avif" srcSet={`${asset(`/images/field/${s.id}-1024.avif`)} 1024w, ${asset(`/images/field/${s.id}-1920.avif`)} 1920w`} sizes="100vw" />
            <source type="image/webp" srcSet={`${asset(`/images/field/${s.id}-1024.webp`)} 1024w, ${asset(`/images/field/${s.id}-1920.webp`)} 1920w`} sizes="100vw" />
            <img
              src={asset(`/images/field/${s.id}-1920.webp`)}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
              style={{ filter: "saturate(0.85) brightness(0.8)" }}
            />
          </picture>
        ))}
        {/* Grade: keep it restrained and readable */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.9)_0%,rgba(0,0,0,0.55)_40%,rgba(0,0,0,0.25)_68%,rgba(0,0,0,0.6)_100%)]" aria-hidden />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,transparent_20%,rgba(0,0,0,0.65)_80%)]" aria-hidden />
        <div className="absolute inset-0 bg-[rgba(8,24,60,0.25)] mix-blend-multiply" aria-hidden />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent" aria-hidden />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black to-transparent" aria-hidden />

        <div className="fd-head relative z-10 px-6 pt-24 lg:absolute lg:left-[7vw] lg:top-1/2 lg:w-[44vw] lg:-translate-y-1/2 lg:px-0 lg:pt-0">
          <p className="eyebrow mb-4 flex items-center gap-3">
            <span className="ph-rule" aria-hidden />
            {copy.field.label}
          </p>
          <h2 id="field-title" className="headline text-[clamp(28px,4vw,62px)] text-white">
            {copy.field.headline[0]} <span className="lg:block">{copy.field.headline[1]}</span>
          </h2>
          <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-1 lg:mt-8 lg:block lg:space-y-1">
            {scenes.map((s) => (
              <li key={s.id} className="fd-line headline text-[clamp(18px,2.2vw,34px)] text-white">
                {s.line}
              </li>
            ))}
          </ul>
          <p className="fd-closing mt-5 translate-y-3 text-[16px] text-steel-300 opacity-0 lg:mt-7 lg:text-[19px] motion-reduce:translate-y-0 motion-reduce:opacity-100">
            {copy.field.closing}
          </p>
        </div>

        <p className="fd-caption spec absolute bottom-[5vh] right-[5vw] z-10 hidden text-steel-400 lg:block" aria-hidden>
          01 / {scenes[0].caption}
        </p>

        <div className="absolute inset-x-0 bottom-0 top-[46%] lg:inset-y-0 lg:left-[50%] lg:right-0 lg:top-0">
          <PhoneRig
            rigClassName="fd-rig"
            style={{ "--phone-s": "min(calc(var(--vhpx, 900) * 0.78 / 800), calc(var(--vwpx, 1440) * 0.66 / 380))", top: "56%" } as React.CSSProperties}
          >
            <div className="screen-stack">
              {SCREENS.map((s, i) => (
                <div key={i} className="fd-screen absolute inset-0" style={{ visibility: i === 0 ? "visible" : "hidden" }}>
                  {s}
                </div>
              ))}
            </div>
          </PhoneRig>
        </div>
      </div>
    </section>
  );
}
