<?php

// Activer l'affichage des erreurs
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// composer autoload
require __DIR__ . '/vendor/autoload.php';

require_once __DIR__ . '/___environment.php';

require_once __DIR__ . '/___database.php';

function indexPhotosIntoAlgolia($idsPhotos = []) {
    global $pdo;
    $client = \Algolia\AlgoliaSearch\Api\SearchClient::create(getenv('ALGOLIA_APP_ID'), getenv('ALGOLIA_API_KEY'));

    $sql =
    "SELECT
        p.id, u.id as authorId, UNIX_TIMESTAMP(validated_at) AS validatedAt,
	    CONCAT('https://ik.imagekit.io/mkwg/', p.id, '.jpg') as photoUrl,
	    u.username as authorName, u.mario_character as authorCharacter,
 	    COALESCE(ch.characters, JSON_ARRAY()) AS characters
        FROM `mario-kart-world-photos` p
        JOIN `mario-kart-world-users` u
            ON p.author_id = u.id
        LEFT JOIN (
            SELECT
                cp.id_photo,
                JSON_ARRAYAGG(DISTINCT cp.id_character) AS characters
            FROM `mario-kart-world-characters-photos` cp
            GROUP BY cp.id_photo
        ) ch ON ch.id_photo = p.id
        WHERE p.validated_at IS NOT NULL";

    if (!empty($idsPhotos)) {
        $sql .= " AND p.id IN (" . implode(',', array_fill(0, count($idsPhotos), '?')) . ")";
    }

    $request = $pdo->prepare($sql);

    $request->execute($idsPhotos);

    $photos = $request->fetchAll(\PDO::FETCH_ASSOC);

    $objectsToIndex = [];
    
    foreach($photos as $photo) {
        $id = $photo['id'];
        $characters = [];

        if (isset($photo['characters']) && $photo['characters'] !== null) {
            $characters = json_decode($photo['characters'], true);
        }

        if (empty($characters)) {
            $characters = ["none"];
        }

        $objectsToIndex[] = [
            'objectID' => $id,
            'id' => $id,
            'author' => [
                'id' => intval($photo['authorId']),
                'name' => htmlspecialchars_decode($photo['authorName'], ENT_QUOTES),
                'character' => $photo['authorCharacter'],
            ],
            'photoUrl' => $photo['photoUrl'],
            'characters' => $characters,
            'validatedAt' => intval($photo['validatedAt']),
        ];
    }
    
    // Index all objects in one batch call
    if (!empty($objectsToIndex)) {
        $client->saveObjects('photos', $objectsToIndex);
    }
}

function indexAuthorPhotosIntoAlgolia($authorId) {
    global $pdo;

    $sql = "SELECT id FROM `mario-kart-world-photos` WHERE author_id = :authorId AND validated_at IS NOT NULL";
    $request = $pdo->prepare($sql);
    $request->bindParam(':authorId', $authorId);
    $request->execute();

    $photoIds = $request->fetchAll(\PDO::FETCH_COLUMN);

    if (!empty($photoIds)) {
        indexPhotosIntoAlgolia($photoIds);
    }
}

if(isset($_GET['indexAll'])) {
    indexPhotosIntoAlgolia();
    echo 'ok';
}