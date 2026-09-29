"use client";

import { useRef } from "react";
import { ArticleScreen, HomeScreen, SearchScreen } from "@/components/app-ui/screens";
import { ResultTile, SearchField } from "@/components/app-ui/primitives";
import { Schematic } from "@/components/fx/Schematic";
import { PhoneRig } from "@/components/phone/PhoneRig";
import { Cta } from "@/components/ui/Cta";
import { copy } from "@/config/content";
import { articles, searches } from "@/config/screens";
import { contentFacts, links, site } from "@/config/site";
import { setChapter } from "@/lib/chapter-store";
import { MQ, gsap, typeInto, useGSAP } from "@/lib/gsap";
import { sound } from "@/lib/sound";

const panelDemo = searches.groundingElectrode;

/** CH 01-03: the device appears, approaches, powers on, searches and settles. */
export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current!;
      const q = gsap.utils.selector(section);
      const slot = q(".hero-slot")[0] as HTMLElement;
      const rel = (el: Element) => {
        const r = el.getBoundingClientRect();
        const s = section.getBoundingClientRect();
        return { x: r.left - s.left + r.width / 2, y: r.top - s.top + r.height / 2 };
      };
      const mm = gsap.matchMedia();

      mm.add(MQ.desktop, () => {
        const typer = typeInto(q(".hero-panel .js-typed")[0], panelDemo.query, () => sound.tick());
        gsap.set(q(".hero-panel"), { autoAlpha: 0 });
        gsap.set(q(".hero-panel .js-result"), { autoAlpha: 0, y: 14 });
        gsap.set(q(".hero-panel .js-typed"), { textContent: "" });
        gsap.set(q(".hero-end > *"), { autoAlpha: 0, y: 30 });
        gsap.set(q(".scr-article"), { autoAlpha: 0 });
        gsap.set(q(".scr-search"), { autoAlpha: 0 });
        gsap.set(q(".hero-rig"), { rotationY: -24, rotationX: 8, rotationZ: -2 });

        const center = () => ({ x: section.clientWidth / 2 - rel(slot).x, y: section.clientHeight * 0.5 - rel(slot).y });
        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=320%",
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => setChapter(self.progress < 0.1 ? 0 : self.progress < 0.42 ? 1 : 2),
          },
        });

        // 1. Wordmark parts, copy lifts away, device approaches
        tl.to(q(".hw-left"), { xPercent: -60, autoAlpha: 0, duration: 1.4 }, 0)
          .to(q(".hw-right"), { xPercent: 60, autoAlpha: 0, duration: 1.4 }, 0)
          .to(q(".hero-fade"), { y: -40, autoAlpha: 0, stagger: 0.06, duration: 0.9 }, 0)
          .to(q(".hero-mover"), { x: () => center().x, y: () => center().y, duration: 1.8 }, 0)
          .to(q(".hero-sizer"), { "--phone-zoom": 1.45, duration: 2.2 }, 0)
          .to(q(".hero-rig"), { rotationY: -36, rotationX: 10, rotationZ: 0, duration: 2 }, 0)
          .to(q(".hero-pool"), { scale: 1.4, autoAlpha: 1, duration: 2 }, 0.4)
          // 2. Schematic lines illuminate
          .to(q(".hero-sch .sch-draw"), { strokeDashoffset: 0, stagger: 0.05, duration: 1.6, ease: "power1.inOut" }, 1.0)
          .to(q(".hero-sch .sch-nodes"), { autoAlpha: 1, duration: 0.8 }, 1.8)
          .to(q(".hero-floor"), { opacity: 0.55, duration: 1.5 }, 1)
          .call(() => section.querySelector(".hero-sch")?.classList.add("is-live"), undefined, 2.6)
          // 3. The device turns a full revolution and powers on
          .to(q(".hero-rig"), { rotationY: 360, rotationX: 2, duration: 2.4, ease: "power3.inOut" }, 2.6)
          .to(q(".hero-sizer"), { "--phone-zoom": 1.7, duration: 2.4 }, 2.6)
          .to(q(".hero-sizer .pp-screen-off"), { opacity: 1, duration: 0.25, ease: "none" }, 3.1)
          .set(q(".scr-home .js-home-tile, .scr-home .js-home-chips, .scr-home .js-home-search, .scr-home .js-home-prompt"), { autoAlpha: 0, y: 16 }, 3.4)
          .to(q(".hero-sizer .pp-screen-off"), { opacity: 0, duration: 0.4, ease: "none" }, 4.5)
          .to(q(".scr-home .js-home-prompt, .scr-home .js-home-search, .scr-home .js-home-tile, .scr-home .js-home-chips"), { autoAlpha: 1, y: 0, stagger: 0.07, duration: 0.6, ease: "power2.out" }, 4.6)
          .call(() => sound.pulse(), undefined, 4.9)
          // 4. The search interface expands out of the device
          .to(q(".hero-mover"), { x: () => center().x - section.clientWidth * 0.16, duration: 1.2 }, 5.4)
          .to(q(".hero-rig"), { rotationY: 374, duration: 1.2 }, 5.4)
          .to(q(".hero-sizer .pp-screen-off"), { opacity: 0.45, duration: 1 }, 5.6)
          .fromTo(
            q(".hero-panel"),
            {
              autoAlpha: 0,
              scale: 0.25,
              x: () => -section.clientWidth * 0.2,
              y: () => -section.clientHeight * 0.12,
            },
            { autoAlpha: 1, scale: 1, x: 0, y: 0, duration: 1.1, ease: "power3.out" },
            5.6,
          )
          // 5. The query types itself, results arrive
          .to(typer.state, { n: panelDemo.query.length, duration: 1.3, ease: "none", onUpdate: typer.update }, 6.7)
          .to(q(".hero-panel .js-result"), { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.5 }, 7.6)
          // 6. A reference is selected
          .to(q(".hero-panel .panel-hl"), { autoAlpha: 1, duration: 0.4 }, 8.4)
          .fromTo(q(".hero-panel .panel-ripple"), { scale: 0, autoAlpha: 0.6 }, { scale: 1, autoAlpha: 0, duration: 0.6, ease: "power2.out" }, 8.6)
          // 7. The panel folds back into the device, which opens the section
          .to(q(".hero-panel"), { autoAlpha: 0, scale: 0.3, x: () => -section.clientWidth * 0.28, y: () => -section.clientHeight * 0.05, duration: 0.8, ease: "power3.in" }, 9.1)
          .to(q(".hero-sizer .pp-screen-off"), { opacity: 0, duration: 0.5 }, 9.5)
          .to(q(".scr-home"), { autoAlpha: 0, duration: 0.3 }, 9.6)
          .fromTo(q(".scr-article"), { autoAlpha: 0, x: 40 }, { autoAlpha: 1, x: 0, duration: 0.5 }, 9.6)
          // 8. The device settles into its hero position
          .to(q(".hero-mover"), { x: () => center().x + section.clientWidth * 0.2, y: () => center().y, duration: 1.4 }, 10)
          .to(q(".hero-rig"), { rotationY: 346, rotationX: 4, duration: 1.4 }, 10)
          .to(q(".hero-sizer"), { "--phone-zoom": 1.6, duration: 1.4 }, 10)
          .to(q(".hero-sch"), { autoAlpha: 0.35, duration: 1 }, 10)
          .to(q(".hero-end > *"), { autoAlpha: 1, y: 0, stagger: 0.12, duration: 0.8, ease: "power3.out" }, 10.5)
          .to({}, { duration: 0.8 });
        return () => section.querySelector(".hero-sch")?.classList.remove("is-live");
      });

      mm.add(MQ.mobile, () => {
        const typer = typeInto(q(".scr-search .js-typed")[0], panelDemo.query, () => sound.tick());
        gsap.set(q(".scr-search .js-typed"), { textContent: "" });
        gsap.set(q(".scr-search .js-results"), { visibility: "visible" });
        gsap.set(q(".scr-search .js-result"), { autoAlpha: 0, y: 10 });
        gsap.set(q(".scr-search, .scr-article"), { autoAlpha: 0 });
        gsap.set(q(".hero-end > *"), { autoAlpha: 0, y: 24 });
        gsap.set(q(".hero-rig"), { rotationY: -20, rotationX: 6 });
        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=220%",
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: (self) => setChapter(self.progress < 0.12 ? 0 : self.progress < 0.4 ? 1 : 2),
          },
        });
        tl.to(q(".hero-fade, .hw-left, .hw-right"), { y: -30, autoAlpha: 0, stagger: 0.04, duration: 0.8 }, 0)
          .to(q(".hero-mover"), { y: () => section.clientHeight * 0.46 - rel(slot).y, duration: 1.4 }, 0)
          .to(q(".hero-sizer"), { "--phone-zoom": 1.55, duration: 1.4 }, 0)
          .to(q(".hero-rig"), { rotationY: 0, rotationX: 0, duration: 1.4 }, 0.2)
          .to(q(".hero-sch .sch-draw"), { strokeDashoffset: 0, stagger: 0.05, duration: 1.2 }, 0.6)
          .to(q(".hero-sch .sch-nodes"), { autoAlpha: 1, duration: 0.6 }, 1.2)
          .to(q(".scr-home"), { autoAlpha: 0, duration: 0.4 }, 1.9)
          .to(q(".scr-search"), { autoAlpha: 1, duration: 0.4 }, 1.9)
          .to(typer.state, { n: panelDemo.query.length, duration: 1.2, ease: "none", onUpdate: typer.update }, 2.3)
          .to(q(".scr-search .js-result"), { autoAlpha: 1, y: 0, stagger: 0.06, duration: 0.4 }, 3.3)
          .to(q(".scr-search"), { autoAlpha: 0, duration: 0.4 }, 4.2)
          .to(q(".scr-article"), { autoAlpha: 1, duration: 0.4 }, 4.2)
          .to(q(".hero-mover"), { y: () => section.clientHeight * 0.36 - rel(slot).y, duration: 1 }, 4.8)
          .to(q(".hero-sizer"), { "--phone-zoom": 1.2, duration: 1 }, 4.8)
          .to(q(".hero-sch"), { autoAlpha: 0.3, duration: 0.8 }, 4.8)
          .to(q(".hero-end > *"), { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.6 }, 5.2)
          .to({}, { duration: 0.6 });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="top" className="hero relative overflow-hidden bg-black" aria-label="Pocket PEC">
      <div className="relative h-[100svh] min-h-[600px] w-full overflow-hidden">
        {/* Backdrop */}
        <div className="fx-grid fx-grid-fade absolute inset-0 opacity-50" aria-hidden />
        <div className="hero-floor fx-floor" aria-hidden />
        <div className="hero-pool fx-pool left-1/2 top-[46%] h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 opacity-60" aria-hidden />
        <Schematic className="hero-sch absolute inset-0 h-full w-full [&_.sch-nodes]:opacity-0" />
        <span className="fx-cross left-[4vw] top-[14vh]" aria-hidden />
        <span className="fx-cross right-[4vw] top-[14vh]" aria-hidden />
        <span className="fx-cross bottom-[6vh] left-[4vw]" aria-hidden />
        <span className="fx-cross bottom-[6vh] right-[4vw]" aria-hidden />

        {/* Opening composition */}
        <div className="relative z-20 flex h-full flex-col items-center justify-center px-5 pt-16 text-center lg:pt-10">
          <p className="hero-fade eyebrow mb-[3vh] lg:mb-[4vh]">
            <span className="intro-rise inline-block" style={{ "--d": "1s" } as React.CSSProperties}>
              {copy.hero.eyebrow}
            </span>
          </p>

          <div className="flex w-full flex-wrap items-center justify-center gap-x-[2vw] lg:flex-nowrap">
            <h1 className="display text-[clamp(52px,14vw,96px)] lg:text-[clamp(72px,10.4vw,196px)]">
              <span className="hw-left inline-block">
                <span className="intro-word-l text-metal inline-block pb-[0.06em]">{copy.hero.words[0]}</span>
              </span>
              <span className="lg:hidden"> </span>
              <span className="sr-only"> </span>
              <span className="hw-right inline-block lg:hidden">
                <span className="intro-word-r text-metal inline-block pb-[0.06em]">{copy.hero.words[1]}</span>
              </span>
              <span className="sr-only">: {copy.hero.headline.join(" ")}</span>
            </h1>
            <div className="hero-slot relative order-3 mt-2 h-[34svh] w-full shrink-0 lg:order-none lg:mt-0 lg:h-[36vh] lg:w-[17vh]">
              <div className="hero-mover absolute inset-0">
                <div className="intro-device absolute inset-0" style={{ "--d": "0.2s" } as React.CSSProperties}>
                <PhoneRig
                  className="hero-sizer"
                  rigClassName="hero-rig"
                  backlight
                  style={{ "--phone-s": "calc(var(--vhpx, 900) * 0.36 / 800)" } as React.CSSProperties}
                >
                  <div className="hero-phone screen-stack">
                    <HomeScreen className="scr-home" />
                    <SearchScreen className="scr-search" demos={[panelDemo]} typed />
                    <ArticleScreen className="scr-article" article={articles.groundingFocus} focus="2.50.3.1" />
                  </div>
                </PhoneRig>
                </div>
              </div>
            </div>
            <span aria-hidden className="display hidden text-[clamp(72px,10.4vw,196px)] lg:inline-block">
              <span className="hw-right inline-block">
                <span className="intro-word-r text-metal inline-block pb-[0.06em]">{copy.hero.words[1]}</span>
              </span>
            </span>
          </div>

          <div className="hero-fade mt-[3vh] lg:mt-[4.5vh]">
            <p className="headline intro-rise text-[clamp(22px,3.2vw,44px)] text-white" style={{ "--d": "0.9s" } as React.CSSProperties}>
              {copy.hero.headline[0]} <span className="text-steel-400">{copy.hero.headline[1]}</span>
            </p>
          </div>
          <div className="hero-fade">
            <p className="intro-rise mx-auto mt-3 max-w-[34rem] text-[15px] leading-relaxed text-steel-400 lg:text-[17px]" style={{ "--d": "1.05s" } as React.CSSProperties}>
              {copy.hero.sub}
            </p>
          </div>
          <div className="hero-fade mt-6">
          <div className="intro-rise flex flex-wrap items-center justify-center gap-3" style={{ "--d": "1.2s" } as React.CSSProperties}>
            <Cta href={links.download} className="max-lg:h-10 max-lg:px-4 max-lg:text-sm">
              {copy.hero.primary}
            </Cta>
            <Cta href={links.howItWorks} variant="secondary" className="max-lg:h-10 max-lg:px-4 max-lg:text-sm">
              {copy.hero.secondary}
            </Cta>
          </div>
          </div>
        </div>

        {/* Spec line */}
        <div className="hero-fade absolute inset-x-0 bottom-[3.5vh] z-20">
        <div className="intro-fade flex flex-col items-center gap-2 px-5 lg:flex-row lg:justify-between lg:px-[4vw]" style={{ "--d": "1.5s" } as React.CSSProperties}>
          <p className="spec text-steel-400">{copy.hero.audience}</p>
          <ul className="spec hidden gap-6 lg:flex" aria-label="Content">
            <li>{site.edition}</li>
            {contentFacts.map((f) => (
              <li key={f.label}>
                <span className="text-steel-300">{f.value}</span> {f.label}
              </li>
            ))}
          </ul>
        </div>
        </div>

        {/* Floating search panel (desktop) */}
        <div className="hero-panel ui-vars invisible absolute left-[54%] top-[22%] z-30 hidden w-[410px] rounded-[26px] p-3 lg:block" aria-hidden style={panelStyle}>
          <SearchField text={panelDemo.query} placeholder="Search the Philippine Electrical Code…" />
          <div className="relative mt-1">
            <div className="ui-section-title js-result" style={{ paddingTop: 12 }}>
              Top matches
            </div>
            {panelDemo.matches.slice(0, 3).map((h, i) => (
              <div key={h.label} className="relative">
                {i === 1 && (
                  <>
                    <span className="panel-hl invisible absolute inset-0 rounded-xl" style={{ background: "rgba(252,192,16,0.1)", boxShadow: "inset 0 0 0 1.5px rgba(252,192,16,0.6)" }} />
                    <span className="panel-ripple invisible absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: "radial-gradient(closest-side, rgba(255,255,255,0.35), transparent)" }} />
                  </>
                )}
                <ResultTile hit={h} terms={panelDemo.terms} className="js-result" />
              </div>
            ))}
          </div>
        </div>

        {/* Settled copy */}
        <div className="hero-end pointer-events-none absolute inset-x-5 bottom-[7svh] z-20 text-center motion-reduce:hidden lg:inset-x-auto lg:bottom-auto lg:left-[7vw] lg:top-1/2 lg:max-w-[34rem] lg:-translate-y-1/2 lg:text-left">
          <p className="eyebrow mb-4 hidden lg:block">{copy.hero.endEyebrow}</p>
          <h2 className="headline text-[clamp(28px,4.2vw,64px)] text-white">
            <span className="lg:block">{copy.hero.endHeadline[0]}</span> <span className="lg:block">{copy.hero.endHeadline[1]}</span>
            <span className="block text-steel-500">{copy.hero.endHeadline[2]}</span>
          </h2>
          <p className="mt-5 hidden max-w-md text-[17px] leading-relaxed text-steel-400 lg:block">{copy.hero.endBody}</p>
        </div>
      </div>

      {/* Reduced motion: the settled message as a static block */}
      <div className="hidden px-6 py-24 text-center motion-reduce:block">
        <h2 className="headline mx-auto max-w-3xl text-4xl text-white md:text-6xl">
          {copy.hero.endHeadline[0]} {copy.hero.endHeadline[1]} <span className="text-steel-500">{copy.hero.endHeadline[2]}</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-steel-400">{copy.hero.endBody}</p>
      </div>
    </section>
  );
}

const panelStyle: React.CSSProperties = {
  background: "linear-gradient(180deg, rgba(15,27,51,0.86), rgba(8,16,32,0.9))",
  boxShadow:
    "0 40px 100px -30px rgba(0,0,0,0.9), inset 0 0 0 1px rgba(157,184,232,0.2), 0 0 80px -20px rgba(59,130,255,0.45)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  fontFamily: "var(--font-app)",
  color: "var(--ui-on)",
};

