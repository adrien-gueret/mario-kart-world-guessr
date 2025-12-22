<?php

require_once __DIR__ . '/___middleware.php';

require_once __DIR__ . '/___github.php';

allowMethod('GET');

if (empty($currentUser)) {
    http_response_code(401);
    echo json_encode(['error' => true, 'message' => 'Unauthorized']);
    exit;
}

try {
    $stmt = $pdo->prepare(
        "SELECT 
            d.id,
            d.daily_date AS dailyDate
        FROM `mario-kart-world-dailies` d
        LEFT JOIN `mario-kart-world-leaderboard-daily` ld
            ON ld.daily_id = d.id
        WHERE ld.player_id = :playerId
        ORDER BY d.daily_date DESC"
    );

    $stmt->bindParam(':playerId', $currentUser['id'], PDO::PARAM_INT);
    $stmt->execute();

    $dailies = $stmt->fetchAll(PDO::FETCH_ASSOC);  

    echo json_encode($dailies); 
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error']);
}