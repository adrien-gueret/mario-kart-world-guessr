import Card from "@/components/Card";
import ModeIcon from "@/components/ModeIcon";
import { useTranslations } from "@/i18n";

import { useScreen } from "../ScreensProvider";

import "./Title.css";

function Title() {
  const { setCurrentScreenName } = useScreen();
  const { translate } = useTranslations();

  return (
    <div className="title-screen">
      <h2>{translate("mode.select")}</h2>

      <menu className="title-menu">
        <li>
          <Card
            icon={<ModeIcon mode="survival" />}
            onClick={() => setCurrentScreenName("SurvivalGame")}
            title={translate("mode.survival.label")}
            content={translate("mode.survival.description")}
            borderColor="#fb501e"
          />
        </li>
        <li>
          <Card
            icon={<ModeIcon mode="goal" />}
            onClick={() => setCurrentScreenName("GoalGame")}
            title={translate("mode.goal.label")}
            content={translate("mode.goal.description")}
            borderColor="#599be5"
          />
        </li>
        <li>
          <Card
            icon={<ModeIcon mode="daily" />}
            onClick={() => setCurrentScreenName("DailyGame")}
            title={translate("mode.daily.label")}
            content={translate("mode.daily.description")}
            borderColor="#00951f"
          />
        </li>
      </menu>
    </div>
  );
}

export default Title;
