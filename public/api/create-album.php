<?php

require_once __DIR__ . '/___middleware.php';

allowMethod('POST');

if (empty($currentUser)) {
    http_response_code(401);
    echo json_encode(['error' => true, 'message' => 'Unauthorized']);
    die;
}

if (empty($_POST['albumname'])) {
    http_response_code(400);
    echo json_encode(['error' => true, 'message' => $headers['accept-language'] === 'fr'
            ? 'Le nom de l\'album est requis.'
            : 'Album name is required.']);
    die;
}

$albumName = trim($_POST['albumname']);
$albumNameLength = mb_strlen($albumName);
if ($albumNameLength < 2 || $albumNameLength > 100) {
    http_response_code(400);

    echo json_encode([
        'error' => true,
        'message' => $headers['accept-language'] === 'fr'
            ? 'Le nom de l\'album doit faire entre 2 et 100 caractères.'
            : 'Album name must be between 2 and 100 characters.'
    ]);
    die;
}

try {
    $stmt = $pdo->prepare(
        "INSERT INTO `mario-kart-world-albums` (album_name, author_id)
        VALUES (:albumname, :authorId)")
    ;
    $stmt->bindParam(':albumname', $albumName, PDO::PARAM_STR);
    $stmt->bindParam(':authorId', $currentUser['id'], PDO::PARAM_INT);

    $stmt->execute();

    $albumId = (int) $pdo->lastInsertId();

    echo json_encode(["success" => true, "album" => ["id" => $albumId, "name" => $albumName]]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "error" => true,
        "message" => "Database error: " . $e->getMessage()
    ]);
}