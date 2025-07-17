import type { MarioCharacter } from "@/types/characters";

import "./CharacterSelect.css";

const characters: Array<MarioCharacter | null> = [
  null,
  "mario",
  "luigi",
  "peach",
  "bowser",
] as const;

type Props = {
  defaultValue?: MarioCharacter | null;
};

export default function CharacterSelect({ defaultValue }: Props) {
  return (
    <div className="character-select">
      {characters.map((character) => {
        const characterId = character ?? "none";
        return (
          <div key={characterId} className="character-option-container">
            <input
              type="radio"
              name="mario-character"
              id={`character-${characterId}`}
              defaultChecked={defaultValue === character}
              value={characterId}
            />
            <div className="character-option">
              <div className="character-selector" />
              <label htmlFor={`character-${characterId}`}>
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
  );
}
