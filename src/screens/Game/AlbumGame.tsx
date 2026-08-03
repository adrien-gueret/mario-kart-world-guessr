import { useParams } from "react-router-dom";

import GameBase from "./GameBase";

import useReplay from "./hooks/useReplay";

export default function AlbumGame() {
  const { albumId } = useParams<{ albumId: string }>();
  const { playIndex, replay } = useReplay();

  return (
    <GameBase
      key={playIndex}
      onReplay={replay}
      mode="album"
      albumId={Number(albumId)}
    />
  );
}
