import { useState, useEffect, useRef } from "react";

import Button from "@/components/Button";
import Map from "@/components/Map";
import Photo from "@/components/Photo";
import Loader from "@/components/Loader";

import { useTranslations } from "@/i18n";

import fetchApi from "@/services/api";

import type { Coordinates } from "@/types/location";
import Pin from "@/components/Pin";

type Props = {
  photoName: string;
  onClose: () => void;
};

type Guess = Coordinates & { id: number };

export default function PhotoDetails({ photoName, onClose }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const lastPhotoFetched = useRef<string | null>(null);
  const { translate } = useTranslations();

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

  return (
    <div className="photo-details">
      <Photo photoName={photoName} />

      <div style={{ position: "relative", textAlign: "center" }}>
        <Map>
          {isLoading ? (
            <Loader />
          ) : (
            guesses.map((guess) => (
              <Pin key={guess.id} x={guess.x} y={guess.y} />
            ))
          )}
        </Map>
      </div>

      <Button onClick={onClose}>{translate("close.label")}</Button>
    </div>
  );
}
