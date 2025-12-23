import { useCurrentUser } from "@/auth/CurrentUserProvider";

import GameBase from "./GameBase";

import useInitGame from "./hooks/useInitGame";

import DifficultySelector from "./DifficultySelector";
import ErrorScreen from "../Error";

export default function ChronoGame() {
  const { playIndex, replay, difficulty, setDifficulty } = useInitGame();

  const { user } = useCurrentUser();

  // TODO: remove this restriction
  if (user.id !== 1) {
    return <ErrorScreen />;
  }

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
