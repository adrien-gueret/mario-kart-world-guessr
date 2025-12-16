import { useEffect, useRef, useState } from "react";

import Snackbar from "@/components/Snackbar";
import { useTranslations } from "@/i18n";
import type { UsableMarioCharacter, LockedMarioCharacter } from "@/characters";
import fetchApi from "@/services/api";

import "./CharacterSelect.css";

type Props = {
  defaultValue?: UsableMarioCharacter | null;
};

export default function CharacterSelect({ defaultValue }: Props) {
  const hasCalledApi = useRef(false);
  const [charactersData, setCharactersData] = useState<
    Array<{
      id: UsableMarioCharacter;
      isUnlocked: boolean;
    }>
  >([
    { id: "mario", isUnlocked: true },
    { id: "luigi", isUnlocked: true },
    { id: "peach", isUnlocked: true },
    { id: "bowser", isUnlocked: true },
  ]);
  const { translate } = useTranslations();
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [infoMessage, setInfoMessage] = useState("");

  useEffect(() => {
    if (hasCalledApi.current) {
      return;
    }

    hasCalledApi.current = true;

    fetchApi("/characters", "GET")
      .then((response) => response.json())
      .then(setCharactersData);
  }, []);

  return (
    <>
      <div className="character-select">
        {[{ id: "none", isUnlocked: true }, ...charactersData].map(
          ({ id: characterId, isUnlocked }) => {
            const domId = `character-${characterId}`;

            const onMouseEnter = isUnlocked
              ? void 0
              : () => {
                  setInfoMessage(
                    translate(
                      `${characterId as LockedMarioCharacter}.unlockClue`
                    )
                  );
                  setIsInfoOpen(true);
                };
            const onMouseLeave = isUnlocked
              ? void 0
              : () => setIsInfoOpen(false);

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
                  defaultChecked={
                    defaultValue === characterId ||
                    (!defaultValue && characterId === "none")
                  }
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
          }
        )}
      </div>
      <Snackbar type="info" isOpen={isInfoOpen}>
        {infoMessage}
      </Snackbar>
    </>
  );
}
