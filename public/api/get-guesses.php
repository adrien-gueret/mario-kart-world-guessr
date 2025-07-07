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

    $stmt = $pdo->prepare("SELECT id, x, y
                            FROM `mario-kart-world-suggestions`
                            WHERE photo_id = :id AND (player_id IS NULL OR player_id != 1)");
    $stmt->bindParam(':id', $id, PDO::PARAM_STR);
    $stmt->execute();
    
    $guesses = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode($guesses);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error']);
}