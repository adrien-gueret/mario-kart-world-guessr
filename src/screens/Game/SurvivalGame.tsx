import GameBase from "./GameBase";

import useInitGame from "./hooks/useInitGame";

import DifficultySelector from "./DifficultySelector";

export default function SurvivalGame() {
  const { playIndex, replay, difficulty, setDifficulty } = useInitGame();

  return difficulty ? (
    <GameBase
      key={playIndex}
      onReplay={replay}
      mode="survival"
      difficulty={difficulty}
    />
  ) : (
    <DifficultySelector mode="survival" onSelect={setDifficulty} />
  );
}
