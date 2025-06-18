import type { Locale } from "../types";

import Button from "../../components/Button";

import "./LanguageSelector.css";

type Props = {
  value: Locale;
  onChange: (locale: Locale) => void;
};

export default function LanguageSelector({ value, onChange }: Props) {
  return (
    <Button
      className="language-selector"
      onClick={() => {
        onChange(value === "fr" ? "en" : "fr");
      }}
    >
      {value === "fr" ? "Français" : "English"}
    </Button>
  );
}
