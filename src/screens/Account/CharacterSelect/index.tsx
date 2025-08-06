import { useEffect, useRef, useState } from "react";

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
    MarioCharacter[]
  >([]);

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
    <div className="character-select">
      {characters.map((character, index) => {
        const characterId = character ?? "none";

        const isUnlocked =
          characterId === "none" ||
          alwaysUnlockedCharacters.includes(characterId) ||
          charactersUnlockedData.includes(characterId);

        const id = `character-${isUnlocked ? characterId : "locked-" + index}`;

        return (
          <div
            key={characterId}
            className={`character-option-container ${
              isUnlocked ? "" : "locked"
            }`}
          >
            <input
              type="radio"
              name="mario-character"
              id={id}
              defaultChecked={defaultValue === character}
              value={characterId}
              disabled={!isUnlocked}
            />
            <div className="character-option">
              <div className="character-selector" />
              <label htmlFor={id}>
                <img
                  src={`./ui/characters/${
                    isUnlocked ? characterId : "locked"
                  }.png`}
                  alt={isUnlocked ? characterId : "locked"}
                />
              </label>
            </div>
          </div>
        );
      })}
    </div>
  );
}
