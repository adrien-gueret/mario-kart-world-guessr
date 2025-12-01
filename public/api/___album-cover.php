<?php

function _getAlbumCoverPhotos(PDO $pdo, int $albumId) {
  $defaultCoverPhotos = [
    [
      'id' => '0',
      'photo_url' => 'https://www.mariouniversalis.fr/mario-kart-world-guessr/backgrounds/albums/default-album-cover.jpg'
    ]
  ];

  try {
    $stmt = $pdo->prepare(
      "SELECT id,
        CASE
          WHEN p.validated_at IS NOT NULL 
              AND p.validated_at <= NOW() - INTERVAL 5 MINUTE
          THEN CONCAT('https://www.mariouniversalis.fr/mario-kart-world-guessr/photos/', p.id, '.jpg')
          ELSE CONCAT('https://www.mariouniversalis.fr/mario-kart-world-guessr/api/photo-proxy?pr_id=', p.github_pr_number)
      END AS photo_url
      FROM `mario-kart-world-albums-photos` AS ap
      LEFT JOIN `mario-kart-world-photos` AS p ON ap.id_photo = p.id
      WHERE ap.id_album = :albumId
      ORDER BY ap.position LIMIT 3");

    $stmt->bindValue(':albumId', $albumId, PDO::PARAM_INT);
    $stmt->execute();
    $fetchedPhotos = $stmt->fetchAll(PDO::FETCH_ASSOC);
  } catch (PDOException $e) {
    return $defaultCoverPhotos;
  }

  return count($fetchedPhotos) === 0
    ? $defaultCoverPhotos
    : $fetchedPhotos;
}

function _getAlbumCoverFilenameFromPhotos($photos) {
  $hashInput = '';
  foreach ($photos as $photo) {
    $hashInput .= $photo['id'];
  }
  return md5($hashInput) . '.jpg';
}

function getPublicAlbumCoverFromDisk(int $albumId) {
  $albumCoversDir = getAlbumCoverFolder($albumId);
  if (!is_dir($albumCoversDir)) {
    return 'https://www.mariouniversalis.fr/mario-kart-world-guessr/backgrounds/albums/default-album-cover.jpg';
  }

  $files = glob($albumCoversDir . '/*.jpg');
  if ($files === false || count($files) === 0) {
    return 'https://www.mariouniversalis.fr/mario-kart-world-guessr/backgrounds/albums/default-album-cover.jpg';
  }

  $filePath = $files[0];
  return 'https://www.mariouniversalis.fr/mario-kart-world-guessr/album-covers/' . $albumId . '/' . basename($filePath);
}

function getAlbumCover(PDO $pdo, int $albumId) {
  $photos = _getAlbumCoverPhotos($pdo, $albumId);
  $coverFilename = _getAlbumCoverFilenameFromPhotos($photos);

  return [
    'photos' => $photos,
    'coverFilename' => $coverFilename
  ];
}

function getAlbumCoverFolder(int $albumId) {
  return __DIR__ . '/../album-covers/' . $albumId;
}

function createAlbumCover(PDO $pdo, int $albumId) {
  $albumCoversDir = getAlbumCoverFolder($albumId);

  if (!is_dir($albumCoversDir)) {
    @mkdir($albumCoversDir, 0777, true);
  } else {
    $baseDir = realpath(__DIR__ . '/../album-covers');
    $realDir = realpath($albumCoversDir);
    if ($realDir === false || $baseDir === false || strpos($realDir, $baseDir) !== 0) {
      return false;
    }

    $files = glob($realDir . '/*');
    if ($files !== false) {
      foreach ($files as $f) {
        if (is_file($f)) {
          @unlink($f);
        }
      }
    }
  }

  $cover = getAlbumCover($pdo, $albumId);
  $photos = $cover['photos'];

  $albumCoverFileName = $cover['coverFilename'];
  $albumCoverFile = $albumCoversDir . '/' . $albumCoverFileName;

  $load_image_from_url = function($url) {
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
  };

  $images = [];
  foreach ($photos as $photo) {
    $img = $load_image_from_url($photo['photo_url']);
    if ($img !== false) {
      $images[] = $img;
    }
  }

  if (count($images) === 0) {
    return false;
  }

  $w = 1600;
  $h = 900;
  $canvas = imagecreatetruecolor($w, $h);
  $bg = imagecolorallocate($canvas, 255, 255, 255);
  imagefill($canvas, 0, 0, $bg);

  $borderImage = null;

  if (count($images) === 1) {
    $borderImage = imagecreatefrompng(__DIR__ . '/../backgrounds/albums/borders-1-photo.png');
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
    $borderImage = imagecreatefrompng(__DIR__ . '/../backgrounds/albums/borders-2-photos.png');
    $dstW = (int) floor($w / 2);
    $dstH = $h;
    for ($i = 0; $i < 2; $i++) {
      $src = $images[$i];
      $sw = imagesx($src);
      $sh = imagesy($src);
      $scale = max($dstW / $sw, $dstH / $sh);
      $nw = (int) round($sw * $scale);
      $nh = (int) round($sh * $scale);
      $tmp = imagecreatetruecolor($nw, $nh);
      imagecopyresampled($tmp, $src, 0, 0, 0, 0, $nw, $nh, $sw, $sh);
      $dstImg = imagecreatetruecolor($dstW, $dstH);
      $srcX = (int) floor(max(0, ($nw - $dstW) / 2));
      $srcY = (int) floor(max(0, ($nh - $dstH) / 2));
      imagecopy($dstImg, $tmp, 0, 0, $srcX, $srcY, $dstW, $dstH);
      $x = $i * $dstW;
      imagecopy($canvas, $dstImg, $x, 0, 0, 0, $dstW, $dstH);
      imagedestroy($tmp);
      imagedestroy($dstImg);
    }
  } else {
    $borderImage = imagecreatefrompng(__DIR__ . '/../backgrounds/albums/borders-3-photos.png');
    $leftW = (int) floor($w / 2);
    $leftH = $h;
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

  foreach ($images as $im) {
    @imagedestroy($im);
  }

  $saved = false;

  if ($borderImage) {
    imagecopyresampled($canvas, $borderImage, 0, 0, 0, 0, $w, $h, imagesx($borderImage), imagesy($borderImage));
    imagedestroy($borderImage);
  }

  if (@imagejpeg($canvas, $albumCoverFile, 85)) {
    @chmod($albumCoverFile, 0777);
    $saved = true;
  }

  imagedestroy($canvas);

  return $saved ? $albumCoverFile : false;
}