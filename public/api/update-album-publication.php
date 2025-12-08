<?php

require_once __DIR__ . '/___middleware.php';

require_once __DIR__ . '/___check-album-author.php';

$_PATCH = allowMethod('PATCH');

if (empty($currentUser) || empty($currentUser['email'])) {
    http_response_code(401);
    echo json_encode(['error' => true, 'message' => 'Unauthorized']);
    die;
}

if (!isset($_PATCH['isPublished']) || empty($_PATCH['albumId'])) {
    http_response_code(400);
    echo json_encode(['error' => true, 'message' => 'Album publication status and ID are required']);
    die;
}

try {
    checkAlbumAuthor($pdo, $_PATCH['albumId'], $currentUser['id'], $headers['accept-language']);
    
    $stmt = $pdo->prepare(
        "UPDATE `mario-kart-world-albums`
        SET is_published = :isPublished
        WHERE id = :id AND author_id = :authorId");
    $stmt->bindParam(':isPublished', $_PATCH['isPublished'], PDO::PARAM_BOOL);
    $stmt->bindParam(':id', $_PATCH['albumId'], PDO::PARAM_INT);
    $stmt->bindParam(':authorId', $currentUser['id'], PDO::PARAM_INT);

    $stmt->execute();

    $stmt = $pdo->prepare("SELECT
            a.id, a.album_name, a.author_id, a.is_published, a.created_at,
            u.username AS author_name,
            u.mario_character
        FROM `mario-kart-world-albums` AS a
        LEFT JOIN `mario-kart-world-users` AS u ON a.author_id = u.id
        WHERE a.id = :albumId AND (a.author_id = :authorId OR a.is_published = 1)");
    $stmt->bindParam(':albumId', $_PATCH['albumId'], PDO::PARAM_INT);
    $stmt->bindParam(':authorId', $currentUser['id'], PDO::PARAM_INT);
    $stmt->execute();
    
    $albumData = $stmt->fetch(PDO::FETCH_ASSOC) ?: null;

   echo json_encode(["success" => true, "album" => [
        'id' => (int) $albumData['id'],
        'name' => $albumData['album_name'],
        'isPublished' => (bool) $albumData['is_published'],
        'createdAt' => $albumData['created_at'],
        'author' => [
            'id' => (int) $albumData['author_id'],
            'name' => $albumData['author_name'],
            'character' => $albumData['mario_character'],
        ]]
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "error" => true,
        "message" => "Database error: " . $e->getMessage()
    ]);
}