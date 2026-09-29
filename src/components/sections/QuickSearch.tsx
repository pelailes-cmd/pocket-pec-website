"use client";

import { useRef } from "react";
import { HomeScreen, SearchScreen } from "@/components/app-ui/screens";
import { PhoneRig } from "@/components/phone/PhoneRig";
import { copy } from "@/config/content";
import { searches } from "@/config/screens";
import { setChapter } from "@/lib/chapter-store";
import { MQ, gsap, typeInto, useGSAP } from "@/lib/gsap";
import { sound } from "@/lib/sound";

const DEMOS = [searches.grounding, searches.motor, searches.ampacity];

/** Types on the phone's keyboard; results appear; the app returns home. */
export function QuickSearch() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current!;
      const q = gsap.utils.selector(section);
      const mm = gsap.matchMedia();
      mm.add(`${MQ.desktop}, ${MQ.mobile}`, () => {
        const mobile = window.matchMedia(MQ.mobile).matches;
        const field = q(".qs-phone .js-typed")[0];
        const groups = q(".qs-phone .js-results");
        const keys = q(".qs-phone [data-key]");
        const press = (ch: string) => {
          const key = keys.find((k) => k.dataset.key === ch);
          if (!key) return;
          key.classList.add("is-pressed");
          window.setTimeout(() => key.classList.remove("is-pressed"), 140);
        };
        gsap.set(field, { textContent: "" });
        gsap.set(groups, { autoAlpha: 0 });
        gsap.set(q(".qs-home"), { autoAlpha: 0 });
        gsap.set(q(".qs-rig"), { rotationY: mobile ? 0 : -16, rotationX: 4 });

        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: mobile ? "+=220%" : "+=260%",
            pin: true,
            scrub: 0.6,
            onToggle: (self) => self.isActive && setChapter(5),
          },
        });
        tl.fromTo(q(".qs-copy > *"), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.6 }, 0);
        let t = 0.6;
        DEMOS.forEach((d, i) => {
          const typer = typeInto(field, d.query, () => {
            sound.tick();
            press(d.query[Math.max(0, (field.textContent ?? "").length - 1)]);
          });
          const g = groups[i];
          tl.to(q(`.qs-chip[data-i="${i}"]`), { color: "#fff", borderColor: "rgba(156,194,255,0.6)", backgroundColor: "rgba(59,130,255,0.14)", duration: 0.2 }, t)
            .to(typer.state, { n: d.query.length, duration: 0.8, ease: "none", onUpdate: typer.update }, t)
            .to(g, { autoAlpha: 1, duration: 0.01 }, t + 0.85)
            .fromTo(g.querySelectorAll(".js-result"), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, stagger: 0.07, duration: 0.35 }, t + 0.85)
            .to(q(`.qs-chip[data-i="${i}"]`), { color: "", borderColor: "", backgroundColor: "", duration: 0.2 }, t + 1.9)
            .to(g, { autoAlpha: 0, duration: 0.2 }, t + 1.9);
          const back = typeInto(field, d.query);
          back.state.n = d.query.length;
          tl.to(back.state, { n: 0, duration: 0.25, ease: "none", onUpdate: back.update }, t + 1.9);
          t += 2.3;
        });
        // Back to the Pocket PEC home screen
        tl.to(q(".qs-search"), { autoAlpha: 0, duration: 0.4 }, t)
          .fromTo(q(".qs-home"), { autoAlpha: 0, scale: 0.96 }, { autoAlpha: 1, scale: 1, duration: 0.5 }, t)
          .to(q(".qs-rig"), { rotationY: mobile ? 0 : -8, duration: 0.8 }, t)
          .to({}, { duration: 0.8 });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative overflow-hidden bg-black" aria-labelledby="quick-title">
      <div className="relative flex h-[100svh] min-h-[640px] w-full flex-col overflow-hidden lg:flex-row lg:items-center">
        <div className="fx-pool left-[66%] top-1/2 h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 opacity-50" aria-hidden />

        <div className="qs-copy relative z-10 px-6 pt-24 lg:ml-[7vw] lg:w-[38%] lg:px-0 lg:pt-0">
          <p className="eyebrow mb-4">{copy.quick.label}</p>
          <h2 id="quick-title" className="headline text-[clamp(30px,4.6vw,72px)] text-white">
            {copy.quick.headline}
          </h2>
          <p className="mt-4 max-w-md text-[16px] leading-relaxed text-steel-400 lg:text-[18px]">{copy.quick.body}</p>
          <div className="mt-6 flex flex-wrap gap-2 lg:mt-8">
            {DEMOS.map((d, i) => (
              <span key={d.query} data-i={i} className="qs-chip rounded-full border border-white/12 px-3.5 py-1.5 font-mono text-[12px] text-steel-400">
                {d.query}
              </span>
            ))}
          </div>
          <p className="spec mt-5 hidden lg:block">{copy.quick.kinds.join(" · ")}</p>
        </div>

        <div className="relative flex-1">
          <PhoneRig className="qs-sizer" rigClassName="qs-rig" backlight>
            <div className="qs-phone screen-stack">
              <SearchScreen className="qs-search" demos={DEMOS} keyboard typed={false} />
              <HomeScreen className="qs-home" />
            </div>
          </PhoneRig>
        </div>
      </div>
    </section>
  );
}
