<?php

require_once __DIR__ . '/___environment.php';

require_once __DIR__ . '/___database.php';

require_once __DIR__ . '/___github.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Method Not Allowed');
}

$body = file_get_contents("php://input");

$signature = $_SERVER['HTTP_X_HUB_SIGNATURE_256'] ?? '';
$secret = getenv('MU_SECRET');
$hash = 'sha256=' . hash_hmac('sha256', $body, $secret);

if (!hash_equals($hash, $signature)) {
    http_response_code(401);
    exit('Unauthorized: Invalid signature');
}

$event = json_decode($_POST['payload'], true);

if ($event['action'] !== 'closed' || !isset($event['pull_request'])) {
    http_response_code(200);
    exit('No action required');
}

$prNumber = $event['pull_request']['number'];

$stmt = $pdo->prepare("SELECT id, author_id FROM `mario-kart-world-photos` WHERE github_pr_number = ?");
$stmt->execute([$prNumber]);
$photo = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$photo) {
    http_response_code(404);
    exit('Pull request not found in database');
}

if ($event['pull_request']['merged'] === true) { 
    $updateStmt = $pdo->prepare("UPDATE `mario-kart-world-photos` SET validated_at = NOW() WHERE github_pr_number = ?");
    $updateStmt->execute([$prNumber]);

    $insertStmt = $pdo->prepare(
        "INSERT INTO `mario-kart-world-notifications` (id_user, notification_type, specific_data)
        VALUES (:id_user, 'photo_validated', :specific_data)");
    $insertStmt->bindParam(':id_user', $photo['author_id'], PDO::PARAM_INT);
    $insertStmt->bindParam(':specific_data', json_encode(['photo_id' => $photo['id']]), PDO::PARAM_STR);
    $insertStmt->execute();

    http_response_code(200);
    echo 'Photo correctly validated';
} else {
    $comments = githubApi("GET", "https://api.github.com/repos/adrien-gueret/mario-kart-world-guessr/issues/$prNumber/comments", $githubToken);
    $refusedReason = $comments[0]['body'];
   
    $updateStmt = $pdo->prepare("UPDATE `mario-kart-world-photos` SET refused_at = NOW(), refused_reason=:reason WHERE github_pr_number = :prNumber");
    $updateStmt->bindParam(':reason', $refusedReason, PDO::PARAM_STR);
    $updateStmt->bindParam(':prNumber', $prNumber, PDO::PARAM_INT);
    $updateStmt->execute();

    $insertStmt = $pdo->prepare(
        "INSERT INTO `mario-kart-world-notifications` (id_user, notification_type, specific_data)
        VALUES (:id_user, 'photo_refused', :specific_data)");
    $insertStmt->bindParam(':id_user', $photo['author_id'], PDO::PARAM_INT);
    $insertStmt->bindParam(':specific_data', json_encode(['photo_id' => $photo['id']]), PDO::PARAM_STR);
    $insertStmt->execute();

    http_response_code(200);
    echo 'Photo correctly rejected';
}