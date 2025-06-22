import { useState, useLayoutEffect } from "react";

import { useTranslations } from "../../i18n";

import "./GlobalScore.css";

type Props = {
  score: number;
  photoIndex?: number;
  maxPhotos?: number;
};

export default function GlobalScore({
  score,
  photoIndex,
  maxPhotos = 0,
}: Props) {
  const [scoreToRender, setScoreToRender] = useState(0);
  const { translate } = useTranslations();

  useLayoutEffect(() => {
    const clock = setInterval(() => {
      if (scoreToRender < score) {
        setScoreToRender((prev) => Math.min(prev + 11, score));
      } else {
        clearInterval(clock);
      }
    }, 5);

    return () => {
      clearInterval(clock);
    };
  }, [score, scoreToRender]);

  return (
    <aside className="global-score">
      <div>
        {translate("game.globalScore")}
        {scoreToRender}
      </div>
      {
        <div className="global-score-photo-index">
          {translate("game.globalScore.photoIndex")}
          {photoIndex || 1}
          {maxPhotos > 0 && ` / ${maxPhotos}`}
        </div>
      }
    </aside>
  );
}
