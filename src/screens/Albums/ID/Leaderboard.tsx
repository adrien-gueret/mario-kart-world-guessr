import { useLoaderData, useOutletContext } from "react-router-dom";

import { useCurrentUser } from "@/auth/CurrentUserProvider";

import AlbumStats from "@/components/Album/AlbumStats";
import ConstraintContainer from "@/components/ConstraintContainer";
import LeaderboardRow from "@/components/LeaderboardRow";
import Table from "@/components/Table";
import Text from "@/components/Text";

import { useTranslations } from "@/i18n";

import { getPercentile } from "@/services/leaderboard";

import type { LeaderboardsResponse } from "@/types/game";

import type { AlbumOutletContext } from "@/layouts/sublayouts/AlbumLayout";

export default function AlbumLeaderboard() {
  const { album } = useOutletContext<AlbumOutletContext>();
  const { leaderboard } = useLoaderData<{
    leaderboard: LeaderboardsResponse;
  }>();

  const { user } = useCurrentUser();
  const { translate } = useTranslations();

  const playerCount = leaderboard.length;

  if (playerCount === 0) {
    return (
      <ConstraintContainer>
        <Text>{translate("album.leaderboard.empty")}</Text>
      </ConstraintContainer>
    );
  }

  const scores = leaderboard.map((player) => player.score);
  const bestScore = Math.max(...scores);
  const averageScore = Math.round(
    scores.reduce((total, score) => total + score, 0) / playerCount,
  );

  const currentUserRow = leaderboard.find(
    (player) => player.playerId === user?.id,
  );
  const yourRank = currentUserRow
    ? {
        rank: currentUserRow.rank,
        percentile: getPercentile(currentUserRow.rank, playerCount),
      }
    : null;

  return (
    <ConstraintContainer>
      <AlbumStats
        players={playerCount}
        averageScore={averageScore}
        bestScore={bestScore}
        totalGames={album.stats?.totalGamesPlayed ?? 0}
        yourRank={yourRank}
      />

      <Table>
        {leaderboard.map((player) => (
          <LeaderboardRow
            key={player.rank}
            rank={player.rank}
            username={player.playerName}
            marioCharacter={player.marioCharacter ?? void 0}
            score={player.score}
            isHighlighted={user?.id === player.playerId}
          />
        ))}
      </Table>
    </ConstraintContainer>
  );
}
