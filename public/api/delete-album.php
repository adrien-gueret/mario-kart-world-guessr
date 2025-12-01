<?php

require_once __DIR__ . '/___middleware.php';

require_once __DIR__ . '/___check-album-author.php';

$_DELETE = allowMethod('DELETE');

if (empty($currentUser) || empty($currentUser['email'])) {
    http_response_code(401);
    echo json_encode(['error' => true, 'message' => 'Unauthorized']);
    die;
}

if (empty($_DELETE['albumId'])) {
    http_response_code(400);
    echo json_encode(['error' => true, 'message' => 'Album ID is required']);
    die;
}

try {
    checkAlbumAuthor($pdo, $_DELETE['albumId'], $currentUser['id'], $headers['accept-language']);

    $stmt = $pdo->prepare(
        "DELETE FROM `mario-kart-world-albums-photos`
        WHERE id_album = :id");
    $stmt->bindParam(':id', $_DELETE['albumId'], PDO::PARAM_INT);

    $stmt->execute();

    $stmt = $pdo->prepare(
        "DELETE FROM `mario-kart-world-albums`
        WHERE id = :id AND author_id = :authorId");
    $stmt->bindParam(':id', $_DELETE['albumId'], PDO::PARAM_INT);
    $stmt->bindParam(':authorId', $currentUser['id'], PDO::PARAM_INT);

    $stmt->execute();

    echo json_encode(["success" => true]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "error" => true,
        "message" => "Database error: " . $e->getMessage()
    ]);
}