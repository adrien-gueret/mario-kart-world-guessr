<?php

require_once __DIR__ . '/___middleware.php';

require_once __DIR__ . '/___github.php';

allowMethod('GET');

if (empty($_GET['id'])) {
    http_response_code(400);
    echo json_encode(["error" => "Missing photo id"]);
    exit;
}

$stmt = $pdo->prepare("SELECT github_pr_number
    FROM `mario-kart-world-photos`
    WHERE id = :photoId"
);
$stmt->bindParam(':photoId', $_GET['id'], PDO::PARAM_STR);
$stmt->execute();

$photo = $stmt->fetch(PDO::FETCH_ASSOC);

if (empty($photo)) {
    http_response_code(404);
    echo json_encode(["error" => "Photo not found"]);
    exit;
}

$pr = githubApi("GET", "/repos/$owner/$repo/pulls/{$photo['github_pr_number']}/files", $githubToken);

if (empty($pr)) {
    http_response_code(404);
    echo json_encode(["error" => "Photo not found"]);
    exit;
}

$photo = githubApi("GET", $pr[0]['contents_url'], $githubToken);

if (empty($photo['download_url'])) {
    http_response_code(404);
    echo json_encode(["error" => "Photo not found"]);
    exit;
}

// TODO return image as blob and not just the URL
header('Content-Type: image/jpeg');
readfile($photo['download_url']);