import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { useCurrentUser } from "@/auth/CurrentUserProvider";

import Checkbox from "@/components/Checkbox";
import DifficultyIcon from "@/components/DifficultyIcon";
import ModeIcon from "@/components/ModeIcon";
import LeaderboardRow from "@/components/LeaderboardRow";
import Loader from "@/components/Loader";
import Table from "@/components/Table";
import Text from "@/components/Text";

import { useTranslations } from "@/i18n";

import fetchApi from "@/services/api";

import type { LeaderboardsResponse, GameMode, Difficulty } from "@/types/game";

import "./Leaderboards.css";
import Button from "@/components/Button";

function Leaderboards() {
  const state = useLocation().state ?? {};
  const navigate = useNavigate();

  const [leaderboard, setLeaderboard] = useState<LeaderboardsResponse>([]);
  const [gameMode, setGameMode] = useState<GameMode>(
    () => state.gameMode || "survival"
  );
  const [gameDifficulty, setGameDifficulty] = useState<Difficulty>(
    () => state.gameDifficulty || "50cc"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [shouldHideAnonymous, setShouldHideAnonymous] = useState(false);
  const [currentUserLeaderboardData, setCurrentUserLeaderboardData] = useState<{
    rank: number;
    photoCount: number;
  } | null>(null);

  const { user: currentUser, isAnonymous } = useCurrentUser();

  const { translate } = useTranslations();

  useEffect(() => {
    setIsLoading(true);

    fetchApi(
      `/leaderboards?mode=${gameMode}&difficulty=${gameDifficulty}`,
      "GET"
    )
      .then((response) => response.json())
      .then((leaderboard: LeaderboardsResponse) => {
        const currentUserRow = leaderboard.find(
          ({ playerId }) => playerId === currentUser.id
        );
        setLeaderboard(leaderboard);
        setCurrentUserLeaderboardData(
          currentUserRow
            ? {
                rank: currentUserRow.rank ?? 0,
                photoCount: currentUserRow.photoCount ?? 0,
              }
            : null
        );
      })
      .finally(() => setIsLoading(false));
  }, [gameMode, gameDifficulty, currentUser.id]);

  return (
    <div className="leaderboards-screen">
      <h2>{translate("home.menu.leaderboards.title")}</h2>

      <Text>{translate("leaderboards.description")}</Text>

      <h3>{translate("leaderboards.mode")}</h3>
      {/* TODO: add chrono */}
      {(["goal", "survival"] as GameMode[]).map((mode) => (
        <span key={mode} className="checkbox-large">
          <Checkbox
            name="game-mode"
            label={
              <span className="leaderboards-label-with-icon">
                {translate(`mode.${mode}.label`)} <ModeIcon mode={mode} />
              </span>
            }
            checked={gameMode === mode}
            onChange={() => setGameMode(mode)}
            isRadio
          />
        </span>
      ))}

      <h3>{translate("leaderboards.difficulty")}</h3>

      {(["50cc", "100cc", "150cc", "mirror"] as Difficulty[]).map(
        (difficulty) => (
          <span key={difficulty} className="checkbox-large">
            <Checkbox
              name="game-difficulty"
              label={
                <span className="leaderboards-label-with-icon">
                  {translate(`difficulty.${difficulty}.title`)}{" "}
                  <DifficultyIcon difficulty={difficulty} />
                </span>
              }
              checked={gameDifficulty === difficulty}
              onChange={() => setGameDifficulty(difficulty)}
              isRadio
            />
          </span>
        )
      )}

      {isLoading && leaderboard.length === 0 ? (
        <Loader />
      ) : (
        <div style={{ marginTop: "64px" }}>
          <Text>
            {isAnonymous
              ? translate("leaderboards.not-logged-in")
              : currentUserLeaderboardData
              ? translate("leaderboards.currentUserScore")(
                  gameMode,
                  gameDifficulty,
                  currentUserLeaderboardData.photoCount,
                  currentUserLeaderboardData.rank
                )
              : translate("leaderboards.not-played-yet")(
                  gameMode,
                  gameDifficulty
                )}
          </Text>

          <div style={{ marginTop: "32px" }}>
            <Checkbox
              name="hide-anonymous"
              label={translate("leaderboards.hide-anonymous")}
              checked={shouldHideAnonymous}
              onChange={(checked) => setShouldHideAnonymous(checked)}
            />
          </div>

          <div className="leaderboards-table">
            <Table>
              {(shouldHideAnonymous
                ? leaderboard.filter((player) => !player.isAnonymous)
                : leaderboard
              ).map((player) => (
                <LeaderboardRow
                  key={player.rank}
                  rank={player.rank}
                  username={player.playerName}
                  marioCharacter={player.marioCharacter ?? void 0}
                  score={player.photoCount!}
                  secondaryScore={player.score}
                  isHighlighted={
                    !isAnonymous && currentUser.id === player.playerId
                  }
                />
              ))}
            </Table>
          </div>
        </div>
      )}

      <Button variant="primary" onClick={() => navigate("/")}>
        {translate("home.button")}
      </Button>
    </div>
  );
}

export default Leaderboards;
