import { useTranslations } from "@/i18n";
import currentVersion from "@/versions/currentVersion";

export default function Footer() {
  const { translate } = useTranslations();

  const currentScreenName = ""; // TODO

  return (
    <footer style={{ marginTop: "48px" }}>
      <a
        className="basic-link"
        href={
          currentScreenName === "ReleaseNotes" ? undefined : "#/releasenotes"
        }
      >
        <b>{currentVersion.version}</b>
      </a>
      <br />

      <aside className="aside-links">
        <a
          className="basic-link"
          href={
            currentScreenName === "PrivacyPolicies"
              ? undefined
              : "#/privacypolicies"
          }
        >
          <b>{translate("privacy-policies.title")}</b>
        </a>
        <a
          className="basic-link"
          href={
            currentScreenName === "TermsServices"
              ? undefined
              : "#/termsservices"
          }
        >
          <b>{translate("terms-services.title")}</b>
        </a>
      </aside>

      <aside className="aside-links">
        <a
          className="basic-link"
          href="https://buymeacoffee.com/mariouniversalis"
          target="_blank"
          rel="noopener noreferrer"
        >
          <b>☕ {translate("buy-me-coffee")} ↗</b>
        </a>
      </aside>
    </footer>
  );
}
