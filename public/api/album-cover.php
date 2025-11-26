<?php

require_once __DIR__ . '/___middleware.php';

require_once __DIR__ . '/___github.php';

allowMethod('GET');


header('Content-Type: image/jpeg');

function output_default() {
  $defaultUrl = 'https://www.mariouniversalis.fr/mario-kart-world-guessr/backgrounds/new-album.avif';

  if (!@readfile($defaultUrl)) {
    http_response_code(204);
  }
  exit;
}

$albumId = isset($_GET['id']) ? $_GET['id'] : '';

if (empty($albumId)) {
  output_default();
}

try {
  $stmt = $pdo->prepare(
    "SELECT
      CASE
        WHEN p.validated_at IS NOT NULL 
            AND p.validated_at <= NOW() - INTERVAL 5 MINUTE
        THEN CONCAT('https://www.mariouniversalis.fr/mario-kart-world-guessr/photos/', p.id, '.jpg')
        ELSE CONCAT('https://www.mariouniversalis.fr/mario-kart-world-guessr/api/photo-proxy?pr_id=', p.github_pr_number)
    END AS photo_url
    FROM `mario-kart-world-albums-photos` AS ap
    LEFT JOIN `mario-kart-world-photos` AS p ON ap.id_photo = p.id
    WHERE ap.id_album = :albumId
    ORDER BY ap.position");

  $stmt->bindValue(':albumId', $albumId, PDO::PARAM_INT);

  $stmt->execute();

  $fetchedPhotos = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    output_default();
}

if (count($fetchedPhotos) === 0) {
    output_default();
}

function load_image_from_url($url) {
  $data = @file_get_contents($url);

  if ($data === false && function_exists('curl_init')) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    $data = curl_exec($ch);
    curl_close($ch);
  }
  
  if ($data === false) {
    return false;
  }
  
  $im = @imagecreatefromstring($data);
  return $im ?: false;
}

$images = [];
foreach ($fetchedPhotos as $photo) {
  $img = load_image_from_url($photo['photo_url']);
  if ($img !== false) {
    $images[] = $img;
  }
}

if (count($images) === 0) {
  output_default();
}

// Create collage canvas
$w = 1600;
$h = 900;
$canvas = imagecreatetruecolor($w, $h);
$bg = imagecolorallocate($canvas, 255, 255, 255);
imagefill($canvas, 0, 0, $bg);

if (count($images) === 1) {
    // single image: scale to cover while preserving aspect ratio
    $src = $images[0];
    $sw = imagesx($src);
    $sh = imagesy($src);
    $scale = max($w / $sw, $h / $sh);
    $nw = (int) round($sw * $scale);
    $nh = (int) round($sh * $scale);
    $tmp = imagecreatetruecolor($nw, $nh);
    imagecopyresampled($tmp, $src, 0, 0, 0, 0, $nw, $nh, $sw, $sh);
    $x = (int) floor(($w - $nw) / 2);
    $y = (int) floor(($h - $nh) / 2);
    imagecopy($canvas, $tmp, $x, $y, 0, 0, $nw, $nh);
    imagedestroy($tmp);
} elseif (count($images) === 2) {
    // two images: side by side, ensure both halves are filled and cropped consistently
    $dstW = (int) floor($w / 2);
    $dstH = $h;
    for ($i = 0; $i < 2; $i++) {
        $src = $images[$i];
        $sw = imagesx($src);
        $sh = imagesy($src);
        // scale to cover the dst area
        $scale = max($dstW / $sw, $dstH / $sh);
        $nw = (int) round($sw * $scale);
        $nh = (int) round($sh * $scale);
        $tmp = imagecreatetruecolor($nw, $nh);
        imagecopyresampled($tmp, $src, 0, 0, 0, 0, $nw, $nh, $sw, $sh);
        // center-crop the scaled image to exact dstW x dstH
        $dstImg = imagecreatetruecolor($dstW, $dstH);
        $srcX = (int) floor(max(0, ($nw - $dstW) / 2));
        $srcY = (int) floor(max(0, ($nh - $dstH) / 2));
        imagecopy($dstImg, $tmp, 0, 0, $srcX, $srcY, $dstW, $dstH);
        // place on canvas
        $x = $i * $dstW;
        imagecopy($canvas, $dstImg, $x, 0, 0, 0, $dstW, $dstH);
        imagedestroy($tmp);
        imagedestroy($dstImg);
    }
} else {
    // three images: left big, right top and bottom
    $leftW = (int) floor($w / 2);
    $leftH = $h;
    // left image
    $src = $images[0];
    $sw = imagesx($src);
    $sh = imagesy($src);
    $scale = max($leftW / $sw, $leftH / $sh);
    $nw = (int) round($sw * $scale);
    $nh = (int) round($sh * $scale);
    $tmp = imagecreatetruecolor($nw, $nh);
    imagecopyresampled($tmp, $src, 0, 0, 0, 0, $nw, $nh, $sw, $sh);
    $x = (int) floor(($leftW - $nw) / 2);
    $y = (int) floor(($leftH - $nh) / 2);
    imagecopy($canvas, $tmp, $x, $y, 0, 0, $nw, $nh);
    imagedestroy($tmp);

    // right column
    $rightW = $w - $leftW;
    $rightH = (int) floor($h / 2);
    for ($i = 1; $i <= 2; $i++) {
        $src = $images[$i];
        $sw = imagesx($src);
        $sh = imagesy($src);
        $scale = max($rightW / $sw, $rightH / $sh);
        $nw = (int) round($sw * $scale);
        $nh = (int) round($sh * $scale);
        $tmp = imagecreatetruecolor($nw, $nh);
        imagecopyresampled($tmp, $src, 0, 0, 0, 0, $nw, $nh, $sw, $sh);
        $x = $leftW + (int) floor(($rightW - $nw) / 2);
        $y = ($i - 1) * $rightH + (int) floor(($rightH - $nh) / 2);
        imagecopy($canvas, $tmp, $x, $y, 0, 0, $nw, $nh);
        imagedestroy($tmp);
    }
}

// free original images
foreach ($images as $im) {
    @imagedestroy($im);
}

// Output JPEG

imagejpeg($canvas, null, 85);
imagedestroy($canvas);
exit;