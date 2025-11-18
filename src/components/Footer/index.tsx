import { NavLink } from "react-router-dom";
import { useTranslations } from "@/i18n";
import currentVersion from "@/versions/currentVersion";

export default function Footer() {
  const { translate } = useTranslations();

  return (
    <footer style={{ marginTop: "48px" }}>
      <NavLink className="basic-link" to="/releasenotes">
        <b>{currentVersion.version}</b>
      </NavLink>
      <br />

      <aside className="aside-links">
        <NavLink className="basic-link" to="/privacypolicies">
          <b>{translate("privacy-policies.title")}</b>
        </NavLink>

        <NavLink className="basic-link" to="/termsservices">
          <b>{translate("terms-services.title")}</b>
        </NavLink>
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
