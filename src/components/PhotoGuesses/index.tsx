import { useState, useEffect, useRef } from "react";

import fetchApi from "@/services/api";

import type { Coordinates } from "@/types/location";

import Map from "../Map";
import Pin from "../Pin";
import Loader from "../Loader";

type Props = {
  photoId: string;
};

type Guess = Coordinates & { id: number; isAnswer: 0 | 1 };

export default function PhotoGuesses({ photoId }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const lastPhotoFetched = useRef<string | null>(null);

  useEffect(() => {
    if (lastPhotoFetched.current === photoId) {
      return;
    }

    lastPhotoFetched.current = photoId;

    setIsLoading(true);

    fetchApi(`/get-guesses?id=${photoId}`)
      .then(async (response) => {
        const guesses = await response.json();

        setGuesses(guesses);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [photoId]);

  return (
    <div className="photo-details">
      <div style={{ position: "relative", textAlign: "center", width: "100%" }}>
        <Map
          shouldZoomOnDoubleClick
          size={{
            height: "60vh",
            width: "45vw",
          }}
        >
          {isLoading ? (
            <Loader />
          ) : (
            guesses.map((guess) => (
              <Pin
                key={guess.id}
                x={guess.x}
                y={guess.y}
                variant={guess.isAnswer ? "star" : null}
                zIndex={guess.isAnswer ? 9999 : undefined}
              />
            ))
          )}
        </Map>
      </div>
    </div>
  );
}
