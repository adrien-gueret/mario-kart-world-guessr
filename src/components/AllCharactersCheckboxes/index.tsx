import { allCharacters, type MarioCharacter } from "@/characters";

import CharacterCheckbox from "../CharacterCheckbox";

import "./AllCharactersCheckboxes.css";

type Props = {
  defaultSelectedCharacters?: MarioCharacter[];
};

export default function AllCharactersCheckboxes({
  defaultSelectedCharacters = [],
}: Props) {
  return (
    <div className="characters-checkboxes">
      {allCharacters.map((character) => (
        <CharacterCheckbox
          key={character}
          character={character}
          defaultChecked={defaultSelectedCharacters.includes(character)}
        />
      ))}
    </div>
  );
}
