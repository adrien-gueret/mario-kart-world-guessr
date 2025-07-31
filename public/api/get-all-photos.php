<?php 

require_once __DIR__ . '/___middleware.php';

allowMethod('GET');

try {
    $stmt = $pdo->prepare("SELECT id as photoName, x, y
        FROM `mario-kart-world-photos`
        WHERE validated_at IS NOT NULL AND validated_at <= NOW() - INTERVAL 5 MINUTE"
    );

    $stmt->execute();
    
    $photos = $stmt->fetchAll(PDO::FETCH_ASSOC);  
  
    echo json_encode($photos);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error']);
}