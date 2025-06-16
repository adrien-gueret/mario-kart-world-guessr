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
  "mode.goal.label": "Objectif : 20.000",
  "mode.goal.description":
    "En combien de photos atteindrez-vous 20.000 points ?",
  "mode.daily.label": "Photos du jour",
  "mode.daily.description":
    "Chaque jour, une nouvelle sélection de trois photos : faites un meilleur score que vos amis !",
};

export default fr;
