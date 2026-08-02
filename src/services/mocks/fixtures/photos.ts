import type { Photo } from "@/types/photos";

const PHOTO_CDN =
  "https://www.mariouniversalis.fr/mario-kart-world-guessr/photos";

/** Note: image URLs point at the production CDN and will not load offline
 * (accepted trade-off). The rest of the data flow works fully offline. */
export const photos: Photo[] = [
  {
    id: "photo-1",
    difficulty: "easy",
    validatedAt: "2026-01-05T10:00:00.000Z",
    photoUrl: `${PHOTO_CDN}/photo-1.jpg`,
    suggestionCount: 42,
    characters: ["mario"],
    x: 1240,
    y: 820,
  },
  {
    id: "photo-2",
    difficulty: "medium",
    validatedAt: "2026-01-06T10:00:00.000Z",
    photoUrl: `${PHOTO_CDN}/photo-2.jpg`,
    suggestionCount: 17,
    characters: ["luigi", "peach"],
    x: 2100,
    y: 1360,
  },
  {
    id: "photo-3",
    difficulty: "hard",
    validatedAt: "2026-01-07T10:00:00.000Z",
    photoUrl: `${PHOTO_CDN}/photo-3.jpg`,
    suggestionCount: 8,
    characters: ["bowser"],
    x: 640,
    y: 2040,
  },
  {
    id: "photo-4",
    difficulty: "easy",
    validatedAt: "2026-01-08T10:00:00.000Z",
    photoUrl: `${PHOTO_CDN}/photo-4.jpg`,
    suggestionCount: 25,
    characters: ["daisy"],
    x: 3020,
    y: 900,
  },
  {
    id: "photo-5",
    difficulty: "medium",
    validatedAt: "2026-01-09T10:00:00.000Z",
    photoUrl: `${PHOTO_CDN}/photo-5.jpg`,
    suggestionCount: 33,
    characters: ["peach"],
    x: 1580,
    y: 2480,
  },
  {
    id: "photo-6",
    difficulty: "hard",
    validatedAt: null,
    photoUrl: `${PHOTO_CDN}/photo-6.jpg`,
    suggestionCount: 0,
    characters: [],
    x: 2260,
    y: 1720,
  },
];
