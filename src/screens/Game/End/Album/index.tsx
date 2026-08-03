import { useState, useEffect, useRef } from "react";

import { useCurrentUser } from "@/auth/CurrentUserProvider";

import { useTranslations } from "@/i18n";

import type { GameHistory, LeaderboardsResponse } from "@/types/game";

import Button from "@/components/Button";
import Callout from "@/components/Callout";
import LeaderboardRow from "@/components/LeaderboardRow";
import Loader from "@/components/Loader";
import Table from "@/components/Table";

import fetchApi from "@/services/api";
import useNavigate from "@/services/useNavigate";

import EndGameContent from "../EndGameContent";

type Props = {
  gameHistory: GameHistory;
  gameId: number;
  albumId: number;
  wasAlbumModified?: boolean;
  onLeaderboardShow: () => void;
};

export default function AlbumEnd({
  gameHistory,
  gameId,
  albumId,
  wasAlbumModified = false,
  onLeaderboardShow,
}: Props) {
  const { translate, currentLocale } = useTranslations();
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState<LeaderboardsResponse>([]);
  const { user } = useCurrentUser();
  const hasBeenInit = useRef(false);

  const totalScore = gameHistory.reduce((acc, score) => acc + score, 0);

  useEffect(() => {
    if (hasBeenInit.current || wasAlbumModified) {
      return;
    }

    hasBeenInit.current = true;

    fetchApi(`/relative-leaderboards?gameId=${gameId}`, "GET")
      .then((response) => response.json())
      .then(setLeaderboard);
  }, [gameId, currentLocale, wasAlbumModified]);

  // Album edited mid-game: the play is incomplete and unscored, so there is no
  // leaderboard to show. Render a standalone screen without the second step.
  if (wasAlbumModified) {
    return (
      <div className="game-album-end">
        <div style={{ margin: "0 auto 16px", maxWidth: "90%" }}>
          <Callout type="warning">
            {translate("endGame.album.modified")}
          </Callout>
        </div>

        <div className="end-game-content-buttons">
          <Button onClick={() => navigate(`/albums/${albumId}`)}>
            {translate("album.play.backToAlbum")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="game-album-end">
      <EndGameContent
        firstStepContent={
          <>
            <div>{translate("endGame.album.description")}</div>

            <div style={{ width: "70%", margin: "12px auto" }}>
              <Table
                footer={
                  <tr>
                    <th>Total</th>
                    <td>{totalScore}</td>
                  </tr>
                }
              >
                {gameHistory.map((score, index) => (
                  <tr key={index}>
                    <th>{index + 1}</th>
                    <td>{score}</td>
                  </tr>
                ))}
              </Table>
            </div>

            <Button
              variant="secondary"
              onClick={() => navigate(`/albums/${albumId}`)}
            >
              {translate("album.play.backToAlbum")}
            </Button>
          </>
        }
        secondStepContent={
          <>
            {leaderboard.length === 0 ? (
              <Loader />
            ) : (
              <div className="leaderboard-container">
                <Table>
                  {leaderboard.map((player) => (
                    <LeaderboardRow
                      key={player.rank}
                      rank={player.rank}
                      username={player.playerName}
                      marioCharacter={player.marioCharacter ?? void 0}
                      score={player.score}
                      isHighlighted={user.id === player.playerId}
                    />
                  ))}
                </Table>

                <div className="leaderboard-actions" style={{ marginTop: 16 }}>
                  <Button
                    variant="secondary"
                    onClick={() => navigate(`/albums/${albumId}/leaderboard`)}
                  >
                    {translate("endGame.see-leaderboards")}
                  </Button>
                </div>
              </div>
            )}
          </>
        }
        onLeaderboardShow={onLeaderboardShow}
      />
    </div>
  );
}
