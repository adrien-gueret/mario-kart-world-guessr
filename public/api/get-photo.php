<?php 

require_once __DIR__ . '/___middleware.php';

allowMethod('GET');

try {
    $id = isset($_GET['id']) ? $_GET['id'] : null;

    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing photo ID']);
        exit;
    }

    $stmt = $pdo->prepare(
        "SELECT DISTINCT
            p.id as photoName, p.x, p.y,
            md.guess_median_x, md.guess_median_y,
            COUNT(s.photo_id) as guesses_count
        FROM `mario-kart-world-photos` p
        LEFT JOIN `mario-kart-world-suggestions` s 
            ON p.id = s.photo_id
        LEFT JOIN `mario-kart-world-games` g 
            ON s.game_id = g.id
        LEFT JOIN (
            SELECT DISTINCT
                s.photo_id,
                MEDIAN(s.x) OVER (PARTITION BY s.photo_id) AS guess_median_x,
                MEDIAN(s.y) OVER (PARTITION BY s.photo_id) AS guess_median_y
            FROM 
                `mario-kart-world-suggestions` s
            LEFT JOIN `mario-kart-world-games` g ON s.game_id = g.id
            WHERE (g.player_id IS NULL OR g.player_id != 1)
        ) md ON p.id = md.photo_id
        WHERE p.id = :id 
        AND p.validated_at IS NOT NULL
        AND (g.player_id IS NULL OR g.player_id != 1)
");
    $stmt->bindParam(':id', $id, PDO::PARAM_STR);
    $stmt->execute();
    
    $photo = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$photo) {
        http_response_code(404);
        echo json_encode(['error' => 'Photo not found or not validated']);
        exit;
    }
    
    echo json_encode($photo);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error']);
}