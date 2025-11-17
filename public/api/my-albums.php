<?php

require_once __DIR__ . '/___middleware.php';

require_once __DIR__ . '/___github.php';

allowMethod('GET');

if (empty($currentUser)) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

try {
    $stmt = $pdo->prepare(
        "SELECT a.id, a.album_name as `name`
        FROM `mario-kart-world-albums` a
        WHERE a.author_id = :authorId
        ORDER BY a.created_at DESC"
    );

    $stmt->bindParam(':authorId', $currentUser['id'], PDO::PARAM_INT);
    $stmt->execute();

    $albums = $stmt->fetchAll(PDO::FETCH_ASSOC);  

    echo json_encode($albums);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error']);
}