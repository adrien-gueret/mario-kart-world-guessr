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
  "mode.goal.label": "Objectif 50.000",
  "mode.goal.description":
    "En combien de photos atteindrez-vous 50.000 points ?",
  "mode.survival.label": "Survie",
  "mode.survival.description":
    "Continuez à jouer tant que vous marquez au moins 3000 points !",
  "mode.daily.label": "Photos du jour",
  "mode.daily.description": "Bientôt disponible !",
  //"Chaque jour, une nouvelle sélection de trois photos : faites un meilleur score que vos amis !",
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
    "Faite le meilleur score possible sur trois photos du jour !",
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
};

export default fr;
