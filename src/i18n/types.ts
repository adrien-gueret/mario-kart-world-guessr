import type { ReactNode } from "react";
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
  "rules.mode.survival.title": string;
  "rules.mode.survival.description": string;
  "rules.mode.goal.title": string;
  "rules.mode.goal.description": string;
  "rules.mode.daily.title": string;
  "rules.mode.daily.description": string;
  "endGame.title": string;
  "endGame.titleScreen.label": string;
  "endGame.replay.label": string;
  "endGame.survival.description": (
    lastGuess: number,
    photoCount: number,
    totalScore: number
  ) => ReactNode;
  "endGame.goal.description": (photoCount: number) => ReactNode;
} & Partial<Record<Location["photoName"], string>>;

export type TranslationKey = keyof Texts;

export type Translations = Record<Locale, Texts>;

export type TranslationsContextType = {
  currentLocale: Locale;
  translate: <T extends TranslationKey>(key: T) => Texts[T];
};
