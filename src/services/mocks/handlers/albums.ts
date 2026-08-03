import type { Album, AlbumBackgroundImage, AlbumPhoto } from "@/types/photos";

import { db } from "../db";
import { field, jsonResponse, okResponse, notFound } from "../helpers";
import type { MockHandlers } from "../types";

function findAlbum(id: number): Album | undefined {
  return db.myAlbums.find((album) => album.id === id);
}

function syncPublicAlbums(): void {
  const published = db.myAlbums.filter((album) => album.isPublished);
  const others = db.publicAlbums.filter(
    (album) => album.author.id !== db.user.id,
  );
  db.publicAlbums = [...published, ...others];
}

const albumHandlers: MockHandlers = {
  "GET /album": ({ query }) => {
    const id = Number(query.get("id"));
    const album =
      findAlbum(id) ?? db.publicAlbums.find((current) => current.id === id);
    if (!album) return notFound(`album ${id}`);

    const played = db.albumGames.get(id);
    return jsonResponse({
      ...album,
      game: {
        hasPlayed: Boolean(played),
        score: played ? played.totalScore : null,
        gameId: played ? played.id : null,
      },
    });
  },

  "GET /my-albums": () => jsonResponse(db.myAlbums),

  "GET /public-albums": () => jsonResponse(db.publicAlbums),

  "POST /create-album": ({ body }) => {
    const name = field(body, "albumname") ?? "Nouvel album";
    const album: Album = {
      id: db.counters.album++,
      name,
      coverUrl:
        "https://www.mariouniversalis.fr/mario-kart-world-guessr/backgrounds/new-album.avif",
      isPublished: false,
      createdAt: new Date().toISOString(),
      backgroundImage: "squares",
      backgroundColor: "#E63946",
      author: {
        id: db.user.id,
        name: db.user.username,
        character: db.user.marioCharacter,
      },
      photos: [],
    };
    db.myAlbums.push(album);
    return jsonResponse({ album });
  },

  "PATCH /update-album-name": ({ body }) => {
    const album = findAlbum(Number(field(body, "albumId")));
    if (!album) return notFound("album");
    album.name = field(body, "albumName") ?? album.name;
    syncPublicAlbums();
    return jsonResponse({ album });
  },

  "PATCH /update-album-photos": ({ body }) => {
    const album = findAlbum(Number(field(body, "albumId")));
    if (!album) return notFound("album");

    const photos: AlbumPhoto[] = [];
    for (let position = 1; position <= 12; position++) {
      const photoId = field(body, `position[${position}]`);
      if (!photoId) continue;
      const source = db.photos.find((photo) => photo.id === photoId);
      photos.push({
        id: photoId,
        photoUrl: source?.photoUrl ?? "",
        position,
      });
    }
    album.photos = photos;
    // The photo pool changed: reset the album game so it can be replayed.
    db.albumGames.delete(album.id);
    syncPublicAlbums();
    return jsonResponse({ album });
  },

  "PATCH /update-album-background": ({ body }) => {
    const album = findAlbum(Number(field(body, "albumId")));
    if (!album) return notFound("album");
    const backgroundImage = field(body, "albumBackgroundImage") as
      | AlbumBackgroundImage
      | undefined;
    if (backgroundImage) album.backgroundImage = backgroundImage;
    album.backgroundColor =
      field(body, "albumBackgroundColor") ?? album.backgroundColor;
    syncPublicAlbums();
    return jsonResponse({ album });
  },

  "PATCH /update-album-publication": ({ body }) => {
    const album = findAlbum(Number(field(body, "albumId")));
    if (!album) return notFound("album");
    album.isPublished = field(body, "isPublished") === "1";
    syncPublicAlbums();
    return jsonResponse({ album });
  },

  "DELETE /delete-album": ({ body }) => {
    const id = Number(field(body, "albumId"));
    db.myAlbums = db.myAlbums.filter((album) => album.id !== id);
    syncPublicAlbums();
    return okResponse();
  },
};

export default albumHandlers;
