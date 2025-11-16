import { useTranslations } from "../../i18n";
import "./Credits.css";

export default function Credits() {
  const { translate } = useTranslations();

  return (
    <aside className="credits">
      <p>
        {translate("credits.by")} <strong>Mario Universalis</strong>.
      </p>
      <menu>
        <li>
          <a
            href="https://x.com/MarioUnivRsalis"
            className="social-logo x"
            title={translate("credits.followOn")("X")}
          >
            @MarioUnivRsalis
          </a>
        </li>
        <li>
          <a
            href="https://bsky.app/profile/mariouniversalis.fr"
            className="social-logo bluesky"
            title={translate("credits.followOn")("Bluesky")}
          >
            @mariouniversalis.fr
          </a>
        </li>
      </menu>
    </aside>
  );
}
