<?php

require_once __DIR__ . '/../api/___database.php';

require_once __DIR__ . '/../api/___album.php';

require_once __DIR__ . '/../api/___album-cover.php';

$albumId = $_GET['id'] ?? null;

$BASE_URL = 'https://www.mariouniversalis.fr/mario-kart-world-guessr';

$SHARE_URL = $BASE_URL . '/albums/' . $albumId;
$GAME_URL  = $BASE_URL . '/#/albums/' . ($albumId ?? 'not-found');

function isPreviewBot(string $ua): bool {
    if ($ua === '') {
        return false;
    }

    $ua = strtolower($ua);

    $bots = [
        // Réseaux sociaux / previews
        'facebookexternalhit',
        'facebot',
        'twitterbot',
        'discordbot',
        'slackbot',
        'linkedinbot',
        'pinterestbot',
        'vkshare',

        // Messageries avec preview
        'whatsapp',
        'telegrambot',
        'applebot',          // iMessage / Apple
        'skypeuripreview',
        'teamsbot',

        // Reddit
        'redditbot',

        // (optionnel) moteurs de recherche
        'googlebot',
        'bingbot',
        'yandexbot',
        'duckduckbot',
        'baiduspider',
        'semrushbot',
    ];

    foreach ($bots as $bot) {
        if (strpos($ua, $bot) !== false) {
            return true;
        }
    }

    return false;
}

function getDescription(int $photosCount, string $authorName): string {
    return 'Discover ' . $photosCount . ' photo' . ($photosCount > 1 ? 's' : '') . ' from "Mario Kart World" in this album made by ' . $authorName . ' in "Mario Kart World Guessr".';
}

function buildAlbumJsonLd(array $album, string $coverUrl): array {
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
        'description'=> getDescription(count($album['photos'] ?? []), $authorName ?? 'an user'),
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
            'name'         => 'Photo at position ' . $photo['position'],
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
    header("Location: $GAME_URL", true, 308);
    exit;
}

$userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';

if(!isPreviewBot($userAgent)) {
    header("Location: $GAME_URL", true, 308);
    exit;
}

$album = getAlbumById($pdo, $albumId);
if (!$album) {
    header("Location: $GAME_URL", true, 308);
    exit;
}

$authorName   = $album['author']['name'] ?? '';
$photosCount  = count($album['photos'] ?? []);
$coverUrl     = getPublicAlbumCoverFromDisk($albumId);

$metaTitle = $album['name'];

$metaDescription = getDescription($photosCount, $authorName);

$jsonLd = buildAlbumJsonLd($album, $coverUrl);

header('Content-Type: text/html; charset=utf-8');
?>
<!doctype html>
<html lang="fr">
<head>
    <meta charset="utf-8" />
    <title><?= htmlspecialchars($metaTitle, ENT_QUOTES, 'UTF-8') ?></title>

    <link rel="canonical" href="<?= htmlspecialchars($SHARE_URL, ENT_QUOTES, 'UTF-8') ?>" />

    <!-- Open Graph -->
    <meta property="og:title" content="<?= htmlspecialchars($metaTitle, ENT_QUOTES, 'UTF-8') ?>" />
    <meta property="og:description" content="<?= htmlspecialchars($metaDescription, ENT_QUOTES, 'UTF-8') ?>" />
    <meta property="og:image" content="<?= htmlspecialchars($coverUrl, ENT_QUOTES, 'UTF-8') ?>" />
    <meta property="og:url" content="<?= htmlspecialchars($SHARE_URL, ENT_QUOTES, 'UTF-8') ?>" />
    <meta property="og:type" content="website" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="<?= htmlspecialchars($metaTitle, ENT_QUOTES, 'UTF-8') ?>" />
    <meta name="twitter:description" content="<?= htmlspecialchars($metaDescription, ENT_QUOTES, 'UTF-8') ?>" />
    <meta name="twitter:image" content="<?= htmlspecialchars($coverUrl, ENT_QUOTES, 'UTF-8') ?>" />

    <!-- JSON-LD -->
    <script type="application/ld+json">
<?= json_encode($jsonLd, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) ?>

    </script>
</head>
<body>
    <script>
        window.location = <?= json_encode($GAME_URL) ?>;
    </script>
</body>
</html>

