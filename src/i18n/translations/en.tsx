import Anchor from "@/components/Anchor";
import type { GameMode, Difficulty } from "@/types/game";
import type { Version } from "@/versions/types";
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
  "difficulty.100cc.locked": (
    <ul>
      <li>
        Get <strong>any</strong> cup in <strong>50cc</strong> to unlock 100cc!
      </li>
    </ul>
  ),
  "difficulty.150cc.locked": (
    <ul>
      <li>
        Get <strong>any</strong> cup in <strong>100cc</strong> to unlock 150cc!
      </li>
    </ul>
  ),
  "difficulty.mirror.locked": (
    <ul>
      <li>
        Get the <strong>gold</strong> cup in <strong>50cc</strong>, at least the{" "}
        <strong>silver</strong> cup in <strong>100cc</strong> and{" "}
        <strong>any</strong> cup in <strong>150cc</strong> to unlock mirror
        mode!
      </li>
    </ul>
  ),
  "difficulty.survival.50cc": (
    <ul>
      <li>
        Game continues as long as you score <b>3000 points</b>
      </li>
      <li>
        The <b>easiest</b> photos
      </li>
      <li>The most lenient scoring system</li>
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
      <li>Moderate tolerance in score calculation</li>
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
      <li>The strictest scoring system</li>
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
      Game continues as long as you score <b>3000 points</b>.
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
      <li>The most lenient scoring system</li>
      <li>Option to display tracks on the map</li>
    </ul>
  ),
  "difficulty.goal.100cc": (
    <ul>
      <li>
        Most photos, <b>except</b> the most difficult ones
      </li>
      <li>Moderate tolerance in score calculation</li>
      <li>Option to display tracks on the map</li>
    </ul>
  ),
  "difficulty.goal.150cc": (
    <ul>
      <li>
        <b>ALL</b> photos, including the most difficult ones
      </li>
      <li>The strictest scoring system</li>
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
      The <b>easiest</b> photos and the most lenient scoring system.
    </>
  ),
  "difficulty.goal.100cc.short": (
    <>
      Most photos <b>except</b> the most difficult ones, and moderate tolerance
      in score calculation
    </>
  ),
  "difficulty.goal.150cc.short": (
    <>
      <b>ALL</b> photos, including the most difficult ones! And the strictest
      scoring system.
    </>
  ),
  "difficulty.goal.mirror.short": (
    <>
      <b>ALL</b> photos, including the most difficult ones! And the strictest
      scoring system.
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
  "leaderboard.tab.bots": "Mario & Co",
  "leaderboard.tab.allPlayers": "All Players",
  "leaderboard.congrats": "Congratulations!",
  "leaderboard.tooBad": "Too bad...",
  "leaderboard.needs.login": "To display your name in the leaderboard, log in!",
  "endGame.title": "Game over!",
  "endGame.title.leaderboard": "Leaderboard",
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
  "endGame.next-button.label": "Next",
  "endGame.see-leaderboards": "See whole leaderboard",
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
  "upload.title": "Submit a photo",
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
      Only photos from the <b>Nintendo Switch 2</b> sharing system are accepted.
    </>
  ),
  "upload.error.serverError":
    "An error occurred while sending your photo. Please try again later.",
  "upload.success.title": "Photo sent!",
  "upload.success.info":
    "It will be visible after validation. Thank you for your contribution!",
  "uploader.preview.remove": "Remove photo",
  "uploader.explanation":
    "Click on the cloud or drag and drop a photo to upload it.",
  "need.help": "Need help?",
  "photos.title": "All photos",
  "photos.description": (
    <>
      Discover all the photos of <b>Mario Kart World Guessr</b>!
    </>
  ),
  "photo.details.title": "Photo details",
  "photo.by": "Photo by",
  "login.screen.title": "Log in",
  "login.screen.description": (
    <>
      Choose the service you prefer to log in to <b>Mario Kart World Guessr</b>.
    </>
  ),
  "login.discord.label": "Log in with Discord",
  "logout.label": "Log out",
  "new-version.title": (version: Version) => `New version: ${version}`,
  "privacy-policies.title": "Privacy Policies",
  "terms-services.title": "Terms of Service",
  "see-release-notes.label": "See all release notes",
  "release-notes.title": "Release notes",
  "form.submit": "Submit",
  "account.title": "My account",
  "account.username.label": "Username",
  "account.username.helper":
    "Your can change your username. It's displayed to other players in leaderboards.",
  "account.locale.label": "Language",
  "account.locale.helper": "Language used for displaying game texts.",
  "account.save.success": "Changes saved successfully",
  "play.label": "Play",
  "account.marioCharacter.label": "Select your favorite character",
  "account.marioCharacter.helper":
    "It will appear in the pins you place on the map and next to your username in leaderboards.",
  "giveUp.label": "Give up",
  "giveUp.title": "Give up the game?",
  "giveUp.description":
    "Are you sure you want to give up the current game? Your score will not be recorded in the leaderboard.",
  "giveUp.confirm.cancel": "No, continue the game",
  "giveUp.confirm.accept": "Yes, stop",
  "home.menu.play.title": "Play",
  "home.menu.account.title": "My Account",
  "home.menu.leaderboards.title": "Leaderboards",
  "home.menu.upload.title": "Upload a photo",
  "leaderboards.description":
    "Check out the player leaderboards for all modes and difficulties! Will you make it to the top?",
  "leaderboards.mode": "Select a game mode",
  "leaderboards.difficulty": "Select a difficulty",
  "leaderboards.hide-anonymous": "Hide anonymous players",
  "leaderboards.not-logged-in": (
    <>
      You are not logged in. <a href="#/login">Log in</a> to see your score in
      the leaderboard.
    </>
  ),
  "leaderboards.currentUserScore": (
    gameMode: GameMode,
    gameDifficulty: Difficulty,
    photoCount: number,
    rank: number
  ) => (
    <>
      With your score of <b>{photoCount}</b> photo{photoCount > 1 ? "s" : ""},
      you are in{" "}
      {rank === 1 ? (
        <>
          <b>first</b> place
        </>
      ) : (
        <>
          <Anchor href={`#leaderboard-row-${rank}`}>#{rank}</Anchor> place
        </>
      )}{" "}
      in the <i>{en[`mode.${gameMode}.label`]}</i> mode at{" "}
      <b>{en[`difficulty.${gameDifficulty}.title`]}!</b>
    </>
  ),
  "leaderboards.not-played-yet": (
    gameMode: GameMode,
    gameDifficulty: Difficulty
  ) => (
    <>
      You haven't played the <i>{en[`mode.${gameMode}.label`]}</i> mode at{" "}
      <b>{en[`difficulty.${gameDifficulty}.title`]}</b> yet.
    </>
  ),
  //////
  "gold_50cc_survival.description":
    "You won the Gold Cup in Survival mode at 50cc!",
  "gold_50cc_survival.unlockedItem": "Daisy is unlocked!",
  "daisy.unlockClue": "Obtain the Gold Cup in Survival mode at 50cc.",

  "gold_100cc_survival.description":
    "You won the Gold Cup in Survival mode at 100cc!",
  "gold_100cc_survival.unlockedItem": "Yoshi is unlocked!",
  "green_yoshi.unlockClue": "Obtain the Gold Cup in Survival mode at 100cc.",

  "gold_150cc_survival.description":
    "You won the Gold Cup in Survival mode at 150cc!",
  "gold_150cc_survival.unlockedItem": "Wario is unlocked!",
  "wario.unlockClue": "Obtain the Gold Cup in Survival mode at 150cc.",

  "gold_mirror_survival.description":
    "You won the Gold Cup in Mirror Survival mode!",
  "gold_mirror_survival.unlockedItem": "Rosalina is unlocked!",
  "rosalina.unlockClue": "Obtain the Gold Cup in Mirror Survival mode.",

  "gold_50cc_goal.description": "You won the Gold Cup in Goal mode at 50cc!",
  "gold_50cc_goal.unlockedItem": "Donkey Kong is unlocked!",
  "dk.unlockClue": "Obtain the Gold Cup in Goal mode at 50cc.",

  "gold_100cc_goal.description": "You won the Gold Cup in Goal mode at 100cc!",
  "gold_100cc_goal.unlockedItem": "Toad is unlocked!",
  "toad.unlockClue": "Obtain the Gold Cup in Goal mode at 100cc.",

  "gold_150cc_goal.description": "You won the Gold Cup in Goal mode at 150cc!",
  "gold_150cc_goal.unlockedItem": "King Boo is unlocked!",
  "king_boo.unlockClue": "Obtain the Gold Cup in Goal mode at 150cc.",

  "gold_mirror_goal.description": "You won the Gold Cup in Mirror Goal mode!",
  "gold_mirror_goal.unlockedItem": "Pauline is unlocked!",
  "pauline.unlockClue": "Obtain the Gold Cup in Mirror Goal mode.",

  "5000_points.description":
    "You placed a photo exactly at the right location!",
  "5000_points.unlockedItem": "Shy Guy is unlocked!",
  "shyguy.unlockClue": "Place a photo exactly at the right location.",

  "4000_three_in_a_row.description":
    "You scored at least 4000 points three times in a row!",
  "4000_three_in_a_row.unlockedItem": "Lakitu is unlocked!",
  "lakitu.unlockClue": "Score at least 4000 points three times in a row.",
};

export default en;
