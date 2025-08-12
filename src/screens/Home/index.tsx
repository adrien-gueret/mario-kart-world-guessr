import Card from "@/components/Card";
import HomeIcon from "@/components/HomeIcon";
import { useTranslations } from "@/i18n";

import { useScreen } from "../ScreensProvider";

import "./Home.css";

function Home() {
  const { setCurrentScreenName } = useScreen();
  const { translate } = useTranslations();

  return (
    <div className="home-screen">
      <menu className="home-menu">
        <li className="home-item__account">
          <Card
            icon={<HomeIcon icon="Account" />}
            onClick={() => setCurrentScreenName("Account")}
            title={translate("home.menu.account.title")}
            borderColor="#00951f"
          />
        </li>
        <li className="home-item__play">
          <Card
            icon={<HomeIcon icon="Play" />}
            onClick={() => setCurrentScreenName("Play")}
            title={translate("home.menu.play.title")}
            borderColor="#599be5"
          />
        </li>
        <li className="home-item__leaderboards">
          <Card
            icon={<HomeIcon icon="Leaderboards" />}
            onClick={() => setCurrentScreenName("Leaderboards")}
            title={translate("home.menu.leaderboards.title")}
            borderColor="#fb501e"
          />
        </li>
        <li className="home-item__breakline" aria-hidden="true"></li>
        <li className="home-item__upload">
          <Card
            icon={<HomeIcon icon="Upload" />}
            onClick={() => setCurrentScreenName("Upload")}
            title={translate("home.menu.upload.title")}
            borderColor="#9e9e9eff"
          />
        </li>
      </menu>
    </div>
  );
}

export default Home;
