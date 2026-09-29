"use client";

import { Menu, X } from "lucide-react";
import { AnimatePresence, LazyMotion, domAnimation, m } from "motion/react";
import { useEffect, useState, type MouseEvent } from "react";
import { SoundToggle } from "@/components/layout/SoundToggle";
import { Cta } from "@/components/ui/Cta";
import { asset, links, site } from "@/config/site";
import { cn } from "@/lib/cn";
import { getLenis, scrollToTarget } from "@/lib/scroll";

const ITEMS = [
  { label: "Features", href: links.features },
  { label: "How It Works", href: links.howItWorks },
  { label: "Download", href: links.download },
];

function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <img src={asset(site.logo.mono)} alt="" width={30} height={22} className="h-[22px] w-auto" />
      <span className="whitespace-nowrap text-[12px] font-semibold tracking-[0.16em] text-white sm:text-[13px] sm:tracking-[0.2em]">{site.wordmark}</span>
    </span>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const lenis = getLenis();
    if (open) lenis?.stop();
    else lenis?.start();
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setOpen(false);
    // Let the menu close before travelling.
    window.setTimeout(() => scrollToTarget(href), open ? 250 : 0);
  };

  return (
    <LazyMotion features={domAnimation} strict>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500",
          scrolled ? "bg-black/55 shadow-[0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl" : "bg-transparent",
        )}
      >
        <nav className="mx-auto flex h-16 max-w-[1680px] items-center justify-between px-5 lg:px-[4vw]" aria-label="Main">
          <a href="#top" onClick={(e) => go(e, "#top")} aria-label={`${site.name}, back to top`}>
            <Logo />
          </a>
          <div className="hidden items-center gap-9 lg:flex">
            {ITEMS.map((i) => (
              <a key={i.href} href={i.href} onClick={(e) => go(e, i.href)} className="text-[13.5px] text-steel-300 transition-colors hover:text-white">
                {i.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden lg:block">
              <SoundToggle />
            </span>
            <Cta href={links.download} size="sm" arrow={false}>
              Download App
            </Cta>
            <button
              type="button"
              className="grid h-9 w-9 place-items-center rounded-full text-white ring-1 ring-white/15 lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <m.div
            id="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col bg-black/92 px-6 pb-10 pt-24 backdrop-blur-2xl lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <ul className="flex flex-col gap-2">
              {ITEMS.map((i, idx) => (
                <m.li
                  key={i.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * idx + 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <a href={i.href} onClick={(e) => go(e, i.href)} className="block py-2 text-4xl font-semibold tracking-tight text-white">
                    {i.label}
                  </a>
                </m.li>
              ))}
            </ul>
            <div className="mt-auto flex items-center justify-between">
              <SoundToggle />
              <span className="spec">{site.edition}</span>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}
