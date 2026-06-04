<?php 

require_once __DIR__ . '/___middleware.php';

allowMethod('GET');

try {
    $stmt = $pdo->prepare(
        "SELECT 
            p.id,
            p.difficulty,
            p.validated_at AS validatedAt,
            p.x,
            p.y,

            COALESCE(ch.characters, JSON_ARRAY()) AS characters,
            CAST(COALESCE(sug.suggestionCount, 0) AS UNSIGNED) AS suggestionCount,

            CASE
                WHEN p.validated_at IS NOT NULL 
                    AND p.validated_at <= NOW() - INTERVAL 5 MINUTE
                THEN CONCAT('https://ik.imagekit.io/mkwg/', p.id, '.jpg')
                ELSE CONCAT('https://www.mariouniversalis.fr/mario-kart-world-guessr/api/photo-proxy?id=', p.id)
            END AS photoUrl

        FROM `mario-kart-world-photos` p

        /* Agrégation des personnages par photo */
        LEFT JOIN (
            SELECT
                cp.id_photo,
                JSON_ARRAYAGG(DISTINCT cp.id_character) AS characters
            FROM `mario-kart-world-characters-photos` cp
            GROUP BY cp.id_photo
        ) ch ON ch.id_photo = p.id

        /* Agrégation du compteur de suggestions par photo */
        LEFT JOIN (
            SELECT
                s.photo_id,
                CAST(
                COUNT(DISTINCT CASE
                    WHEN (s.id IS NOT NULL AND g.player_id IS NULL) THEN s.id
                    WHEN (g.player_id <> p2.author_id) THEN s.id
                    ELSE NULL
                END) AS UNSIGNED
                ) AS suggestionCount
            FROM `mario-kart-world-suggestions` s
            LEFT JOIN `mario-kart-world-games` g
                ON g.id = s.game_id
            INNER JOIN `mario-kart-world-photos` p2
                ON p2.id = s.photo_id
            GROUP BY s.photo_id
        ) sug ON sug.photo_id = p.id

        WHERE p.rejected_at IS NULL

        ORDER BY
            (p.validated_at IS NULL) DESC,
            CASE WHEN p.validated_at IS NULL THEN p.github_issue_number ELSE NULL END ASC,
            p.validated_at DESC;"
    );
    $stmt->execute();
    
    $photos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($photos as &$photo) {
        if (isset($photo['characters']) && $photo['characters'] !== null) {
            $photo['characters'] = json_decode($photo['characters'], true);
        } else {
            $photo['characters'] = [];
        }
    }
    
    echo json_encode($photos);    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error']);
}