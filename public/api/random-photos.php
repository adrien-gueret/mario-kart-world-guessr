<?php 

require_once __DIR__ . '/___middleware.php';

allowMethod('GET');

try {
    $stmt = $pdo->prepare("SELECT id as photoName, author_name as authorName FROM `mario-kart-world-photos` WHERE is_validated = 1 ORDER BY RAND()");
    $stmt->execute();
    
    $photos = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode($photos);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error']);
}