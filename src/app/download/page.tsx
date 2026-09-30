import { Download, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import { StoreButtons } from "@/components/ui/StoreButtons";
import { apk, asset, contact, links, site } from "@/config/site";

export const metadata: Metadata = {
  title: "Download Pocket PEC for Android",
  description: "Download and install Pocket PEC, a mobile reference app for the Philippine Electrical Code.",
};

const STEPS = [
  `Tap "Download APK". The file is large (${apk.size}), so Wi-Fi is recommended.`,
  "Open the downloaded file. If Android asks, allow your browser to install apps (Settings > Apps > Special app access > Install unknown apps).",
  "Tap Install, then open Pocket PEC.",
  apk.activation,
];

/** Landing page for the QR code and "How to install" links. */
export default function DownloadPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-14 lg:px-[7vw]">
      <a href={asset("/")} className="inline-flex items-center gap-3">
        <img src={asset(site.logo.mono)} alt="" className="h-[22px] w-auto" />
        <span className="text-[13px] font-semibold tracking-[0.2em] text-white">{site.wordmark}</span>
      </a>

      <div className="mx-auto mt-16 max-w-2xl">
        <img src={asset("/brand/logo-glow-640.webp")} alt="" width={160} height={107} className="-ml-4 w-[140px]" />
        <p className="eyebrow mt-6">Download</p>
        <h1 className="headline mt-3 text-[clamp(34px,6vw,60px)] text-white">Pocket PEC for Android</h1>

        {apk.url ? (
          <>
            <a href={apk.url} rel="noopener" className="btn btn-primary mt-8 h-14 px-7 text-base">
              <Download size={19} aria-hidden />
              Download APK · {apk.size}
            </a>
            <dl className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3">
              {[
                ["Version", apk.version],
                ["Size", apk.size],
                ["Requires", apk.requires],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="spec">{k}</dt>
                  <dd className="mt-1.5 text-[15px] text-white">{v}</dd>
                </div>
              ))}
            </dl>

            <h2 className="mt-14 text-[20px] font-semibold tracking-tight text-white">How to install</h2>
            <ol className="mt-5 space-y-4">
              {STEPS.map((step, i) => (
                <li key={i} className="flex gap-4 text-[15.5px] leading-relaxed text-steel-300">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/8 font-mono text-[12px] text-white ring-1 ring-white/12">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
            <p className="mt-6 text-[14px] text-steel-400">
              Need an access code? Email{" "}
              <a href={links.contact} className="text-white underline underline-offset-4">
                {contact.email}
              </a>{" "}
              or call / text{" "}
              <a href={links.phone} className="whitespace-nowrap text-white underline underline-offset-4">
                {contact.phone}
              </a>
              .
            </p>

            <div className="mt-12 rounded-2xl border border-white/10 p-5">
              <p className="flex items-center gap-2 text-[14px] font-medium text-white">
                <ShieldCheck size={16} className="text-electric-300" aria-hidden />
                Verify the download (optional)
              </p>
              <p className="mt-2 text-[13px] text-steel-400">SHA-256 checksum of the official file:</p>
              <p className="mt-2 break-all font-mono text-[12px] leading-relaxed text-steel-300">{apk.sha256}</p>
            </div>
          </>
        ) : (
          <>
            <p className="mt-6 text-[17px] leading-relaxed text-steel-300">The download link will appear here as soon as Pocket PEC is published.</p>
            <StoreButtons className="mt-10" centered={false} />
          </>
        )}

        <p className="mt-14 text-[12px] leading-relaxed text-steel-500">{site.disclaimer}</p>
        <a href={asset("/")} className="mt-8 inline-block text-[14px] text-steel-300 underline underline-offset-4 hover:text-white">
          Back to Pocket PEC
        </a>
      </div>
    </main>
  );
}
