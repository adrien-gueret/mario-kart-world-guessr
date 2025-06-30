import type { ReactNode } from "react";

export type Locale = "fr" | "en";

export type Texts = {
  "photo.subtitle": string;
  "clickMap.subtitle": string;
  "guess.label": string;
  "next.label": string;
  "close.label": string;
  "more.label": string;
  "distance.label": string;
  "distance.value": (distance: number) => string;
  "score.label": string;
  "score.value": (score: number) => string;
  "mode.select": string;
  "mode.goal.label": string;
  "mode.goal.description": string;
  "mode.survival.label": string;
  "mode.survival.description": string;
  "mode.daily.label": string;
  "mode.daily.description": string;
  "choose.difficulty": string;
  "difficulty.label": string;
  "difficulty.50cc.title": string;
  "difficulty.100cc.title": string;
  "difficulty.150cc.title": string;
  "difficulty.mirror.title": string;
  "difficulty.survival.50cc": ReactNode;
  "difficulty.survival.100cc": ReactNode;
  "difficulty.survival.150cc": ReactNode;
  "difficulty.survival.mirror": ReactNode;
  "difficulty.survival.50cc.short": ReactNode;
  "difficulty.survival.100cc.short": ReactNode;
  "difficulty.survival.150cc.short": ReactNode;
  "difficulty.survival.mirror.short": ReactNode;
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
  "endGame.daily.description": string;
  "endGame.daily.next": string;
  "share.text.title": string;
  "share.copy.button.label": string;
  "share.copy.success": string;
  "share.share.button.label": string;
  "credits.by": string;
  "game.globalScore": string;
  "game.globalScore.photoIndex": string;
  "home.button": string;
  "upload.title": string;
  "upload.description": string;
  "upload.step1.title": string;
  "upload.step1.info1": ReactNode;
  "upload.step1.info2": string;
  "upload.step2.title": string;
  "upload.step2.info": string;
  "upload.step2.help.label": string;
  "upload.step3.title": string;
  "upload.step3.info": ReactNode;
  "upload.step3.login.info": (userEmail: string) => ReactNode;
  "upload.step3.logout.label": string;
  "upload.step3.or": string;
  "upload.step3.authorName.label": (userName: string) => ReactNode;
  "upload.step3.authorName.anonymous": string;
  "upload.step3.shouldBeNotified.label": string;
  "upload.step4.title": string;
  "upload.step4.info": string;
  "upload.form.submit.label": string;
  "upload.loading.title": string;
  "upload.loading.info": string;
  "upload.error": string;
  "upload.error.missingFields": string;
  "upload.error.invalidPhoto": ReactNode;
  "upload.error.serverError": string;
  "upload.success.title": string;
  "upload.success.info": string;
  "photos.title": string;
  "photos.description": ReactNode;
  "photo.details.title": string;
};

export type TranslationKey = keyof Texts;

export type Translations = Record<Locale, Texts>;

export type TranslationsContextType = {
  currentLocale: Locale;
  translate: <T extends TranslationKey>(key: T) => Texts[T];
};
