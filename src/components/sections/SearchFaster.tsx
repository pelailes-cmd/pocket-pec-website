"use client";

import { Search } from "lucide-react";
import { useRef } from "react";
import { ArticleScreen, SearchScreen } from "@/components/app-ui/screens";
import { PhoneRig } from "@/components/phone/PhoneRig";
import { copy } from "@/config/content";
import { articles, searches } from "@/config/screens";
import { setChapter } from "@/lib/chapter-store";
import { MQ, gsap, typeInto, useGSAP } from "@/lib/gsap";
import { sound } from "@/lib/sound";

/** The four demo searches, each resolving to an app screen. */
const QUERIES = [
  { demo: searches.conductorAmpacity, kind: "Keywords", screen: "results", group: 0 },
  { demo: searches.groundingElectrode, kind: "Keywords", screen: "results", group: 1 },
  { demo: searches.article310, kind: "Article number", screen: "article", group: -1 },
  { demo: searches.table310, kind: "Table reference", screen: "results", group: 2 },
] as const;

const RESULT_DEMOS = [searches.conductorAmpacity, searches.groundingElectrode, searches.table310];

export function SearchFaster() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current!;
      const q = gsap.utils.selector(section);
      const mm = gsap.matchMedia();

      mm.add(`${MQ.desktop}, ${MQ.mobile}`, () => {
        const mobile = window.matchMedia(MQ.mobile).matches;
        const big = q(".sf-typed")[0];
        const phoneTyped = q(".sf-phone .scr-search .js-typed")[0];
        const groups = q(".sf-phone .js-results");
        gsap.set(big, { textContent: "" });
        gsap.set(groups, { autoAlpha: 0 });
        gsap.set(q(".sf-phone .scr-article"), { autoAlpha: 0 });
        gsap.set(q(".sf-kind"), { autoAlpha: 0, y: 8 });
        gsap.set(q(".sf-phone-wrap"), { yPercent: 30, autoAlpha: 0 });

        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: mobile ? "+=260%" : "+=340%",
            pin: true,
            scrub: 0.7,
            onToggle: (self) => self.isActive && setChapter(3),
          },
        });
        tl.fromTo(q(".sf-head > *"), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, stagger: 0.12, duration: 0.6 }, 0)
          .fromTo(q(".sf-field"), { autoAlpha: 0, scale: 0.92, y: 40 }, { autoAlpha: 1, scale: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0.1)
          .to(q(".sf-phone-wrap"), { yPercent: 0, autoAlpha: 1, duration: 1, ease: "power3.out" }, 0.4);

        let t = 1.2;
        QUERIES.forEach((item, i) => {
          const text = item.demo.query;
          const typer = typeInto(big, text, () => sound.tick());
          const kind = q(`.sf-kind[data-i="${i}"]`);
          tl.set(q(".sf-count"), { textContent: `0${i + 1} / 0${QUERIES.length}` }, t)
            .to(kind, { autoAlpha: 1, y: 0, duration: 0.3 }, t)
            .to(typer.state, { n: text.length, duration: 0.9, ease: "none", onUpdate: typer.update }, t)
            // Enter: a pulse travels from the field into the phone
            .fromTo(q(".sf-beam"), { scaleY: 0, autoAlpha: 1, transformOrigin: "50% 0%" }, { scaleY: 1, duration: 0.3, ease: "power2.in" }, t + 0.95)
            .to(q(".sf-beam"), { autoAlpha: 0, duration: 0.25 }, t + 1.25)
            .call(() => phoneTyped && (phoneTyped.textContent = text), undefined, t + 1.1)
            .to(q(".sf-field"), { boxShadow: "0 0 0 1px rgba(156,194,255,0.55), 0 0 90px -10px rgba(59,130,255,0.75)", duration: 0.2, yoyo: true, repeat: 1 }, t + 0.95);

          if (item.screen === "article") {
            tl.to(q(".sf-phone .scr-search"), { autoAlpha: 0, duration: 0.3 }, t + 1.15).fromTo(
              q(".sf-phone .scr-article"),
              { autoAlpha: 0, x: 30 },
              { autoAlpha: 1, x: 0, duration: 0.4 },
              t + 1.15,
            );
          } else {
            const g = groups[item.group];
            tl.to(q(".sf-phone .scr-search"), { autoAlpha: 1, duration: 0.2 }, t + 1.1)
              .to(q(".sf-phone .scr-article"), { autoAlpha: 0, duration: 0.2 }, t + 1.1)
              .to(g, { autoAlpha: 1, duration: 0.01 }, t + 1.15)
              .fromTo(g.querySelectorAll(".js-result"), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, stagger: 0.06, duration: 0.4 }, t + 1.15);
          }

          if (i < QUERIES.length - 1) {
            const back = typeInto(big, text);
            back.state.n = text.length;
            tl.to(kind, { autoAlpha: 0, y: -8, duration: 0.25 }, t + 2.1)
              .to(back.state, { n: 0, duration: 0.3, ease: "none", onUpdate: back.update }, t + 2.1);
            if (item.group >= 0) tl.to(groups[item.group], { autoAlpha: 0, duration: 0.2 }, t + 2.35);
          }
          t += 2.5;
        });
        tl.to({}, { duration: 0.8 });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="how-it-works" className="relative overflow-hidden bg-black" aria-labelledby="search-title">
      <div className="relative h-[100svh] min-h-[620px] w-full overflow-hidden">
        <div className="fx-grid fx-grid-fade absolute inset-0 opacity-40" aria-hidden />
        <div className="fx-pool left-1/2 top-[40%] h-[60vmin] w-[120vmin] -translate-x-1/2 -translate-y-1/2 opacity-70" aria-hidden />

        <div className="sf-head relative z-10 px-6 pt-[13vh] text-center lg:pt-[12vh]">
          <p className="eyebrow mb-4">{copy.search.eyebrow}</p>
          <h2 id="search-title" className="headline text-[clamp(30px,4.6vw,68px)] text-white">
            {copy.search.headline}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] text-steel-400 lg:text-[17px]">{copy.search.body}</p>
        </div>

        {/* The floating search field */}
        <div className="relative z-20 mx-auto mt-[4vh] w-[min(1040px,90vw)]">
          <div className="sf-field glass relative flex h-[64px] items-center gap-4 rounded-full px-6 lg:h-[92px] lg:gap-6 lg:px-9" style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.1), 0 30px 80px -30px rgba(59,130,255,0.5)" }}>
            <Search className="h-6 w-6 shrink-0 text-electric-300 lg:h-8 lg:w-8" aria-hidden />
            <div className="relative min-w-0 flex-1 truncate text-[20px] font-medium tracking-tight text-white lg:text-[38px]">
              <span className="sf-typed" data-placeholder={copy.search.placeholder}>
                {QUERIES[3].demo.query}
              </span>
              <span className="ml-0.5 inline-block h-[0.9em] w-[2px] translate-y-[0.12em] animate-pulse bg-electric-400" aria-hidden />
            </div>
            <div className="relative hidden h-6 w-44 shrink-0 text-right lg:block" aria-hidden>
              {QUERIES.map((item, i) => (
                <span key={i} data-i={i} className="sf-kind spec absolute inset-0 text-electric-300">
                  {item.kind}
                </span>
              ))}
            </div>
            <span className="sf-count spec shrink-0 text-steel-500" aria-hidden>
              04 / 04
            </span>
          </div>
          <span className="sf-beam pointer-events-none absolute left-1/2 top-full h-[9vh] w-px -translate-x-1/2 bg-gradient-to-b from-electric-300 to-transparent opacity-0" aria-hidden />
        </div>

        {/* The phone rising from below */}
        <div className="sf-phone-wrap absolute inset-x-0 bottom-0 top-[52%] z-10 lg:top-[50%]">
          <PhoneRig
            className="sf-phone-rig"
            float={false}
            style={{ "--phone-s": "min(calc(var(--vhpx, 900) * 0.92 / 800), calc(var(--vwpx, 1440) * 0.86 / 380))", top: "calc(var(--vhpx, 900) * 0.46px)" } as React.CSSProperties}
          >
            <div className="sf-phone screen-stack">
              <SearchScreen className="scr-search" demos={RESULT_DEMOS} typed />
              <ArticleScreen className="scr-article" article={articles.conductors} />
            </div>
          </PhoneRig>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[22vh] bg-gradient-to-t from-black to-transparent" aria-hidden />
        </div>
      </div>
    </section>
  );
}
