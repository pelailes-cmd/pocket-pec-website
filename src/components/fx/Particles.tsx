"use client";

import { useEffect, useRef } from "react";

type Mote = { x: number; y: number; z: number; vx: number; vy: number; r: number; tw: number; gold: boolean };

/**
 * Sparse floating dust with depth. One fixed canvas for the whole page; motes
 * drift with scroll velocity for parallax. Paused when the tab is hidden and
 * disabled for reduced motion.
 */
export function Particles() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const mobile = window.innerWidth < 768;
    let w = 0;
    let h = 0;
    let motes: Mote[] = [];

    // Pre-rendered glow sprites (blue-white and a rare warm gold).
    const sprite = (color: string) => {
      const c = document.createElement("canvas");
      c.width = c.height = 64;
      const g = c.getContext("2d")!;
      const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, color);
      grad.addColorStop(0.25, color.replace(/[\d.]+\)$/, "0.35)"));
      grad.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = grad;
      g.fillRect(0, 0, 64, 64);
      return c;
    };
    const blue = sprite("rgba(190,215,255,1)");
    const gold = sprite("rgba(255,214,90,1)");

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = mobile ? 26 : 64;
      motes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random(),
        vx: (Math.random() - 0.5) * 0.08,
        vy: -0.03 - Math.random() * 0.1,
        r: 0.6 + Math.random() * 1.8,
        tw: Math.random() * Math.PI * 2,
        gold: Math.random() < 0.06,
      }));
    };
    resize();
    window.addEventListener("resize", resize);

    let lastScroll = window.scrollY;
    let velocity = 0;
    let raf = 0;
    let running = true;
    const frame = (t: number) => {
      raf = requestAnimationFrame(frame);
      if (!running) return;
      const sy = window.scrollY;
      velocity += (sy - lastScroll - velocity) * 0.15;
      lastScroll = sy;
      ctx.clearRect(0, 0, w, h);
      for (const m of motes) {
        const depth = 0.3 + m.z * 0.9;
        m.x += m.vx * depth;
        m.y += m.vy * depth - velocity * 0.12 * depth;
        if (m.y < -20) m.y = h + 20;
        if (m.y > h + 20) m.y = -20;
        if (m.x < -20) m.x = w + 20;
        if (m.x > w + 20) m.x = -20;
        const alpha = (0.18 + 0.4 * m.z) * (0.65 + 0.35 * Math.sin(t / 900 + m.tw));
        const size = m.r * (2 + m.z * 6);
        ctx.globalAlpha = alpha;
        ctx.drawImage(m.gold ? gold : blue, m.x - size / 2, m.y - size / 2, size, size);
      }
      ctx.globalAlpha = 1;
    };
    raf = requestAnimationFrame(frame);
    const onVis = () => {
      running = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas ref={ref} className="pointer-events-none fixed inset-0 z-30" aria-hidden />;
}
