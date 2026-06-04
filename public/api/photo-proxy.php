<?php

require_once __DIR__ . '/___middleware.php';

allowMethod('GET');

if (empty($_GET['id'])) {
    http_response_code(400);
    echo json_encode(["error" => "Missing id"]);
    exit;
}

$photoId = $_GET['id'];

$stmt = $pdo->prepare(
    "SELECT id, validated_at, rejected_at
     FROM `mario-kart-world-photos`
     WHERE id = :id"
);
$stmt->bindParam(':id', $photoId, PDO::PARAM_STR);
$stmt->execute();
$photo = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$photo) {
    http_response_code(404);
    echo json_encode(["error" => "Photo not found"]);
    exit;
}

$isValidated = $photo['validated_at'] !== null;
$isAvailableOnCDN = $isValidated
    && strtotime($photo['validated_at']) <= time() - 5 * 60;

if ($isAvailableOnCDN) {
    $photoUrl = "https://ik.imagekit.io/mkwg/{$photo['id']}.jpg";
} elseif ($isValidated) {
    $photoUrl = "https://www.mariouniversalis.fr/mario-kart-world-guessr/photos/{$photo['id']}.jpg";
} elseif ($photo['rejected_at'] !== null) {
    $photoUrl = "https://www.mariouniversalis.fr/mario-kart-world-guessr/photos/rejected/{$photo['id']}.jpg";
} else {
    $photoUrl = "https://www.mariouniversalis.fr/mario-kart-world-guessr/photos/pending/{$photo['id']}.jpg";
}

header('Content-Type: image/jpeg');
readfile($photoUrl);