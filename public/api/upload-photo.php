<?php

require_once __DIR__ . '/___middleware.php';

require_once __DIR__ . '/___github.php';

allowMethod('POST');

if (empty($currentUser)) {
    http_response_code(401);
    die(json_encode([
      'error' => true,
      'message' => $headers['accept-language'] === 'fr'
          ? 'Vous semblez être déconnecté. Connectez-vous et réessayez.'
          : 'You seem to be logged out. Please log in and try again.'
    ]));
    exit;
}

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

$isJpgExtension = $extension === 'jpg' || $extension === 'jpeg';
$isJpgMimeType = $mimeType === 'image/jpeg';

if (!$isJpgExtension || !$isJpgMimeType) {
    http_response_code(400);
    die(json_encode([
        'error' => true,
        'message' => $headers['accept-language'] === 'fr'
            ? 'Votre photo semble invalide. Veuillez fournir une photo envoyée depuis le système de partage de votre "Nintendo Switch 2".'
            : 'Your photo seems invalid. Please provide a photo sent from "Nintendo Switch 2" sharing system.'
    ]));
}

$targetRatio = 16 / 9;
$isLandscape = $width > $height;
$isRatioValid = abs(($width / $height) - $targetRatio) < 0.01;
$isMinSizeValid = $width >= 1600 && $height >= 900;

$isSizeValid = $isLandscape && $isRatioValid && $isMinSizeValid;

if (!$isSizeValid) {
    http_response_code(400);
    die(json_encode([
        'error' => true,
        'message' => $headers['accept-language'] === 'fr'
            ? 'Les dimensions de votre photo sont invalides. Elle doit être au format paysage, respecter le ratio 16:9 (par exemple 1920x1080) et mesurer au minimum 1600x900 pixels.'
            : 'Your photo dimensions are invalid. It must be in landscape format, follow the 16:9 ratio (for example 1920x1080) and be at least 1600x900 pixels.'
    ]));
}

$authorName = empty($currentUser['username']) ? "Anonymous" : $currentUser['username'];
$authorLocale = empty($currentUser['locale']) ? "en" : $currentUser['locale'];

$photoName = getUuidVersion($originalName) !== null ? $originalName : uuidv4();
$photoFileName = "$photoName.jpg";

$pendingDir = __DIR__ . '/../photos/pending';
if (!is_dir($pendingDir)) {
    @mkdir($pendingDir, 0755, true);
}
$pendingPath = "$pendingDir/$photoFileName";

if (!move_uploaded_file($photo['tmp_name'], $pendingPath)) {
    http_response_code(500);
    die(json_encode([
        'error' => true,
        'message' => $headers['accept-language'] === 'fr'
            ? 'Impossible de sauvegarder votre photo : veuillez réessayer plus tard.'
            : 'Unable to save your photo: please try again later.'
    ]));
}

$pendingUrl = "https://www.mariouniversalis.fr/mario-kart-world-guessr/photos/pending/$photoFileName";

$issueBody = "<!-- photo-id: $photoName -->\n\n"
    . "**Author:** $authorName ($authorLocale)\n"
    . "**Coordinates:** ($x, $y)\n\n"
    . "![preview]($pendingUrl)\n\n"
    . "---\n"
    . "_Close as **completed** to validate, or as **not planned** with a comment explaining why to reject._";

try {
    $issue = githubApi("POST", "/repos/$owner/$repo/issues", $githubToken, [
        "title" => "Photo à valider ($authorName)",
        "body" => $issueBody,
        "labels" => ["pending-photo"],
    ]);
} catch (Exception $e) {
    @unlink($pendingPath);
    http_response_code(500);
    die(json_encode([
        'error' => true,
        'message' => $headers['accept-language'] === 'fr'
            ? 'Impossible de soumettre votre photo : veuillez réessayer plus tard.'
            : 'Unable to submit your photo: please try again later.'
    ]));
}

$stmt = $pdo->prepare("INSERT INTO `mario-kart-world-photos` (id, x, y, github_issue_number, author_id)
  VALUES (:id, :x, :y, :github_issue_number, :author_id)
");
$stmt->bindParam(':id', $photoName, PDO::PARAM_STR);
$stmt->bindParam(':x', $x, PDO::PARAM_INT);
$stmt->bindParam(':y', $y, PDO::PARAM_INT);
$stmt->bindParam(':github_issue_number', $issue['number'], PDO::PARAM_INT);
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
  "photo_id" => $photoName,
  "issue_number" => $issue["number"]
]);
