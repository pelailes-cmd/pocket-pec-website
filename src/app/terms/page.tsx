import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/layout/LegalPage";
import { apk, asset, links, site } from "@/config/site";

export const metadata: Metadata = {
  title: "Terms of Use · Pocket PEC",
  description: "The terms for using the Pocket PEC website and app.",
};

// Keep in line with how access codes actually work (pocket-pec-access:
// a code binds to one phone, reinstalls on that phone are allowed, codes can
// be freed for a new phone or revoked) and with the app's content notes.
export default function Terms() {
  return (
    <LegalPage
      title="Terms of Use"
      intro={
        <p>
          These terms apply to the Pocket PEC website (pocketpec.space) and the Pocket PEC app. By using the website, or by installing or
          using the app, you agree to them. If you do not agree, please do not use Pocket PEC.
        </p>
      }
    >
      <LegalSection title="What Pocket PEC is">
        <p>
          Pocket PEC is a mobile reference app that helps you find and read the Philippine Electrical Code 2017, Part 1 (&ldquo;the
          Code&rdquo;). {site.disclaimer}
        </p>
      </LegalSection>

      <LegalSection title="Accuracy and your professional responsibility">
        <ul>
          <li>
            The app&apos;s text and tables were extracted from scanned pages of the Code using text recognition and checked against independent
            readings. Words that could not be confirmed are marked in the app, some tables are marked &ldquo;Needs review&rdquo;, and the original
            page is always available. Errors may still remain.
          </li>
          <li>
            Always confirm requirements, values and tables that matter against the official edition of the Code before relying on them.
          </li>
          <li>
            Pocket PEC is a reference aid, not engineering, legal or professional advice. You remain responsible for your work and for complying
            with the Code, applicable laws, and the requirements of the authority having jurisdiction.
          </li>
          <li>Screens shown on this website are illustrations. Their body text and table values are sample content, not text or values from the Code.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Downloading and installing">
        <p>
          Download the app only from pocketpec.space or our official GitHub release. The app requires {apk.requires}. Installing it outside an
          app store requires allowing your browser to install apps; you choose whether to do so. You can check that your download is genuine
          with the SHA-256 checksum on the <a href={asset("/download/")}>download page</a>.
        </p>
      </LegalSection>

      <LegalSection title="Access codes and activation">
        <ul>
          <li>The app needs an access code, which you buy from us. Activation needs an internet connection once; after that the app works offline.</li>
          <li>
            Each code activates <strong>one phone</strong>. You can reinstall and reactivate the app on the same phone at any time. If you change
            phones, contact us and we can release your code for the new phone.
          </li>
          <li>Your code is for your own use. Do not share, sell, give away or publish it.</li>
          <li>
            We may revoke a code that has been shared, resold, published or obtained by fraud. A revoked code cannot be activated again.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Acceptable use">
        <p>You may use Pocket PEC for your own reference, study and professional work. You may not:</p>
        <ul>
          <li>copy, extract, publish or distribute the app&apos;s content, including the Code text, tables, figures or database, in bulk or for others;</li>
          <li>modify, repackage or redistribute the app, or remove its notices;</li>
          <li>bypass, disable or interfere with activation or licensing;</li>
          <li>resell the app, its content or access codes; or</li>
          <li>use Pocket PEC in a way that breaks the law or infringes anyone&apos;s rights.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Intellectual property">
        <p>
          The Pocket PEC app, website, design, name and logo belong to us. The Philippine Electrical Code is the work of its publisher and
          copyright holder; we do not claim ownership of it. Android and Google Play are trademarks of Google LLC, and App Store is a trademark
          of Apple Inc.
        </p>
      </LegalSection>

      <LegalSection title="Availability and updates">
        <p>
          We may update, change or stop offering the app or website at any time. The app is currently available for Android by direct download;
          we do not promise availability on other platforms or app stores.
        </p>
      </LegalSection>

      <LegalSection title="No warranty and limitation of liability">
        <p>
          Pocket PEC is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;, without warranties of any kind, including accuracy,
          completeness or fitness for a particular purpose. To the fullest extent allowed by Philippine law, we are not liable for any
          indirect, incidental or consequential loss, or for any loss arising from reliance on the app&apos;s content, and our total liability
          to you is limited to the amount you paid for your access code. Nothing in these terms limits rights you have under the Consumer Act
          of the Philippines that cannot be waived.
        </p>
      </LegalSection>

      <LegalSection title="Privacy">
        <p>
          How we handle personal information is explained in our <a href={links.privacy}>Privacy Policy</a>.
        </p>
      </LegalSection>

      <LegalSection title="Governing law and changes">
        <p>
          These terms are governed by the laws of the Republic of the Philippines. We may update them; the new version applies from the
          effective date shown on this page.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
