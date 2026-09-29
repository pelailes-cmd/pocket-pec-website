import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";
import { site } from "@/config/site";

export const metadata: Metadata = { title: "Terms of Use · Pocket PEC", robots: { index: false } };

export default function Terms() {
  return (
    <LegalPage title="Terms of Use">
      <p>{site.disclaimer}</p>
      <p>Screens shown on this website are illustrations. Body text and table values in them are sample content, not text or values from the Philippine Electrical Code.</p>
    </LegalPage>
  );
}
