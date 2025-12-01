<?php 

require_once __DIR__ . '/___middleware.php';

require_once __DIR__ . '/___coordinates.php';

require_once __DIR__ . '/___achievements.php';

allowMethod('GET');

if (empty($currentUser)) {
    http_response_code(401);
     echo json_encode(['error' => true, 'message' => 'Unauthorized']);
    exit;
}

try {
    $stmt = $pdo->prepare(
        "SELECT c.id, c.position,
        CASE
            WHEN c.id_achievement IS NULL THEN TRUE
            WHEN ua.id_achievement IS NOT NULL THEN TRUE
            ELSE FALSE
        END AS is_unlocked
        FROM `mario-kart-world-characters` c
        LEFT JOIN `mario-kart-world-users-unlocked-achievements` ua
        ON c.id_achievement = ua.id_achievement AND ua.id_user = :userId
        LEFT JOIN `mario-kart-world-achievements` a ON a.id = c.id_achievement
        ORDER BY c.position
      ");
        
    $stmt->bindValue(':userId', $currentUser['id'], PDO::PARAM_INT);

    $stmt->execute();
    
    $fetchedCharacters = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $characters = [];

    foreach($fetchedCharacters as $fetchedCharacter) {
        if (!$isDev && $fetchedCharacter['position'] === 0) {
            continue;
        }
        $characters[] = [
            'id' => $fetchedCharacter['id'],
            'isUnlocked' => $fetchedCharacter['is_unlocked'] === 1,
        ];    
    }

    echo json_encode($characters);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'error' => $e->getMessage(),
        'message' => 'Database error: ' . $e->getMessage(),
    ]);
}