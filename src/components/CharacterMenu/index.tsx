import { useRefinementList } from "react-instantsearch";

import type { MarioCharacter } from "@/characters";
import { useTranslations } from "@/i18n";

import CharacterCheckbox from "../CharacterCheckbox";

import "./CharacterMenu.css";

export default function CharacterMenu() {
  const { translate } = useTranslations();
  const { items, refine, isShowingMore, toggleShowMore, canToggleShowMore } =
    useRefinementList({
      attribute: "characters",
      limit: 10,
      showMore: true,
      showMoreLimit: 100,
      operator: "and",
      sortBy: ["count:desc", "name:asc"],
    });

  return (
    <div className="character-menu">
      <div className="characters-checkboxes">
        {items.map((item) => (
          <CharacterCheckbox
            key={item.value}
            character={item.value as MarioCharacter}
            defaultChecked={item.isRefined}
            onChange={() => refine(item.value)}
            count={item.count}
          />
        ))}
      </div>

      {canToggleShowMore && (
        <button
          className="character-menu__show-more"
          disabled={!canToggleShowMore}
          onClick={toggleShowMore}
        >
          {translate(
            isShowingMore
              ? "photos.filter.less_characters"
              : "photos.filter.more_characters"
          )}
        </button>
      )}
    </div>
  );
}
