import { useEffect, useRef, useState } from "react";

import Loader from "@/components/Loader";
import Table from "@/components/Table";

import { useCurrentUser } from "@/auth/CurrentUserProvider";

import { useTranslations } from "@/i18n";
import fetchApi from "@/services/api";

import type { RelativeLeaderbordsResponse } from "@/types/game";

import EndGameContent from "../EndGameContent";

type Props = {
  photoCount: number;
  gameId: number;
  onReplay: () => void;
  onLeaderboardShow: () => void;
};

export default function GoalEnd({
  photoCount,
  gameId,
  onReplay,
  onLeaderboardShow,
}: Props) {
  const { translate } = useTranslations();
  const [leaderboard, setLeaderboard] = useState<RelativeLeaderbordsResponse>(
    []
  );
  const { user } = useCurrentUser();

  const hasBeenInit = useRef(false);

  useEffect(() => {
    if (hasBeenInit.current) {
      return;
    }

    hasBeenInit.current = true;

    fetchApi(`/relative-leaderboards?gameId=${gameId}`, "GET")
      .then((response) => response.json())
      .then(setLeaderboard);
  }, [gameId, user]);

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
                {leaderboard.map((player) => (
                  <tr
                    key={player.rank}
                    className={
                      player.playerId === user.id ? "is-highlighted" : ""
                    }
                  >
                    <th>{player.rank}</th>
                    <th className="cell-name">{player.playerName}</th>
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
