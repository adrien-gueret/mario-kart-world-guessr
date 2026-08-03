import { useState, useEffect, useRef, type ReactNode } from "react";

import Card from "@/components/Card";
import CupIcon from "@/components/Cup";
import DifficultyIcon from "@/components/DifficultyIcon";
import Text from "@/components/Text";

import { useTranslations } from "@/i18n";

import fetchApi from "@/services/api";

import type { GameMode, Difficulty, Cup, StarRank } from "@/types/game";

import "./DifficultySelector.css";

type Props = {
  mode: Exclude<GameMode, "daily" | "album">;
  onSelect: (difficulty: Difficulty) => void;
};

const ALL_DIFFICULTIES: Difficulty[] = ["50cc", "100cc", "150cc", "mirror"];

const difficultyToColor: Record<Difficulty, string> = {
  "50cc": "#41df41",
  "100cc": "#ffa500",
  "150cc": "#f65353",
  mirror: "#a500a5",
};

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
  }> = ALL_DIFFICULTIES.map((difficulty) => {
    const isUnlocked = (() => {
      if (difficulty !== "mirror") {
        return true;
      }

      if (!difficultiesCups) {
        return false;
      }

      return difficultiesCups["150cc"].cup !== "none";
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
    "100cc": "",
    "150cc": "",
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
            cup === "gold" ? difficultiesCups?.[difficulty].starRank : void 0;

          return (
            <Card
              key={difficulty}
              onClick={isUnlocked ? () => onSelect(difficulty) : void 0}
              icon={
                <>
                  <DifficultyIcon difficulty={difficulty} />
                  {cup !== "none" && <CupIcon cup={cup} starRank={starRank} />}
                </>
              }
              borderColor={difficultyToColor[difficulty]}
              title={translate(`difficulty.${difficulty}.title`)}
              content={
                isUnlocked
                  ? difficultiesLabels[difficulty]
                  : difficultiesLockedLabels[difficulty]
              }
            />
          );
        })}
      </div>
    </div>
  );
}
