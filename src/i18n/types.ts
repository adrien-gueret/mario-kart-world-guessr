import type { LockedCharacter } from "@/types/characters";
import type { GameMode, Difficulty } from "@/types/game";
import type { Achievement } from "@/types/achievements";
import type { Version } from "@/versions/types";
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
  "difficulty.100cc.locked": ReactNode;
  "difficulty.150cc.locked": ReactNode;
  "difficulty.mirror.locked": ReactNode;
  "difficulty.mirror.title": string;
  "difficulty.survival.50cc": ReactNode;
  "difficulty.survival.100cc": ReactNode;
  "difficulty.survival.150cc": ReactNode;
  "difficulty.survival.mirror": ReactNode;
  "difficulty.survival.50cc.short": ReactNode;
  "difficulty.survival.100cc.short": ReactNode;
  "difficulty.survival.150cc.short": ReactNode;
  "difficulty.survival.mirror.short": ReactNode;
  "difficulty.goal.50cc": ReactNode;
  "difficulty.goal.100cc": ReactNode;
  "difficulty.goal.150cc": ReactNode;
  "difficulty.goal.mirror": ReactNode;
  "difficulty.goal.50cc.short": ReactNode;
  "difficulty.goal.100cc.short": ReactNode;
  "difficulty.goal.150cc.short": ReactNode;
  "difficulty.goal.mirror.short": ReactNode;
  "rules.title": string;
  "rules.description": string;
  "rules.mode.survival.title": string;
  "rules.mode.survival.description": string;
  "rules.mode.goal.title": string;
  "rules.mode.goal.description": string;
  "rules.mode.daily.title": string;
  "rules.mode.daily.description": string;
  "leaderboard.tab.bots": string;
  "leaderboard.tab.allPlayers": string;
  "leaderboard.congrats": string;
  "leaderboard.tooBad": string;
  "leaderboard.needs.login": string;
  "endGame.title": string;
  "endGame.title.leaderboard": string;
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
  "endGame.next-button.label": string;
  "endGame.see-leaderboards": string;
  "share.text.title": string;
  "share.copy.button.label": string;
  "share.copy.success": string;
  "share.share.button.label": string;
  "credits.by": string;
  "game.globalScore": string;
  "game.globalScore.photoIndex": string;
  "game.globalScore.showOtherPlayers": string;
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
  "upload.step3.info": string;
  "upload.form.submit.label": string;
  "upload.loading.title": string;
  "upload.loading.info": string;
  "upload.error": string;
  "upload.error.missingFields": string;
  "upload.error.invalidPhoto": ReactNode;
  "upload.error.serverError": string;
  "upload.success.title": string;
  "upload.success.info": string;
  "uploader.preview.remove": string;
  "uploader.explanation": string;
  "need.help": string;
  "photos.title": string;
  "photos.description": ReactNode;
  "photo.details.title": string;
  "photo.by": string;
  "login.screen.title": string;
  "login.screen.description": ReactNode;
  "login.discord.label": string;
  "logout.label": string;
  "new-version.title": (version: Version) => string;
  "privacy-policies.title": string;
  "terms-services.title": string;
  "see-release-notes.label": string;
  "release-notes.title": string;
  "form.submit": string;
  "account.title": string;
  "account.username.label": string;
  "account.username.helper": string;
  "account.locale.label": string;
  "account.locale.helper": string;
  "account.save.success": string;
  "account.tab.preferences": string;
  "account.tab.notifications": string;
  "account.tab.photos": string;
  "play.label": string;
  "account.marioCharacter.label": string;
  "account.marioCharacter.helper": string;
  "giveUp.label": string;
  "giveUp.title": string;
  "giveUp.description": string;
  "giveUp.confirm.cancel": string;
  "giveUp.confirm.accept": string;
  "home.menu.play.title": string;
  "home.menu.account.title": string;
  "home.menu.leaderboards.title": string;
  "home.menu.upload.title": string;
  "leaderboards.description": string;
  "leaderboards.mode": string;
  "leaderboards.difficulty": string;
  "leaderboards.hide-anonymous": string;
  "leaderboards.not-logged-in": ReactNode;
  "leaderboards.currentUserScore": (
    gameMode: GameMode,
    gameDifficulty: Difficulty,
    photoCount: number,
    rank: number
  ) => ReactNode;
  "leaderboards.not-played-yet": (
    gameMode: GameMode,
    gameDifficulty: Difficulty
  ) => ReactNode;
  "notifications.none": string;
  "notifications.title": string;
  "notifications.photo_validated.title": string;
  "notifications.photo_validated.description": string;
  "notifications.photo_refused.title": string;
  "notifications.photo_refused.description": (reason: string) => ReactNode;
  "notifications.deleting": string;
  "notification.delete": string;
  "photo.difficulty.easy": string;
  "photo.difficulty.medium": string;
  "photo.difficulty.hard": string;
  "photo.validation.pending": string;
  "account.photos.description": string;
  "account.photos.stats.title": string;
  "account.photos.stats.subtitle": string;
  "account.photos.stats.totalLabel": string;
  "account.photos.stats.suggestions": (count: number) => ReactNode;
  "account.your_photos.title": string;
} & {
  [K in Achievement as `${K}.unlockedItem`]: string;
} & {
  [K in Achievement as `${K}.description`]: string;
} & {
  [K in LockedCharacter as `${K}.unlockClue`]: string;
};

export type TranslationKey = keyof Texts;

export type Translations = Record<Locale, Texts>;

export type TranslationsContextType = {
  currentLocale: Locale;
  translate: <T extends TranslationKey>(key: T) => Texts[T];
  setCurrentLocale: (locale: Locale) => void;
};
