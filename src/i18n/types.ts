import type { LockedMarioCharacter, MarioCharacter } from "@/characters";
import type { GameMode, Difficulty } from "@/types/game";
import type { Achievement } from "@/types/achievements";
import type { PhotoFilter } from "@/types/photos";
import type { Version } from "@/versions/types";
import type { ReactNode } from "react";

export type Locale = "fr" | "en";

export type Texts = {
  "buy-me-coffee": string;
  "photo.subtitle": string;
  "clickMap.subtitle": string;
  "guess.label": string;
  "next.label": string;
  "close.label": string;
  "more.label": string;
  "distance.label": string;
  "score.label": string;
  "score.value": (score: number) => string;
  "mode.select": string;
  "mode.goal.label": string;
  "mode.goal.description": string;
  "mode.survival.label": string;
  "mode.survival.description": string;
  "mode.chrono.label": string;
  "mode.chrono.description": string;
  "mode.daily.label": string;
  "mode.daily.description": string;
  "mode.album.label": string;
  "mode.album.description": string;
  "choose.difficulty": string;
  "difficulty.label": string;
  "difficulty.50cc.title": string;
  "difficulty.100cc.title": string;
  "difficulty.150cc.title": string;
  "difficulty.mirror.locked": ReactNode;
  "difficulty.mirror.title": string;
  "difficulty.survival.50cc": ReactNode;
  "difficulty.survival.100cc": ReactNode;
  "difficulty.survival.150cc": ReactNode;
  "difficulty.survival.mirror": ReactNode;
  "difficulty.survival.short": (minimumScore: number) => ReactNode;
  "difficulty.goal.50cc": ReactNode;
  "difficulty.goal.100cc": ReactNode;
  "difficulty.goal.150cc": ReactNode;
  "difficulty.goal.mirror": ReactNode;
  "difficulty.goal.50cc.short": ReactNode;
  "difficulty.goal.100cc.short": ReactNode;
  "difficulty.goal.150cc.short": ReactNode;
  "difficulty.goal.mirror.short": ReactNode;
  "difficulty.chrono.50cc": ReactNode;
  "difficulty.chrono.100cc": ReactNode;
  "difficulty.chrono.150cc": ReactNode;
  "difficulty.chrono.mirror": ReactNode;
  "difficulty.chrono.50cc.short": ReactNode;
  "difficulty.chrono.100cc.short": ReactNode;
  "difficulty.chrono.150cc.short": ReactNode;
  "difficulty.chrono.mirror.short": ReactNode;
  "survival.harderGame.title": string;
  "survival.harderGame.description": (minimumScore: number) => ReactNode;
  "survival.harderGame.okButton": string;
  "rules.title": string;
  "rules.description": string;
  "rules.mode.survival.title": string;
  "rules.mode.survival.description": string;
  "rules.mode.goal.title": string;
  "rules.mode.goal.description": string;
  "rules.mode.chrono.title": string;
  "rules.mode.chrono.description": string;
  "rules.mode.daily.title": string;
  "rules.mode.daily.description": string;
  "rules.mode.album.title": string;
  "rules.mode.album.description": string;
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
    totalScore: number,
  ) => ReactNode;
  "endGame.goal.description": (photoCount: number) => ReactNode;
  "endGame.chrono.description": (score: number) => ReactNode;
  "endGame.daily.description": string;
  "endGame.daily.next": string;
  "endGame.album.description": string;
  "endGame.album.modified": string;
  "endGame.next-button.label": string;
  "endGame.see-leaderboards": string;
  "share.daily.title": string;
  "share.album.description.myself": string;
  "share.album.description.other": (authorName: string) => string;
  "share.copy.button.label": string;
  "share.copy.success": string;
  "share.share.button.label": string;
  "credits.by": string;
  "credits.followOn": (platform: string) => string;
  "global.see": string;
  "global.edit": string;
  "global.apply": string;
  "global.alpha": string;
  "global.none": string;
  "game.globalScore": string;
  "game.globalScore.photoIndex": string;
  "game.globalScore.showOtherPlayers": string;
  "game.chrono.timer": string;
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
  "photos.showMap": string;
  "photos.filter.by_characters": string;
  "photos.filter.more_characters": string;
  "photos.filter.less_characters": string;
  "photos.filter.clear_characters": string;
  "photo.details.title": string;
  "photo.by": string;
  "album.by": string;
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
  "form.confirm": string;
  "form.cancel": string;
  "account.title": string;
  "account.username.label": string;
  "account.username.helper": string;
  "account.locale.label": string;
  "account.locale.helper": string;
  "account.distanceUnit.label": string;
  "account.distanceUnit.km": string;
  "account.distanceUnit.miles": string;
  "account.distanceUnit.helper": string;
  "account.withSafeArea.label": string;
  "account.withSafeArea.helper": string;
  "account.save.success": string;
  "account.tab.preferences": string;
  "account.tab.notifications": string;
  "account.tab.photos": string;
  "account.tab.albums": string;
  "gallery.tab.photos": string;
  "gallery.tab.albums": string;
  "gallery.community-albums.description": string;
  "gallery.community-albums.empty": string;
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
  "home.menu.gallery.title": string;
  "leaderboards.description": string;
  "leaderboards.mode": string;
  "leaderboards.difficulty": string;
  "leaderboards.calendar": string;
  "leaderboards.hide-anonymous": string;
  "leaderboards.no_data": string;
  "leaderboards.not-logged-in": ReactNode;
  "leaderboards.currentUserScore": (
    gameMode: GameMode,
    gameDifficulty: Difficulty,
    photoCount: number,
    score: number,
    rank: number,
  ) => ReactNode;
  "leaderboards.daily.currentUserScore": (
    date: Date,
    score: number,
    rank: number,
  ) => ReactNode;
  "leaderboards.not-played-yet": (
    gameMode: GameMode,
    gameDifficulty: Difficulty,
  ) => ReactNode;
  "leaderboards.daily.not-played-yet": (date: Date) => ReactNode;
  "notifications.none": string;
  "notifications.title": string;
  "notifications.photo_validated.title": string;
  "notifications.photo_validated.description": string;
  "notifications.photo_refused.title": string;
  "notifications.photo_refused.description": (reason: string) => ReactNode;
  "notifications.deleting": string;
  "notification.delete": string;
  "notifications.clear_all": string;
  "photo.difficulty.easy": string;
  "photo.difficulty.medium": string;
  "photo.difficulty.hard": string;
  "photo.difficulty.all": string;
  "photo.difficulty.waiting": string;
  "photo.difficulty.waiting.tooltip": string;
  "photo.validation.pending": string;
  "photo.editCharacters.title": ReactNode;
  "photo.editCharacters.success": string;
  "account.photos.description": string;
  "account.photos.filter": string;
  "account.photos.stats.suggestions": (
    count: string,
    activeFilter: PhotoFilter,
  ) => ReactNode;
  "all-photos.stats.suggestions": (
    count: string,
    activeFilter: PhotoFilter,
  ) => ReactNode;
  "all-photos.title": string;
  "all-photos.description": ReactNode;
  "all-photos.empty": string;
  "all-photos.load_more": string;
  "all-photos.loading": string;
  "all-photos.photo_count": (count: number) => ReactNode;
  "all-photos.details.title": string;
  "all-photos.details.characters": string;
  "all-photos.details.no_characters": string;
  "account.your_photos.title": string;
  "account.albums.description": string;
  "account.albums.create.title": string;
  "account.albums.create.name": string;
  "account.albums.create.defaultName": string;
  "account.albums.create.success": string;
  "account.albums.delete.title": string;
  "account.albums.delete.warning": ReactNode;
  "account.albums.delete.success": string;
  "account.albums.background.title": string;
  "account.albums.background.color": string;
  "album.edit.name.success": string;
  "album.edit.photos.success": string;
  "album.edit.leaderboardReset.title": string;
  "album.edit.leaderboardReset.warning": string;
  "album.edit.photo.processing": string;
  "album.edit.back": string;
  "album.edit.this": string;
  "album.edit.publish": string;
  "album.edit.unpublish": string;
  "album.edit.publish.success": string;
  "album.edit.unpublish.success": string;
  "album.edit.background.pattern": string;
  "album.edit.background.color": string;
  "album.edit.background.preview": string;
  "album.edit.background.success": string;
  "album.status.published": ReactNode;
  "album.status.unpublished": string;
  "account.albums.delete.photo": string;
  "account.albums.move.photo": string;
  "account.albums.photo.select.title": string;
  "account.albums.photo.select.description": string;
  "account.albums.photo.select.none": string;
  "account.albums.no_photos": string;
  "album.create.myOwn": string;
  "album.play.button": string;
  "album.play.seeScore": string;
  "album.play.backToAlbum": string;
  "album.leaderboard.title": string;
  "album.leaderboard.empty": string;
  "error.title": string;
  "error.description": string;
  "error.button": string;
  "error.logoutWarning.title": string;
  "error.logoutWarning.description": string;
  "error.logoutWarning.button": string;
} & {
  [K in Achievement as `${K}.unlockedItem`]: string;
} & {
  [K in Achievement as `${K}.description`]: string;
} & {
  [K in LockedMarioCharacter as `${K}.unlockClue`]: string;
} & {
  [K in MarioCharacter as `${K}.name`]: string;
};

export type TranslationKey = keyof Texts;

export type Translations = Record<Locale, Texts>;

export type TranslationsContextType = {
  currentLocale: Locale;
  translate: <T extends TranslationKey>(key: T) => Texts[T];
  setCurrentLocale: (locale: Locale) => void;
};
