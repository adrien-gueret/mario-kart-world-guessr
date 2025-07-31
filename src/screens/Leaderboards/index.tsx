import { useEffect, useState } from "react";

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

import { useScreen } from "../ScreensProvider";

import "./Leaderboards.css";

function Leaderboards() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardsResponse>([]);
  const [gameMode, setGameMode] = useState<GameMode>("survival");
  const [gameDifficulty, setGameDifficulty] = useState<Difficulty>("50cc");
  const [isLoading, setIsLoading] = useState(false);
  const [shouldHideAnonymous, setShouldHideAnonymous] = useState(false);

  const { user, isAnonymous } = useCurrentUser();
  const { setCurrentScreenName } = useScreen();
  const { translate } = useTranslations();

  useEffect(() => {
    setIsLoading(true);

    fetchApi(
      `/leaderboards?mode=${gameMode}&difficulty=${gameDifficulty}`,
      "GET"
    )
      .then((response) => response.json())
      .then(setLeaderboard)
      .finally(() => setIsLoading(false));
  }, [gameMode, gameDifficulty]);

  return (
    <div className="leaderboards-screen">
      <h2>{translate("home.menu.leaderboards.title")}</h2>

      <Text>{translate("leaderboards.description")}</Text>

      <h3>{translate("leaderboards.mode")}</h3>
      {(["survival", "goal"] as GameMode[]).map((mode) => (
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

      <div style={{ marginTop: "64px" }}>
        <Checkbox
          name="hide-anonymous"
          label={translate("leaderboards.hide-anonymous")}
          checked={shouldHideAnonymous}
          onChange={(checked) => setShouldHideAnonymous(checked)}
        />
      </div>

      {isLoading && leaderboard.length === 0 ? (
        <Loader />
      ) : (
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
                isHighlighted={!isAnonymous && user.id === player.playerId}
              />
            ))}
          </Table>
        </div>
      )}
    </div>
  );
}

export default Leaderboards;
