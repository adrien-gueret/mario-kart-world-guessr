import { useTranslations } from "@/i18n";

import type { Difficulty } from "@/types/game";

import EndGameContent from "../EndGameContent";
import Leaderboard from "../EndGameContent/Leaderboard";

type Props = {
  photoCount: number;
  gameId: number;
  difficulty: Difficulty;
  onReplay: () => void;
  onLeaderboardShow: () => void;
};

export default function GoalEnd({
  photoCount,
  gameId,
  difficulty,
  onReplay,
  onLeaderboardShow,
}: Props) {
  const { translate } = useTranslations();

  return (
    <EndGameContent
      firstStepContent={translate("endGame.goal.description")(photoCount)}
      secondStepContent={
        <Leaderboard gameId={gameId} mode="goal" difficulty={difficulty} />
      }
      onReplay={onReplay}
      onLeaderboardShow={onLeaderboardShow}
    />
  );
}
