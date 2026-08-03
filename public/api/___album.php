<?php

require_once __DIR__ . '/___album-cover.php';

require_once __DIR__ . '/___album-game.php';

function getAlbumById(PDO $pdo, string $albumId, int $currentUserId = 0): ?array {
    $isAdmin = $currentUserId === 1;

    $stmt = $pdo->prepare(
        "SELECT
            a.id, a.album_name, a.author_id, a.is_published, a.created_at,
            a.background_color, a.background_image,
            u.username AS author_name, u.locale, u.mario_character
        FROM `mario-kart-world-albums` AS a
        LEFT JOIN `mario-kart-world-users` AS u ON a.author_id = u.id
        WHERE a.id = :albumId ".($isAdmin ? "" : "AND (a.author_id = :authorId OR a.is_published = 1)"));

    $stmt->bindValue(':albumId', $albumId, PDO::PARAM_INT);

    if (!$isAdmin) {
        $stmt->bindValue(':authorId', $currentUserId, PDO::PARAM_INT);
    }

    $stmt->execute();
    
    $albumData = $stmt->fetch(PDO::FETCH_ASSOC) ?: null;

    if (empty($albumData)) {
        return null;    
    }

    $stmt = $pdo->prepare(
        "SELECT ap.id_photo, p.difficulty, p.validated_at, ap.position,
         CASE
            WHEN p.validated_at IS NOT NULL 
                AND p.validated_at <= NOW() - INTERVAL 5 MINUTE
            THEN CONCAT('https://ik.imagekit.io/mkwg/', p.id, '.jpg')
            ELSE CONCAT('https://www.mariouniversalis.fr/mario-kart-world-guessr/api/photo-proxy?id=', p.id)
        END AS photo_url
        FROM `mario-kart-world-albums-photos` AS ap
        LEFT JOIN `mario-kart-world-photos` AS p ON ap.id_photo = p.id
        WHERE ap.id_album = :albumId
        ORDER BY ap.position");

    $stmt->bindValue(':albumId', $albumId, PDO::PARAM_INT);

    $stmt->execute();

    $fetchedPhotos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Current user's play state for this album's current photo pool.
    $gameState = [
        'hasPlayed' => false,
        'score' => null,
        'gameId' => null,
    ];

    if ($currentUserId > 0) {
        $photosHash = computeAlbumPhotosHash($pdo, (int) $albumId);

        $gameStmt = $pdo->prepare(
            "SELECT
                l.score AS score,
                (
                    SELECT ag.game_id
                    FROM `mario-kart-world-album-games` ag
                    JOIN `mario-kart-world-games` g ON g.id = ag.game_id
                    WHERE ag.album_id = :albumId
                        AND ag.photos_hash = :photosHash
                        AND g.player_id = :playerId
                    ORDER BY g.id DESC
                    LIMIT 1
                ) AS gameId
            FROM `mario-kart-world-leaderboard-album` l
            WHERE l.player_id = :playerId
                AND l.album_id = :albumId
                AND l.photos_hash = :photosHash
            LIMIT 1");
        $gameStmt->bindValue(':albumId', (int) $albumId, PDO::PARAM_INT);
        $gameStmt->bindValue(':photosHash', $photosHash, PDO::PARAM_STR);
        $gameStmt->bindValue(':playerId', $currentUserId, PDO::PARAM_INT);
        $gameStmt->execute();
        $playRow = $gameStmt->fetch(PDO::FETCH_ASSOC);

        if (!empty($playRow)) {
            $gameState = [
                'hasPlayed' => true,
                'score' => (int) $playRow['score'],
                'gameId' => $playRow['gameId'] !== null ? (int) $playRow['gameId'] : null,
            ];
        }
    }

    return [
        'id' => (int) $albumData['id'],
        'name' => $albumData['album_name'],
        'isPublished' => (bool) $albumData['is_published'],
        'backgroundImage' => $albumData['background_image'],
        'backgroundColor' => $albumData['background_color'],
        'coverUrl' => getPublicAlbumCoverFromDisk((int) $albumData['id']),
        'createdAt' => $albumData['created_at'],
        'author' => [
            'id' => (int) $albumData['author_id'],
            'name' => $albumData['author_name'],
            'locale' => $albumData['locale'],
            'character' => $albumData['mario_character'],
        ],
        'photos' => array_map(fn($photo) => [
            'id' => $photo['id_photo'],
            'difficulty' => $photo['difficulty'] ?? null,
            'validatedAt' => $photo['validated_at'] ?? null,
            'photoUrl' => $photo['photo_url'],
            'position' => $photo['position'],
        ], $fetchedPhotos),
        'game' => $gameState,
    ];
}