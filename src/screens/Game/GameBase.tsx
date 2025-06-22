import { useState, useCallback, useRef, useEffect } from "react";
import { type Coordinates, type LocationFull } from "@/types/location";

import {
  bottomCenterTopTopLeft,
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

import type { GameMode } from "@/types/game";

import { useTranslations } from "@/i18n";

import useGame from "./hooks/useGame";

import { useScreen } from "../ScreensProvider";

import EndDailyGame from "./daily/End";

import "./Game.css";

type Props = {
  mode: GameMode;
  onReplay: () => void;
};

export default function Game({ mode, onReplay }: Props) {
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
  } = useGame(mode);

  const [currentLocationCoordinates, setCurrentLocationCoordinates] =
    useState<Coordinates | null>(null);

  const [userGuess, setUserGuess] = useState<{
    realCoordinates: Coordinates;
    renderedCoordinates: Coordinates;
  } | null>(null);
  const [photoCount, setPhotoCount] = useState<number>(1);
  const [isGameEnded, setIsGameEnded] = useState<boolean>(false);

  const isGameOver = isGameEnded || hasReachedLimit;

  const [totalScore, setTotalScore] = useState<number>(0);
  const [guessData, setGuessData] = useState<{
    distance: number;
    score: number;
  } | null>(null);

  const mapRef = useRef<HTMLImageElement>(null);
  const photoSubtitleRef = useRef<HTMLHeadingElement>(null);

  const shouldShowAnswer = Boolean(guessData);
  const canGuess = !shouldShowAnswer && !isGameOver;

  const requestNextPhoto = useCallback(
    async (shouldScroll = false) => {
      await getNextLocation();

      setUserGuess(null);
      setGuessData(null);
      setPhotoCount((prevCount) => prevCount + 1);

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
      formData.append("x", `${userGuess.realCoordinates.x}`);
      formData.append("y", `${userGuess.realCoordinates.y}`);
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
      userGuess.realCoordinates,
      coordinates
    );

    addScoreInHistory(newScore);

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

  const currentLocationRenderedCoordinates = currentLocationCoordinates
    ? mapRef.current
      ? getRenderedCoordinatesFromRealCoordinates(
          mapRef.current,
          currentLocationCoordinates
        )
      : currentLocationCoordinates
    : { x: 0, y: 0 };

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
      <Button
        className="game-back-button"
        onClick={() => setCurrentScreenName("Title")}
        variant="secondary"
      >
        {translate("home.button")}
      </Button>

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
              position: "relative",
              pointerEvents: canGuess ? "auto" : "none",
            }}
          >
            <Map
              onClick={({ realCoordinates, renderedCoordinates }) => {
                setUserGuess({ realCoordinates, renderedCoordinates });
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
              return <EndDailyGame gameHistory={gameHistory} />;
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
