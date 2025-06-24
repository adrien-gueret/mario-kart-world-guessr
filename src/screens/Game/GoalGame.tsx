import GameBase from "./GameBase";

import useInitGame from "./hooks/useInitGame";

export default function GoalGame() {
  const { playIndex, replay } = useInitGame();
  return <GameBase key={playIndex} onReplay={replay} mode="goal" />;
}
