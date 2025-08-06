import { useEffect, useRef, useState } from "react";

import Snackbar from "@/components/Snackbar";
import { useTranslations } from "@/i18n";
import type { Locale } from "@/i18n/types";
import type { MarioCharacter } from "@/types/characters";
import fetchApi from "@/services/api";

import "./CharacterSelect.css";

const characters: Array<MarioCharacter | null> = [
  null,
  "mario",
  "luigi",
  "peach",
  "bowser",
  "daisy",
  "green_yoshi",
  "wario",
] as const;

const alwaysUnlockedCharacters: MarioCharacter[] = [
  "mario",
  "luigi",
  "peach",
  "bowser",
] as const;

type Props = {
  defaultValue?: MarioCharacter | null;
};

export default function CharacterSelect({ defaultValue }: Props) {
  const hasCalledApi = useRef(false);
  const [charactersUnlockedData, setCharactersUnlockedData] = useState<
    Array<{
      id: MarioCharacter;
      unlockClue: Record<Locale, string>;
      isUnlocked: boolean;
    }>
  >([]);
  const { currentLocale } = useTranslations();
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [infoMessage, setInfoMessage] = useState("");

  useEffect(() => {
    if (hasCalledApi.current) {
      return;
    }

    hasCalledApi.current = true;

    fetchApi("/characters", "GET")
      .then((response) => response.json())
      .then(setCharactersUnlockedData);
  }, []);

  return (
    <>
      <div className="character-select">
        {characters.map((character) => {
          const characterId = character ?? "none";

          const characterUnlockedData = charactersUnlockedData.find(
            ({ id }) => id === characterId
          );

          const isUnlocked =
            characterId === "none" ||
            alwaysUnlockedCharacters.includes(characterId) ||
            characterUnlockedData?.isUnlocked;

          const domId = `character-${characterId}`;

          const onMouseEnter = isUnlocked
            ? void 0
            : () => {
                setInfoMessage(
                  characterUnlockedData?.unlockClue[currentLocale] ?? ""
                );
                setIsInfoOpen(true);
              };
          const onMouseLeave = isUnlocked ? void 0 : () => setIsInfoOpen(false);

          return (
            <div
              key={characterId}
              className={`character-option-container ${
                isUnlocked ? "" : "locked"
              }`}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
            >
              <input
                type="radio"
                name="mario-character"
                id={domId}
                defaultChecked={defaultValue === character}
                value={characterId}
                disabled={!isUnlocked}
              />
              <div className="character-option">
                <div className="character-selector" />
                <label htmlFor={domId}>
                  <img
                    src={`./ui/characters/${characterId}.png`}
                    alt={characterId}
                  />
                </label>
              </div>
            </div>
          );
        })}
      </div>
      <Snackbar type="info" isOpen={isInfoOpen}>
        {infoMessage}
      </Snackbar>
    </>
  );
}
