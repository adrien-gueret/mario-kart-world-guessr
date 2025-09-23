import GameBase from "./GameBase";

import useInitGame from "./hooks/useInitGame";

import DifficultySelector from "./DifficultySelector";

export default function ChronoGame() {
  const { playIndex, replay, difficulty, setDifficulty } = useInitGame();

  return difficulty ? (
    <>
      <GameBase
        key={playIndex}
        onReplay={replay}
        mode="chrono"
        difficulty={difficulty}
      />
    </>
  ) : (
    <DifficultySelector mode="chrono" onSelect={setDifficulty} />
  );
}
