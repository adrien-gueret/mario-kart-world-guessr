<?php

require_once __DIR__ . '/___middleware.php';

require_once __DIR__ . '/___check-album-author.php';

require_once __DIR__ . '/___album-cover.php';

require_once __DIR__ . '/___album-game.php';

$_POST = allowMethod('POST');

if (empty($currentUser) || empty($currentUser['email'])) {
    http_response_code(401);
    echo json_encode(['error' => true, 'message' => 'Unauthorized']);
    die;
}

if (empty($_POST['albumId'])) {
    http_response_code(400);
    echo json_encode(['error' => true, 'message' => 'Album ID is required']);
    die;
}

try {
    checkAlbumAuthor($pdo, $_POST['albumId'], $currentUser['id'], $headers['accept-language']);

    $photoIdsPerPosition = isset($_POST['position']) ? $_POST['position'] : [];

    $insert = [];
    $params = [];
    $photoIds = array_values($photoIdsPerPosition);

    $shouldEmptyAlbum = count($photoIdsPerPosition) === 0;

    if (!$shouldEmptyAlbum) {
        $stmt = $pdo->prepare(
            "SELECT id FROM `mario-kart-world-photos`
            WHERE id IN (" . implode(", ", array_fill(0, count($photoIds), "?")) . ")
            AND author_id = ? and validated_at IS NOT NULL"
        );
        $stmt->execute(array_merge($photoIds, [$currentUser['id']]));
        $ownedPhotoIds = $stmt->fetchAll(PDO::FETCH_COLUMN);

        if (count($ownedPhotoIds) !== count($photoIds)) {
            http_response_code(403);
            echo json_encode(['error' => true, 'message' => $headers['accept-language'] === 'fr'
                ? 'Vous ne pouvez ajouter que vos propres photos dans un album'
                : 'You can only add your own photos to an album']);
            die;
        }
    }

    $stmt = $pdo->prepare(
        "DELETE FROM `mario-kart-world-albums-photos`
         WHERE id_album = ?"
    );
    $stmt->execute([$_POST['albumId']]);

    if (!$shouldEmptyAlbum) {
        foreach ($photoIdsPerPosition as $position => $photoId) {
            $insert[] = "(?, ?, ?)";
            $params[] = $_POST['albumId'];
            $params[] = $photoId;
            $params[] = $position;
        }

        $stmt = $pdo->prepare(
            "INSERT INTO `mario-kart-world-albums-photos`
            (id_album, id_photo, position) VALUES "
            . implode(", ", $insert)
        );

        $stmt->execute($params);
    }

    createAlbumCover($pdo, $_POST['albumId']);

    // Refresh the album's photo-pool signature so album-mode leaderboards are
    // scoped to the new pool (adding/removing a photo makes the album replayable).
    $photosHash = computeAlbumPhotosHash($pdo, (int) $_POST['albumId']);
    $updateHashStmt = $pdo->prepare(
        "UPDATE `mario-kart-world-albums` SET photos_hash = :photosHash WHERE id = :albumId");
    $updateHashStmt->bindValue(':photosHash', $photosHash, PDO::PARAM_STR);
    $updateHashStmt->bindValue(':albumId', (int) $_POST['albumId'], PDO::PARAM_INT);
    $updateHashStmt->execute();

    echo json_encode(["success" => true]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "error" => true,
        "message" => "Database error: " . $e->getMessage()
    ]);
}