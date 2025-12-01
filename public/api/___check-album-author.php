<?php

function checkAlbumAuthor(PDO $pdo, int $albumId, int $userId, string $language) {
    $stmt = $pdo->prepare(
        "SELECT a.author_id
        FROM `mario-kart-world-albums` a
        WHERE a.id = :albumId");

    $stmt->bindValue(':albumId', $albumId, PDO::PARAM_INT);

    $stmt->execute();

    $authorId = $stmt->fetchColumn();

    $isUserAlbumAuthor = $authorId && $authorId == $userId;

    if (!$isUserAlbumAuthor) {
        http_response_code(403);
        echo json_encode(['error' => true, 'message' => $language === 'fr'
            ? 'Impossible de modifier cet album'
            : 'Cannot edit given album']);
        exit;
    }
}