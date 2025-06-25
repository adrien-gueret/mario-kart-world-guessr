import { useState, useEffect, useRef } from "react";

import Button from "@/components/Button";
import Map from "@/components/Map";
import Photo from "@/components/Photo";
import Loader from "@/components/Loader";

import fetchApi from "@/services/api";

import type { Coordinates } from "@/types/location";
import Pin from "@/components/Pin";
import { getRenderedCoordinatesFromRealCoordinates } from "@/services/coordinates";

type Props = {
  photoName: string;
  onClose: () => void;
};

type Guess = Coordinates & { id: number };

export default function PhotoDetails({ photoName, onClose }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const lastPhotoFetched = useRef<string | null>(null);
  const mapRef = useRef<HTMLImageElement>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    if (lastPhotoFetched.current === photoName) {
      return;
    }

    lastPhotoFetched.current = photoName;

    setIsLoading(true);

    fetchApi(`/get-guesses?id=${photoName}`)
      .then(async (response) => {
        const guesses = await response.json();

        setGuesses(guesses);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [photoName]);

  console.log("guesses", guesses);

  return (
    <div className="photo-details">
      <Photo photoName={photoName} />

      <div style={{ position: "relative", textAlign: "center" }}>
        <div style={{ display: isLoading ? "none" : "block" }}>
          <Map ref={mapRef} onLoad={() => setIsMapReady(true)} />
        </div>

        {isLoading || !isMapReady ? (
          <Loader />
        ) : (
          <>
            {guesses.map((guess) => {
              const renderedCoordinates =
                getRenderedCoordinatesFromRealCoordinates(
                  mapRef.current!,
                  guess
                );
              return (
                <Pin
                  key={guess.id}
                  x={renderedCoordinates.x}
                  y={renderedCoordinates.y}
                />
              );
            })}
          </>
        )}
      </div>

      <Button onClick={onClose}>Close</Button>
    </div>
  );
}
