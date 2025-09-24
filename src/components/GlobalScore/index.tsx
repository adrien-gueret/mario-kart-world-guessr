import { useTranslations } from "@/i18n";

import "./GlobalScore.css";

import useAnimatedScore from "./useAnimatedNumber";

type Props = {
  score: number;
  photoIndex?: number;
  maxPhotos?: number;
  // TODO: remainingTime?: number;
};

export default function GlobalScore({
  score,
  photoIndex = 1,
  maxPhotos = 0,
}: Props) {
  const scoreToRender = useAnimatedScore(score, 800);
  const { translate } = useTranslations();

  return (
    <aside className="global-score">
      <div>
        {translate("game.globalScore")}
        {scoreToRender}
      </div>
      {
        <div className="global-score-photo-index">
          {translate("game.globalScore.photoIndex")}
          {maxPhotos > 0 ? Math.min(photoIndex, maxPhotos) : photoIndex}
          {maxPhotos > 0 && ` / ${maxPhotos}`}
        </div>
      }
    </aside>
  );
}
