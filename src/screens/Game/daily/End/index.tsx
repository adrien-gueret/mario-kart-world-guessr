import { useState, useLayoutEffect } from "react";

import { useTranslations } from "@/i18n";

import type { GameHistory } from "@/types/game";

import "./End.css";
import Button from "@/components/Button";

type Props = {
  gameHistory: GameHistory;
};

function numberToEmoji(value: number): string {
  return ["0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣"][value] || "1️⃣";
}

export default function DailyEnd({ gameHistory }: Props) {
  const { translate } = useTranslations();
  const [hasCopySuccess, setHasCopySuccess] = useState(false);

  useLayoutEffect(() => {
    if (!hasCopySuccess) {
      return;
    }

    const clock = setTimeout(() => {
      setHasCopySuccess(false);
    }, 3000);

    return () => {
      clearTimeout(clock);
    };
  }, [hasCopySuccess]);

  const totalScore = gameHistory.scores.reduce((acc, score) => acc + score, 0);

  const canShare = Boolean(navigator.share);

  const getTextToShare = () => {
    let textToShare = `${translate("share.text.title")}\n\n`;

    gameHistory.scores.forEach((score, index) => {
      textToShare += `${numberToEmoji(index + 1)} - ${score}\n`;
    });

    textToShare += `🏁 - ${totalScore}\n\nhttps://www.mariouniversalis.fr/mario-kart-world-guessr/#/dailygame`;

    return textToShare;
  };

  const copy = async () => {
    await navigator.clipboard.writeText(getTextToShare());
    setHasCopySuccess(true);
  };

  const share = !canShare
    ? void 0
    : () => {
        navigator.share({
          text: getTextToShare(),
        });
      };

  return (
    <div className="game-daily-end">
      <div>{translate("endGame.daily.description")}</div>
      <table className="game-daily-score">
        <tbody>
          {gameHistory.scores.map((score, index) => (
            <tr key={index}>
              <th>{index + 1}</th>
              <td>{score}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th>Total</th>
            <td>{totalScore}</td>
          </tr>
        </tfoot>
      </table>

      <div className="share-container">
        <div>
          <Button onClick={copy} variant="secondary">
            {translate("share.copy.button.label")}
          </Button>
          {hasCopySuccess && (
            <div className="copy-success">
              {translate("share.copy.success")}
            </div>
          )}
        </div>

        {canShare && (
          <Button onClick={share} variant="secondary">
            {translate("share.share.button.label")}
          </Button>
        )}
      </div>
    </div>
  );
}
