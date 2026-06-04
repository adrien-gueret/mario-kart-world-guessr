<?php

require_once __DIR__ . '/___environment.php';
require_once __DIR__ . '/___database.php';
require_once __DIR__ . '/___algolia.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Method Not Allowed');
}

$headers = function_exists('getallheaders') ? array_change_key_case(getallheaders(), CASE_LOWER) : [];
$authHeader = $headers['authorization'] ?? ($_SERVER['HTTP_AUTHORIZATION'] ?? '');
$expected = 'Bearer ' . getenv('MU_SECRET');
if (!hash_equals($expected, $authHeader)) {
    http_response_code(401);
    exit('Unauthorized');
}

$input = json_decode(file_get_contents('php://input'), true) ?? [];
$photoId = $input['photo_id'] ?? null;
$issueNumber = isset($input['issue_number']) ? (int) $input['issue_number'] : null;

if (!$photoId && !$issueNumber) {
    http_response_code(400);
    exit('Missing photo_id or issue_number');
}

if ($photoId) {
    $stmt = $pdo->prepare("SELECT id, author_id, validated_at FROM `mario-kart-world-photos` WHERE id = :id");
    $stmt->execute([':id' => $photoId]);
} else {
    $stmt = $pdo->prepare("SELECT id, author_id, validated_at FROM `mario-kart-world-photos` WHERE github_issue_number = :n");
    $stmt->execute([':n' => $issueNumber]);
}
$photo = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$photo) {
    http_response_code(404);
    exit('Photo not found');
}

if (!empty($photo['validated_at'])) {
    http_response_code(200);
    exit('Already validated');
}

$photoId = $photo['id'];
$photosDir = __DIR__ . '/../photos';
$pendingPath = "$photosDir/pending/$photoId.jpg";
$finalPath = "$photosDir/$photoId.jpg";

if (!file_exists($pendingPath) && !file_exists($finalPath)) {
    http_response_code(404);
    exit('Pending file missing');
}

if (file_exists($pendingPath)) {
    if (!@rename($pendingPath, $finalPath)) {
        http_response_code(500);
        exit('Failed to move file');
    }
}

$updateStmt = $pdo->prepare("UPDATE `mario-kart-world-photos` SET validated_at = NOW() WHERE id = :id");
$updateStmt->execute([':id' => $photoId]);

$notifStmt = $pdo->prepare(
    "INSERT INTO `mario-kart-world-notifications` (id_user, notification_type, specific_data)
    VALUES (:id_user, 'photo_validated', :specific_data)"
);
$notifStmt->execute([
    ':id_user' => $photo['author_id'],
    ':specific_data' => json_encode(['photo_id' => $photoId]),
]);

indexPhotosIntoAlgolia([$photoId]);

http_response_code(200);
echo 'Photo validated';
