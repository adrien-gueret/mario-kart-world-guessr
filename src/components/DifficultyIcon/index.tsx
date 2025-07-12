import type { Difficulty } from "@/types/game";

import "./DifficultyIcon.css";

type Props = {
  difficulty: Difficulty;
};

export default function DifficultyIcon({ difficulty }: Props) {
  return <picture className={`difficulty-icon difficulty-${difficulty}`} />;
}
