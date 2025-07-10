import { useState, useCallback, useRef, useEffect } from "react";
import type {
  AddGuessResponse,
  StartGameResponse,
  GameHistory,
} from "@/types/game";
import { type Coordinates } from "@/types/location";

import { MAP_SIZE_IN_PIXELS } from "@/services/coordinates";

import { useCurrentUser } from "@/auth/CurrentUserProvider";
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
  const hasBeenInit = useRef(false);

  const [currentGameId, setCurrentGameId] = useState<number | null>(null);
  const [currentPhotoId, setCurrentPhotoId] = useState<string | null>(null);
  const [nextPhotoId, setNextPhotoId] = useState<string | null>(null);
  const [photoCount, setPhotoCount] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [gameHistory, setGameHistory] = useState<GameHistory>([]);

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

  const [guessResults, setGuessResults] = useState<{
    distance: number;
    score: number;
  } | null>(null);

  const { isAnonymous } = useCurrentUser();

  const { translate } = useTranslations();

  const photoSubtitleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (hasBeenInit.current) {
      return;
    }

    hasBeenInit.current = true;

    const initGame = async () => {
      const formData = new FormData();
      formData.append("mode", mode);

      if (difficulty) {
        formData.append("difficulty", difficulty);
      }

      const response = await fetchApi("/start-game", "POST", formData);

      if (!response.ok) {
        throw new Error("Failed to start game.");
      }

      const game = (await response.json()) as StartGameResponse;

      setCurrentGameId(game.id);
      setCurrentPhotoId(game.currentPhotoId);
      setPhotoCount(game.history.length);
      setTotalScore(game.totalScore);

      const isFinished = game.currentPhotoId === null;

      if (isFinished) {
        setIsGameEnded(true);
        setGameHistory(game.history);
      }
    };

    initGame();
  }, [mode, difficulty]);

  const shouldShowAnswer = Boolean(guessResults);
  const canGuess = !shouldShowAnswer && !isGameEnded;

  const renderNextPhoto = useCallback(async () => {
    setCurrentPhotoId(nextPhotoId);
    setNextPhotoId(null);
    setUserGuess(null);
    setGuessResults(null);

    if (photoSubtitleRef.current) {
      photoSubtitleRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [nextPhotoId]);

  const handleConfirmGuess = async () => {
    if (!userGuess || !currentPhotoId) {
      return;
    }

    if (import.meta.env.DEV && isAnonymous) {
      if (
        !confirm(
          "You are in development mode without being connected! Do you want to continue?"
        )
      ) {
        throw new Error("Guess canceled.");
      }
    }

    const formData = new FormData();
    formData.append("photoId", currentPhotoId);
    formData.append(
      "x",
      `${
        difficulty === "mirror"
          ? MAP_SIZE_IN_PIXELS.width - userGuess.x
          : userGuess.x
      }`
    );
    formData.append("y", `${userGuess.y}`);

    formData.append("gameId", `${currentGameId}`);

    const response = await fetchApi("/add-guess2", "POST", formData);

    if (!response.ok) {
      throw new Error();
    }

    const addGuessResponse = (await response.json()) as AddGuessResponse;
    const coordinates = addGuessResponse.actualCoordinates;
    const playersCoordinates = addGuessResponse.playersMedianCoordinates;

    if (difficulty === "mirror") {
      coordinates.x = MAP_SIZE_IN_PIXELS.width - coordinates.x;
      playersCoordinates.x = MAP_SIZE_IN_PIXELS.width - playersCoordinates.x;
    }

    setCurrentLocationCoordinates(coordinates);
    setCurrentLocationPlayersCoordinates(playersCoordinates);

    const hasBeenGuessedMoreThan5Times =
      addGuessResponse.playersGuessCount >= 5;

    setCanShowPlayersCoordinates(hasBeenGuessedMoreThan5Times);

    if (!hasBeenGuessedMoreThan5Times) {
      setShouldShowOtherPlayersGuesses(false);
    }

    const { distanceInKm: distance, newScore } =
      addGuessResponse.currentPlayerGuess;

    setGuessResults({ distance, score: newScore });

    setNextPhotoId(addGuessResponse.gameData.nextPhotoId);
    setPhotoCount(addGuessResponse.gameData.history.length);
    setTotalScore(addGuessResponse.gameData.totalScore);

    setIsGameEnded(addGuessResponse.gameData.isFinished);

    if (addGuessResponse.gameData.isFinished) {
      setGameHistory(addGuessResponse.gameData.history);
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
            photoName={!currentPhotoId ? "" : currentPhotoId}
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
            {userGuess && (
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
                        distance={guessResults!.distance}
                        score={guessResults!.score}
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
        photoIndex={photoCount + 1}
        maxPhotos={mode === "daily" ? 5 : 0}
      />

      {userGuess && !shouldShowAnswer && (
        <StickyButtonContainer>
          <Button onClick={handleConfirmGuess}>
            {translate("guess.label")}
          </Button>
        </StickyButtonContainer>
      )}

      {shouldShowAnswer && !isGameEnded && (
        <StickyButtonContainer withDelay>
          <Button onClick={renderNextPhoto}>{translate("next.label")}</Button>
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
        isOpen={isGameEnded}
        disableSkew={mode === "daily" || isLeaderboardShown}
      >
        {(() => {
          switch (mode) {
            case "survival":
              return (
                <EndSurvivalGame
                  lastScore={guessResults?.score || 0}
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
                  /* TODO: handle nextDailyDate */
                  nextDailyDate={null}
                  onLeaderboardShow={() => setIsLeaderboardShown(true)}
                />
              );
          }
        })()}
      </Modal>
    </div>
  );
}
