import { useEffect, useRef, useState } from "react";

import Loader from "@/components/Loader";
import Table from "@/components/Table";

import { useCurrentUser } from "@/auth/CurrentUserProvider";

import { useTranslations } from "@/i18n";
import fetchApi from "@/services/api";

import type { Difficulty } from "@/types/game";

import EndGameContent from "../EndGameContent";

type Props = {
  photoCount: number;
  totalScore: number;
  difficulty: Difficulty;
  onReplay: () => void;
  onLeaderboardShow: () => void;
};

export default function GoalEnd({
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
      `/leaderboards?mode=goal&difficulty=${difficulty}&photoCount=${photoCount}&score=${totalScore}&username=${user.username}`,
      "GET"
    )
      .then((response) => response.json())
      .then(setLeaderboard);
  }, [difficulty, photoCount, totalScore, user]);

  return (
    <EndGameContent
      firstStepContent={translate("endGame.goal.description")(photoCount)}
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
                    <td>{player.photoCount}</td>
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
