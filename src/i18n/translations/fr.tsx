import type { Texts } from "../types";

const fr: Texts = {
  "photo.subtitle": "Où cette photo a-t-elle été prise ?",
  "clickMap.subtitle": "Cliquez sur la carte pour deviner !",
  "guess.label": "Deviner",
  "next.label": "Continuer",
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
    "Continuez à jouer tant que vous marquez au moins 3000 points !",
  "mode.daily.label": "Photos du jour",
  "mode.daily.description":
    "Chaque jour, une nouvelle sélection de cinq photos : faites un meilleur score que vos amis !",
  "rules.title": "Règles du jeu",
  "rules.description":
    "Cliquez sur la carte pour deviner où la photo a été prise. Plus vous êtes proche, plus vous marquez de points, jusqu'à 5000 par photo !",
  "rules.mode.survival.title": "Mode Survie",
  "rules.mode.survival.description":
    "La partie continue tant que vous marquez au moins 3000 points. Combien de photos pouvez-vous deviner ?",
  "rules.mode.goal.title": "Mode Objectif 50.000",
  "rules.mode.goal.description":
    "Devinez des photos jusqu'à atteindre 50.000 points. Combien de photos vous faudra-t-il ?",
  "rules.mode.daily.title": "Mode Photos du jour",
  "rules.mode.daily.description":
    "Faite le meilleur score possible sur cinq photos du jour !",
  "endGame.title": "Partie terminée !",
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
  "share.text.title": "Mario Kart World Guessr - Photos du jour",
  "share.copy.button.label": "Copier",
  "share.copy.success": "Copié dans le presse-papiers",
  "share.share.button.label": "Partager",
  "credits.by": "Un jeu par ",
  "game.globalScore": "Score : ",
  "game.globalScore.photoIndex": "Photo n° ",
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
  "upload.step3.login.info": (userEmail: string) => (
    <>
      Vous êtes actuellement connecté via <b>Google</b> avec votre email{" "}
      <b>{userEmail}</b> (
      <i>
        cet email ne sera <b>pas</b> publique
      </i>
      ).
    </>
  ),
  "upload.step3.logout.label": "Se déconnecter",
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
};

export default fr;
