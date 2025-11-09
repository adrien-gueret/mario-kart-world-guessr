import { useTranslations } from "@/i18n";

import type { Difficulty } from "@/types/game";

import EndGameContent from "../EndGameContent";
import Leaderboard, {
  type Props as LeaderboardProps,
} from "../EndGameContent/Leaderboard";

type Props = {
  photoCount: number;
  gameId: number;
  difficulty: Difficulty;
  cupData: LeaderboardProps["cupData"];
  onReplay: () => void;
  onClose: () => void;
  onLeaderboardShow: () => void;
};

export default function GoalEnd({
  photoCount,
  gameId,
  difficulty,
  onReplay,
  onClose,
  onLeaderboardShow,
  cupData,
}: Props) {
  const { translate } = useTranslations();

  return (
    <EndGameContent
      firstStepContent={translate("endGame.goal.description")(photoCount)}
      secondStepContent={
        <Leaderboard
          gameId={gameId}
          mode="goal"
          difficulty={difficulty}
          cupData={cupData}
        />
      }
      onReplay={onReplay}
      onClose={onClose}
      onLeaderboardShow={onLeaderboardShow}
    />
  );
}
