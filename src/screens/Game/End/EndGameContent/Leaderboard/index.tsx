import { useEffect, useRef, useState } from "react";
import useNavigate from "@/services/useNavigate";

import { useCurrentUser } from "@/auth/CurrentUserProvider";

import { useTranslations } from "@/i18n";

import Button from "@/components/Button";
import Cup from "@/components/Cup";
import LeaderboardRow from "@/components/LeaderboardRow";
import Loader from "@/components/Loader";
import Table from "@/components/Table";
import Tabs from "@/components/Tabs";

import fetchApi from "@/services/api";

import type {
  GameMode,
  Difficulty,
  LeaderboardsResponse,
  Cup as CupType,
  StarRank,
} from "@/types/game";

import "./Leaderboard.css";

export type Props = {
  gameId: number;
  mode: GameMode;
  difficulty: Difficulty;
  cupData: {
    cup: CupType;
    starRank?: StarRank | null;
  };
};

export default function Leaderboard({
  gameId,
  mode,
  difficulty,
  cupData,
}: Props) {
  const hasBeenInit = useRef(false);

  const { user, isAnonymous } = useCurrentUser();
  const navigate = useNavigate();
  const { translate } = useTranslations();

  const [activeTab, setActiveTab] = useState<"all" | "bots">("bots");

  const [botLeaderboard, setBotLeaderboard] = useState<LeaderboardsResponse>(
    []
  );

  const [leaderboard, setLeaderboard] = useState<LeaderboardsResponse>([]);

  useEffect(() => {
    if (hasBeenInit.current) {
      return;
    }

    hasBeenInit.current = true;

    fetchApi(`/relative-leaderboards?gameId=${gameId}&only-bots=1`, "GET")
      .then((response) => response.json())
      .then(setBotLeaderboard);

    fetchApi(`/relative-leaderboards?gameId=${gameId}`, "GET")
      .then((response) => response.json())
      .then(setLeaderboard);
  }, [gameId]);

  const areBothLeaderboardsIdentical =
    JSON.stringify(botLeaderboard) === JSON.stringify(leaderboard);

  const leaderboardToShow = areBothLeaderboardsIdentical
    ? leaderboard
    : activeTab === "all"
    ? leaderboard
    : botLeaderboard;

  return (
    <>
      <div className="leaderboard">
        <div>
          {!areBothLeaderboardsIdentical && (
            <div className="leaderboard-tabs">
              <Tabs
                activeTab={activeTab}
                tabs={[
                  {
                    children: translate("leaderboard.tab.bots"),
                    value: "bots",
                  },
                  {
                    children: translate("leaderboard.tab.allPlayers"),
                    value: "all",
                  },
                ]}
                onTabChange={setActiveTab}
                variant="table"
              />
            </div>
          )}

          <div className="leaderboard-inner-container">
            {leaderboardToShow.length === 0 ? (
              <Loader />
            ) : (
              <Table>
                {leaderboardToShow.map((player) => (
                  <LeaderboardRow
                    key={player.rank}
                    rank={player.rank}
                    username={player.playerName}
                    marioCharacter={player.marioCharacter ?? void 0}
                    score={player.photoCount!}
                    secondaryScore={player.score}
                    isHighlighted={user.id === player.playerId}
                  />
                ))}
              </Table>
            )}
          </div>
        </div>

        <div className="leaderboard-cup-container">
          {activeTab === "bots" ? (
            cupData.cup === "none" ? (
              <>
                <h3 className="leaderboard-results-title">
                  {translate("leaderboard.tooBad")}
                </h3>
                <img src="./ui/too_bad.png" alt="" />
              </>
            ) : (
              <>
                <h3 className="leaderboard-results-title">
                  {translate("leaderboard.congrats")}
                </h3>
                <Cup cup={cupData.cup} starRank={cupData.starRank} />
              </>
            )
          ) : (
            <>
              {isAnonymous && (
                <>
                  <p style={{ maxWidth: 200, textAlign: "center" }}>
                    {translate("leaderboard.needs.login")}
                  </p>
                  <Button
                    variant="secondary"
                    onClick={() => navigate("/login")}
                  >
                    {translate("login.screen.title")}
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {activeTab === "all" && (
        <div className="leaderboard-actions">
          <Button
            variant="secondary"
            onClick={() =>
              navigate("/leaderboards", {
                state: {
                  gameMode: mode,
                  gameDifficulty: difficulty,
                },
              })
            }
          >
            {translate("endGame.see-leaderboards")}
          </Button>
        </div>
      )}
    </>
  );
}
