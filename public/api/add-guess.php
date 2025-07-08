<?php

require_once __DIR__ . '/___middleware.php';

allowMethod('POST');

$photoName = isset($_POST['photoName']) ? $_POST['photoName'] : null;
$x = isset($_POST['x']) ? intval($_POST['x']) : null;
$y = isset($_POST['y']) ? intval($_POST['y']) : null;

if (!$photoName || $x === null || $y === null ) {
    http_response_code(400);
    die('{"error":true,"message":"Missing parameters."}');
}

try {
    $stmt = $pdo->prepare("INSERT INTO `mario-kart-world-suggestions` (photo_id, x, y, game_id) VALUES (:photoName, :x, :y, :gameId)");
    
    $stmt->bindParam(':photoName', $photoName, PDO::PARAM_STR);
    $stmt->bindParam(':x', $x, PDO::PARAM_INT);
    $stmt->bindParam(':y', $y, PDO::PARAM_INT);

    if (empty($currentUser) || empty($currentUser['id']) || empty($_POST['gameId'])) {
        $stmt->bindValue(':gameId', null, PDO::PARAM_NULL);
    } else {
        $selectStmt = $pdo->prepare("SELECT id FROM `mario-kart-world-games` WHERE id = :gameId AND player_id = :playerId");
        $selectStmt->bindParam(':gameId', $_POST['gameId'], PDO::PARAM_INT);
        $selectStmt->bindParam(':playerId', $currentUser['id'], PDO::PARAM_INT);
        $selectStmt->execute();
        $game = $selectStmt->fetch(PDO::FETCH_ASSOC);

        if (!$game) {
            http_response_code(401);
            die('{"error":true,"message":"Invalid game ID or not owned by current user."}');
        }

        $stmt->bindParam(':gameId', $_POST['gameId'], PDO::PARAM_INT);
    }
   
    $stmt->execute();
    
    $lastInsertId = $pdo->lastInsertId();
    
    http_response_code(201);
    echo json_encode([
      "error" => false,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "error" => true,
        "message" => "Database error: " . $e->getMessage()
    ]);
}