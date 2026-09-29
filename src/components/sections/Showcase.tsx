"use client";

import { useRef, type ReactNode } from "react";
import { ArticleScreen, HomeScreen, LibraryScreen, SavedScreen, SearchScreen, TableScreen } from "@/components/app-ui/screens";
import { PhoneRig } from "@/components/phone/PhoneRig";
import { copy } from "@/config/content";
import { articles, searches } from "@/config/screens";
import { setChapter } from "@/lib/chapter-store";
import { MQ, gsap, useGSAP } from "@/lib/gsap";

const SCREENS: ReactNode[] = [
  <HomeScreen key="home" />,
  <SearchScreen key="search" demos={[searches.groundingElectrode]} />,
  <ArticleScreen key="article" article={articles.groundingTop} />,
  <TableScreen key="table" />,
  <LibraryScreen key="reference" />,
  <SavedScreen key="bookmarks" />,
];

type Pose = { x: number; y?: number; z: number; ry: number; o: number };
// x / y as fractions of the viewport, z in device units.
const P = {
  front: { x: 0, z: 0, ry: -12, o: 1 },
  backL: { x: -0.13, z: -520, ry: 22, o: 0.5 },
  backR: { x: 0.13, z: -520, ry: -22, o: 0.5 },
  offR: { x: 0.55, z: 0, ry: -45, o: 0 },
  offL: { x: -0.55, z: 0, ry: 45, o: 0 },
  hide: { x: 0, z: -1200, ry: 0, o: 0 },
  edge: { x: 0, z: 0, ry: 90, o: 1 },
  below: { x: 0, y: 0.9, z: 0, ry: -12, o: 0 },
} satisfies Record<string, Pose>;

// Pose of each phone (columns) at each step (rows): the brief's choreography.
const STEPS: Pose[][] = [
  [P.offR, P.hide, P.hide, P.hide, P.hide, P.hide],
  [P.front, P.hide, P.hide, P.hide, P.hide, P.hide], // 1 enters from the right
  [P.backR, P.front, P.hide, P.hide, P.hide, P.hide], // 2 slides behind, then forward
  [P.offL, P.backL, P.front, P.hide, P.hide, P.hide], // 3 replaces 1
  [P.hide, P.hide, P.backR, P.front, P.hide, P.hide], // 4 rotates into view
  [P.hide, P.hide, P.hide, P.backL, P.front, P.hide], // 5
  [P.hide, P.hide, P.hide, P.backL, P.backR, P.front], // 6
];
// Finale: all six as a layered arc.
const FAN: Pose[] = [-0.36, -0.22, -0.075, 0.075, 0.22, 0.36].map((x, i) => ({
  x,
  z: -Math.abs(i - 2.5) * 260,
  ry: -x * 70,
  o: 1,
}));

