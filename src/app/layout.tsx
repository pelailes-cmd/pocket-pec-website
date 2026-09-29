import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import type { ReactNode } from "react";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { asset, site } from "@/config/site";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });
// The app's own typeface, used on the phone screens.
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  applicationName: site.name,
  openGraph: {
    title: site.title,
    description: site.description,
    siteName: site.name,
    locale: site.locale,
    type: "website",
    images: [{ url: asset("/og.jpg"), width: 1200, height: 630, alt: "Pocket PEC on a smartphone" }],
  },
  twitter: { card: "summary_large_image", title: site.title, description: site.description, images: [asset("/og.jpg")] },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

// Sets viewport numbers before first paint so the device is sized correctly immediately.
const viewportScript = `(function(){var d=document.documentElement;d.style.setProperty('--vwpx',innerWidth);d.style.setProperty('--vhpx',innerHeight)})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-PH" className={`${geist.variable} ${geistMono.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: viewportScript }} />
      </head>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
