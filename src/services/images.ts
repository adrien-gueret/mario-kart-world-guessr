export function getCDNPhotoUrl(
  originalUrl: string,
  transformations: { w?: number; h?: number } = {}
): string {
  const urlObject = new URL(originalUrl);

  if (urlObject.hostname !== "ik.imagekit.io") {
    return originalUrl;
  }

  const { w, h } = transformations;

  const finalTransformations = [];
  if (w) {
    finalTransformations.push(`w-${w}`);
  }

  if (h) {
    finalTransformations.push(`h-${h}`);
  }

  return finalTransformations.length > 0
    ? `${originalUrl}?tr=${finalTransformations.join(",")}`
    : originalUrl;
}
