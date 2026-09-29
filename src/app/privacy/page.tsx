import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = { title: "Privacy Policy · Pocket PEC", robots: { index: false } };

export default function Privacy() {
  return (
    <LegalPage title="Privacy Policy">
      <p>This website does not use cookies, analytics, or tracking scripts, and it does not collect personal information.</p>
      <p>The optional sound on this site is generated in your browser and is off until you turn it on.</p>
      <p>How the Pocket PEC app itself handles data should be described here by the app&apos;s publisher.</p>
    </LegalPage>
  );
}
