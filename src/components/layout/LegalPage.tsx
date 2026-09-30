import type { ReactNode } from "react";
import { asset, contact, legal, links, site } from "@/config/site";

/** Shell for the Privacy Policy and Terms of Use. */
export function LegalPage({ title, intro, children }: { title: string; intro: ReactNode; children: ReactNode }) {
  return (
    <main className="min-h-screen bg-black px-6 py-14 lg:px-[7vw]">
      <a href={asset("/")} className="inline-flex items-center gap-3">
        <img src={asset(site.logo.mono)} alt="" className="h-[22px] w-auto" />
        <span className="text-[13px] font-semibold tracking-[0.2em] text-white">{site.wordmark}</span>
      </a>
      <article className="mx-auto mt-16 max-w-[44rem]">
        <p className="eyebrow mb-4">{site.name}</p>
        <h1 className="headline text-[clamp(36px,6vw,56px)] text-white">{title}</h1>
        <p className="spec mt-5">Effective {legal.effective}</p>
        <div className="mt-8 text-[17px] leading-relaxed text-steel-300">{intro}</div>
        <div className="legal mt-12 space-y-12">
          {children}
          <LegalSection title="Contact us">
            <p>
              Email <a href={links.contact}>{contact.email}</a> or call / text{" "}
              <a href={links.phone} className="whitespace-nowrap">
                {contact.phone}
              </a>
              .
            </p>
          </LegalSection>
        </div>
        <div className="hairline my-12" />
        <p className="text-[13px] leading-relaxed text-steel-500">{site.disclaimer}</p>
        <p className="mt-8 flex gap-6 text-[14px]">
          <a href={asset("/")} className="text-steel-300 underline underline-offset-4 hover:text-white">
            Home
          </a>
          <a href={links.privacy} className="text-steel-300 underline underline-offset-4 hover:text-white">
            Privacy Policy
          </a>
          <a href={links.terms} className="text-steel-300 underline underline-offset-4 hover:text-white">
            Terms of Use
          </a>
        </p>
      </article>
    </main>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-[21px] font-semibold tracking-tight text-white">{title}</h2>
      <div className="mt-4 space-y-4 text-[15.5px] leading-relaxed text-steel-300">{children}</div>
    </section>
  );
}
