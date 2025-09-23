import Anchor from "@/components/Anchor";
import type { GameMode, Difficulty } from "@/types/game";
import type { Version } from "@/versions/types";
import type { Texts } from "../types";

const fr: Texts = {
  "buy-me-coffee": "Offrez-moi un café",
  "photo.subtitle": "Où cette photo a-t-elle été prise ?",
  "clickMap.subtitle": "Cliquez sur la carte pour deviner !",
  "guess.label": "Deviner",
  "next.label": "Continuer",
  "close.label": "Fermer",
  "more.label": "Plus",
  "distance.label": "Distance : ",
  "distance.value": (distance: number) => `${distance.toFixed(2)} km`,
  "score.label": "Score : ",
  "score.value": (score: number) => `+ ${score}`,
  "mode.select": "Choisissez un mode de jeu",
  "mode.goal.label": "Objectif 50.000",
  "mode.goal.description":
    "En combien de photos atteindrez-vous 50.000 points ?",
  "mode.survival.label": "Survie",
  "mode.survival.description":
    "Continuez à jouer tant que vous marquez assez de points !",
  "mode.daily.label": "Photos du jour",
  "mode.daily.description":
    "Chaque jour, une nouvelle sélection de cinq photos : faites un meilleur score que vos amis !",
  "choose.difficulty": "Choisissez la difficulté",
  "difficulty.label": "Difficulté : ",
  "difficulty.50cc.title": "50cc",
  "difficulty.100cc.title": "100cc",
  "difficulty.150cc.title": "150cc",
  "difficulty.mirror.title": "Miroir",
  "difficulty.100cc.locked": (
    <ul>
      <li>
        Obtenez <strong>n'importe quelle</strong> coupe en <strong>50cc</strong>{" "}
        pour débloquer le 100cc !
      </li>
    </ul>
  ),
  "difficulty.150cc.locked": (
    <ul>
      <li>
        Obtenez <strong>n'importe quelle</strong> coupe en{" "}
        <strong>100cc</strong> pour débloquer le 150cc !
      </li>
    </ul>
  ),
  "difficulty.mirror.locked": (
    <ul>
      <li>
        Obtenez la coupe d'<strong>or</strong> en <strong>50cc</strong>, au
        moins la coupe d'<strong>argent</strong> en <strong>100cc</strong> et{" "}
        <strong>n'importe quelle</strong> coupe en <strong>150cc</strong> pour
        débloquer le mode miroir !
      </li>
    </ul>
  ),
  "difficulty.survival.50cc": (
    <ul>
      <li>
        La partie continue tant que vous marquez <b>3000 points</b>
      </li>
      <li>
        Les photos <b>les plus faciles</b>
      </li>
      <li>La meilleure tolérance sur le calcul du score</li>
      <li>Possibilité d'afficher les circuits sur la carte</li>
    </ul>
  ),
  "difficulty.survival.100cc": (
    <ul>
      <li>
        La partie continue tant que vous marquez <b>3250 points</b>
      </li>
      <li>
        La plupart des photos, <b>sauf</b> les plus difficiles
      </li>
      <li>Une bonne tolérance sur le calcul du score</li>
      <li>Possibilité d'afficher les circuits sur la carte</li>
    </ul>
  ),
  "difficulty.survival.150cc": (
    <ul>
      <li>
        La partie continue tant que vous marquez <b>3500 points</b>
      </li>
      <li>
        <b>TOUTES</b> les photos, y compris les plus difficiles
      </li>
      <li>Une tolérance légère sur le calcul du score</li>
      <li>Circuits non affichés sur la carte</li>
    </ul>
  ),
  "difficulty.survival.mirror": (
    <ul>
      <li>Comme le 150cc mais...</li>
      <li>
        <b>Les photos et la carte sont inversées !</b>
      </li>
    </ul>
  ),
  "difficulty.survival.short": (minimumScore: number) => (
    <>
      La partie continue tant que vous marquez <b>{minimumScore} points</b>.
      <br />
      {minimumScore < 4500 ? (
        <>Cette limite augmente toutes les huit photos jouées (jusqu'à 4500).</>
      ) : (
        <>
          Cette limite n'augmentera plus ! Continuez à survivre au
          maximum&nbsp;!
        </>
      )}
    </>
  ),
  "difficulty.goal.50cc": (
    <ul>
      <li>
        Les photos <b>les plus faciles</b>
      </li>
      <li>La meilleure tolérance sur le calcul du score</li>
      <li>Possibilité d'afficher les circuits sur la carte</li>
    </ul>
  ),
  "difficulty.goal.100cc": (
    <ul>
      <li>
        La plupart des photos, <b>sauf</b> les plus difficiles
      </li>
      <li>Une bonne tolérance sur le calcul du score</li>
      <li>Possibilité d'afficher les circuits sur la carte</li>
    </ul>
  ),
  "difficulty.goal.150cc": (
    <ul>
      <li>
        <b>TOUTES</b> les photos, y compris les plus difficiles
      </li>
      <li>Une tolérance légère sur le calcul du score</li>
      <li>Circuits non affichés sur la carte</li>
    </ul>
  ),
  "difficulty.goal.mirror": (
    <ul>
      <li>Comme le 150cc mais...</li>
      <li>
        <b>Les photos et la carte sont inversées !</b>
      </li>
    </ul>
  ),
  "difficulty.goal.50cc.short": (
    <>
      Les photos <b>les plus faciles</b> et la meilleure tolérance sur le calcul
      du score.
    </>
  ),
  "difficulty.goal.100cc.short": (
    <>
      La plupart des photos <b>sauf</b> les plus difficiles et une bonne
      tolérance sur le calcul du score.
    </>
  ),
  "difficulty.goal.150cc.short": (
    <>
      <b>TOUTES</b> les photos, y compris les plus difficiles ! Et une tolérance
      légère sur le calcul du score.
    </>
  ),
  "difficulty.goal.mirror.short": (
    <>
      <b>TOUTES</b> les photos, y compris les plus difficiles ! Et une tolérance
      légère sur le calcul du score.
    </>
  ),
  "survival.harderGame.title": "Difficulté augmentée !",
  "survival.harderGame.description": (minimumScore: number) => (
    <p>
      Vous vous débrouillez bien&nbsp;!
      <br />
      Et si on augmentait un peu la difficulté&nbsp;? <br />
      <b>
        Désormais, la partie continue tant que vous marquez {minimumScore}{" "}
        points
      </b>
      &nbsp;!
    </p>
  ),
  "survival.harderGame.okButton": "OK",
  "rules.title": "Règles du jeu",
  "rules.description":
    "Cliquez sur la carte pour deviner où la photo a été prise. Plus vous êtes proche, plus vous marquez de points, jusqu'à 5000 par photo !",
  "rules.mode.survival.title": "Mode Survie",
  "rules.mode.survival.description":
    "La partie continue tant que vous marquez suffisament de points. Combien de photos pouvez-vous deviner ?",
  "rules.mode.goal.title": "Mode Objectif 50.000",
  "rules.mode.goal.description":
    "Devinez des photos jusqu'à atteindre 50.000 points. Combien de photos vous faudra-t-il ?",
  "rules.mode.daily.title": "Mode Photos du jour",
  "rules.mode.daily.description":
    "Faite le meilleur score possible sur cinq photos du jour !",
  "leaderboard.tab.bots": "Mario & Co (bots)",
  "leaderboard.tab.allPlayers": "Tous les joueurs",
  "leaderboard.congrats": "Félicitations !",
  "leaderboard.tooBad": "Dommage...",
  "leaderboard.needs.login":
    "Pour afficher votre nom dans le classement, connectez-vous !",
  "endGame.title": "Partie terminée !",
  "endGame.title.leaderboard": "Classement",
  "endGame.titleScreen.label": "Accueil",
  "endGame.replay.label": "Rejouer",
  "endGame.survival.description": (
    lastGuess: number,
    photoCount: number,
    totalScore: number
  ) => (
    <>
      <p>
        Avec un score de <b>{lastGuess}</b>, votre proposition est située trop
        loin...
      </p>
      <p>
        Votre partie s'arrête après <b>{photoCount}</b> photo
        {photoCount > 1 ? "s" : ""}, pour un score total de <b>{totalScore}</b>{" "}
        ! Pouvez-vous faire mieux ?
      </p>
    </>
  ),
  "endGame.goal.description": (photoCount: number) => (
    <>
      <p>Vous avez atteint l'objectif de 50.000 points !</p>
      <p>
        Vous avez gagné à la photo n°<b>{photoCount}</b> ! Pouvez-vous faire
        mieux ?
      </p>
    </>
  ),
  "endGame.daily.description":
    "Vous avez fini de localiser les 5 photos du jour !",
  "endGame.daily.next": "Prochaines photos du jour dans : ",
  "endGame.next-button.label": "Suivant",
  "endGame.see-leaderboards": "Voir tout le classement",
  "share.text.title": "Mario Kart World Guessr - Photos du jour",
  "share.copy.button.label": "Copier",
  "share.copy.success": "Copié dans le presse-papiers",
  "share.share.button.label": "Partager",
  "credits.by": "Un jeu par ",
  "game.globalScore": "Score : ",
  "game.globalScore.photoIndex": "Photo n° ",
  "game.globalScore.showOtherPlayers":
    "Afficher l'emplacement médian de tous les joueurs",
  "home.button": "Accueil",
  "upload.title": "Proposer une photo",
  "upload.description": "Envoyez une photo pour enrichir le jeu !",
  "upload.step1.title": "1. Sélectionnez votre photo",
  "upload.step1.info1": (
    <>
      Elle doit obligatoirement provenir du système de partage de la{" "}
      <b>Nintendo Switch 2</b>.
    </>
  ),
  "upload.step1.info2":
    "Notez que votre photo passera une étape de validation avant d'être visible dans le jeu.",
  "upload.step2.title": "2. Où avez-vous pris cette photo ?",
  "upload.step2.info":
    "Cliquez sur la carte pour indiquer l'emplacement de votre photo. Soyez le plus précis possible !",
  "upload.step2.help.label": "Afficher les circuits et les routes",
  "upload.step3.title": "3. Confirmez votre envoi",
  "upload.step3.info":
    "En envoyant votre photo, vous acceptez que celle-ci soit utilisée dans le jeu.",
  "upload.form.submit.label": "Envoyer",
  "upload.loading.title": "Envoi en cours...",
  "upload.loading.info": "Merci de patienter pendant l'envoi de votre photo.",
  "upload.error": "Une erreur est survenue...",
  "upload.error.missingFields": "Veuillez remplir toutes les informations.",
  "upload.error.invalidPhoto": (
    <>
      Seules les photos venant du système de partage de la{" "}
      <b>Nintendo Switch 2</b> sont acceptées.
    </>
  ),
  "upload.error.serverError":
    "Une erreur est survenue lors de l'envoi de votre photo. Veuillez réessayer plus tard.",
  "upload.success.title": "Photo envoyée !",
  "upload.success.info":
    "Elle sera visible après une validation. Merci de votre contribution !",
  "uploader.preview.remove": "Supprimer la photo",
  "uploader.explanation":
    "Cliquez sur le nuage ou glissez/déposez une photo pour la télécharger.",
  "need.help": "Besoin d'aide ?",
  "photos.title": "Toutes les photos",
  "photos.description": (
    <>
      Découvrez toutes les photos de <b>Mario Kart World Guessr</b>!
    </>
  ),
  "photo.details.title": "Suggestions des joueurs",
  "photo.by": "Photo par",
  "login.screen.title": "Se connecter",
  "login.screen.description": (
    <>
      Choisissez le service que vous préférez pour vous connecter à{" "}
      <b>Mario Kart World Guessr</b>.
    </>
  ),
  "login.discord.label": "Se connecter avec Discord",
  "logout.label": "Se déconnecter",
  "new-version.title": (version: Version) => `Nouvelle version : ${version}`,
  "privacy-policies.title": "Règles de Confidentialité",
  "terms-services.title": "Conditions Générales d'Utilisation",
  "see-release-notes.label": "Voir toutes les notes de version",
  "release-notes.title": "Notes de version",
  "form.submit": "Envoyer",
  "account.title": "Mon compte",
  "account.username.label": "Pseudo",
  "account.username.helper":
    "Vous pouvez changer votre pseudo. Il est affiché aux autres joueurs dans les classements.",
  "account.locale.label": "Langue",
  "account.locale.helper":
    "Langue utilisée pour l'affichage des textes du jeu.",
  "account.save.success": "Modifications enregistrées avec succès",
  "play.label": "Jouer",
  "account.marioCharacter.label": "Sélectionnez votre personnage favori",
  "account.marioCharacter.helper":
    "Il apparaitra dans les pins que vous placez sur la carte et à côté de votre pseudo dans les classements.",
  "account.tab.preferences": "Préférences",
  "account.tab.notifications": "Notifications",
  "account.tab.photos": "Mes photos",
  "giveUp.label": "Abandonner",
  "giveUp.title": "Abandonner la partie ?",
  "giveUp.description":
    "Êtes-vous sûr de vouloir abandonner la partie en cours ? Votre score ne sera pas enregistré dans le classement.",
  "giveUp.confirm.cancel": "Non, continuer le jeu",
  "giveUp.confirm.accept": "Oui, arrêter",
  "home.menu.play.title": "Jouer",
  "home.menu.account.title": "Mon compte",
  "home.menu.leaderboards.title": "Classements",
  "home.menu.upload.title": "Proposer une photo",
  "leaderboards.description":
    "Consultez les classements des joueurs pour tous les modes et difficultés ! Arriverez-vous à être parmi les meilleurs ?",
  "leaderboards.mode": "Sélectionnez un mode de jeu",
  "leaderboards.difficulty": "Sélectionnez une difficulté",
  "leaderboards.hide-anonymous": "Masquer les joueurs anonymes",
  "leaderboards.not-logged-in": (
    <>
      Vous n'êtes pas connecté. <a href="#/login">Connectez-vous</a> pour voir
      votre score dans le classement.
    </>
  ),
  "leaderboards.currentUserScore": (
    gameMode: GameMode,
    gameDifficulty: Difficulty,
    photoCount: number,
    rank: number
  ) => (
    <>
      Avec votre score de <b>{photoCount}</b> photo{photoCount > 1 ? "s" : ""},
      vous êtes à la{" "}
      {rank === 1 ? (
        <>
          <b>première</b> place
        </>
      ) : (
        <>
          place <Anchor href={`#leaderboard-row-${rank}`}>#{rank}</Anchor>
        </>
      )}{" "}
      du mode <i>{fr[`mode.${gameMode}.label`]}</i> en{" "}
      <b>{fr[`difficulty.${gameDifficulty}.title`]} !</b>
    </>
  ),
  "leaderboards.not-played-yet": (
    gameMode: GameMode,
    gameDifficulty: Difficulty
  ) => (
    <>
      Vous n'avez pas encore joué au mode <i>{fr[`mode.${gameMode}.label`]}</i>{" "}
      en <b>{fr[`difficulty.${gameDifficulty}.title`]}.</b>
    </>
  ),
  "notifications.none":
    "Aucune notification. Vous serez notifié ici de la validation des photos que vous proposez.",
  "notifications.title": "Notifications",
  "notifications.photo_validated.title": "Votre photo a été validée !",
  "notifications.photo_validated.description":
    "Votre photo a été validée et sera disponible auprès de tous les joueurs dans quelques minutes. Bravo à vous, et merci pour votre contribution !",
  "notifications.photo_refused.title": "Votre photo a été refusée.",
  "notifications.photo_refused.description": (reason: string) => (
    <>
      Votre photo a malheureusement été refusée.
      <br />
      {reason && (
        <>
          Voici la raison de ce refus :<br />
          <q>{reason}</q>
        </>
      )}
      <br />
      N'hésitez pas malgré tout à proposer une autre photo&nbsp;!
    </>
  ),
  "notifications.deleting": "Suppression...",
  "notification.delete": "Effacer la notification",
  "photo.difficulty.easy": "Facile",
  "photo.difficulty.medium": "Moyen",
  "photo.difficulty.hard": "Difficile",
  "photo.difficulty.waiting": "Inconnue",
  "photo.difficulty.waiting.tooltip":
    "La difficulté d'une photo est déterminée après qu'elle ait été vue au moins 5 fois par les joueurs.",
  "photo.validation.pending": "En attente de validation",
  "account.photos.description":
    "Retrouvez ici les photos que vous avez prises et voyez comment se débrouillent les joueurs dessus !",
  "account.photos.stats.title": "Quelques données sur vos photos",
  "account.photos.stats.subtitle": "Répartition des photos par difficulté",
  "account.photos.stats.totalLabel": "Total",
  "account.photos.stats.suggestions": (count: number) => (
    <>
      Accumulées, vos photos ont été vues <b>{count}</b> fois !
    </>
  ),
  "account.your_photos.title": "Vos photos",

  //////
  "gold_50cc_survival.description":
    "Vous avez gagné la coupe d'or du mode Survie en 50cc !",
  "gold_50cc_survival.unlockedItem": "Daisy est débloquée !",
  "daisy.unlockClue": "Obtenez la coupe d'or du mode Survie en 50cc.",

  "gold_100cc_survival.description":
    "Vous avez gagné la coupe d'or du mode Survie en 100cc !",
  "gold_100cc_survival.unlockedItem": "Yoshi est débloqué !",
  "green_yoshi.unlockClue": "Obtenez la coupe d'or du mode Survie en 100cc.",

  "gold_150cc_survival.description":
    "Vous avez gagné la coupe d'or du mode Survie en 150cc !",
  "gold_150cc_survival.unlockedItem": "Wario est débloqué !",
  "wario.unlockClue": "Obtenez la coupe d'or du mode Survie en 150cc.",

  "gold_mirror_survival.description":
    "Vous avez gagné la coupe d'or du mode Survie en Miroir !",
  "gold_mirror_survival.unlockedItem": "Harmonie est débloquée !",
  "rosalina.unlockClue": "Obtenez la coupe d'or du mode Survie en Miroir.",

  "gold_50cc_goal.description":
    "Vous avez gagné la coupe d'or du mode Objectif en 50cc !",
  "gold_50cc_goal.unlockedItem": "Donkey Kong est débloqué !",
  "dk.unlockClue": "Obtenez la coupe d'or du mode Objectif en 50cc.",

  "gold_100cc_goal.description":
    "Vous avez gagné la coupe d'or du mode Objectif en 100cc !",
  "gold_100cc_goal.unlockedItem": "Toad est débloqué !",
  "toad.unlockClue": "Obtenez la coupe d'or du mode Objectif en 100cc.",

  "gold_150cc_goal.description":
    "Vous avez gagné la coupe d'or du mode Objectif en 150cc !",
  "gold_150cc_goal.unlockedItem": "Le Roi Boo est débloqué !",
  "king_boo.unlockClue": "Obtenez la coupe d'or du mode Objectif en 150cc.",

  "gold_mirror_goal.description":
    "Vous avez gagné la coupe d'or du mode Objectif en Miroir !",
  "gold_mirror_goal.unlockedItem": "Pauline est débloquée !",
  "pauline.unlockClue": "Obtenez la coupe d'or du mode Objectif en Miroir.",

  "5000_points.description": "Vous avez placé une photo pile au bon endroit !",
  "5000_points.unlockedItem": "Maskass est débloqué !",
  "shyguy.unlockClue": "Placez une photo pile au bon endroit.",

  "4000_three_in_a_row.description":
    "Vous avez fait au moins 4000 points trois fois de suite !",
  "4000_three_in_a_row.unlockedItem": "Lakitu est débloqué !",
  "lakitu.unlockClue": "Faire au moins 4000 points trois fois de suite.",

  "photo_validated.description": "Une de vos photos a été validée !",
  "photo_validated.unlockedItem": "Toadette est débloquée !",
  "toadette.unlockClue": "Ayez une photo publiée dans le jeu.",
};

export default fr;
