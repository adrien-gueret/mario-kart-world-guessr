import { useState, useLayoutEffect } from "react";

import { useTranslations } from "../../i18n";

import "./GlobalScore.css";

type Props = {
  score: number;
};

export default function GlobalScore({ score }: Props) {
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
      {translate("game.globalScore")}
      {scoreToRender}
    </aside>
  );
}
