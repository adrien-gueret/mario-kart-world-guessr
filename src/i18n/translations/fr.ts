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
};

export default fr;
