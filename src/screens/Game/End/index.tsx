import { useState, useLayoutEffect, useEffect } from "react";

import { useTranslations } from "@/i18n";

import type { GameHistory } from "@/types/game";

import Button from "@/components/Button";
import Table from "@/components/Table";

import "./End.css";

type Props = {
  gameHistory: GameHistory;
  nextDailyDate: string | null;
};

function numberToEmoji(value: number): string {
  return ["0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣"][value] || "1️⃣";
}

export default function DailyEnd({ gameHistory, nextDailyDate }: Props) {
  const { translate } = useTranslations();
  const [hasCopySuccess, setHasCopySuccess] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

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

  useEffect(() => {
    if (!nextDailyDate) {
      return;
    }
    let clock: NodeJS.Timeout;

    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const nextDate = new Date(nextDailyDate).getTime();
      const difference = nextDate - now;

      if (difference <= 0) {
        setTimeRemaining({
          hours: 0,
          minutes: 0,
          seconds: 0,
        });

        clearInterval(clock);

        return;
      }

      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeRemaining({ hours, minutes, seconds });
    };

    calculateTimeRemaining();

    clock = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(clock);
  }, [nextDailyDate]);

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

  const formatTimeRemaining = () => {
    if (!timeRemaining) return "";
    const { hours, minutes, seconds } = timeRemaining;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="game-daily-end">
      <div>{translate("endGame.daily.description")}</div>

      <Table
        footer={
          <tr>
            <th>Total</th>
            <td>{totalScore}</td>
          </tr>
        }
      >
        {gameHistory.scores.map((score, index) => (
          <tr key={index}>
            <th>{index + 1}</th>
            <td>{score}</td>
          </tr>
        ))}
      </Table>

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

      {timeRemaining &&
      timeRemaining.hours === 0 &&
      timeRemaining.minutes === 0 &&
      timeRemaining.seconds === 0 ? (
        <Button onClick={() => window.location.reload()} variant="primary">
          {translate("endGame.replay.label")}
        </Button>
      ) : (
        <p className="counter-container">
          <span>{translate("endGame.daily.next")}</span>{" "}
          <span className="counter">{formatTimeRemaining()}</span>
        </p>
      )}
    </div>
  );
}
