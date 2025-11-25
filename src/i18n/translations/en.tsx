import Anchor from "@/components/Anchor";
import type { GameMode, Difficulty } from "@/types/game";
import type { Version } from "@/versions/types";
import type { Texts } from "../types";

const en: Texts = {
  "buy-me-coffee": "Buy me a coffee",
  "photo.subtitle": "Where was this photo taken?",
  "clickMap.subtitle": "Click on the map to guess!",
  "guess.label": "Guess",
  "next.label": "Next",
  "close.label": "Close",
  "more.label": "More",
  "distance.label": "Distance: ",
  "score.label": "Score: ",
  "score.value": (score: number) => `+${score}`,
  "mode.select": "Select a game mode",
  "mode.goal.label": "Goal: 50,000",
  "mode.goal.description": "In how many photos will you reach 50,000 points?",
  "mode.chrono.label": "Chrono",
  "mode.chrono.description":
    "Score as many points as possible within a time limit!",
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
  "difficulty.mirror.locked": (
    <ul>
      <li>
        Get <strong>any</strong> cup in <strong>150cc</strong> to unlock mirror
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
        Game continues as long as you score <b>3250 points</b>
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
  "difficulty.survival.short": (minimumScore: number) => (
    <>
      Game continues as long as you score <b>{minimumScore} points</b>.
      <br />
      {minimumScore < 4500 ? (
        <>This threshold increases every eight photos played (up to 4500).</>
      ) : (
        <>
          This threshold will no longer increase — keep surviving for as long as
          you can!
        </>
      )}
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
  "difficulty.chrono.50cc": (
    <ul>
      <li>
        Score the most points in <b>5 minutes</b>
      </li>
      <li>
        Gain <b>15</b> seconds each time you score 4000 points
      </li>
      <li>
        The <b>easiest</b> photos
      </li>
      <li>The most lenient scoring system</li>
      <li>Option to display tracks on the map</li>
    </ul>
  ),
  "difficulty.chrono.100cc": (
    <ul>
      <li>
        Score the most points in <b>4 minutes</b>
      </li>
      <li>
        Gain <b>10</b> seconds each time you score 4000 points
      </li>
      <li>
        Most photos, <b>except</b> the most difficult ones
      </li>
      <li>Moderate tolerance in score calculation</li>
      <li>Option to display tracks on the map</li>
    </ul>
  ),
  "difficulty.chrono.150cc": (
    <ul>
      <li>
        Score the most points in <b>3 minutes</b>
      </li>
      <li>
        Gain <b>5</b> seconds each time you score 4000 points
      </li>
      <li>
        <b>ALL</b> photos, including the most difficult ones
      </li>
      <li>The strictest scoring system</li>
      <li>Tracks not displayed on the map</li>
    </ul>
  ),
  "difficulty.chrono.mirror": (
    <ul>
      <li>Same as 150cc but...</li>
      <li>
        <b>Photos and map are mirrored!</b>
      </li>
    </ul>
  ),
  "difficulty.chrono.50cc.short": (
    <>
      Score the most points in <b>5 minutes</b>.<br />
      Increase this time by <b>15 seconds</b> each time you score 4000
      points&nbsp;!
    </>
  ),
  "difficulty.chrono.100cc.short": (
    <>
      Score the most points in <b>4 minutes</b>.<br />
      Increase this time by <b>10 seconds</b> each time you score 4000
      points&nbsp;!
    </>
  ),
  "difficulty.chrono.150cc.short": (
    <>
      Score the most points in <b>3 minutes</b>.<br />
      Increase this time by <b>5 seconds</b> each time you score 4000
      points&nbsp;!
    </>
  ),
  "difficulty.goal.50cc.short": (
    <>
      The <b>easiest</b> photos and the most lenient scoring system.
    </>
  ),
  "difficulty.goal.100cc.short": (
    <>
      Most photos <b>except</b> the most difficult ones and a moderate tolerance
      in score calculation.
    </>
  ),
  "difficulty.goal.150cc.short": (
    <>
      <b>ALL</b> photos, including the most difficult ones! And a light
      tolerance in score calculation.
    </>
  ),
  "difficulty.goal.mirror.short": (
    <>
      <b>ALL</b> photos, including the most difficult ones! And a light
      tolerance in score calculation.
    </>
  ),
  "difficulty.chrono.mirror.short": (
    <>
      Score the most points in <b>3 minutes</b>.<br />
      Increase this time by <b>5 seconds</b> each time you score 4000
      points&nbsp;!
    </>
  ),
  "survival.harderGame.title": "Increased difficulty!",
  "survival.harderGame.description": (minimumScore: number) => (
    <p>
      You're doing well!
      <br />
      Let's increase the difficulty a bit! <br />
      <b>
        From now on, the game continues as long as you score {minimumScore}{" "}
        points
      </b>
      &nbsp;!
    </p>
  ),
  "survival.harderGame.okButton": "OK",
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
  "rules.mode.chrono.title": "Chrono Mode",
  "rules.mode.chrono.description":
    "Score as many points as possible within a time limit!",
  "leaderboard.tab.bots": "Mario & Co (bots)",
  "leaderboard.tab.allPlayers": "All Players",
  "leaderboard.congrats": "Congratulations!",
  "leaderboard.tooBad": "Too bad...",
  "leaderboard.needs.login": "To display your name in the leaderboard, log in!",
  "endGame.title": "Game over!",
  "endGame.title.leaderboard": "Leaderboard",
  "endGame.titleScreen.label": "Home",
  "endGame.replay.label": "Play again",
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
        You won at photo #<b>{photoCount}</b>! Can you do better?
      </p>
    </>
  ),
  "endGame.chrono.description": (score: number) => (
    <>
      <p>Time's up!</p>
      <p>
        You scored <b>{score}</b> points! Can you do better?
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
  "credits.followOn": (platform: string) => `Follow on ${platform}`,
  "game.globalScore": "Score: ",
  "game.globalScore.photoIndex": "Photo #",
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
  "upload.step2.help.label": "Show tracks",
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
  "photos.showMap": "Show map",
  "photo.details.title": "Players' guesses",
  "photo.by": "Photo by",
  "album.by": "An album by",
  "login.screen.title": "Log in",
  "login.screen.description": (
    <>
      Choose the service you prefer to log in to <b>Mario Kart World Guessr</b>.
    </>
  ),
  "login.discord.label": "Log in with Discord",
  "logout.label": "Log out",
  "new-version.title": (version: Version) => `New version: ${version}`,
  "privacy-policies.title": "Privacy Policy",
  "terms-services.title": "Terms of Service",
  "see-release-notes.label": "See all release notes",
  "release-notes.title": "Release notes",
  "form.submit": "Submit",
  "form.confirm": "Confirm",
  "form.cancel": "Cancel",
  "account.title": "My account",
  "account.username.label": "Username",
  "account.username.helper":
    "Your can change your username. It's displayed to other players in leaderboards.",
  "account.locale.label": "Language",
  "account.locale.helper": "Language used for displaying game texts.",
  "account.distanceUnit.label": "Distance Unit",
  "account.distanceUnit.km": "Kilometers",
  "account.distanceUnit.miles": "Miles",
  "account.distanceUnit.helper":
    "Unit used for displaying distances on the map.",
  "account.withSafeArea.label": "Safe area",
  "account.withSafeArea.helper": `This option adds a non-clickable area around the "Guess" button, helping to avoid miss-clicks.`,
  "account.save.success": "Changes saved successfully",
  "play.label": "Play",
  "account.marioCharacter.label": "Select your favorite character",
  "account.marioCharacter.helper":
    "It will appear in the pins you place on the map and next to your username in leaderboards.",
  "account.tab.preferences": "Preferences",
  "account.tab.notifications": "Notifications",
  "account.tab.photos": "My photos",
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
  "notifications.none":
    "No notifications. You'll be notified here when photos you submitted are validated.",
  "notifications.title": "Notifications",
  "notifications.photo_validated.title": "Your photo has been approved!",
  "notifications.photo_validated.description":
    "Your photo has been approved and will be available to all players in a few minutes. Congratulations, and thank you for your contribution!",
  "notifications.photo_refused.title": "Your photo has been rejected.",
  "notifications.photo_refused.description": (reason: string) => (
    <>
      Unfortunately, your photo has been rejected.
      <br />
      {reason && (
        <>
          Here is the reason for this rejection:
          <br />
          <q>{reason}</q>
        </>
      )}
      <br />
      Please feel free to submit another photo!
    </>
  ),
  "notifications.deleting": "Deleting...",
  "notification.delete": "Delete notification",
  "notifications.clear_all": "Clear all notifications",
  "photo.difficulty.easy": "Easy",
  "photo.difficulty.medium": "Medium",
  "photo.difficulty.hard": "Hard",
  "photo.difficulty.waiting": "Unknown",
  "photo.difficulty.all": "All",
  "photo.difficulty.waiting.tooltip":
    "A photo's difficulty is determined after it has been seen by at least 5 players.",
  "photo.validation.pending": "Pending validation",
  "account.photos.description":
    "Here are the photos you have submitted and how players performed on them!",
  "account.photos.filter": "Filter your photos by difficulty",
  "account.photos.stats.suggestions": (count, activeFilter) => {
    let segment: string = "";

    switch (activeFilter) {
      case "easy":
        segment = "your easy photos";
        break;
      case "medium":
        segment = "your medium photos";
        break;
      case "hard":
        segment = "your hard photos";
        break;
      case "all":
        segment = "all your photos";
        break;
      default:
        segment = "your photos";
        break;
    }

    return (
      <>
        In total, {segment} have been viewed <b>{count}</b> times!
      </>
    );
  },
  "all-photos.stats.suggestions": (count, activeFilter) => {
    let segment: string = "";

    switch (activeFilter) {
      case "easy":
        segment = "all easy photos";
        break;
      case "medium":
        segment = "all medium photos";
        break;
      case "hard":
        segment = "all hard photos";
        break;
      case "all":
        segment = "all photos";
        break;
      default:
        segment = "all photos";
        break;
    }

    return (
      <>
        In total, {segment} have been viewed <b>{count}</b> times!
      </>
    );
  },
  "account.your_photos.title": "Your photos",
  "account.albums.description":
    "Create albums with your photos and share them!",
  "account.albums.create.title": "Create a new album",
  "account.albums.create.name": "Album name",
  "account.albums.create.defaultName": "My album",
  "account.albums.create.success": "Album created successfully.",
  "album.edit.name.success": "Album name updated successfully.",
  "account.albums.delete.title": "Delete album",
  "account.albums.delete.warning": (
    <>
      Are you sure you want to delete this album?
      <br />
      The photos it contains will <b>not</b> be deleted, but the album itself
      cannot be recovered.
    </>
  ),
  "account.albums.delete.success": "Album deleted successfully.",
  "error.title": "Oops! Something went wrong.",
  "error.description": "An unexpected error occurred... Everything is broken!",
  "error.button": "Back to home",
  "error.logoutWarning.title": "You have been logged out",
  "error.logoutWarning.description":
    "An error occurred with your session: for security reasons, it has been expired and you have been logged out. Please log in again.",
  "error.logoutWarning.button": "Log in",

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

  "photo_validated.description":
    "One of your submitted photos has been validated!",
  "photo_validated.unlockedItem": "Toadette is unlocked!",
  "toadette.unlockClue": "Have one of your submitted photos validated.",

  "break_everything.description": "You have broken the game!",
  "break_everything.unlockedItem": "Waluigi is unlocked!",
  "waluigi.unlockClue": "Break the game by accessing something unusual.",
};

export default en;
