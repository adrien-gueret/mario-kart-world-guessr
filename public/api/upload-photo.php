<?php

require_once __DIR__ . '/___middleware.php';

require_once __DIR__ . '/___github.php';

allowMethod('POST');

$photo = $_FILES['photo'];
$x = intval($_POST['x']);
$y = intval($_POST['y']);

$originalName = pathinfo($photo['name'], PATHINFO_FILENAME);
$extension = strtolower(pathinfo($photo['name'], PATHINFO_EXTENSION));
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mimeType = finfo_file($finfo, $photo['tmp_name']);
finfo_close($finfo);
[$width, $height] = getimagesize($photo['tmp_name']);

$doesNameMatch = preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/', $originalName);
$isJpgExtension = $extension === 'jpg';
$isJpgMimeType = $mimeType === 'image/jpeg';
$isSizeValid = $width === 1600 && $height === 900;

if (!$doesNameMatch || !$isJpgExtension || !$isJpgMimeType  || !$isSizeValid) {
    http_response_code(400);
    die('{"error":true,"message":"Please provide a photo sent from \"Nintendo Switch 2\" sharing system."}');
}

$photoName = $originalName;
$photoFileName = "$photoName.jpg";
$branchName = "add-photo-" . time();

$refData = githubApi("GET", "/repos/$owner/$repo/git/ref/heads/$baseBranch", $githubToken);
$baseSha = $refData['object']['sha'];

githubApi("POST", "/repos/$owner/$repo/git/refs", $githubToken, [
  "ref" => "refs/heads/$branchName",
  "sha" => $baseSha
]);

$authorName = empty($currentUser['username']) ? "Anonymous" : $currentUser['username'];
$authorEmail =  empty($currentUser['email']) ? "anoynmous@mariouniversalis.fr" : $currentUser['email'];

$photoContent = base64_encode(file_get_contents($photo['tmp_name']));
githubApi("PUT", "/repos/$owner/$repo/contents/public/photos/$photoFileName", $githubToken, [
  "message" => "Add photo $photoName",
  "content" => $photoContent,
  "branch" => $branchName,
  "author" => [
    "name" => $authorName,
    "email" => $authorEmail
  ],
]);


$pr = githubApi("POST", "/repos/$owner/$repo/pulls", $githubToken, [
  "title" => "Ajout photo",
  "head" => $branchName,
  "base" => $baseBranch,
  "body" => "Ajout d'une nouvelle photo à x: $x, y: $y"
]);

// Ajouter la photo dans la table `mario-kart-world-photos`
$stmt = $pdo->prepare("INSERT INTO `mario-kart-world-photos` (id, x, y, github_pr_number, author_id)
  VALUES (:id, :x, :y, :github_pr_number, :author_id)
");
$stmt->bindParam(':id', $photoName, PDO::PARAM_STR);
$stmt->bindParam(':x', $x, PDO::PARAM_INT);
$stmt->bindParam(':y', $y, PDO::PARAM_INT);
$stmt->bindParam(':github_pr_number', $pr['number'], PDO::PARAM_INT);
$authorId = empty($currentUser['id']) ? 1 : $currentUser['id'];
$stmt->bindParam(':author_id', $authorId, PDO::PARAM_INT);
$stmt->execute();
if ($stmt->rowCount() === 0) {
    http_response_code(500);
    die('{"error":true,"message":"Failed to insert photo into database."}');
}

http_response_code(201);

echo json_encode([
  "error" => false,
  "photo_number" => $pr["number"]
]);
