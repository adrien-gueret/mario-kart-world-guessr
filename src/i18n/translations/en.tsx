import type { Texts } from "../types";

const kilometersToMiles = (km: number): string => {
  return (km * 0.621371).toFixed(2);
};

const en: Texts = {
  "photo.subtitle": "Where was this photo taken?",
  "clickMap.subtitle": "Click on the map to guess!",
  "guess.label": "Guess",
  "next.label": "Next",
  "distance.label": "Distance: ",
  "distance.value": (distance: number) =>
    `${kilometersToMiles(distance)} miles`,
  "score.label": "Score: ",
  "score.value": (score: number) => `+${score}`,
  "mode.select": "Select a game mode",
  "mode.goal.label": "Goal: 50,000",
  "mode.goal.description": "In how many photos will you reach 50,000 points?",
  "mode.survival.label": "Survival",
  "mode.survival.description":
    "Keep playing as long as you score at least 3000 points!",
  "mode.daily.label": "Daily Photos",
  "mode.daily.description": "Available soon!",
  //"Every day, a new selection of three photos: get a better score than your friends!",
  "rules.title": "Game Rules",
  "rules.description":
    "Click on the map to guess where the photo was taken. The closer you are, the more points you score, up to 5000 per photo!",
  "rules.mode.survival.title": "Survival Mode",
  "rules.mode.survival.description":
    "The game continues as long as you score at least 3000 points. How many photos can you guess?",
  "rules.mode.goal.title": "Goal 50,000 Mode",
  "rules.mode.goal.description":
    "Guess photos until you reach 50,000 points. How many photos will it take?",
  "rules.mode.daily.title": "Daily Photos Mode",
  "rules.mode.daily.description":
    "Get the best possible score on three daily photos!",
  "endGame.title": "Game over!",
  "endGame.titleScreen.label": "Home",
  "endGame.replay.label": "Replay",
  "endGame.survival.description": (
    lastGuess: number,
    photoCount: number,
    totalScore: number
  ) => (
    <>
      <p>
        With a score of <b>{lastGuess}</b>, your guess is too far...
      </p>
      <p>
        Your game ends after <b>{photoCount}</b> photo
        {photoCount > 1 ? "s" : ""}, for a total score of <b>{totalScore}</b>!
        Can you do better?
      </p>
    </>
  ),
  "endGame.goal.description": (photoCount: number) => (
    <>
      <p>You have reached the 50,000 points goal!</p>
      <p>
        You won at photo n°<b>{photoCount}</b>! Can you do better?
      </p>
    </>
  ),
  "credits.by": "A game by ",
};

export default en;
