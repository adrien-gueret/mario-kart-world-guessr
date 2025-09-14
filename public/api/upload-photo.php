<?php

require_once __DIR__ . '/___middleware.php';

require_once __DIR__ . '/___github.php';

allowMethod('POST');

function getUuidVersion($uuid) {
  if (!preg_match(
      '/^[0-9a-f]{8}-[0-9a-f]{4}-([1-5])[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i',
      $uuid,
      $matches
  )) {
      return null;
  }

  return $matches[1];
}

function uuidv4() {
  $bytes = secure_random_bytes(16);
  $bytes[6] = chr((ord($bytes[6]) & 0x0f) | 0x40);
  $bytes[8] = chr((ord($bytes[8]) & 0x3f) | 0x80);

  $hex = bin2hex($bytes);
  
  return sprintf(
    '%s-%s-%s-%s-%s',
    substr($hex, 0, 8),
    substr($hex, 8, 4),
    substr($hex, 12, 4),
    substr($hex, 16, 4),
    substr($hex, 20, 12)
  );
}

function secure_random_bytes(int $len): string {
  if (function_exists('random_bytes')) {
    return random_bytes($len);
  }
  if (function_exists('openssl_random_pseudo_bytes')) {
    $strong = false;
    $bytes = openssl_random_pseudo_bytes($len, $strong);
    if ($bytes !== false && $strong === true) {
      return $bytes;
    }
  }

  throw new RuntimeException("Aucune source d'aléa cryptographique disponible");
}

$photo = $_FILES['photo'];
$x = intval($_POST['x']);
$y = intval($_POST['y']);

$originalName = pathinfo($photo['name'], PATHINFO_FILENAME);
$extension = strtolower(pathinfo($photo['name'], PATHINFO_EXTENSION));
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mimeType = finfo_file($finfo, $photo['tmp_name']);
finfo_close($finfo);
[$width, $height] = getimagesize($photo['tmp_name']);

$isJpgExtension = $extension === 'jpg';
$isJpgMimeType = $mimeType === 'image/jpeg';

$isSizeValid = true;

if (!$isJpgExtension || !$isJpgMimeType  || !$isSizeValid) {
    http_response_code(400);
    die(json_encode([
        'error' => true,
        'message' => $headers['accept-language'] === 'fr'
            ? 'Votre photo semble invalide. Veuillez fournir une photo envoyée depuis le système de partage de votre "Nintendo Switch 2".'
            : 'Your photo seems invalid. Please provide a photo sent from "Nintendo Switch 2" sharing system.'
    ]));
}

$branchName = "add-photo-" . time();

$refData = githubApi("GET", "/repos/$owner/$repo/git/ref/heads/$baseBranch", $githubToken);

$baseSha = $refData['object']['sha'];

githubApi("POST", "/repos/$owner/$repo/git/refs", $githubToken, [
  "ref" => "refs/heads/$branchName",
  "sha" => $baseSha
]);

$authorName = empty($currentUser['username']) ? "Anonymous" : $currentUser['username'];
$authorEmail =  empty($currentUser['email']) ? "anoynmous@mariouniversalis.fr" : $currentUser['email'];
$authorLocale = empty($currentUser['locale']) ? "en" : $currentUser['locale'];

$photoContent = base64_encode(file_get_contents($photo['tmp_name']));

$uploadOK = false;
$triesCount = 0;

while(!$uploadOK && $triesCount < 5) {
  try {
    $photoName = ($triesCount > 0 || getUuidVersion($originalName) === null) ? uuidv4() : $originalName;
    $photoFileName = "$photoName.jpg";

    githubApi("PUT", "/repos/$owner/$repo/contents/public/photos/$photoFileName", $githubToken, [
      "message" => "Add photo $photoName",
      "content" => $photoContent,
      "branch" => $branchName,
      "author" => [
        "name" => $authorName,
        "email" => $authorEmail
      ],
    ]);

    $uploadOK = true;
  } catch (Exception $e) {
    $triesCount++;

    if ($triesCount >= 5) {
      http_response_code(500);
       die(json_encode([
        'error' => true,
        'message' => $headers['accept-language'] === 'fr'
            ? 'Impossible de sauvegarder votre photo : veuillez réessayer plus tard.'
            : 'Unable to save your photo: please try again later.'
    ]));
    }
  } 
}



$pr = githubApi("POST", "/repos/$owner/$repo/pulls", $githubToken, [
  "title" => "Ajout photo",
  "head" => $branchName,
  "base" => $baseBranch,
  "body" => "$authorName ($authorLocale) veut ajouter une nouvelle photo en ($x, $y)"
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
