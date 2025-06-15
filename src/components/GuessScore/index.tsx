import { useTranslations } from "../../i18n";

import "./GuessScore.css";

type Props = {
  distance: number;
  score: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export default function GuessScore({ distance, score, x1, y1, x2, y2 }: Props) {
  const { translate } = useTranslations();
  return (
    <div
      className="game-guess-score"
      style={{
        left: `${(x1 + x2) / 2 - 20}px`,
        top: `${(y1 + y2) / 2 - 20}px`,
      }}
    >
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
