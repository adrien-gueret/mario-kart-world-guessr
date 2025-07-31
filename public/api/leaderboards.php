<?php 

require_once __DIR__ . '/___middleware.php';

require_once __DIR__ . '/___coordinates.php';

allowMethod('GET');

$possibleModes = ['survival', 'goal'];

if (!isset($_GET['mode']) || !in_array($_GET['mode'], $possibleModes)) {
    http_response_code(400);
    die('{"error":true,"message":"Invalid mode"}');
}

$possibleDifficulties = ['50cc', '100cc', '150cc', 'mirror'];

if (!$isDailyMode && (!isset($_GET['difficulty']) || !in_array($_GET['difficulty'], $possibleDifficulties))) {
    http_response_code(400);
    die('{"error":true,"message":"Invalid difficulty"}');
}

try {
    $anonymousUserName = $headers['accept-language'] === 'fr' ? 'Anonyme' : 'Anonymous';
    $photoCountOrderType = $_GET['mode'] === 'survival' ? 'DESC' : 'ASC';
    
    $stmt = $pdo->prepare(
        "SELECT
            l.player_id playerId,
            l.score,
            l.photo_count photoCount,
            l.performed_at,
            IF(u.email IS NULL, '$anonymousUserName', u.username) AS playerName,
            IF(u.email IS NULL, 1, 0) AS isAnonymous,
            u.mario_character marioCharacter,
            ROW_NUMBER() OVER (
                ORDER BY photo_count $photoCountOrderType, score DESC, performed_at DESC
            ) AS rank
        FROM `mario-kart-world-leaderboard-goal-survival` l
        LEFT JOIN `mario-kart-world-users` u ON l.player_id = u.id
        WHERE l.difficulty = :difficulty and l.mode = :mode
    ");

    $stmt->bindParam(':difficulty', $_GET['difficulty'], PDO::PARAM_STR);
    $stmt->bindParam(':mode', $_GET['mode'], PDO::PARAM_STR);
    
    $stmt->execute();
    
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);  
  
    echo json_encode($users);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'error' => true,
        'message' => 'Database error: ' . $e->getMessage(),
    ]);
}