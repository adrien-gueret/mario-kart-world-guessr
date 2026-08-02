import type { Album } from "@/types/photos";

const COVER_CDN =
  "https://www.mariouniversalis.fr/mario-kart-world-guessr/backgrounds/albums";

/** Albums owned by the logged-in mock user. */
export const myAlbums: Album[] = [
  {
    id: 1,
    name: "Mes plus beaux clichés",
    coverUrl: `${COVER_CDN}/1.avif`,
    isPublished: true,
    createdAt: "2026-01-10T12:00:00.000Z",
    backgroundImage: "waves",
    backgroundColor: "#3AA0FF",
    author: { id: 1, name: "MockPlayer", character: "mario" },
    photos: [
      {
        id: "photo-1",
        photoUrl:
          "https://www.mariouniversalis.fr/mario-kart-world-guessr/photos/photo-1.jpg",
        position: 1,
      },
      {
        id: "photo-2",
        photoUrl:
          "https://www.mariouniversalis.fr/mario-kart-world-guessr/photos/photo-2.jpg",
        position: 2,
      },
      {
        id: "photo-3",
        photoUrl:
          "https://www.mariouniversalis.fr/mario-kart-world-guessr/photos/photo-3.jpg",
        position: 3,
      },
    ],
  },
  {
    id: 2,
    name: "Brouillon (privé)",
    coverUrl: `${COVER_CDN}/2.avif`,
    isPublished: false,
    createdAt: "2026-01-15T09:30:00.000Z",
    backgroundImage: "wood",
    backgroundColor: "#C08457",
    author: { id: 1, name: "MockPlayer", character: "mario" },
    photos: [
      {
        id: "photo-4",
        photoUrl:
          "https://www.mariouniversalis.fr/mario-kart-world-guessr/photos/photo-4.jpg",
        position: 1,
      },
    ],
  },
];

/** Published albums authored by other players (community gallery). */
export const publicAlbums: Album[] = [
  ...myAlbums.filter((album) => album.isPublished),
  {
    id: 101,
    name: "Circuits mythiques",
    coverUrl: `${COVER_CDN}/101.avif`,
    isPublished: true,
    createdAt: "2026-01-02T18:00:00.000Z",
    backgroundImage: "checkerboard",
    backgroundColor: "#E63946",
    author: { id: 7, name: "Toadstool", character: "peach" },
    photos: [
      {
        id: "photo-5",
        photoUrl:
          "https://www.mariouniversalis.fr/mario-kart-world-guessr/photos/photo-5.jpg",
        position: 1,
      },
      {
        id: "photo-2",
        photoUrl:
          "https://www.mariouniversalis.fr/mario-kart-world-guessr/photos/photo-2.jpg",
        position: 2,
      },
    ],
  },
  {
    id: 102,
    name: "Tour du monde",
    coverUrl: `${COVER_CDN}/102.avif`,
    isPublished: true,
    createdAt: "2026-01-20T14:45:00.000Z",
    backgroundImage: "dots",
    backgroundColor: "#2A9D8F",
    author: { id: 12, name: "KoopaKing", character: "bowser" },
    photos: [
      {
        id: "photo-3",
        photoUrl:
          "https://www.mariouniversalis.fr/mario-kart-world-guessr/photos/photo-3.jpg",
        position: 1,
      },
    ],
  },
];
