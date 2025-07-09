export function isDateInThePast(dateToCheck: string): boolean {
  const today = new Date();
  const nextDaily = new Date(dateToCheck);
  return today >= nextDaily;
}
