import { useState, useEffect } from "react";

import type { Difficulty } from "@/types/game";

import useReplay from "./useReplay";

export default function useInitGame() {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const { playIndex, replay } = useReplay();

  useEffect(() => {
    if (difficulty) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [difficulty]);

  return {
    playIndex,
    replay,
    difficulty,
    setDifficulty,
  };
}
