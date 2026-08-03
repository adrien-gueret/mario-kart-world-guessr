<?php

/**
 * Helpers for the "album" game mode: playing a game with the photos of a
 * specific user album, with a leaderboard scoped to the album's current photo
 * pool.
 *
 * Pool versioning: `computeAlbumPhotosHash` returns an order-independent
 * signature of the album photos. Reordering keeps the same signature (the
 * leaderboard is preserved); adding/removing a photo changes it (the album
 * becomes replayable and its leaderboard is scoped to the new pool).
 */

/**
 * Order-independent SHA1 signature of an album's photo pool.
 */
function computeAlbumPhotosHash(PDO $pdo, int $albumId): string {
    $stmt = $pdo->prepare(
        "SELECT SHA1(
            COALESCE(GROUP_CONCAT(id_photo ORDER BY id_photo SEPARATOR ','), '')
        ) AS hash
        FROM `mario-kart-world-albums-photos`
        WHERE id_album = :albumId");
    $stmt->bindValue(':albumId', $albumId, PDO::PARAM_INT);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    return $row && $row['hash'] !== null ? $row['hash'] : sha1('');
}

/**
 * Number of photos in an album.
 */
function getAlbumPhotoCount(PDO $pdo, int $albumId): int {
    $stmt = $pdo->prepare(
        "SELECT COUNT(*) FROM `mario-kart-world-albums-photos` WHERE id_album = :albumId");
    $stmt->bindValue(':albumId', $albumId, PDO::PARAM_INT);
    $stmt->execute();

    return (int) $stmt->fetchColumn();
}

/**
 * The album photo at ordinal position $index (0-based), ordered by position.
 * Returns null when the index is out of range (i.e. the album is finished).
 */
function getAlbumPhotoByIndex(PDO $pdo, int $albumId, int $index): ?array {
    $stmt = $pdo->prepare(
        "SELECT ap.id_photo AS id,
            p.author_id AS authorId,
            u.username AS authorName,
            u.mario_character AS authorCharacter
        FROM `mario-kart-world-albums-photos` ap
        LEFT JOIN `mario-kart-world-photos` p ON ap.id_photo = p.id
        LEFT JOIN `mario-kart-world-users` u ON p.author_id = u.id
        WHERE ap.id_album = :albumId
        ORDER BY ap.position
        LIMIT 1 OFFSET " . (int) $index);
    $stmt->bindValue(':albumId', $albumId, PDO::PARAM_INT);
    $stmt->execute();

    return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
}

/**
 * Album + pool version a game was played on, from the `album-games` link table.
 * Returns ['album_id' => int, 'photos_hash' => string] or null.
 */
function getAlbumGameLink(PDO $pdo, int $gameId): ?array {
    $stmt = $pdo->prepare(
        "SELECT album_id, photos_hash
        FROM `mario-kart-world-album-games`
        WHERE game_id = :gameId
        LIMIT 1");
    $stmt->bindValue(':gameId', $gameId, PDO::PARAM_INT);
    $stmt->execute();

    return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
}
