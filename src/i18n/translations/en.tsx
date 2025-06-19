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
  "game.globalScore": "Score: ",
  "upload.title": "Suggest a photo",
  "upload.description": "Send a photo to enrich the game!",
  "upload.step1.title": "1. Select your photo",
  "upload.step1.info1": (
    <>
      It must come from the <b>Nintendo Switch App</b>.
    </>
  ),
  "upload.step1.info2":
    "Note that your photo will go through a validation step before being visible in the game.",
  "upload.step2.title": "2. Where did you take this photo?",
  "upload.step2.info":
    "Click on the map to indicate the location of your photo. Be as precise as possible!",
  "upload.step2.help.label": "Show tracks and roads",
  "upload.step3.title": "3. Confirm your submission",
  "upload.step3.info":
    "By sending your photo, you agree that it will be used in the game.",
  "upload.form.submit.label": "Send",
  "upload.loading.title": "Sending...",
  "upload.loading.info": "Please wait while your photo is being sent.",
  "upload.error": "An error occurred...",
  "upload.error.missingFields": "Please fill in all the information.",
  "upload.error.invalidPhoto": (
    <>
      Only photos from the <b>Nintendo Switch App</b> application are accepted.
    </>
  ),
  "upload.error.serverError":
    "An error occurred while sending your photo. Please try again later.",
  "upload.success.title": "Photo sent!",
  "upload.success.info":
    "It will be visible after validation. Thank you for your contribution!",
};

export default en;
