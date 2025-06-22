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

    $stmt = $pdo->prepare("SELECT id as photoName, x, y, author_name as authorName FROM `mario-kart-world-photos` WHERE id = :id AND validated_at IS NOT NULL");
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