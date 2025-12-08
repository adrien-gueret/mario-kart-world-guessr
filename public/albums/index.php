<?php

require_once __DIR__ . '/../api/___database.php';

require_once __DIR__ . '/../api/___album.php';

require_once __DIR__ . '/../api/___album-cover.php';

require_once __DIR__ . '/../___services/getIndexHTML.php';

$albumId = $_GET['id'] ?? null;

$BASE_URL = 'https://www.mariouniversalis.fr/mario-kart-world-guessr';

$SHARE_URL = $BASE_URL . '/albums/' . $albumId;

function getDescription(int $photosCount, string $authorName, string $lang): string {
    return $lang === 'fr'
        ? 'Découvrez ' . $photosCount . ' photo' . ($photosCount > 1 ? 's' : '') . ' de "Mario Kart World" dans cet album de ' . $authorName . ', créé via "Mario Kart World Guessr".'
        : 'Discover ' . $photosCount . ' photo' . ($photosCount > 1 ? 's' : '') . ' from "Mario Kart World" in this album by ' . $authorName . ', created via "Mario Kart World Guessr".';
}

function buildAlbumJsonLd(array $album, string $coverUrl, string $lang): array {
    global $BASE_URL;
    global $SHARE_URL;
  
    $albumId     = $album['id'];
    $albumUrl    = $SHARE_URL;
    $authorName  = $album['author']['name'] ?? null;
    $authorAvatar= $album['author']['character'] ? $BASE_URL.'/ui/pins/icon-' . $album['author']['character'] . '.png' : null;

    $jsonLd = [
        '@context'   => 'https://schema.org',
        '@type'      => 'ImageGallery',
        '@id'        => $albumUrl,
        'name'       => $album['name'],
        'description'=> getDescription(count($album['photos'] ?? []), $authorName ?? 'an user', $lang),
        'url'        => $albumUrl,
        'image'      => $coverUrl,
    ];

    // Creator (auteur de l’album)
    if ($authorName) {
        $creator = [
            '@type' => 'Person',
        ];
        if ($authorName) {
            $creator['name'] = $authorName;
        }
        if ($authorAvatar) {
            $creator['image'] = $authorAvatar;
        }
        $jsonLd['creator'] = $creator;
    }

    // hasPart : liste des photos
    $photos = $album['photos'] ?? [];
    $parts  = [];

    foreach ($photos as $photo) {
        $photoId = $photo['id'] ?? null;
        $photoUrl = $photo['photoUrl'] ?? null;
        if (!$photoId || !$photoUrl) {
            continue;
        }

        $part = [
            '@type'        => 'Photograph',
            '@id'          => $photoUrl,
            'name'         => $lang === 'fr' ? 'Photo à la position ' . $photo['position'] : 'Photo at position ' . $photo['position'],
            'description'  => null,
            'image'        => $photoUrl,
            'url'          => $photoUrl,
        ];

        if (!empty($photo['validatedAt'])) {
            $part['dateCreated'] = $photo['validatedAt'];
        }

        if ($authorName) {
            $photoCreator = [
                '@type' => 'Person',
            ];
           
            if ($authorName) {
                $photoCreator['name'] = $authorName;
            }
            $part['creator'] = $photoCreator;
        }

        $parts[] = $part;
    }

    if ($parts) {
        $jsonLd['hasPart'] = $parts;
    }

    return $jsonLd;
}

if (!$albumId) {
    http_response_code(404);
    echo getIndexHTML([
        'title' => 'Mario Kart World Guessr - Album not found',
        'description' => 'The requested album was not found.',
    ]);
    exit;
}

$userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';

$album = getAlbumById($pdo, $albumId);
if (!$album) {
    http_response_code(404);
    echo getIndexHTML([
        'title' => 'Mario Kart World Guessr - Album not found',
        'description' => 'The requested album was not found.',
    ]);
    exit;
}

$authorName   = $album['author']['name'] ?? '';
$lang         = $album['author']['locale'] ?? 'en';
$photosCount  = count($album['photos'] ?? []);
$coverUrl     = getPublicAlbumCoverFromDisk($albumId);

$metaDescription = getDescription($photosCount, $authorName, $lang);

$jsonLd = buildAlbumJsonLd($album, $coverUrl, $lang);

header('Content-Type: text/html; charset=utf-8');

$html = getIndexHTML([
    'title' => 'Mario Kart World Guessr - '.$album['name'],
    'description' => $metaDescription,
    'thumbnail' => $coverUrl,
    'thumbnailWidth' => 1600,
    'thumbnailHeight' => 900,
    'url' => 'https://www.mariouniversalis.fr/mario-kart-world-guessr/albums/' . $albumId,
    'ogType' => 'article',
    'jsonLd' => $jsonLd
]);

echo $html;
