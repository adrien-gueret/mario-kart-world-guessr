import type { Locale } from "../types";

import "./LanguageSelector.css";

type Props = {
  value: Locale;
  onChange: (locale: Locale) => void;
};

export default function LanguageSelector({ value, onChange }: Props) {
  return (
    <button
      className="language-selector"
      onClick={() => {
        onChange(value === "fr" ? "en" : "fr");
      }}
    >
      {value === "fr" ? "Français" : "English"}
    </button>
  );
}
