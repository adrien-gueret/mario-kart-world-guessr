import Button from "../../components/Button";

import { useScreen } from "../ScreensProvider";

import "./Title.css";

function Title() {
  const { setCurrentScreenName } = useScreen();

  return (
    <div className="title-screen">
      <h2>Choisissez un mode de jeu</h2>

      <menu className="title-menu">
        <li>
          <Button onClick={() => setCurrentScreenName("Game")}>
            Objectif 20.000
          </Button>
          <span>
            En combien de photos atteindrez-vous le score de 20.000 points ?
          </span>
        </li>
        <li>
          <Button onClick={() => setCurrentScreenName("Game")}>
            Photos du jour
          </Button>
          <span>
            Chaque jour, une nouvelle sélection de trois photos : faites un
            meilleur score que vos amis !
          </span>
        </li>
      </menu>
    </div>
  );
}

export default Title;
