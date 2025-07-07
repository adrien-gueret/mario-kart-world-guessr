import { useState, useCallback, useRef, useEffect, use } from "react";
import { type Coordinates, type LocationFull } from "@/types/location";

import {
  getDistanceAndScoreFromCoordinates,
  MAP_SIZE_IN_PIXELS,
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

import EndDailyGame from "./End/Daily";
import EndGoalGame from "./End/Goal";
import EndSurvivalGame from "./End/Survival";

import "./Game.css";

type Props = {
  mode: GameMode;
  difficulty?: Difficulty;
  onReplay: () => void;
};

export default function Game({ mode, difficulty, onReplay }: Props) {
  const firstLocationRequested = useRef(false);

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
  } = useGame(mode, difficulty);

  const photoCount = gameHistory.scores.length;

  const totalScore = gameHistory.scores.reduce((acc, score) => acc + score, 0);

  useEffect(() => {
    if (mode === "goal" && totalScore >= 50000) {
      setIsGameEnded(true);
    }
  }, [mode, totalScore]);

  const [currentLocationCoordinates, setCurrentLocationCoordinates] =
    useState<Coordinates | null>(null);
  const [
    currentLocationPlayersCoordinates,
    setCurrentLocationPlayersCoordinates,
  ] = useState<Coordinates | null>(null);

  const [userGuess, setUserGuess] = useState<Coordinates | null>(null);
  const [shouldShowOtherPlayersGuesses, setShouldShowOtherPlayersGuesses] =
    useState(false);
  const [canShowPlayersCoordinates, setCanShowPlayersCoordinates] =
    useState(false);
  const [isGameEnded, setIsGameEnded] = useState(false);
  const [isLeaderboardShown, setIsLeaderboardShown] = useState(false);

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
      formData.append(
        "x",
        `${
          difficulty === "mirror"
            ? MAP_SIZE_IN_PIXELS.width - userGuess.x
            : userGuess.x
        }`
      );
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
    const playersCoordinates = {
      x: locationData.guess_median_x,
      y: locationData.guess_median_y,
    };

    if (difficulty === "mirror") {
      coordinates.x = MAP_SIZE_IN_PIXELS.width - coordinates.x;
      playersCoordinates.x = MAP_SIZE_IN_PIXELS.width - playersCoordinates.x;
    }

    setCurrentLocationCoordinates(coordinates);
    setCurrentLocationPlayersCoordinates(playersCoordinates);

    const hasBeenGuessedMoreThan5Times = locationData.guesses_count >= 5;

    setCanShowPlayersCoordinates(hasBeenGuessedMoreThan5Times);

    if (!hasBeenGuessedMoreThan5Times) {
      setShouldShowOtherPlayersGuesses(false);
    }

    const { distance, score: newScore } = getDistanceAndScoreFromCoordinates(
      userGuess,
      coordinates,
      difficulty
    );

    addScoreInHistory(newScore);

    setGuessData({ distance, score: newScore });

    if (mode === "survival") {
      const shouldEndGame =
        (difficulty === "50cc" && newScore < 2500) ||
        (difficulty === "100cc" && newScore < 3000) ||
        (difficulty === "150cc" && newScore < 3500) ||
        (difficulty === "mirror" && newScore < 3500);
      setIsGameEnded(shouldEndGame);
    }
  };

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

          {difficulty && mode !== "daily" && (
            <>
              <h3>
                {translate("difficulty.label")}{" "}
                {translate(`difficulty.${difficulty}.title`)}
              </h3>
              <Text component="p">
                {translate(`difficulty.${mode}.${difficulty}.short`)}
              </Text>
            </>
          )}
        </div>

        <div className="photo-container">
          <h2 ref={photoSubtitleRef}>{translate("photo.subtitle")}</h2>

          <Photo
            photoName={isLocationLoading ? "" : currentLocation?.photoName}
            isMirrored={difficulty === "mirror"}
          />
        </div>

        <div className="map-container">
          <h2>{translate("clickMap.subtitle")}</h2>

          <Map
            canShowCourses={difficulty === "50cc" || difficulty === "100cc"}
            isMirrored={difficulty === "mirror"}
            onClick={
              canGuess
                ? ({ realCoordinates }) => {
                    setUserGuess(realCoordinates);
                  }
                : undefined
            }
          >
            {userGuess && currentLocation && (
              <>
                {shouldShowAnswer &&
                  currentLocationCoordinates &&
                  currentLocationPlayersCoordinates && (
                    <>
                      <Line
                        x1={userGuess.x}
                        y1={userGuess.y}
                        x2={currentLocationCoordinates.x}
                        y2={currentLocationCoordinates.y}
                      />
                      <Pin
                        x={currentLocationCoordinates.x}
                        y={currentLocationCoordinates.y}
                        variant="star"
                      />
                      {shouldShowOtherPlayersGuesses && (
                        <Pin
                          x={currentLocationPlayersCoordinates.x}
                          y={currentLocationPlayersCoordinates.y}
                          variant="luigi"
                        />
                      )}

                      <GuessScore
                        distance={guessData!.distance}
                        score={guessData!.score}
                        canShowPlayersCoordinates={canShowPlayersCoordinates}
                        shouldShowPlayersCoordinates={
                          shouldShowOtherPlayersGuesses
                        }
                        onShowPlayersCoordinatesChange={
                          setShouldShowOtherPlayersGuesses
                        }
                      />
                    </>
                  )}

                <Pin x={userGuess.x} y={userGuess.y} variant="mario" />
              </>
            )}
          </Map>
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
        title={
          isLeaderboardShown
            ? `${translate("endGame.title.leaderboard")} - ${translate(
                `mode.${mode}.label`
              )}${
                difficulty
                  ? ` - ${translate(`difficulty.${difficulty}.title`)}`
                  : ""
              }`
            : translate("endGame.title")
        }
        isOpen={isGameOver}
        disableSkew={mode === "daily" || isLeaderboardShown}
      >
        {(() => {
          switch (mode) {
            case "survival":
              return (
                <EndSurvivalGame
                  lastScore={guessData?.score || 0}
                  photoCount={photoCount}
                  totalScore={totalScore}
                  difficulty={difficulty!}
                  onReplay={onReplay}
                  onLeaderboardShow={() => setIsLeaderboardShown(true)}
                />
              );

            case "goal":
              return (
                <EndGoalGame
                  photoCount={photoCount}
                  totalScore={totalScore}
                  difficulty={difficulty!}
                  onReplay={onReplay}
                  onLeaderboardShow={() => setIsLeaderboardShown(true)}
                />
              );

            case "daily":
              return (
                <EndDailyGame
                  gameHistory={gameHistory}
                  nextDailyDate={nextDailyDate}
                  onLeaderboardShow={() => setIsLeaderboardShown(true)}
                />
              );
          }
        })()}
      </Modal>
    </div>
  );
}
