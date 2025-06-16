import Button from "../../components/Button";
import { useTranslations } from "../../i18n";

import { useScreen } from "../ScreensProvider";

import "./Title.css";

function Title() {
  const { setCurrentScreenName } = useScreen();
  const { translate } = useTranslations();

  return (
    <div className="title-screen">
      <h2>Choisissez un mode de jeu</h2>

      <menu className="title-menu">
        <li>
          <Button onClick={() => setCurrentScreenName("Game")}>
            {translate("mode.goal.label")}
          </Button>
          <span>{translate("mode.goal.description")}</span>
        </li>
        <li>
          <Button onClick={() => setCurrentScreenName("Game")}>
            {translate("mode.daily.label")}
          </Button>
          <span>{translate("mode.daily.description")}</span>
        </li>
      </menu>
    </div>
  );
}

export default Title;
