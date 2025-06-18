import { useState, useCallback, useRef } from "react";
import useLocation, {
  type Location,
  type LocationBase,
} from "../../data/locations";

import {
  bottomCenterTopTopLeft,
  distanceBetweenCoordinatesInKilometers,
  getRenderedCoordinatesFromRealCoordinates,
} from "../../services/coordinatesTransformer";

import Button from "../../components/Button";
import Modal from "../../components/Modal";
import StickyButtonContainer from "../../components/StickyButtonContainer";
import GlobalScore from "../../components/GlobalScore";
import GuessScore from "../../components/GuessScore";
import Map from "../../components/Map";
import Pin from "../../components/Pin";
import Line from "../../components/Line";
import Photo from "../../components/Photo";
import Text from "../../components/Text";

import { useScreen } from "../ScreensProvider";

import { useTranslations } from "../../i18n";

import "./Game.css";

type GameMode = "survival" | "goal" | "daily";

type Props = {
  mode: GameMode;
  onReplay: () => void;
};

function Game({ mode, onReplay }: Props) {
  const { setCurrentScreenName } = useScreen();
  const { translate } = useTranslations();
  const { getRandomLocation, removeLocation } = useLocation();

  const [currentLocation, setCurrentLocation] = useState<Location>(() => {
    return getRandomLocation();
  });
  const [userGuess, setUserGuess] = useState<{
    realCoordinates: LocationBase["coordinates"];
    renderedCoordinates: LocationBase["coordinates"];
  } | null>(null);
  const [photoCount, setPhotoCount] = useState<number>(1);
  const [isGameEnded, setIsGameEnded] = useState<boolean>(false);

  const [totalScore, setTotalScore] = useState<number>(0);
  const [guessData, setGuessData] = useState<{
    distance: number;
    score: number;
  } | null>(null);

  const mapRef = useRef<HTMLImageElement>(null);
  const photoSubtitleRef = useRef<HTMLHeadingElement>(null);

  const shouldShowAnswer = Boolean(guessData);
  const canGuess = !shouldShowAnswer && !isGameEnded;

  const nextPhoto = useCallback(() => {
    removeLocation(currentLocation.photoName);

    const nextLocation = getRandomLocation();

    setCurrentLocation(nextLocation);
    setUserGuess(null);
    setGuessData(null);
    setPhotoCount((prevCount) => prevCount + 1);

    if (photoSubtitleRef.current) {
      photoSubtitleRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [currentLocation.photoName, getRandomLocation, removeLocation]);

  const handleConfirmGuess = () => {
    if (!userGuess) {
      return;
    }

    const distance = distanceBetweenCoordinatesInKilometers(
      userGuess.realCoordinates,
      currentLocation.coordinates
    );

    const newScore = Math.ceil(5000 * Math.exp((-10 * distance) / 13.4));

    setGuessData({ distance, score: newScore });
    setTotalScore((prevScore) => {
      const updatedScore = prevScore + newScore;

      if (mode === "goal" && updatedScore >= 50000) {
        setIsGameEnded(true);
      }

      return updatedScore;
    });

    if (mode === "survival" && newScore < 3000) {
      setIsGameEnded(true);
    }
  };

  const userGuessPinPosition = userGuess
    ? bottomCenterTopTopLeft(userGuess.renderedCoordinates)
    : null;

  const currentLocationRenderedCoordinates = mapRef.current
    ? getRenderedCoordinatesFromRealCoordinates(
        mapRef.current,
        currentLocation.coordinates
      )
    : currentLocation.coordinates;

  const currentLocationPinPosition = bottomCenterTopTopLeft(
    currentLocationRenderedCoordinates
  );

  const gameModeToRules: Record<
    GameMode,
    { title: string; description: string }
  > = {
    survival: {
      title: translate("rules.mode.survival.title"),
      description: translate("rules.mode.survival.description"),
    },
    goal: {
      title: translate("rules.mode.goal.title"),
      description: translate("rules.mode.goal.description"),
    },
    daily: {
      title: translate("rules.mode.daily.title"),
      description: translate("rules.mode.daily.description"),
    },
  };

  const gameModeRules = gameModeToRules[mode];

  return (
    <div className="game-screen">
      <div className="game-area">
        <div className="rules-container">
          <h2>{translate("rules.title")}</h2>
          <Text component="p">{translate("rules.description")}</Text>
          <h3>{gameModeRules.title}</h3>
          <Text component="p">{gameModeRules.description}</Text>
        </div>

        <div className="photo-container">
          <h2 ref={photoSubtitleRef}>{translate("photo.subtitle")}</h2>

          <Photo photoName={currentLocation.photoName} />
        </div>

        <div className="map-container">
          <h2>{translate("clickMap.subtitle")}</h2>

          <div
            style={{
              position: "relative",
              pointerEvents: canGuess ? "auto" : "none",
            }}
          >
            <Map
              onClick={({ realCoordinates, renderedCoordinates }) => {
                setUserGuess({ realCoordinates, renderedCoordinates });

                if (process.env.NODE_ENV === "development") {
                  console.log(realCoordinates);
                }
              }}
              ref={mapRef}
            />

            {userGuessPinPosition &&
              userGuess &&
              currentLocationPinPosition &&
              currentLocation && (
                <>
                  {shouldShowAnswer && (
                    <>
                      <Line
                        x1={userGuess.renderedCoordinates.x}
                        y1={userGuess.renderedCoordinates.y}
                        x2={currentLocationRenderedCoordinates.x}
                        y2={currentLocationRenderedCoordinates.y}
                      />
                      <Pin
                        x={currentLocationPinPosition.x}
                        y={currentLocationPinPosition.y}
                        variant="star"
                      />
                      <GuessScore
                        distance={guessData!.distance}
                        score={guessData!.score}
                      />
                    </>
                  )}

                  <Pin
                    x={userGuessPinPosition.x}
                    y={userGuessPinPosition.y}
                    variant="mario"
                  />
                </>
              )}
          </div>
        </div>
      </div>

      <GlobalScore score={totalScore} />

      {userGuess && !shouldShowAnswer && (
        <StickyButtonContainer>
          <Button onClick={handleConfirmGuess}>
            {translate("guess.label")}
          </Button>
        </StickyButtonContainer>
      )}

      {shouldShowAnswer && !isGameEnded && (
        <StickyButtonContainer withDelay>
          <Button onClick={nextPhoto}>{translate("next.label")}</Button>
        </StickyButtonContainer>
      )}

      <Modal title={translate("endGame.title")} isOpen={isGameEnded}>
        {(() => {
          switch (mode) {
            case "survival":
              return translate("endGame.survival.description")(
                guessData?.score || 0,
                photoCount,
                totalScore
              );

            case "goal":
              return translate("endGame.goal.description")(photoCount);

            case "daily":
              return "Well played!";
          }
        })()}

        <p
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <Button onClick={() => setCurrentScreenName("Title")}>
            {translate("endGame.titleScreen.label")}
          </Button>
          <Button onClick={onReplay}>
            {translate("endGame.replay.label")}
          </Button>
        </p>
      </Modal>
    </div>
  );
}

export default Game;
