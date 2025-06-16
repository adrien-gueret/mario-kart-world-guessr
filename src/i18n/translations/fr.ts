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
  "mode.goal.label": "Objectif : 50.000",
  "mode.goal.description":
    "En combien de photos atteindrez-vous 50.000 points ?",
  "mode.survival.label": "Survie",
  "mode.survival.description":
    "Continuez à jouer tant que vous marquez au moins 3500 points !",
  "mode.daily.label": "Photos du jour",
  "mode.daily.description":
    "Chaque jour, une nouvelle sélection de trois photos : faites un meilleur score que vos amis !",
  "rules.title": "Règles du jeu",
  "rules.description":
    "Cliquez sur la carte pour deviner où la photo a été prise. Plus vous êtes proche, plus vous marquez de points, jusqu'à 5000 par photo !",
};

export default fr;
