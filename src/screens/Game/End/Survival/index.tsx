import { useTranslations } from "@/i18n";

import type { Difficulty } from "@/types/game";

import EndGameContent from "../EndGameContent";

import Leaderboard from "../EndGameContent/Leaderboard";

type Props = {
  lastScore: number;
  photoCount: number;
  totalScore: number;
  gameId: number;
  difficulty: Difficulty;
  onReplay: () => void;
  onLeaderboardShow: () => void;
};

export default function SurvivalEnd({
  lastScore,
  photoCount,
  totalScore,
  gameId,
  difficulty,
  onReplay,
  onLeaderboardShow,
}: Props) {
  const { translate } = useTranslations();

  return (
    <EndGameContent
      firstStepContent={translate("endGame.survival.description")(
        lastScore,
        photoCount,
        totalScore
      )}
      secondStepContent={
        <Leaderboard gameId={gameId} mode="survival" difficulty={difficulty} />
      }
      onReplay={onReplay}
      onLeaderboardShow={onLeaderboardShow}
    />
  );
}
