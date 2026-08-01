<?php

require_once __DIR__ . '/___middleware.php';

require_once __DIR__ . '/___album-cover.php';

allowMethod('GET');

try {
    $stmt = $pdo->prepare(
        "SELECT
            a.id, a.album_name AS `name`, a.created_at,
            a.background_color, a.background_image,
            u.id AS author_id, u.username AS author_name, u.mario_character AS author_character
        FROM `mario-kart-world-albums` AS a
        LEFT JOIN `mario-kart-world-users` AS u ON a.author_id = u.id
        WHERE a.is_published = 1
            AND a.album_name NOT IN ('Mon album', 'My album')
            AND EXISTS (
                SELECT 1
                FROM `mario-kart-world-albums-photos` AS ap
                WHERE ap.id_album = a.id
            )
        ORDER BY a.created_at DESC"
    );

    $stmt->execute();

    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $albums = array_map(fn($row) => [
        'id' => (int) $row['id'],
        'name' => $row['name'],
        'isPublished' => true,
        'coverUrl' => getPublicAlbumCoverFromDisk((int) $row['id']),
        'createdAt' => $row['created_at'],
        'backgroundImage' => $row['background_image'],
        'backgroundColor' => $row['background_color'],
        'author' => [
            'id' => (int) $row['author_id'],
            'name' => $row['author_name'],
            'character' => $row['author_character'],
        ],
    ], $rows);

    echo json_encode($albums);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => true, 'message' => 'Database error']);
}
