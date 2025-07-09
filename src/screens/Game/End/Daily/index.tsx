import { useState, useLayoutEffect, useEffect, useRef } from "react";

import { useCurrentUser } from "@/auth/CurrentUserProvider";

import { useTranslations } from "@/i18n";

import type { GameHistory } from "@/types/game";

import Button from "@/components/Button";
import Loader from "@/components/Loader";
import Table from "@/components/Table";

import fetchApi from "@/services/api";

import "./Daily.css";
import EndGameContent from "../EndGameContent";

type Props = {
  gameHistory: GameHistory;
  nextDailyDate: string | null;
  onLeaderboardShow: () => void;
};

function numberToEmoji(value: number): string {
  return ["0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣"][value] || "1️⃣";
}

export default function DailyEnd({
  gameHistory,
  nextDailyDate,
  onLeaderboardShow,
}: Props) {
  const { translate } = useTranslations();
  const [hasCopySuccess, setHasCopySuccess] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  const [leaderboard, setLeaderboard] = useState<Array<any>>([]);
  const { user } = useCurrentUser();
  const hasBeenInit = useRef(false);

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

  useEffect(() => {
    if (hasBeenInit.current) {
      return;
    }

    hasBeenInit.current = true;

    fetchApi(
      `/leaderboards?mode=daily&score=${totalScore}&username=${user.username}`,
      "GET"
    )
      .then((response) => response.json())
      .then(setLeaderboard);
  }, [totalScore, user]);

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
      <EndGameContent
        firstStepContent={
          <>
            <div>{translate("endGame.daily.description")}</div>

            <div style={{ width: "70%", margin: "12px auto" }}>
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
            </div>

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
              <Button
                onClick={() => window.location.reload()}
                variant="primary"
              >
                {translate("endGame.replay.label")}
              </Button>
            ) : (
              <p className="counter-container">
                <span>{translate("endGame.daily.next")}</span>{" "}
                <span className="counter">{formatTimeRemaining()}</span>
              </p>
            )}
          </>
        }
        secondStepContent={
          <>
            {leaderboard.length === 0 ? (
              <Loader />
            ) : (
              <div className="leaderboard-container">
                <Table>
                  {leaderboard.map((player, index) => (
                    <tr
                      key={player.playerId}
                      className={
                        player.playerId === user.id ? "is-highlighted" : ""
                      }
                    >
                      <th>{index + 1}</th>
                      <th className="cell-name">{player.username}</th>
                      <td>{player.score}</td>
                    </tr>
                  ))}
                </Table>
              </div>
            )}
          </>
        }
        onLeaderboardShow={onLeaderboardShow}
      />
    </div>
  );
}
