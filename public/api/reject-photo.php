<?php

require_once __DIR__ . '/___environment.php';
require_once __DIR__ . '/___database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Method Not Allowed');
}

$authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
$expected = 'Bearer ' . getenv('MU_SECRET');
if (!hash_equals($expected, $authHeader)) {
    http_response_code(401);
    exit('Unauthorized');
}

$input = json_decode(file_get_contents('php://input'), true) ?? [];
$photoId = $input['photo_id'] ?? null;
$issueNumber = isset($input['issue_number']) ? (int) $input['issue_number'] : null;
$reason = trim($input['reason'] ?? '');

if (!$photoId && !$issueNumber) {
    http_response_code(400);
    exit('Missing photo_id or issue_number');
}

if ($photoId) {
    $stmt = $pdo->prepare("SELECT id, author_id, rejected_at FROM `mario-kart-world-photos` WHERE id = :id");
    $stmt->execute([':id' => $photoId]);
} else {
    $stmt = $pdo->prepare("SELECT id, author_id, rejected_at FROM `mario-kart-world-photos` WHERE github_issue_number = :n");
    $stmt->execute([':n' => $issueNumber]);
}
$photo = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$photo) {
    http_response_code(404);
    exit('Photo not found');
}

if (!empty($photo['rejected_at'])) {
    http_response_code(200);
    exit('Already rejected');
}

$photoId = $photo['id'];
$photosDir = __DIR__ . '/../photos';
$pendingPath = "$photosDir/pending/$photoId.jpg";
$rejectedDir = "$photosDir/rejected";
$rejectedPath = "$rejectedDir/$photoId.jpg";

if (!is_dir($rejectedDir)) {
    @mkdir($rejectedDir, 0755, true);
}

if (file_exists($pendingPath)) {
    @rename($pendingPath, $rejectedPath);
}

$updateStmt = $pdo->prepare(
    "UPDATE `mario-kart-world-photos`
     SET rejected_at = NOW(), rejection_reason = :reason
     WHERE id = :id"
);
$updateStmt->execute([
    ':id' => $photoId,
    ':reason' => $reason !== '' ? $reason : null,
]);

$notifStmt = $pdo->prepare(
    "INSERT INTO `mario-kart-world-notifications` (id_user, notification_type, specific_data)
    VALUES (:id_user, 'photo_refused', :specific_data)"
);
$notifStmt->execute([
    ':id_user' => $photo['author_id'],
    ':specific_data' => json_encode(['photo_id' => $photoId, 'reason' => $reason]),
]);

http_response_code(200);
echo 'Photo rejected';
