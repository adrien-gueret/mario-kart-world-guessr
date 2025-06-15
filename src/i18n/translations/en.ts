import type { Texts } from "../types";

const kilometersToMiles = (km: number): string => {
  return (km * 0.621371).toFixed(2);
};

const en: Texts = {
  "photo.subtitle": "Where was this photo taken?",
  "clickMap.subtitle": "Click on the map to guess!",
  "guess.label": "Guess",
  "next.label": "Next",
  "distance.label": "Distance: ",
  "distance.value": (distance: number) =>
    `${kilometersToMiles(distance)} miles`,
  "score.label": "Score: ",
  "score.value": (score: number) => `+${score}`,
};

export default en;
