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
        "SELECT
            n.id, n.notification_type as `type`, n.specific_data as specificData,
            n.created_at as createdAt
        FROM `mario-kart-world-notifications` n
        WHERE n.id_user = :userId
        ORDER BY n.created_at DESC
      ");
        
    $stmt->bindValue(':userId', $currentUser['id'], PDO::PARAM_INT);

    $stmt->execute();
    
    $notifications = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $serverTz = date_default_timezone_get();
    $notifications = array_map(function ($notification) use ($serverTz, $pdo, $currentUser) {
        $date = new DateTime($notification['createdAt'], new DateTimeZone('Europe/Paris'));
        $date->setTimezone(new DateTimeZone('UTC'));

        if ($notification['type'] === 'photo_validated') {
          unlockAchievement($pdo, $currentUser['id'], 'photo_validated');
        }

        return [
            'id' => (int)$notification['id'],
            'type' => $notification['type'],
            'specificData' => $notification['specificData'] !== null ? json_decode($notification['specificData'], true) : null,
            'createdAt' => $date->format('c'),
        ];
    }, $notifications);

    echo json_encode($notifications);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'error' => $e->getMessage(),
        'message' => 'Database error: ' . $e->getMessage(),
    ]);
}