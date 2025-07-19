import GameBase from "./GameBase";

import useInitGame from "./hooks/useInitGame";

import DifficultySelector from "./DifficultySelector";

export default function GoalGame() {
  const { playIndex, replay, difficulty, setDifficulty } = useInitGame();

  return difficulty ? (
    <>
      <GameBase
        key={playIndex}
        onReplay={replay}
        mode="goal"
        difficulty={difficulty}
      />
    </>
  ) : (
    <DifficultySelector mode="goal" onSelect={setDifficulty} />
  );
}
