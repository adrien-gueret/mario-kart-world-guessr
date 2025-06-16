import GameBase from "./GameBase";

import useReplay from "./useReplay";

export default function SurvivalGame() {
  const { playIndex, replay } = useReplay();
  return <GameBase key={playIndex} onReplay={replay} mode="survival" />;
}
