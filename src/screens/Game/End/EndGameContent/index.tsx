import { useState, type ReactNode } from "react";
import useNavigate from "@/services/useNavigate";

import Button from "@/components/Button";

import { useTranslations } from "@/i18n";

import "./EndGameContent.css";

type Props = {
  firstStepContent: ReactNode;
  secondStepContent: ReactNode;
  onLeaderboardShow: () => void;
  onClose?: () => void;
  onReplay?: () => void;
};

export default function EndGameContent({
  firstStepContent,
  secondStepContent,
  onClose,
  onReplay,
  onLeaderboardShow,
}: Props) {
  const [currentStep, setCurrentStep] = useState(1);
  const { translate } = useTranslations();
  const navigate = useNavigate();

  const onClickNext = () => {
    setCurrentStep((prev) => prev + 1);
    onLeaderboardShow();
  };

  return (
    <>
      <div>{currentStep === 1 ? firstStepContent : secondStepContent}</div>

      <div className="end-game-content-buttons">
        {onClose && currentStep === 1 && (
          <Button onClick={onClose} variant="secondary">
            {translate("close.label")}
          </Button>
        )}

        {currentStep === 1 ? (
          <Button onClick={onClickNext}>
            {translate("endGame.next-button.label")}
          </Button>
        ) : (
          <>
            <Button
              variant={onReplay ? "secondary" : "primary"}
              onClick={() => navigate("/")}
            >
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