export function Showcase() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current!;
      const q = gsap.utils.selector(section);
      const mm = gsap.matchMedia();
      const labels = q(".sc-label");
      const setActive = (i: number) => labels.forEach((el, j) => el.classList.toggle("is-active", i === j));

      mm.add(MQ.desktop, () => {
        const rigs = q(".sc-rig");
        const sizers = q(".sc-sizer");
        const scale = () => Math.min((innerHeight * 0.66) / 800, (innerWidth * 0.26) / 380);
        const apply = () => sizers.forEach((s) => s.style.setProperty("--phone-s", String(scale())));
        apply();
        const pose = (p: Pose) => ({
          x: () => (p.x * innerWidth) / scale(),
          y: () => ((p.y ?? 0) * innerHeight) / scale(),
          z: p.z,
          rotationY: p.ry,
          autoAlpha: p.o,
        });
        rigs.forEach((r, i) => gsap.set(r, pose(STEPS[0][i])));

        const tl = gsap.timeline({
          defaults: { ease: "power3.inOut", duration: 1 },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=420%",
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onRefresh: apply,
            onToggle: (self) => self.isActive && setChapter(3),
            onUpdate: (self) => setActive(Math.min(5, Math.max(0, Math.floor(self.progress * 8.2) - 1))),
          },
        });
        tl.fromTo(q(".sc-copy > *"), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.6 }, 0);
        for (let s = 1; s < STEPS.length; s++) {
          rigs.forEach((r, i) => {
            const from = STEPS[s - 1][i];
            const to = STEPS[s][i];
            if (from === to) return;
            // Phone 4 turns in from edge-on.
            if (s === 4 && i === 3) tl.fromTo(r, { ...pose(P.edge), rotationY: 90 }, { ...pose(to), immediateRender: false }, s);
            // Phones 3 and 6 rise from below.
            else if ((s === 3 && i === 2) || (s === 6 && i === 5)) tl.fromTo(r, pose(P.below), { ...pose(to), immediateRender: false }, s);
            else tl.to(r, pose(to), s);
          });
        }
        const fan = STEPS.length;
        tl.to(q(".sc-copy"), { autoAlpha: 0, x: -40, duration: 0.8 }, fan)
          .to(q(".sc-stage"), { x: () => -innerWidth * 0.12, duration: 1 }, fan)
          .to(q(".sc-fan-title"), { autoAlpha: 1, y: 0, duration: 0.8 }, fan + 0.6);
        rigs.forEach((r, i) => tl.to(r, { ...pose(FAN[i]), y: () => (innerHeight * 0.04) / scale() }, fan + i * 0.04));
        tl.to({}, { duration: 0.8 });
      });

      mm.add(MQ.mobile, () => {
        const screens = q(".sc-m-screen");
        gsap.set(screens, { autoAlpha: 0 });
        gsap.set(screens[0], { autoAlpha: 1 });
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=300%",
            pin: true,
            scrub: 0.5,
            onToggle: (self) => self.isActive && setChapter(3),
            onUpdate: (self) => setActive(Math.min(5, Math.floor(self.progress * 6))),
          },
        });
        screens.forEach((s, i) => {
          if (i === 0) return;
          tl.to(screens[i - 1], { autoAlpha: 0, x: -30, duration: 0.4 }, i).fromTo(s, { autoAlpha: 0, x: 30 }, { autoAlpha: 1, x: 0, duration: 0.4 }, i);
        });
        tl.to({}, { duration: 0.6 });
      });

      mm.add(MQ.reduce, () => {
        const rigs = q(".sc-rig");
        const s = Math.min((innerHeight * 0.5) / 800, (innerWidth * 0.2) / 380);
        q(".sc-sizer").forEach((el) => el.style.setProperty("--phone-s", String(s)));
        rigs.forEach((r, i) => gsap.set(r, { x: (FAN[i].x * 0.6 * innerWidth) / s, z: FAN[i].z, rotationY: FAN[i].ry }));
        setActive(-1);
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="features" className="relative overflow-hidden bg-black" aria-labelledby="showcase-title">
      <div className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
        <div className="fx-pool left-[62%] top-1/2 h-[90vmin] w-[90vmin] -translate-x-1/2 -translate-y-1/2 opacity-60" aria-hidden />
        <div className="fx-floor opacity-25" aria-hidden />

        {/* Labels */}
        <div className="sc-copy relative z-20 px-6 pt-24 lg:absolute lg:left-[7vw] lg:top-1/2 lg:w-[30vw] lg:-translate-y-1/2 lg:px-0 lg:pt-0">
          <p className="eyebrow mb-4">{copy.showcase.eyebrow}</p>
          <h2 id="showcase-title" className="headline text-[clamp(30px,4vw,60px)] text-white">
            {copy.showcase.headline[0]} <span className="text-steel-500 lg:block">{copy.showcase.headline[1]}</span>
          </h2>
          <ol className="mt-6 grid grid-cols-3 gap-x-4 gap-y-2 lg:mt-10 lg:block lg:space-y-1">
            {copy.showcase.items.map((item, i) => (
              <li key={item.id} className="sc-label group">
                <div className="flex items-baseline gap-3 py-1 text-steel-500 transition-colors duration-500 group-[.is-active]:text-white lg:py-2">
                  <span className="font-mono text-[10.5px] tracking-[0.2em] group-[.is-active]:text-electric-300">0{i + 1}</span>
                  <span className="text-[15px] font-medium lg:text-[22px] lg:tracking-tight">{item.title}</span>
                </div>
                <p className="hidden max-h-0 overflow-hidden pl-9 text-[15px] leading-relaxed text-steel-400 opacity-0 transition-all duration-500 group-[.is-active]:max-h-16 group-[.is-active]:opacity-100 lg:block">
                  {item.body}
                </p>
              </li>
            ))}
          </ol>
        </div>

        <p className="sc-fan-title headline pointer-events-none absolute inset-x-0 top-[12vh] z-20 hidden translate-y-6 text-center text-[clamp(28px,3.4vw,52px)] text-white opacity-0 lg:block">
          Six screens. <span className="text-steel-500">One pocket reference.</span>
        </p>

        {/* Desktop stage: six devices sharing one camera */}
        <div className="sc-stage absolute inset-y-0 left-[24%] right-0 hidden lg:block" aria-label="Pocket PEC screens">
          {SCREENS.map((screen, i) => (
            <PhoneRig key={i} className="sc-sizer" rigClassName="sc-rig" float={false} label={`Pocket PEC ${copy.showcase.items[i].title} screen`}>
              {screen}
            </PhoneRig>
          ))}
        </div>

        {/* Mobile: one device, six screens */}
        <div className="absolute inset-x-0 bottom-0 top-[40%] lg:hidden">
          <PhoneRig style={{ "--phone-s": "min(calc(var(--vhpx, 800) * 0.5 / 800), calc(var(--vwpx, 390) * 0.62 / 380))" } as React.CSSProperties}>
            <div className="screen-stack">
              {SCREENS.map((screen, i) => (
                <div key={i} className="sc-m-screen absolute inset-0" style={{ visibility: i === 0 ? "visible" : "hidden" }}>
                  {screen}
                </div>
              ))}
            </div>
          </PhoneRig>
        </div>
      </div>
    </section>
  );
}
