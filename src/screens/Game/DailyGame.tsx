import GameBase from "./GameBase";

import useReplay from "./hooks/useReplay";

export default function DailyGame() {
  const { playIndex, replay } = useReplay();
  return <GameBase key={playIndex} onReplay={replay} mode="daily" />;
}
