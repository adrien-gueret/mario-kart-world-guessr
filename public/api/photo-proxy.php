<?php

require_once __DIR__ . '/___middleware.php';

require_once __DIR__ . '/___github.php';

allowMethod('GET');

$photoUrl = "";

function getPhotoURLByPhotoId($photoId, $pdo) {
  $stmt = $pdo->prepare(
    "SELECT id, github_pr_number,
    CASE
        WHEN validated_at IS NOT NULL AND validated_at <= NOW() - INTERVAL 5 MINUTE
            THEN 1
        ELSE 0
    END AS is_available
    FROM `mario-kart-world-photos`
    WHERE id = :photoId"
  );
  $stmt->bindParam(':photoId', $photoId, PDO::PARAM_STR);
  $stmt->execute();

  $photo = $stmt->fetch(PDO::FETCH_ASSOC);

  if (empty($photo)) {
    return false;
  }

  return $photo['is_available']
    ? "https://www.mariouniversalis.fr/mario-kart-world-guessr/photos/{$photo['id']}.jpg"
    : getPhotoURLByPRId($photo['github_pr_number']);
}

if (!empty($_GET['id'])) {
    $photoUrl = getPhotoURLByPhotoId($_GET['id'], $pdo);
} else if (!empty($_GET['pr_id'])) {
    $photoUrl = getPhotoURLByPRId($_GET['pr_id'], $pdo);
}

if (empty($photoUrl)) {
    http_response_code(404);
    echo json_encode(["error" => "Photo not found"]);
    exit;
}

header('Content-Type: image/jpeg');
readfile($photoUrl);