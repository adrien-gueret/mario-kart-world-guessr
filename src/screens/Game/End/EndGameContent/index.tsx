import { useState, type ReactNode } from "react";

import Button from "@/components/Button";

import { useTranslations } from "@/i18n";

import { useScreen } from "@/screens/ScreensProvider";

import "./EndGameContent.css";

type Props = {
  firstStepContent: ReactNode;
  secondStepContent: ReactNode;
  onLeaderboardShow: () => void;
  onReplay?: () => void;
};

export default function EndGameContent({
  firstStepContent,
  secondStepContent,
  onReplay,
  onLeaderboardShow,
}: Props) {
  const [currentStep, setCurrentStep] = useState(1);
  const { translate } = useTranslations();
  const { setCurrentScreenName } = useScreen();

  const onClickNext = () => {
    setCurrentStep((prev) => prev + 1);
    onLeaderboardShow();
  };

  return (
    <>
      <div>{currentStep === 1 ? firstStepContent : secondStepContent}</div>

      <div className="end-game-content-buttons">
        {currentStep === 1 ? (
          <Button onClick={onClickNext}>
            {translate("endGame.next-button.label")}
          </Button>
        ) : (
          <>
            <Button onClick={() => setCurrentScreenName("Title")}>
              {translate("endGame.titleScreen.label")}
            </Button>
            {onReplay && (
              <Button onClick={onReplay}>
                {translate("endGame.replay.label")}
              </Button>
            )}
          </>
        )}
      </div>
    </>
  );
}
