<?php 

require_once __DIR__ . '/___middleware.php';

require_once __DIR__ . '/___achievements.php';

allowMethod('GET');

if (empty($currentUser)) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

try {
    $stmt = $pdo->prepare(
        "SELECT n.id, n.notification_type, n.specific_data, n.created_at
        FROM `mario-kart-world-notifications` n
        WHERE n.id_user = :userId AND n.read_at IS NULL
        ORDER BY n.created_at DESC
      ");
        
    $stmt->bindValue(':userId', $currentUser['id'], PDO::PARAM_INT);

    $stmt->execute();
    
    $notifications = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($notifications);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'error' => $e->getMessage(),
        'message' => 'Database error: ' . $e->getMessage(),
    ]);
}