<?php

require_once __DIR__ . '/___middleware.php';

$_PUT = allowMethod('PUT');

if (empty($currentUser) || empty($_PUT['gameId'])) {
    http_response_code(400);
    echo json_encode([
        "error" => true,
        "message" => "User or game missing."
    ]);
    die;
}

try {
    $updateGameStmt = $pdo->prepare(
        "UPDATE `mario-kart-world-games`
        SET finished_at = NOW(), current_photo_id = NULL
        WHERE id = :gameId AND player_id = :playerId AND finished_at IS NULL");
    $updateGameStmt->bindParam(':gameId', $_PUT['gameId'], PDO::PARAM_INT);
    $updateGameStmt->bindParam(':playerId', $currentUser['id'], PDO::PARAM_INT);
    $updateGameStmt->execute();

    if ($updateGameStmt->rowCount() === 0) {
        http_response_code(409);
        echo json_encode([
            "error" => true,
            "message" => "Cannot stop given game."
        ]);
        die;
    }
    echo json_encode([
        "error" => false,
        "message" => "Game stopped successfully."
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "error" => true,
        "message" => "Database error: " . $e->getMessage()
    ]);
}