import Checkbox from "@/components/Checkbox";
import { useTranslations } from "@/i18n";

import "./GuessScore.css";

type Props = {
  distance: number;
  score: number;
  onShowPlayersCoordinatesChange: (show: boolean) => void;
  shouldShowPlayersCoordinates: boolean;
  canShowPlayersCoordinates: boolean;
};

export default function GuessScore({
  distance,
  score,
  canShowPlayersCoordinates,
  shouldShowPlayersCoordinates,
  onShowPlayersCoordinatesChange,
}: Props) {
  const { translate } = useTranslations();
  return (
    <div className="game-guess-score">
      {canShowPlayersCoordinates && (
        <div className="game-guess-checkbox-container">
          <Checkbox
            variant="glued"
            name="show-players-coordinates"
            label={translate("game.globalScore.showOtherPlayers")}
            checked={shouldShowPlayersCoordinates}
            onChange={onShowPlayersCoordinatesChange}
          />
        </div>
      )}

      <div className="game-guess-score-banner">
        <div className="game-guess-score-banner-inner">
          <div>
            <label>{translate("distance.label")}</label>
            <span>{translate("distance.value")(distance)}</span>
          </div>
          <div>
            <label>{translate("score.label")}</label>
            <span>{translate("score.value")(score)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
