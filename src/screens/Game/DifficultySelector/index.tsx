import { useState, useEffect, useRef, type ReactNode } from "react";

import Text from "@/components/Text";

import { useTranslations } from "@/i18n";

import fetchApi from "@/services/api";

import type { GameMode, Difficulty, Cup, StarRank } from "@/types/game";

import "./DifficultySelector.css";

type Props = {
  mode: Exclude<GameMode, "daily">;
  onSelect: (difficulty: Difficulty) => void;
};

const ALL_DIFFICULTIES: Difficulty[] = ["50cc", "100cc", "150cc", "mirror"];

export default function DifficultySelector({ mode, onSelect }: Props) {
  const areCupInitialized = useRef(false);
  const [difficultiesCups, setDifficultiesCups] = useState<null | Record<
    Difficulty,
    | {
        cup: Exclude<Cup, "gold">;
        starRank?: never;
      }
    | {
        cup: Extract<Cup, "gold">;
        starRank: StarRank;
      }
  >>(null);

  const difficulties: Array<{
    difficulty: Difficulty;
    isUnlocked: boolean;
  }> = ALL_DIFFICULTIES.map((difficulty, index) => {
    const isUnlocked = (() => {
      if (index === 0) {
        return true;
      }

      if (!difficultiesCups) {
        return false;
      }

      if (difficulty === "mirror") {
        return (
          difficultiesCups["50cc"].cup === "gold" &&
          difficultiesCups["100cc"].cup === "gold" &&
          difficultiesCups["150cc"].cup === "gold"
        );
      }

      const previousDifficulty = ALL_DIFFICULTIES[index - 1];

      return difficultiesCups[previousDifficulty]?.cup !== "none";
    })();

    return { difficulty, isUnlocked };
  });

  const { translate } = useTranslations();

  useEffect(() => {
    if (areCupInitialized.current) {
      return;
    }

    fetchApi(`/cups?mode=${mode}`, "GET")
      .then((response) => response.json())
      .then(setDifficultiesCups);

    areCupInitialized.current = true;
  }, [mode]);

  const modeTitle = translate(`rules.mode.${mode}.title`);
  const modeDescription = translate(`rules.mode.${mode}.description`);

  const difficultiesLabels: Record<Difficulty, ReactNode> = {
    "50cc": translate(`difficulty.${mode}.50cc`),
    "100cc": translate(`difficulty.${mode}.100cc`),
    "150cc": translate(`difficulty.${mode}.150cc`),
    mirror: translate(`difficulty.${mode}.mirror`),
  };

  const difficultiesLockedLabels: Record<Difficulty, ReactNode> = {
    "50cc": "",
    "100cc": translate("difficulty.100cc.locked"),
    "150cc": translate("difficulty.150cc.locked"),
    mirror: translate("difficulty.mirror.locked"),
  };

  return (
    <div>
      <h2>{modeTitle}</h2>
      <Text component="p">{modeDescription}</Text>
      <h3 className="difficulty-selector-title">
        {translate("choose.difficulty")}
      </h3>

      <div className="difficulty-selector">
        {difficulties.map(({ difficulty, isUnlocked }) => {
          const cup = difficultiesCups?.[difficulty].cup || "none";
          const starRank =
            cup === "gold" ? difficultiesCups?.[difficulty].starRank : "";

          return (
            <button
              key={difficulty}
              tabIndex={isUnlocked ? 0 : -1}
              onClick={isUnlocked ? () => onSelect(difficulty) : void 0}
              className={`difficulty-option difficulty-${difficulty} ${
                isUnlocked ? "" : "disabled"
              }`}
            >
              <div className="difficulty-option__icon">
                <div className="difficulty-option__icon__images">
                  <picture />

                  {cup !== "none" && (
                    <div
                      className={`cup ${difficultiesCups?.[difficulty].cup} ${starRank}`}
                    />
                  )}
                </div>
                <div className="difficulty-option__title">
                  {translate(`difficulty.${difficulty}.title`)}
                </div>
              </div>

              <div className="difficulty-option__desc">
                <Text>
                  {isUnlocked
                    ? difficultiesLabels[difficulty]
                    : difficultiesLockedLabels[difficulty]}
                </Text>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
