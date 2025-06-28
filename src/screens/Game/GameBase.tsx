import { useState, useCallback, useRef, useEffect } from "react";
import { type Coordinates, type LocationFull } from "@/types/location";

import {
  getDistanceAndScoreFromCoordinates,
  getRenderedCoordinatesFromRealCoordinates,
} from "@/services/coordinates";

import Button from "@/components/Button";
import Modal from "@/components/Modal";
import StickyButtonContainer from "@/components/StickyButtonContainer";
import GlobalScore from "@/components/GlobalScore";
import GuessScore from "@/components/GuessScore";
import Map from "@/components/Map";
import Pin from "@/components/Pin";
import Line from "@/components/Line";
import Photo from "@/components/Photo";
import Text from "@/components/Text";

import fetchApi from "@/services/api";

import type { Difficulty, GameMode } from "@/types/game";

import { useTranslations } from "@/i18n";

import useGame from "./hooks/useGame";

import { useScreen } from "../ScreensProvider";

import EndDailyGame from "./daily/End";

import "./Game.css";

type Props = {
  mode: GameMode;
  difficulty: Difficulty;
  onReplay: () => void;
};

export default function Game({ mode, difficulty, onReplay }: Props) {
  const firstLocationRequested = useRef(false);
  const { setCurrentScreenName } = useScreen();
  const { translate } = useTranslations();
  const {
    currentLocation,
    getNextLocation,
    currentLocationIndex,
    addScoreInHistory,
    hasReachedLimit,
    maxLocations,
    isLocationLoading,
    gameHistory,
    nextDailyDate,
  } = useGame(mode);

  const photoCount = gameHistory.scores.length;

  const totalScore = gameHistory.scores.reduce((acc, score) => acc + score, 0);

  useEffect(() => {
    if (mode === "goal" && totalScore >= 50000) {
      setIsGameEnded(true);
    }
  }, [mode, totalScore]);

  const [currentLocationCoordinates, setCurrentLocationCoordinates] =
    useState<Coordinates | null>(null);

  const [userGuess, setUserGuess] = useState<Coordinates | null>(null);
  const [isGameEnded, setIsGameEnded] = useState<boolean>(false);

  const isGameOver = isGameEnded || hasReachedLimit;

  const [guessData, setGuessData] = useState<{
    distance: number;
    score: number;
  } | null>(null);

  const photoSubtitleRef = useRef<HTMLHeadingElement>(null);

  const shouldShowAnswer = Boolean(guessData);
  const canGuess = !shouldShowAnswer && !isGameOver;

  const requestNextPhoto = useCallback(
    async (shouldScroll = false) => {
      await getNextLocation();

      setUserGuess(null);
      setGuessData(null);

      if (photoSubtitleRef.current && shouldScroll) {
        photoSubtitleRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    },
    [getNextLocation]
  );

  useEffect(() => {
    if (firstLocationRequested.current) {
      return;
    }

    firstLocationRequested.current = true;
    requestNextPhoto(false);
  }, [requestNextPhoto]);

  const handleConfirmGuess = async () => {
    if (!userGuess || !currentLocation) {
      return;
    }

    if (!import.meta.env.DEV) {
      const formData = new FormData();
      formData.append("photoName", currentLocation.photoName);
      formData.append("x", `${userGuess.x}`);
      formData.append("y", `${userGuess.y}`);
      fetchApi("/add-guess", "POST", formData);
    }

    const response = await fetchApi(
      `/get-photo?id=${currentLocation.photoName}`
    );

    if (!response.ok) {
      throw new Error();
    }

    const locationData = (await response.json()) as LocationFull;
    const coordinates = {
      x: locationData.x,
      y: locationData.y,
    };

    setCurrentLocationCoordinates(coordinates);

    const { distance, score: newScore } = getDistanceAndScoreFromCoordinates(
      userGuess,
      coordinates
    );

    addScoreInHistory(newScore);

    setGuessData({ distance, score: newScore });

    if (mode === "survival" && newScore < 3000) {
      setIsGameEnded(true);
    }
  };

  const currentLocationRenderedCoordinates = currentLocationCoordinates
    ? currentLocationCoordinates
    : { x: 0, y: 0 };

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

          <Photo
            photoName={isLocationLoading ? "" : currentLocation?.photoName}
          />
        </div>

        <div className="map-container">
          <h2>{translate("clickMap.subtitle")}</h2>

          <div
            style={{
              pointerEvents: canGuess ? "auto" : "none",
            }}
          >
            <Map
              canShowCourses={difficulty === "50cc" || difficulty === "100cc"}
              onClick={({ realCoordinates }) => {
                setUserGuess(realCoordinates);
              }}
            >
              {userGuess &&
                currentLocationRenderedCoordinates &&
                currentLocation && (
                  <>
                    {shouldShowAnswer && (
                      <>
                        <Line
                          x1={userGuess.x}
                          y1={userGuess.y}
                          x2={currentLocationRenderedCoordinates.x}
                          y2={currentLocationRenderedCoordinates.y}
                        />
                        <Pin
                          x={currentLocationRenderedCoordinates.x}
                          y={currentLocationRenderedCoordinates.y}
                          variant="star"
                        />
                        <GuessScore
                          distance={guessData!.distance}
                          score={guessData!.score}
                        />
                      </>
                    )}

                    <Pin x={userGuess.x} y={userGuess.y} variant="mario" />
                  </>
                )}
            </Map>
          </div>
        </div>
      </div>

      <GlobalScore
        score={totalScore}
        photoIndex={currentLocationIndex}
        maxPhotos={maxLocations}
      />

      {userGuess && !shouldShowAnswer && (
        <StickyButtonContainer>
          <Button onClick={handleConfirmGuess}>
            {translate("guess.label")}
          </Button>
        </StickyButtonContainer>
      )}

      {shouldShowAnswer && !isGameOver && (
        <StickyButtonContainer withDelay>
          <Button onClick={() => requestNextPhoto(true)}>
            {translate("next.label")}
          </Button>
        </StickyButtonContainer>
      )}

      <Modal
        title={translate("endGame.title")}
        isOpen={isGameOver}
        disableSkew={mode === "daily"}
      >
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
              return (
                <EndDailyGame
                  gameHistory={gameHistory}
                  nextDailyDate={nextDailyDate}
                />
              );
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
          {mode !== "daily" && (
            <Button onClick={onReplay}>
              {translate("endGame.replay.label")}
            </Button>
          )}
        </p>
      </Modal>
    </div>
  );
}
