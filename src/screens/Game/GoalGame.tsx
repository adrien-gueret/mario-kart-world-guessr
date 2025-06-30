import { useTranslations } from "@/i18n";

import GameBase from "./GameBase";

import useInitGame from "./hooks/useInitGame";

import DifficultySelector from "./DifficultySelector";

export default function GoalGame() {
  const { playIndex, replay, difficulty, setDifficulty } = useInitGame();
  const { translate } = useTranslations();

  return difficulty ? (
    <GameBase
      key={playIndex}
      onReplay={replay}
      mode="goal"
      difficulty={difficulty}
    />
  ) : (
    <DifficultySelector
      modeTitle={translate("rules.mode.goal.title")}
      modeDescription={translate("rules.mode.goal.description")}
      onSelect={setDifficulty}
      difficultiesLabels={{
        "50cc": translate("difficulty.goal.50cc"),
        "100cc": translate("difficulty.goal.100cc"),
        "150cc": translate("difficulty.goal.150cc"),
        mirror: translate("difficulty.goal.mirror"),
      }}
    />
  );
}
