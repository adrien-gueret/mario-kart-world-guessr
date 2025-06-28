import type { ReactNode } from "react";

import Text from "@/components/Text";

import { useTranslations } from "@/i18n";

import type { Difficulty } from "@/types/game";

import "./DifficultySelector.css";

type Props = {
  modeTitle: string;
  modeDescription: string;
  value: Difficulty | null;
  onSelect: (difficulty: Difficulty) => void;
  difficultiesLabels: Record<Difficulty, ReactNode>;
};

const DIFFICULTIES: Difficulty[] = ["50cc", "100cc", "150cc", "mirror"];

export default function DifficultySelector({
  modeTitle,
  modeDescription,
  value,
  onSelect,
  difficultiesLabels,
}: Props) {
  const { translate } = useTranslations();

  return (
    <div>
      <h2>{modeTitle}</h2>
      <Text component="p">{modeDescription}</Text>
      <h3 className="difficulty-selector-title">
        {translate("choose.difficulty")}
      </h3>

      <div className="difficulty-selector">
        {DIFFICULTIES.map((difficulty) => (
          <button
            key={difficulty}
            onClick={() => onSelect(difficulty)}
            className={`difficulty-option difficulty-${difficulty}`}
          >
            <picture />

            <span>{difficultiesLabels[difficulty]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
