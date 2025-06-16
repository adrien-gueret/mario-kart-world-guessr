import GameBase from "./GameBase";

import useReplay from "./useReplay";

export default function GoalGame() {
  const { playIndex, replay } = useReplay();
  return <GameBase key={playIndex} onReplay={replay} mode="goal" />;
}
