import Button from "../../components/Button";
import Text from "../../components/Text";
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
          <Button onClick={() => setCurrentScreenName("SurvivalGame")}>
            {translate("mode.survival.label")}
          </Button>
          <Text>{translate("mode.survival.description")}</Text>
        </li>
        <li>
          <Button onClick={() => setCurrentScreenName("GoalGame")}>
            {translate("mode.goal.label")}
          </Button>
          <Text>{translate("mode.goal.description")}</Text>
        </li>
        <li
          style={{
            pointerEvents: "none",
            opacity: 0.5,
            filter: "grayscale(100%)",
          }}
        >
          <Button onClick={() => setCurrentScreenName("DailyGame")}>
            {translate("mode.daily.label")}
          </Button>
          <Text>{translate("mode.daily.description")}</Text>
        </li>
      </menu>
    </div>
  );
}

export default Title;
