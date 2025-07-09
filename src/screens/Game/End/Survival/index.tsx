import { useEffect, useRef, useState } from "react";

import Loader from "@/components/Loader";
import Table from "@/components/Table";

import { useCurrentUser } from "@/auth/CurrentUserProvider";

import { useTranslations } from "@/i18n";
import fetchApi from "@/services/api";

import type { Difficulty } from "@/types/game";

import EndGameContent from "../EndGameContent";

import "./Survival.css";

type Props = {
  lastScore: number;
  photoCount: number;
  totalScore: number;
  difficulty: Difficulty;
  onReplay: () => void;
  onLeaderboardShow: () => void;
};

export default function SurvivalEnd({
  lastScore,
  photoCount,
  totalScore,
  difficulty,
  onReplay,
  onLeaderboardShow,
}: Props) {
  const { translate } = useTranslations();
  const [leaderboard, setLeaderboard] = useState<Array<any>>([]);
  const { user } = useCurrentUser();

  const hasBeenInit = useRef(false);

  useEffect(() => {
    if (hasBeenInit.current) {
      return;
    }

    hasBeenInit.current = true;

    fetchApi(
      `/leaderboards?mode=survival&difficulty=${difficulty}&score=${totalScore}&photoCount=${photoCount}&username=${user.username}`,
      "GET"
    )
      .then((response) => response.json())
      .then(setLeaderboard);
  }, [difficulty, totalScore, photoCount, user]);

  return (
    <EndGameContent
      firstStepContent={translate("endGame.survival.description")(
        lastScore,
        photoCount,
        totalScore
      )}
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
                    <td>
                      {player.photoCount}{" "}
                      <span className="cell-score-container">
                        {player.score}
                      </span>
                    </td>
                  </tr>
                ))}
              </Table>
            </div>
          )}
        </>
      }
      onReplay={onReplay}
      onLeaderboardShow={onLeaderboardShow}
    />
  );
}
