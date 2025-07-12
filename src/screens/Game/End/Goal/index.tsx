import { useTranslations } from "@/i18n";

import EndGameContent from "../EndGameContent";
import Leaderboard from "../EndGameContent/Leaderboard";

type Props = {
  photoCount: number;
  gameId: number;
  onReplay: () => void;
  onLeaderboardShow: () => void;
};

export default function GoalEnd({
  photoCount,
  gameId,
  onReplay,
  onLeaderboardShow,
}: Props) {
  const { translate } = useTranslations();

  return (
    <EndGameContent
      firstStepContent={translate("endGame.goal.description")(photoCount)}
      secondStepContent={<Leaderboard gameId={gameId} />}
      onReplay={onReplay}
      onLeaderboardShow={onLeaderboardShow}
    />
  );
}
