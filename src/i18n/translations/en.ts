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
  "mode.goal.label": "Goal: 20,000",
  "mode.goal.description": "In how many photos will you reach 20,000 points?",
  "mode.daily.label": "Daily Photos",
  "mode.daily.description":
    "Every day, a new selection of three photos: get a better score than your friends!",
};

export default en;
