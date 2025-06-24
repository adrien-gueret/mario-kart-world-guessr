import { useState } from "react";

import type { Difficulty } from "@/types/game";

import useReplay from "./useReplay";

export default function useInitGame() {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const { playIndex, replay } = useReplay();

  return {
    playIndex,
    replay,
    difficulty,
    setDifficulty,
  };
}
