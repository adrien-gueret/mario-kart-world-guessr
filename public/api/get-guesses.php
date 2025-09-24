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


    $stmt = $pdo->prepare("SELECT 0 as id, p.x, p.y, 1 as isAnswer
                            FROM `mario-kart-world-photos` p
                            WHERE p.id = :id
                            UNION ALL
                            SELECT s.id, s.x, s.y, 0 as isAnswer
                            FROM `mario-kart-world-suggestions` s
                            LEFT JOIN `mario-kart-world-games` g ON s.game_id = g.id
                            LEFT JOIN `mario-kart-world-photos` p2 ON p2.id = s.photo_id
                            WHERE p2.validated_at IS NOT NULL
                            AND s.photo_id = :id
                            AND (g.player_id IS NULL OR g.player_id != p2.author_id)");
    $stmt->bindParam(':id', $id, PDO::PARAM_STR);
    $stmt->execute();
    
    $guesses = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode($guesses);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error']);
}