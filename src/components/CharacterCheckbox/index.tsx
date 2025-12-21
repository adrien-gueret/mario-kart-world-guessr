import { useId } from "react";
import { type MarioCharacter } from "@/characters";
import { useTranslations } from "@/i18n";

import "./CharacterCheckbox.css";

type Props = {
  character: MarioCharacter;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  count?: number;
};

export default function CharacterCheckbox({
  character,
  defaultChecked = false,
  onChange,
  count,
}: Props) {
  const domId = useId();
  const { translate } = useTranslations();

  return (
    <>
      <input
        id={domId}
        name="characters[]"
        value={character}
        className="character-checkbox-real-input"
        type="checkbox"
        defaultChecked={defaultChecked}
        onChange={onChange ? (e) => onChange(e.target.checked) : undefined}
      />
      <label className="character-checkbox-container" htmlFor={domId}>
        <img
          className="character-checkbox-image"
          src={`./ui/pins/icon-${character}.png`}
          alt=""
        />
        {translate(`${character}.name`)}
        {count !== undefined && (
          <span className="character-checkbox-count">
            <span>{count}</span>
          </span>
        )}
      </label>
    </>
  );
}
