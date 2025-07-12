import { useTranslations } from "@/i18n";

import EndGameContent from "../EndGameContent";

import Leaderboard from "../EndGameContent/Leaderboard";

type Props = {
  lastScore: number;
  photoCount: number;
  totalScore: number;
  gameId: number;
  onReplay: () => void;
  onLeaderboardShow: () => void;
};

export default function SurvivalEnd({
  lastScore,
  photoCount,
  totalScore,
  gameId,
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
      secondStepContent={<Leaderboard gameId={gameId} />}
      onReplay={onReplay}
      onLeaderboardShow={onLeaderboardShow}
    />
  );
}
