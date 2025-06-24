import { getKey } from "./store";

export function isDateInThePast(dateToCheck: string): boolean {
  const today = new Date();
  const nextDaily = new Date(dateToCheck);
  return today >= nextDaily;
}

export function shouldRunNewDailyGame() {
  const storedDaily = getKey("daily");

  if (!storedDaily?.nextDailyDate) {
    return true;
  }

  return isDateInThePast(storedDaily.nextDailyDate);
}
