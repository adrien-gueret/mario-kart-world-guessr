import { useLoaderData } from "react-router-dom";

import { useCurrentUser } from "@/auth/CurrentUserProvider";

import Button from "@/components/Button";
import LeaderboardRow from "@/components/LeaderboardRow";
import Table from "@/components/Table";
import Text from "@/components/Text";

import { useTranslations } from "@/i18n";

import useNavigate from "@/services/useNavigate";

import type { LeaderboardsResponse } from "@/types/game";
import type { Album } from "@/types/photos";

export default function AlbumLeaderboard() {
  const { album, leaderboard } = useLoaderData<{
    album: Album;
    leaderboard: LeaderboardsResponse;
  }>();

  const { user } = useCurrentUser();
  const { translate } = useTranslations();
  const navigate = useNavigate();

  return (
    <div className="leaderboards-screen">
      <h2>{translate("album.leaderboard.title")}</h2>

      <Text>{album.name}</Text>

      {leaderboard.length === 0 ? (
        <Text>{translate("album.leaderboard.empty")}</Text>
      ) : (
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
      )}

      <div style={{ marginTop: 24 }}>
        <Button
          variant="secondary"
          onClick={() => navigate(`/albums/${album.id}`)}
        >
          {translate("album.play.backToAlbum")}
        </Button>
      </div>
    </div>
  );
}
