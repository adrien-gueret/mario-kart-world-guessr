import { useTranslations } from "../../i18n";

import "./GuessScore.css";

type Props = {
  distance: number;
  score: number;
};

export default function GuessScore({ distance, score }: Props) {
  const { translate } = useTranslations();
  return (
    <div className="game-guess-score">
      <div>
        <label>{translate("distance.label")}</label>
        <span>{translate("distance.value")(distance)}</span>
      </div>
      <div>
        <label>{translate("score.label")}</label>
        <span>{translate("score.value")(score)}</span>
      </div>
    </div>
  );
}
