import { useTranslations } from "@/i18n";

import Text from "@/components/Text";

import GameBase from "./GameBase";

import useInitGame from "./hooks/useInitGame";

import DifficultySelector from "./DifficultySelector";

export default function SurvivalGame() {
  const { playIndex, replay, difficulty, setDifficulty } = useInitGame();
  const { translate } = useTranslations();

  return <GameBase key={playIndex} onReplay={replay} mode="survival" />;

  return difficulty ? (
    <GameBase key={playIndex} onReplay={replay} mode="survival" />
  ) : (
    <div>
      <h2>{translate("rules.mode.survival.title")}</h2>
      <Text component="p">{translate("rules.mode.survival.description")}</Text>
      <h3>{translate("choose.difficulty") ?? "Choisissez la difficulté"}</h3>

      <DifficultySelector difficulty={difficulty} onSelect={setDifficulty} />
    </div>
  );
}
