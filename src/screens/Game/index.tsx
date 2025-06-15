import { useState, useCallback } from "react";
import getRandomLocation, {
  type Location,
  type LocationBase,
} from "../../data/locations";

import {
  bottomCenterTopTopLeft,
  distanceBetweenCoordinatesInKilometers,
} from "../../services/coordinatesTransformer";

import Button from "../../components/Button";
import StickyButtonContainer from "../../components/StickyButtonContainer";
import GlobalScore from "../../components/GlobalScore";
import GuessScore from "../../components/GuessScore";
import Map from "../../components/Map";
import Pin from "../../components/Pin";
import Line from "../../components/Line";
import Photo from "../../components/Photo";

import { useTranslations } from "../../i18n";

function Game() {
  const { translate } = useTranslations();
  const [currentLocation, setCurrentLocation] = useState<Location>(() =>
    getRandomLocation()
  );
  const [userGuess, setUserGuess] = useState<
    LocationBase["coordinates"] | null
  >(null);

  const [totalScore, setTotalScore] = useState<number>(0);
  const [guessData, setGuessData] = useState<{
    distance: number;
    score: number;
  } | null>(null);

  const shouldShowAnswer = Boolean(guessData);
  const canGuess = !shouldShowAnswer;

  const nextPhoto = useCallback(() => {
    let nextLocation: Location;

    do {
      nextLocation = getRandomLocation();
    } while (nextLocation.photoName === currentLocation?.photoName);

    setCurrentLocation(nextLocation);
    setUserGuess(null);
    setGuessData(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentLocation.photoName]);

  const handleMapClick = (coordinates: LocationBase["coordinates"]) => {
    const { x, y } = coordinates;

    setUserGuess({ x, y });

    if (process.env.NODE_ENV === "development") {
      console.log({ x, y });
    }
  };

  const handleConfirmGuess = () => {
    if (!userGuess) {
      return;
    }
    const distance = distanceBetweenCoordinatesInKilometers(
      userGuess,
      currentLocation.coordinates
    );

    const newScore = Math.ceil(5000 * Math.exp((-10 * distance) / 13.4));

    setGuessData({ distance, score: newScore });
    setTotalScore((prevScore) => prevScore + newScore);
  };

  const userGuessPinPosition = userGuess
    ? bottomCenterTopTopLeft(userGuess)
    : null;

  const currentLocationPinPosition = bottomCenterTopTopLeft(
    currentLocation.coordinates
  );

  return (
    <div className="game-screen">
      <div className="game-area">
        <div className="photo-container">
          <h2>{translate("photo.subtitle")}</h2>

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
            <Map onClick={handleMapClick} />

            {userGuessPinPosition &&
              userGuess &&
              currentLocationPinPosition &&
              currentLocation && (
                <>
                  {shouldShowAnswer && (
                    <>
                      <Line
                        x1={userGuess.x}
                        y1={userGuess.y}
                        x2={currentLocation.coordinates.x}
                        y2={currentLocation.coordinates.y}
                      />
                      <Pin
                        x={currentLocationPinPosition.x}
                        y={currentLocationPinPosition.y}
                        variant="star"
                      />
                      <GuessScore
                        distance={guessData!.distance}
                        score={guessData!.score}
                        x1={userGuess.x}
                        y1={userGuess.y}
                        x2={currentLocation.coordinates.x}
                        y2={currentLocation.coordinates.y}
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

      {shouldShowAnswer && (
        <StickyButtonContainer withDelay>
          <Button onClick={nextPhoto}>{translate("next.label")}</Button>
        </StickyButtonContainer>
      )}
    </div>
  );
}

export default Game;
