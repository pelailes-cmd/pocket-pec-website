"use client";

import { useEffect, useRef } from "react";
import { chapters } from "@/config/site";
import { useChapter } from "@/lib/chapter-store";

/** Film-style chapter marker and page progress (desktop only). */
export function ChapterHud() {
  const chapter = useChapter();
  const bar = useRef<HTMLSpanElement>(null);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - innerHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
      // The opening screen has its own bottom line; show the marker once the film starts.
      if (root.current) root.current.style.opacity = scrollY > 80 ? "1" : "0";
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={root}
      style={{ opacity: 0 }}
      className="pointer-events-none fixed bottom-6 left-[4vw] z-40 hidden font-mono transition-opacity duration-500 text-[10px] uppercase tracking-[0.24em] text-steel-400 lg:block" aria-hidden>
      <div className="flex items-center gap-3">
        <span className="text-white">CH {String(chapter + 1).padStart(2, "0")}</span>
        <span className="h-px w-6 bg-white/25" />
        <span key={chapter} className="animate-[intro-fade_0.8s_ease_both]">
          {chapters[chapter]}
        </span>
      </div>
      <div className="mt-3 h-px w-40 overflow-hidden bg-white/10">
        <span ref={bar} className="block h-full origin-left bg-electric-400" style={{ transform: "scaleX(0)" }} />
      </div>
    </div>
  );
}
