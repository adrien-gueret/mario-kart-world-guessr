import type { Location } from "../data/locations";

export type Locale = "fr" | "en";

export type Texts = {
  "photo.subtitle": string;
  "clickMap.subtitle": string;
  "guess.label": string;
  "next.label": string;
  "distance.label": string;
  "distance.value": (distance: number) => string;
  "score.label": string;
  "score.value": (score: number) => string;
  "mode.goal.label": string;
  "mode.goal.description": string;
  "mode.survival.label": string;
  "mode.survival.description": string;
  "mode.daily.label": string;
  "mode.daily.description": string;
  "rules.title": string;
  "rules.description": string;
} & Partial<Record<Location["photoName"], string>>;

export type TranslationKey = keyof Texts;

export type Translations = Record<Locale, Texts>;

export type TranslationsContextType = {
  currentLocale: Locale;
  translate: <T extends TranslationKey>(key: T) => Texts[T];
};
