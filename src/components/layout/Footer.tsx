import { copy } from "@/config/content";
import { asset, contact, links, site, social } from "@/config/site";

const LINKS = [
  { label: "Download", href: links.download },
  { label: "About", href: links.about },
  { label: "Privacy", href: links.privacy },
  { label: "Terms", href: links.terms },
  { label: "Contact", href: links.contact },
];

export function Footer() {
  return (
    <footer className="relative border-t border-white/8 bg-black px-6 pb-10 pt-16 lg:px-[7vw]">
      <div className="mx-auto max-w-[1500px]">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <a href="#top" className="inline-flex items-center gap-3" aria-label={`${site.name}, back to top`}>
              <img src={asset(site.logo.mono)} alt="" width={36} height={26} className="h-[26px] w-auto" />
              <span className="text-[15px] font-semibold tracking-[0.22em] text-white">{site.wordmark}</span>
            </a>
            <p className="mt-4 text-[15px] text-steel-400">{copy.footer.tagline}</p>
            <p className="mt-5 flex flex-wrap gap-x-5 gap-y-1 text-[14px]">
              <a href={links.contact} className="text-steel-300 transition-colors hover:text-white">
                {contact.email}
              </a>
              <a href={links.phone} className="text-steel-300 transition-colors hover:text-white">
                {contact.phone}
              </a>
            </p>
          </div>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-8 gap-y-3">
              {LINKS.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-[14px] text-steel-300 transition-colors hover:text-white">
                    {l.label}
                  </a>
                </li>
              ))}
              {social.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-[14px] text-steel-300 transition-colors hover:text-white">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="hairline my-10" />
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-1.5">
            <p className="spec text-steel-400">{copy.footer.copyright}</p>
            <p className="spec">{copy.footer.made}</p>
          </div>
          <p className="max-w-2xl text-[12px] leading-relaxed text-steel-500 lg:text-right">{site.disclaimer}</p>
        </div>
        <div className="mt-8 flex items-center gap-3" aria-hidden>
          <span className="ph-rule" />
        </div>
      </div>
    </footer>
  );
}
