<?php 

require_once __DIR__ . '/___middleware.php';

$_DELETE = allowMethod('DELETE');

if (empty($currentUser)) {
    http_response_code(401);
     echo json_encode(['error' => true, 'message' => 'Unauthorized']);
    exit;
}

try {
    $stmt = $pdo->prepare(
        "DELETE FROM `mario-kart-world-notifications` n
        WHERE n.id_user = :userId");
        
    $stmt->bindValue(':userId', $currentUser['id'], PDO::PARAM_INT);

    $stmt->execute();

    echo json_encode([]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'error' => $e->getMessage(),
        'message' => 'Database error: ' . $e->getMessage(),
    ]);
}