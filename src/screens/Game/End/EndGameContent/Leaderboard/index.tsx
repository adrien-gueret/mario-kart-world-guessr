import { useEffect, useRef, useState } from "react";

import { useCurrentUser } from "@/auth/CurrentUserProvider";

import { useTranslations } from "@/i18n";

import Cup from "@/components/Cup";
import LeaderboardRow from "@/components/LeaderboardRow";
import Loader from "@/components/Loader";
import Table from "@/components/Table";

import fetchApi from "@/services/api";

import type {
  RelativeLeaderbordsResponse,
  Cup as CupType,
  StarRank,
} from "@/types/game";

import "./Leaderboard.css";

type Props = {
  gameId: number;
};

export default function Leaderboard({ gameId }: Props) {
  const hasBeenInit = useRef(false);

  const { user } = useCurrentUser();
  const { translate, currentLocale } = useTranslations();

  const [activeTab, setActiveTab] = useState<"all" | "bots">("bots");

  const [botLeaderboard, setBotLeaderboard] =
    useState<RelativeLeaderbordsResponse>([]);

  const [leaderboard, setLeaderboard] = useState<RelativeLeaderbordsResponse>(
    []
  );

  useEffect(() => {
    if (hasBeenInit.current) {
      return;
    }

    hasBeenInit.current = true;

    fetchApi(
      `/relative-leaderboards2?gameId=${gameId}&only-bots=1`,
      "GET",
      void 0,
      currentLocale
    )
      .then((response) => response.json())
      .then(setBotLeaderboard);

    fetchApi(
      `/relative-leaderboards2?gameId=${gameId}`,
      "GET",
      void 0,
      currentLocale
    )
      .then((response) => response.json())
      .then(setLeaderboard);
  }, [gameId, currentLocale]);

  const areBothLeaderboardsIdentical =
    JSON.stringify(botLeaderboard) === JSON.stringify(leaderboard);

  const leaderboardToShow = areBothLeaderboardsIdentical
    ? leaderboard
    : activeTab === "all"
    ? leaderboard
    : botLeaderboard;

  const currentPlayerData = botLeaderboard.find(
    ({ playerId }) => user.id === playerId
  );
  const playerRank = currentPlayerData?.rank ?? 0;
  const playerAverageScore =
    (currentPlayerData?.score ?? 0) / (currentPlayerData?.photoCount ?? 1);

  const cup: CupType =
    (["none", "gold", "silver", "bronze"] as const)[playerRank] ?? "none";
  const starRank: StarRank | undefined = (() => {
    if (cup !== "gold") {
      return void 0;
    }

    switch (true) {
      case playerAverageScore >= 4250:
        return "rank-3";

      case playerAverageScore >= 4000:
        return "rank-2";

      case playerAverageScore >= 3750:
        return "rank-1";

      default:
        return "rank-0";
    }
  })();

  return (
    <div className="leaderboard">
      <div>
        {!areBothLeaderboardsIdentical && (
          <nav className="leaderboard-tabs">
            <button
              className={`leaderboard-tab ${
                activeTab === "bots" ? "is-active" : ""
              }`}
              tabIndex={activeTab === "bots" ? -1 : 0}
              onClick={() => setActiveTab("bots")}
            >
              {translate("leaderboard.tab.bots")}
            </button>
            <button
              className={`leaderboard-tab ${
                activeTab === "all" ? "is-active" : ""
              }`}
              tabIndex={activeTab === "all" ? -1 : 0}
              onClick={() => setActiveTab("all")}
            >
              {translate("leaderboard.tab.allPlayers")}
            </button>
          </nav>
        )}

        <div className="leaderboard-inner-container">
          {leaderboardToShow.length === 0 ? (
            <Loader />
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>

      {activeTab === "bots" && cup !== "none" && (
        <div className="leaderboard-cup-container">
          <h3 className="leaderboard-congrats">Congratulations!</h3>
          <Cup cup={cup} starRank={starRank} />
        </div>
      )}
    </div>
  );
}
