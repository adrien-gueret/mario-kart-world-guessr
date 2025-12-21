import { useId } from "react";
import { type MarioCharacter } from "@/characters";
import { useTranslations } from "@/i18n";

import "./CharacterCheckbox.css";

type Props = {
  character: MarioCharacter | "none";
  defaultChecked?: boolean;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  count?: number;
};

export default function CharacterCheckbox({
  character,
  defaultChecked,
  checked,
  onChange,
  count,
}: Props) {
  const domId = useId();
  const { translate } = useTranslations();

  const isNone = character === "none";

  return (
    <>
      <input
        id={domId}
        name="characters[]"
        value={character}
        className="character-checkbox-real-input"
        type="checkbox"
        defaultChecked={defaultChecked}
        checked={checked}
        onChange={onChange ? (e) => onChange(e.target.checked) : undefined}
      />
      <label className="character-checkbox-container" htmlFor={domId}>
        <img
          className="character-checkbox-image"
          src={
            isNone
              ? "./ui/characters/none.png"
              : `./ui/pins/icon-${character}.png`
          }
          alt=""
        />
        {isNone ? translate("global.none") : translate(`${character}.name`)}
        {count !== undefined && (
          <span className="character-checkbox-count">
            <span>{count}</span>
          </span>
        )}
      </label>
    </>
  );
}
