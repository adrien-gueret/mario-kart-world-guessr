import { useTranslations } from "@/i18n";

import GameBase from "./GameBase";

import useInitGame from "./hooks/useInitGame";

import DifficultySelector from "./DifficultySelector";

export default function SurvivalGame() {
  const { playIndex, replay, difficulty, setDifficulty } = useInitGame();
  const { translate } = useTranslations();

  return difficulty ? (
    <GameBase
      key={playIndex}
      onReplay={replay}
      mode="survival"
      difficulty={difficulty}
    />
  ) : (
    <DifficultySelector
      modeTitle={translate("rules.mode.survival.title")}
      modeDescription={translate("rules.mode.survival.description")}
      value={difficulty}
      onSelect={setDifficulty}
      difficultiesLabels={{
        "50cc": translate("difficulty.survival.50cc"),
        "100cc": translate("difficulty.survival.100cc"),
        "150cc": translate("difficulty.survival.150cc"),
        mirror: translate("difficulty.survival.mirror"),
      }}
    />
  );
}
