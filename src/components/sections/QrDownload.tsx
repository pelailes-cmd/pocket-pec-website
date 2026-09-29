import QRCode from "qrcode";
import { HomeScreen } from "@/components/app-ui/screens";
import { PhoneRig } from "@/components/phone/PhoneRig";
import { StoreButtons } from "@/components/ui/StoreButtons";
import { copy } from "@/config/content";
import { asset, qrUrl, site } from "@/config/site";
import { QrAnimator } from "./QrAnimator";

// Until a real download URL is configured the QR encodes a reserved example
// address and is visibly marked as a placeholder, so nobody scans it expecting the app.
const PLACEHOLDER_URL = "https://example.com/pocket-pec-download";

/** Rendered at build time: the QR is static SVG, no client code. */
export async function QrDownload() {
  const live = qrUrl.length > 0;
  const url = live ? qrUrl : PLACEHOLDER_URL;
  const svg = await QRCode.toString(url, { type: "svg", errorCorrectionLevel: "H", margin: 0, color: { dark: "#05070aff", light: "#ffffffff" } });

  return (
    <section className="qr-section relative overflow-hidden bg-graphite-950 px-6 py-[14vh] lg:px-[7vw]" aria-labelledby="qr-title">
      <div className="fx-pool left-[30%] top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 opacity-50" aria-hidden />
      <div className="relative mx-auto grid max-w-[1400px] items-center gap-14 lg:grid-cols-2">
        <div className="relative order-2 h-[62vh] min-h-[440px] lg:order-none lg:h-[78vh]">
          <PhoneRig
            className="qr-sizer"
            rigClassName="qr-rig"
            backlight
            style={{ "--phone-s": "min(calc(var(--vhpx, 900) * 0.7 / 800), calc(var(--vwpx, 1440) * 0.6 / 380))" } as React.CSSProperties}
          >
            <HomeScreen />
          </PhoneRig>
        </div>

        <div className="qr-copy flex flex-col items-center text-center lg:items-start lg:text-left">
          <p className="eyebrow mb-5">{copy.qr.eyebrow}</p>
          <h2 id="qr-title" className="headline text-[clamp(32px,4.2vw,64px)] text-white">
            {copy.qr.headline[0]} <span className="block text-steel-500">{copy.qr.headline[1]}</span>
          </h2>
          <p className="mt-5 max-w-md text-[17px] leading-relaxed text-steel-400">{copy.qr.body}</p>

          <div className="qr-frame mt-12 hidden sm:block">
            <i />
            <i />
            <i />
            <i />
            <div className="relative rounded-[22px] bg-white p-5 shadow-[0_30px_80px_-30px_rgba(59,130,255,0.6)]">
              <div className={live ? "" : "opacity-25 blur-[1.5px]"} style={{ width: 208, height: 208 }} dangerouslySetInnerHTML={{ __html: svg }} />
              <img src={asset(site.logo.color)} alt="" className="absolute left-1/2 top-1/2 w-12 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-1.5" />
              {!live && (
                <span className="absolute inset-x-5 top-1/2 -translate-y-1/2 rounded-md bg-black py-2 text-center font-mono text-[10.5px] uppercase tracking-[0.2em] text-white">
                  {copy.qr.placeholder}
                </span>
              )}
              <span className="qr-scan" aria-hidden />
            </div>
          </div>
          <p className="spec mt-6 hidden max-w-sm break-all sm:block">{live ? url.replace(/^https?:\/\//, "") : "Set NEXT_PUBLIC_DOWNLOAD_URL to activate"}</p>
          <p className="mt-8 text-[14px] text-steel-400 sm:hidden">{copy.qr.mobileHint}</p>
          <StoreButtons className="mt-6 sm:hidden" />
        </div>
      </div>
      <QrAnimator />
    </section>
  );
}
