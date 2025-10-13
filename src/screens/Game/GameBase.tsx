import { useState, useCallback, useRef, useEffect } from "react";
import { SVGOverlay } from "react-leaflet";

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

import type { MarioCharacter } from "@/types/characters";
import type { Difficulty, GameMode } from "@/types/game";

import { useTranslations } from "@/i18n";

import { useScreen } from "../ScreensProvider";

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

  const [hasZoomOnFloatingPhoto, setHasZoomOnFloatingPhoto] = useState(false);

  const [currentGameId, setCurrentGameId] = useState<number | null>(null);
  const [currentPhotoId, setCurrentPhotoId] = useState<string | null>(null);
  const [nextPhotoId, setNextPhotoId] = useState<string | null>(null);
  const [currentPhotoAuthor, setCurrentPhotoAuthor] = useState<{
    id: number;
    name: string;
    character: MarioCharacter | null;
  } | null>(null);

  const [nextPhotoAuthor, setNextPhotoAuthor] = useState<{
    id: number;
    name: string;
    character: MarioCharacter | null;
  } | null>(null);
  const [hasRequestedGiveUp, setHasRequestedGiveUp] = useState(false);
  const [photoCount, setPhotoCount] = useState(0);
  const historyLength = useRef(0);
  const [totalScore, setTotalScore] = useState(0);
  const [cupData, setCupData] = useState<
    AddGuessResponse["gameData"]["cupData"] | null
  >(null);
  const [minimumScoreToContinue, setMinimumScoreToContinue] = useState<
    number | null
  >(null);
  const [showHarderGameStepModal, setShowHarderGameStepModal] = useState(false);
  const [gameHistory, setGameHistory] = useState<GameHistory>([]);
  const { setCurrentScreenName } = useScreen();

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

  const isGuessing = useRef(false);

  const { user } = useCurrentUser();

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
      setCurrentPhotoId(game.currentPhoto?.id || null);
      setCurrentPhotoAuthor(game.currentPhoto?.author || null);
      setTotalScore(game.totalScore);
      setPhotoCount(game.history.length + 1);
      historyLength.current = game.history.length;

      if (mode === "survival") {
        setMinimumScoreToContinue(game.minimumScoreToContinue);
      }

      const isFinished = !Boolean(game.currentPhoto?.id);

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
    setCurrentPhotoAuthor(nextPhotoAuthor);
    setPhotoCount(historyLength.current + 1);
    setNextPhotoId(null);
    setNextPhotoAuthor(null);
    setUserGuess(null);
    setGuessResults(null);

    if (photoSubtitleRef.current) {
      photoSubtitleRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [nextPhotoId, nextPhotoAuthor]);

  const handleConfirmGuess = async () => {
    if (!userGuess || !currentPhotoId || isGuessing.current) {
      return;
    }

    setHasZoomOnFloatingPhoto(false);

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

    isGuessing.current = true;

    const response = await fetchApi("/add-guess", "POST", formData);

    isGuessing.current = false;

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

    setNextPhotoId(addGuessResponse.gameData.nextPhoto?.id ?? null);
    setNextPhotoAuthor(
      addGuessResponse.gameData.nextPhoto
        ? addGuessResponse.gameData.nextPhoto.author
        : null
    );
    historyLength.current = addGuessResponse.gameData.history.length;
    setTotalScore(addGuessResponse.gameData.totalScore);

    setIsGameEnded(addGuessResponse.gameData.isFinished);
    setCupData(addGuessResponse.gameData.cupData);

    if (addGuessResponse.gameData.isFinished) {
      setGameHistory(addGuessResponse.gameData.history);
    } else {
      if (
        mode === "survival" &&
        addGuessResponse.gameData.minimumScoreToContinue !==
          minimumScoreToContinue
      ) {
        setMinimumScoreToContinue(
          addGuessResponse.gameData.minimumScoreToContinue
        );
        setShowHarderGameStepModal(true);
      }
    }
  };

  const giveUp = async () => {
    const formData = new FormData();
    formData.append("gameId", `${currentGameId}`);

    try {
      await fetchApi("/give-up", "PUT", formData);
    } catch (error) {}

    setCurrentScreenName("Home");
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
    chrono: {
      title: translate("rules.mode.chrono.title"),
      description: translate("rules.mode.chrono.description"),
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
                {mode === "survival"
                  ? translate("difficulty.survival.short")(
                      minimumScoreToContinue || 3000
                    )
                  : translate(`difficulty.${mode}.${difficulty}.short`)}
              </Text>
            </>
          )}
        </div>

        <div className="photo-container">
          <h2 ref={photoSubtitleRef}>{translate("photo.subtitle")}</h2>

          <Photo
            photoName={!currentPhotoId ? "" : currentPhotoId}
            isMirrored={difficulty === "mirror"}
            author={currentPhotoAuthor}
          />
        </div>

        <div className="game-map-container">
          <h2>{translate("clickMap.subtitle")}</h2>

          <Map
            key={currentPhotoId}
            canShowCourses={difficulty === "50cc" || difficulty === "100cc"}
            isMirrored={difficulty === "mirror"}
            shouldZoomOnDoubleClick
            onClick={
              canGuess
                ? (coordinates) => {
                    setUserGuess(coordinates);
                  }
                : undefined
            }
            flyTo={
              shouldShowAnswer &&
              currentLocationCoordinates &&
              currentLocationPlayersCoordinates
                ? currentLocationCoordinates
                : null
            }
          >
            {(bounds) => (
              <>
                {userGuess ? (
                  <>
                    {shouldShowAnswer &&
                      currentLocationCoordinates &&
                      currentLocationPlayersCoordinates && (
                        <>
                          <SVGOverlay
                            bounds={bounds}
                            attributes={{
                              viewBox: `0 0 ${MAP_SIZE_IN_PIXELS.width} ${MAP_SIZE_IN_PIXELS.height}`,
                              preserveAspectRatio: "none",
                            }}
                            interactive={false}
                          >
                            <Line
                              x1={userGuess.x}
                              y1={userGuess.y}
                              x2={currentLocationCoordinates.x}
                              y2={currentLocationCoordinates.y}
                            />
                          </SVGOverlay>
                          <Pin
                            x={currentLocationCoordinates.x}
                            y={currentLocationCoordinates.y}
                            variant="star"
                          />
                          {shouldShowOtherPlayersGuesses && (
                            <Pin
                              x={currentLocationPlayersCoordinates.x}
                              y={currentLocationPlayersCoordinates.y}
                              variant={
                                user.marioCharacter === "luigi"
                                  ? "mario"
                                  : user.marioCharacter
                              }
                            />
                          )}
                        </>
                      )}

                    <Pin
                      x={userGuess.x}
                      y={userGuess.y}
                      onDragEnd={setUserGuess}
                      variant={user.marioCharacter}
                    />
                  </>
                ) : null}
                {currentPhotoId && !shouldShowAnswer && (
                  <div
                    className={`floating-photo-container ${
                      hasZoomOnFloatingPhoto ? "zoomed" : ""
                    }`}
                    role="button"
                    onClick={() =>
                      setHasZoomOnFloatingPhoto(
                        canGuess && !hasZoomOnFloatingPhoto
                      )
                    }
                  >
                    <Photo
                      photoName={currentPhotoId}
                      isMirrored={difficulty === "mirror"}
                    />
                  </div>
                )}
              </>
            )}
          </Map>

          {shouldShowAnswer && (
            <GuessScore
              distance={guessResults!.distance}
              score={guessResults!.score}
              canShowPlayersCoordinates={canShowPlayersCoordinates}
              shouldShowPlayersCoordinates={shouldShowOtherPlayersGuesses}
              onShowPlayersCoordinatesChange={setShouldShowOtherPlayersGuesses}
            />
          )}
        </div>
      </div>

      <GlobalScore
        score={totalScore}
        photoIndex={photoCount}
        maxPhotos={mode === "daily" ? 5 : 0}
      />

      {userGuess && !shouldShowAnswer && !hasZoomOnFloatingPhoto && (
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
                  gameId={currentGameId!}
                  difficulty={difficulty!}
                  onReplay={onReplay}
                  onLeaderboardShow={() => setIsLeaderboardShown(true)}
                  cupData={cupData!}
                />
              );

            case "goal":
              return (
                <EndGoalGame
                  photoCount={photoCount}
                  gameId={currentGameId!}
                  difficulty={difficulty!}
                  onReplay={onReplay}
                  onLeaderboardShow={() => setIsLeaderboardShown(true)}
                  cupData={cupData!}
                />
              );

            case "chrono":
              return "TODO"; // TODO: EndChronoGame component to be implemented

            case "daily":
              return (
                <EndDailyGame
                  gameHistory={gameHistory}
                  gameId={currentGameId!}
                  onLeaderboardShow={() => setIsLeaderboardShown(true)}
                />
              );
          }
        })()}
      </Modal>

      {mode === "goal" ||
        (mode === "chrono" && (
          <>
            <Modal
              title={translate("giveUp.title")}
              isOpen={hasRequestedGiveUp}
              noDelay
            >
              <div className="give-up-modal-container">
                {translate("giveUp.description")}

                <div className="give-up-modal-buttons">
                  <Button onClick={giveUp} variant="secondary">
                    {translate("giveUp.confirm.accept")}
                  </Button>
                  <Button onClick={() => setHasRequestedGiveUp(false)}>
                    {translate("giveUp.confirm.cancel")}
                  </Button>
                </div>
              </div>
            </Modal>
            <Button
              onClick={() => setHasRequestedGiveUp(true)}
              variant="secondary"
            >
              {translate("giveUp.label")}
            </Button>
          </>
        ))}

      {mode === "survival" && (
        <Modal
          title={translate("survival.harderGame.title")}
          isOpen={showHarderGameStepModal}
          noDelay
          imageUrl="./ui/lakitu-go.png"
        >
          <div className="harder-game-modal-container">
            {translate("survival.harderGame.description")(
              minimumScoreToContinue!
            )}

            <div className="harder-game-modal-buttons">
              <Button
                onClick={() => setShowHarderGameStepModal(false)}
                variant="primary"
              >
                {translate("survival.harderGame.okButton")}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
