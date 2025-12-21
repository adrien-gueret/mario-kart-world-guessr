import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useCurrentUser } from "@/auth/CurrentUserProvider";

import Button from "@/components/Button";
import Calendar from "@/components/Calendar";
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

type IsoDate =
  `${number}${number}${number}${number}-${number}${number}-${number}${number}`;

// TODO: add chrono mode
const allGameModes: GameMode[] = ["goal", "survival", "daily"];

const allDifficulties: Difficulty[] = ["50cc", "100cc", "150cc", "mirror"];

const isDailyDate = (dateString: string): dateString is IsoDate => {
  return dateString === "today" || /^\d{4}-\d{2}-\d{2}$/.test(dateString);
};

function Leaderboards() {
  const { mode: gameMode, gameDifficulty } = useParams<{
    mode: GameMode;
    gameDifficulty: Difficulty | IsoDate | "today";
  }>();
  const navigate = useNavigate();

  const [leaderboard, setLeaderboard] = useState<LeaderboardsResponse>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [shouldHideAnonymous, setShouldHideAnonymous] = useState(false);
  const [currentUserLeaderboardData, setCurrentUserLeaderboardData] = useState<{
    rank: number;
    photoCount: number;
    score: number;
  } | null>(null);

  const { user: currentUser, isAnonymous } = useCurrentUser();

  const { translate } = useTranslations();

  const isDailyMode = gameMode === "daily";

  useEffect(() => {
    if (isDailyMode) {
      if (!isDailyDate(gameDifficulty ?? "")) {
        navigate(`/leaderboards/daily/today`, {
          replace: true,
          preventScrollReset: true,
        });
        return;
      }
    } else {
      if (!allDifficulties.includes(gameDifficulty as Difficulty)) {
        navigate(`/leaderboards/${gameMode}/150cc`, {
          replace: true,
          preventScrollReset: true,
        });
        return;
      }

      if (!allGameModes.includes(gameMode as GameMode)) {
        navigate(`/leaderboards/survival/${gameDifficulty}`, {
          replace: true,
          preventScrollReset: true,
        });
        return;
      }
    }

    setIsLoading(true);

    const apiEndpoint: `/${string}` =
      gameMode === "daily"
        ? `/leaderboards?mode=daily&date=${gameDifficulty}`
        : `/leaderboards?mode=${gameMode}&difficulty=${gameDifficulty}`;

    fetchApi(apiEndpoint, "GET")
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
                score: currentUserRow.score ?? 0,
              }
            : null
        );
      })
      .finally(() => setIsLoading(false));
  }, [gameMode, gameDifficulty, currentUser.id, isDailyMode, navigate]);

  return (
    <div className="leaderboards-screen">
      <h2>{translate("home.menu.leaderboards.title")}</h2>

      <Text>{translate("leaderboards.description")}</Text>

      <h3>{translate("leaderboards.mode")}</h3>

      {allGameModes.map((mode) => (
        <span key={mode} className="checkbox-large">
          <Checkbox
            name="game-mode"
            label={
              <span className="leaderboards-label-with-icon">
                {translate(`mode.${mode}.label`)} <ModeIcon mode={mode} />
              </span>
            }
            checked={gameMode === mode}
            onChange={() =>
              navigate(`/leaderboards/${mode}/${gameDifficulty}`, {
                preventScrollReset: true,
              })
            }
            isRadio
          />
        </span>
      ))}

      {isDailyMode ? (
        <>
          <h3>{translate("leaderboards.calendar")}</h3>

          {isDailyDate(gameDifficulty ?? "") && (
            <Calendar
              defaultValue={
                gameDifficulty === "today"
                  ? new Date()
                  : new Date(gameDifficulty as string)
              }
              onClickDay={(day) => {
                const isoDay = [
                  day.getFullYear(),
                  String(day.getMonth() + 1).padStart(2, "0"),
                  String(day.getDate()).padStart(2, "0"),
                ].join("-");

                navigate(`/leaderboards/daily/${isoDay}`, {
                  preventScrollReset: true,
                });
              }}
            />
          )}
        </>
      ) : (
        <>
          <h3>{translate("leaderboards.difficulty")}</h3>

          {allDifficulties.map((difficulty) => (
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
                onChange={() =>
                  navigate(`/leaderboards/${gameMode}/${difficulty}`, {
                    preventScrollReset: true,
                  })
                }
                isRadio
              />
            </span>
          ))}
        </>
      )}

      {isLoading && leaderboard.length === 0 ? (
        <Loader />
      ) : (
        <div style={{ marginTop: "64px" }}>
          <Text>
            {isAnonymous
              ? translate("leaderboards.not-logged-in")
              : currentUserLeaderboardData
              ? isDailyMode
                ? translate("leaderboards.daily.currentUserScore")(
                    new Date(gameDifficulty as IsoDate),
                    currentUserLeaderboardData.score,
                    currentUserLeaderboardData.rank
                  )
                : translate("leaderboards.currentUserScore")(
                    gameMode!,
                    gameDifficulty as Difficulty,
                    currentUserLeaderboardData.photoCount,
                    currentUserLeaderboardData.rank
                  )
              : isDailyMode
              ? translate("leaderboards.daily.not-played-yet")(
                  new Date(gameDifficulty as IsoDate)
                )
              : translate("leaderboards.not-played-yet")(
                  gameMode!,
                  gameDifficulty as Difficulty
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
                  score={isDailyMode ? player.score : player.photoCount!}
                  secondaryScore={isDailyMode ? void 0 : player.score}
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
