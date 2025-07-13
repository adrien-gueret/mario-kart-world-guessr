import Button from "@/components/Button";

import type { Locale } from "../types";

type Props = {
  value: Locale;
  onChange: (locale: Locale) => void;
};

export default function LanguageSelector({ value, onChange }: Props) {
  return (
    <Button
      variant="secondary"
      className="language-selector"
      onClick={() => {
        onChange(value === "fr" ? "en" : "fr");
      }}
    >
      {value === "fr" ? "Français" : "English"}
    </Button>
  );
}
