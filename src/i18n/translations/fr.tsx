import type { Texts } from "../types";

const fr: Texts = {
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
        Obtenez une coupe d'<strong>or</strong> en <strong>50cc</strong>,{" "}
        <strong>100cc</strong> et <strong>150cc</strong> pour débloquer le mode
        miroir !
      </li>
    </ul>
  ),
  "difficulty.survival.50cc": (
    <ul>
      <li>
        La partie continue tant que vous marquez <b>2500 points</b>
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
        La partie continue tant que vous marquez <b>3000 points</b>
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
  "difficulty.survival.50cc.short": (
    <>
      La partie continue tant que vous marquez <b>2500 points</b>.
    </>
  ),
  "difficulty.survival.100cc.short": (
    <>
      La partie continue tant que vous marquez <b>3000 points</b>.
    </>
  ),
  "difficulty.survival.150cc.short": (
    <>
      La partie continue tant que vous marquez <b>3500 points</b>.
    </>
  ),
  "difficulty.survival.mirror.short": (
    <>
      La partie continue tant que vous marquez <b>3500 points</b>.
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
  "leaderboard.tab.bots": "Mario & Co",
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
  "upload.step3.title": "3. Optionnel : connectez-vous",
  "upload.step3.info": (
    <>
      Cette étape est <b>facultative</b> ; vous pouvez publier votre photo sans
      vous connecter.
    </>
  ),
  "upload.step3.login.info": (username: string, userEmail: string) => (
    <>
      Vous êtes actuellement connecté en tant que <b>{username}</b> avec votre
      email <b>{userEmail}</b> (
      <i>
        cet email ne sera <b>pas</b> publique
      </i>
      ).
    </>
  ),
  "upload.step3.or": "ou",
  "upload.step3.authorName.label": (userName: string) => (
    <>
      Afficher <b>{userName}</b>
    </>
  ),
  "upload.step3.authorName.anonymous": "Ne pas afficher mon nom",
  "upload.step3.shouldBeNotified.label":
    "Me notifier par email de la validation de ma photo",
  "upload.step4.title": "4. Confirmez votre envoi",
  "upload.step4.info":
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
  "photos.title": "Toutes les photos",
  "photos.description": (
    <>
      Découvrez toutes les photos de <b>Mario Kart World Guessr</b>!
    </>
  ),
  "photo.details.title": "Détails de la photo",
  "login.screen.title": "Se connecter",
  "login.screen.description": (
    <>
      Choisissez le service que vous préférez pour vous connecter à{" "}
      <b>Mario Kart World Guessr</b>.
    </>
  ),
  "login.discord.label": "Se connecter avec Discord",
  "logout.label": "Se déconnecter",
};

export default fr;
