import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/layout/LegalPage";
import { links } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy · Pocket PEC",
  description: "How the Pocket PEC website and app handle personal information.",
};

// Every statement here must match what the website, the app
// (lib/licensing/license.dart) and the access-code backend actually do.
// Review it whenever any of them changes.
export default function Privacy() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro={
        <>
          <p>
            This policy explains what information the Pocket PEC website (pocketpec.space) and the Pocket PEC app collect, why, and the
            choices you have. It is written in line with the Philippine Data Privacy Act of 2012 (Republic Act No. 10173).
          </p>
          <p className="mt-4">
            <strong className="text-white">In short:</strong> the website does not use cookies, analytics or trackers. The app keeps your
            bookmarks, history and study results on your phone. It contacts us only once, to activate your access code.
          </p>
        </>
      }
    >
      <LegalSection title="Who we are">
        <p>
          Pocket PEC (&ldquo;we&rdquo;, &ldquo;us&rdquo;) develops and distributes the Pocket PEC app and operates this website. We decide how the
          information described here is used. Our contact details are at the end of this page.
        </p>
      </LegalSection>

      <LegalSection title="The website">
        <ul>
          <li>We do not use cookies, analytics, advertising or tracking tools, and we do not ask for any personal information on the website.</li>
          <li>
            The website is hosted on GitHub Pages, and the app download is served by GitHub. Like most web hosts, GitHub may record technical
            information such as your IP address when you visit or download, to run and secure its service. See GitHub&apos;s privacy statement
            for details.
          </li>
          <li>Fonts and images are served from our own site. The optional sound is generated in your browser and is off until you turn it on.</li>
        </ul>
      </LegalSection>

      <LegalSection title="When you buy an access code">
        <p>
          Access codes are sold directly by us. When you contact us to buy one, we receive the details you choose to give us, such as your
          name, email address or mobile number, your messages, and proof of payment. We record which access code was issued to you so we can
          support you later.
        </p>
      </LegalSection>

      <LegalSection title="When you activate the app">
        <p>The first time you open the app, it sends the following to our activation service over an encrypted (HTTPS) connection:</p>
        <ul>
          <li>
            <strong>Your access code.</strong>
          </li>
          <li>
            <strong>A device code</strong>: a one-way hash (SHA-256) of your phone&apos;s Android ID, calculated on your phone. We never receive
            the Android ID itself, and the hash cannot be turned back into it. It lets a code work on one phone only.
          </li>
          <li>
            <strong>Your phone&apos;s make and model</strong> (for example &ldquo;Samsung SM-A546E&rdquo;), so we can help you if you contact us.
          </li>
        </ul>
        <p>
          We store these together with the date of first and latest activation and the number of activations. The activation service may also
          keep standard request logs, such as IP addresses. After activation, the app checks its license on your phone and does not need to
          contact us again.
        </p>
      </LegalSection>

      <LegalSection title="Information that stays on your phone">
        <p>
          Your bookmarks, notes, reading positions, recently viewed items, recent searches, practice and test results, settings, and your
          license are stored only on your phone. They are never sent to us. Uninstalling the app or clearing its data deletes them.
        </p>
        <p>The app has no ads, analytics or crash-reporting tools, and the only permission it uses is internet access (for activation).</p>
      </LegalSection>

      <LegalSection title="How we use information">
        <ul>
          <li>To sell and deliver access codes and to activate the app.</li>
          <li>To keep each code to one phone, and to stop codes from being shared, resold or misused.</li>
          <li>To help you, for example to reinstall the app or move your code to a new phone.</li>
          <li>To reply when you contact us, and to meet legal obligations.</li>
        </ul>
        <p>
          We do not sell your information, use it for advertising, or build profiles about you. Our legal bases are the performance of our
          agreement with you (providing the app you bought), our legitimate interest in preventing misuse of access codes, and compliance
          with the law.
        </p>
      </LegalSection>

      <LegalSection title="Who we share it with">
        <p>
          We share information only with the service providers that run our services for us: Supabase (the database and activation service)
          and GitHub (website and download hosting). Their servers may be outside the Philippines. We may also disclose information when
          required by law or to protect our rights.
        </p>
      </LegalSection>

      <LegalSection title="How long we keep it">
        <p>
          We keep access-code records for as long as the code can be used, so your phone can reinstall and reactivate the app, and afterwards
          only as long as needed for our records or as required by law. You can ask us to delete your information at any time. If we delete
          your code&apos;s record, the code can no longer be activated.
        </p>
      </LegalSection>

      <LegalSection title="Security">
        <p>
          Activation data is sent over HTTPS. Only the device hash, never the raw device ID, is stored. The access-code database is available
          only to us as administrators. No method of storage or transmission is completely secure, but we take reasonable steps to protect
          your information.
        </p>
      </LegalSection>

      <LegalSection title="Your rights">
        <p>
          Under the Data Privacy Act you have the right to be informed, to access your personal information, to object to its processing, to
          have it corrected, blocked or erased, to data portability, and to damages where applicable. To use these rights, contact us below.
          You may also file a complaint with the National Privacy Commission (privacy.gov.ph).
        </p>
      </LegalSection>

      <LegalSection title="Changes to this policy">
        <p>
          If we change how we handle information, we will update this page and its effective date. Please also read our{" "}
          <a href={links.terms}>Terms of Use</a>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
