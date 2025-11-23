<?php 

require_once __DIR__ . '/___middleware.php';

require_once __DIR__ . '/___coordinates.php';

allowMethod('GET');

if (empty($currentUser)) {
    http_response_code(401);
    echo json_encode(['error' => true, 'message' => 'Unauthorized']);
    exit;
}

$albumId = $_GET['id'];

if (!isset($albumId) || !is_numeric($albumId)) {
    http_response_code(400);
    die('{"error":true,"message":"Invalid album ID"}');
}

try {
    $stmt = $pdo->prepare(
        "SELECT
            a.id, a.album_name, a.author_id, a.is_published, a.created_at,
            u.username AS author_name,
            u.mario_character
        FROM `mario-kart-world-albums` AS a
        LEFT JOIN `mario-kart-world-users` AS u ON a.author_id = u.id
        WHERE a.id = :albumId AND (a.author_id = :authorId OR a.is_published = 1)");

    $stmt->bindValue(':albumId', $albumId, PDO::PARAM_INT);
    $stmt->bindValue(':authorId', $currentUser['id'], PDO::PARAM_INT);

    $stmt->execute();
    
    $albumData = $stmt->fetch(PDO::FETCH_ASSOC) ?: null;

    if (empty($albumData)) {
        http_response_code(404);
        die('{"error":true,"message":"Album not found."}');
    }

    $stmt = $pdo->prepare(
        "SELECT ap.id_photo, p.difficulty, ap.position,
         CASE
            WHEN p.validated_at IS NOT NULL 
                AND p.validated_at <= NOW() - INTERVAL 5 MINUTE
            THEN CONCAT('https://www.mariouniversalis.fr/mario-kart-world-guessr/photos/', p.id, '.jpg')
            ELSE CONCAT('https://www.mariouniversalis.fr/mario-kart-world-guessr/api/photo-proxy?pr_id=', p.github_pr_number)
        END AS photo_url
        FROM `mario-kart-world-albums-photos` AS ap
        LEFT JOIN `mario-kart-world-photos` AS p ON ap.id_photo = p.id
        WHERE ap.id_album = :albumId
        ORDER BY ap.position");

    $stmt->bindValue(':albumId', $albumId, PDO::PARAM_INT);

    $stmt->execute();

    $fetchedPhotos = $stmt->fetchAll(PDO::FETCH_ASSOC);
  
    echo json_encode([
        'id' => (int) $albumData['id'],
        'name' => $albumData['album_name'],
        'isPublished' => (bool) $albumData['is_published'],
        'createdAt' => $albumData['created_at'],
        'author' => [
            'id' => (int) $albumData['author_id'],
            'name' => $albumData['author_name'],
            'character' => $albumData['mario_character'],
        ],
        'photos' => array_map(fn($photo) => [
            'id' => $photo['id_photo'],
            'difficulty' => $photo['difficulty'] ?? null,
            'photoUrl' => $photo['photo_url'],
            'position' => $photo['position'],
        ], $fetchedPhotos),
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'error' => $e->getMessage(),
        'message' => 'Database error: ' . $e->getMessage(),
    ]);
}