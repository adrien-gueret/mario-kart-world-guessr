export type IsoDate =
  `${number}${number}${number}${number}-${number}${number}-${number}${number}`;

export function isDateInThePast(dateToCheck: string): boolean {
  const today = new Date();
  const nextDaily = new Date(dateToCheck);
  return today >= nextDaily;
}

export function isDailyDate(dateString?: string): dateString is IsoDate {
  if (!dateString) {
    return false;
  }

  return dateString === "today" || /^\d{4}-\d{2}-\d{2}$/.test(dateString);
}

export function parseIsoDateToLocal(iso: IsoDate) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function getIsoDate(date: Date): IsoDate {
  const isoDay = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");

  return isoDay as IsoDate;
}
