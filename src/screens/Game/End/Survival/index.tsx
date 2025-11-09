import { useTranslations } from "@/i18n";

import type { Difficulty } from "@/types/game";

import EndGameContent from "../EndGameContent";

import Leaderboard, {
  type Props as LeaderboardProps,
} from "../EndGameContent/Leaderboard";

type Props = {
  lastScore: number;
  photoCount: number;
  totalScore: number;
  gameId: number;
  difficulty: Difficulty;
  onReplay: () => void;
  onClose: () => void;
  onLeaderboardShow: () => void;
  cupData: LeaderboardProps["cupData"];
};

export default function SurvivalEnd({
  lastScore,
  photoCount,
  totalScore,
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
      firstStepContent={translate("endGame.survival.description")(
        lastScore,
        photoCount,
        totalScore
      )}
      secondStepContent={
        <Leaderboard
          gameId={gameId}
          mode="survival"
          difficulty={difficulty}
          cupData={cupData}
        />
      }
      onClose={onClose}
      onReplay={onReplay}
      onLeaderboardShow={onLeaderboardShow}
    />
  );
}
