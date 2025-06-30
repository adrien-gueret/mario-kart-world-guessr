import type { ReactNode } from "react";

import Text from "@/components/Text";

import { useTranslations } from "@/i18n";

import type { Difficulty } from "@/types/game";

import "./DifficultySelector.css";

type Props = {
  modeTitle: string;
  modeDescription: string;
  onSelect: (difficulty: Difficulty) => void;
  difficultiesLabels: Record<Difficulty, ReactNode>;
};

const DIFFICULTIES: Difficulty[] = ["50cc", "100cc", "150cc", "mirror"];

export default function DifficultySelector({
  modeTitle,
  modeDescription,
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
            <div className="difficulty-option__icon">
              <picture />
              <div className="difficulty-option__title">
                {translate(`difficulty.${difficulty}.title`)}
              </div>
            </div>

            <div className="difficulty-option__desc">
              <Text>{difficultiesLabels[difficulty]}</Text>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
