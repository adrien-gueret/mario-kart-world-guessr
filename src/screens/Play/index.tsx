import useNavigate from "@/services/useNavigate";
import Card from "@/components/Card";
import ModeIcon from "@/components/ModeIcon";
import { useTranslations } from "@/i18n";

import "./Play.css";

function Play() {
  const navigate = useNavigate();
  const { translate } = useTranslations();

  return (
    <div className="play-screen">
      <h2>{translate("mode.select")}</h2>

      <menu className="play-menu">
        <li>
          <Card
            icon={<ModeIcon mode="goal" />}
            onClick={() => navigate("/goalgame")}
            title={translate("mode.goal.label")}
            content={translate("mode.goal.description")}
            borderColor="#599be5"
          />
        </li>
        {/*
          TODO: uncomment
           <li>
            <Card
            icon={<ModeIcon mode="chrono" />}
            onClick={() => setCurrentScreenName("ChronoGame")}
            title={translate("mode.chrono.label")}
            content={translate("mode.chrono.description")}
            borderColor="#a500a5"
          />
        </li>
        */}

        <li>
          <Card
            icon={<ModeIcon mode="survival" />}
            onClick={() => navigate("/survivalgame")}
            title={translate("mode.survival.label")}
            content={translate("mode.survival.description")}
            borderColor="#fb501e"
          />
        </li>
        <li>
          <Card
            icon={<ModeIcon mode="daily" />}
            onClick={() => navigate("/dailygame")}
            title={translate("mode.daily.label")}
            content={translate("mode.daily.description")}
            borderColor="#00951f"
          />
        </li>
      </menu>
    </div>
  );
}

export default Play;
