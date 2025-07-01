import type { Texts } from "../types";

const kilometersToMiles = (km: number): string => {
  return (km * 0.621371).toFixed(2);
};

const en: Texts = {
  "photo.subtitle": "Where was this photo taken?",
  "clickMap.subtitle": "Click on the map to guess!",
  "guess.label": "Guess",
  "next.label": "Next",
  "close.label": "Close",
  "more.label": "More",
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
    "Keep playing as long as you score enough points!",
  "mode.daily.label": "Daily Photos",
  "mode.daily.description":
    "Every day, a new selection of five photos: get a better score than your friends!",
  "choose.difficulty": "Choose difficulty",
  "difficulty.label": "Difficulty: ",
  "difficulty.50cc.title": "50cc",
  "difficulty.100cc.title": "100cc",
  "difficulty.150cc.title": "150cc",
  "difficulty.mirror.title": "Mirror",
  "difficulty.survival.50cc": (
    <ul>
      <li>
        Game continues as long as you score <b>2500 points</b>
      </li>
      <li>
        The <b>easiest</b> photos
      </li>
      <li>Option to display tracks on the map</li>
    </ul>
  ),
  "difficulty.survival.100cc": (
    <ul>
      <li>
        Game continues as long as you score <b>3000 points</b>
      </li>
      <li>
        Most photos, <b>except</b> the most difficult ones
      </li>
      <li>Option to display tracks on the map</li>
    </ul>
  ),
  "difficulty.survival.150cc": (
    <ul>
      <li>
        Game continues as long as you score <b>3500 points</b>
      </li>
      <li>
        <b>ALL</b> photos, including the most difficult ones
      </li>
      <li>Cannot display tracks on the map</li>
    </ul>
  ),
  "difficulty.survival.mirror": (
    <ul>
      <li>Same as 150cc but...</li>
      <li>
        <b>Photos and map are mirrored!</b>
      </li>
    </ul>
  ),
  "difficulty.survival.50cc.short": (
    <>
      Game continues as long as you score <b>2500 points</b>.
    </>
  ),
  "difficulty.survival.100cc.short": (
    <>
      Game continues as long as you score <b>3000 points</b>.
    </>
  ),
  "difficulty.survival.150cc.short": (
    <>
      Game continues as long as you score <b>3500 points</b>.
    </>
  ),
  "difficulty.survival.mirror.short": (
    <>
      Game continues as long as you score <b>3500 points</b>.
    </>
  ),
  "difficulty.goal.50cc": (
    <ul>
      <li>
        The <b>easiest</b> photos
      </li>
      <li>Option to display tracks on the map</li>
    </ul>
  ),
  "difficulty.goal.100cc": (
    <ul>
      <li>
        Most photos, <b>except</b> the most difficult ones
      </li>
      <li>Option to display tracks on the map</li>
    </ul>
  ),
  "difficulty.goal.150cc": (
    <ul>
      <li>
        <b>ALL</b> photos, including the most difficult ones
      </li>
      <li>Tracks not displayed on the map</li>
    </ul>
  ),
  "difficulty.goal.mirror": (
    <ul>
      <li>Same as 150cc but...</li>
      <li>
        <b>Photos and map are mirrored!</b>
      </li>
    </ul>
  ),
  "difficulty.goal.50cc.short": (
    <>
      The <b>easiest</b> photos!
    </>
  ),
  "difficulty.goal.100cc.short": (
    <>
      Most photos, <b>except</b> the most difficult ones.
    </>
  ),
  "difficulty.goal.150cc.short": (
    <>
      <b>ALL</b> photos, including the most difficult ones!
    </>
  ),
  "difficulty.goal.mirror.short": (
    <>
      <b>ALL</b> photos, including the most difficult ones!
    </>
  ),
  "rules.title": "Game Rules",
  "rules.description":
    "Click on the map to guess where the photo was taken. The closer you are, the more points you score, up to 5000 per photo!",
  "rules.mode.survival.title": "Survival Mode",
  "rules.mode.survival.description":
    "Keep playing as long as you score enough points each round. How many photos can you guess?",
  "rules.mode.goal.title": "Goal 50,000 Mode",
  "rules.mode.goal.description":
    "Guess photos until you reach 50,000 points. How many photos will it take?",
  "rules.mode.daily.title": "Daily Photos Mode",
  "rules.mode.daily.description":
    "Get the best possible score on five daily photos!",
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
  "endGame.daily.description":
    "You have finished locating all 5 photos of the day!",
  "endGame.daily.next": "Next daily photos in: ",
  "share.text.title": "Mario Kart World Guessr - Daily Photos",
  "share.copy.button.label": "Copy",
  "share.copy.success": "Copied to clipboard",
  "share.share.button.label": "Share",
  "credits.by": "A game by ",
  "game.globalScore": "Score: ",
  "game.globalScore.photoIndex": "Photo n°",
  "game.globalScore.showOtherPlayers":
    "Show the median location of all players",
  "home.button": "Home",
  "upload.title": "Suggest a photo",
  "upload.description": "Send a photo to enrich the game!",
  "upload.step1.title": "1. Select your photo",
  "upload.step1.info1": (
    <>
      It must come from the <b>Nintendo Switch 2</b> sharing system.
    </>
  ),
  "upload.step1.info2":
    "Note that your photo will go through a validation step before being visible in the game.",
  "upload.step2.title": "2. Where did you take this photo?",
  "upload.step2.info":
    "Click on the map to indicate the location of your photo. Be as precise as possible!",
  "upload.step2.help.label": "Show tracks and roads",
  "upload.step3.title": "3. Optional: log in",
  "upload.step3.info": (
    <>
      This step is <b>optional</b>; you can publish your photo without logging
      in.
    </>
  ),
  "upload.step3.login.info": (userEmail: string) => (
    <>
      You are currently logged in via <b>Google</b> with your email{" "}
      <b>{userEmail}</b> (
      <i>
        this email will <b>not</b> be public
      </i>
      ).
    </>
  ),
  "upload.step3.logout.label": "Log out",
  "upload.step3.or": "or",
  "upload.step3.authorName.label": (userName: string) => (
    <>
      Display <b>{userName}</b>
    </>
  ),
  "upload.step3.authorName.anonymous": "Do not display my name",
  "upload.step3.shouldBeNotified.label":
    "Notify me by email when my photo is validated",
  "upload.step4.title": "4. Confirm your submission",
  "upload.step4.info":
    "By sending your photo, you agree that it will be used in the game.",
  "upload.form.submit.label": "Send",
  "upload.loading.title": "Sending...",
  "upload.loading.info": "Please wait while your photo is being sent.",
  "upload.error": "An error occurred...",
  "upload.error.missingFields": "Please fill in all the information.",
  "upload.error.invalidPhoto": (
    <>
      Only photos from the <b>Nintendo Switch 2</b> sharing system are accepted.
    </>
  ),
  "upload.error.serverError":
    "An error occurred while sending your photo. Please try again later.",
  "upload.success.title": "Photo sent!",
  "upload.success.info":
    "It will be visible after validation. Thank you for your contribution!",
  "photos.title": "All photos",
  "photos.description": (
    <>
      Discover all the photos of <b>Mario Kart World Guessr</b>!
    </>
  ),
  "photo.details.title": "Photo details",
};

export default en;
