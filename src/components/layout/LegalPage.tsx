import type { ReactNode } from "react";
import { asset, links, site } from "@/config/site";

/** Simple shell for the legal pages. Replace the placeholder text before launch. */
export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className="min-h-screen bg-black px-6 py-16 lg:px-[7vw]">
      <a href={asset("/")} className="inline-flex items-center gap-3">
        <img src={asset(site.logo.mono)} alt="" className="h-[22px] w-auto" />
        <span className="text-[13px] font-semibold tracking-[0.2em] text-white">{site.wordmark}</span>
      </a>
      <article className="mx-auto mt-20 max-w-2xl">
        <p className="eyebrow mb-4">Pocket PEC</p>
        <h1 className="headline text-5xl text-white">{title}</h1>
        <div className="mt-6 rounded-xl border border-dashed border-gold-300/40 bg-gold-500/5 p-4 font-mono text-[12px] uppercase tracking-[0.14em] text-gold-300">
          Placeholder page. Replace this text with the final {title.toLowerCase()} before launch.
        </div>
        <div className="mt-10 space-y-5 text-[16px] leading-relaxed text-steel-300">{children}</div>
        <p className="mt-12 text-[14px] text-steel-500">
          Questions? <a href={links.contact} className="text-white underline underline-offset-4">Contact us</a>.
        </p>
      </article>
    </main>
  );
}
