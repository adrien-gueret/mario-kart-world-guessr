<?php

require_once __DIR__ . '/___middleware.php';

$_PUT = allowMethod('PUT');

if (empty($currentUser) || empty($currentUser['email'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

if (empty($_PUT['username']) || empty($_PUT['locale'])) {
    http_response_code(400);
    die('{"error":true,"message":"Username and locale are required"}');
}

try {
   $stmt = $pdo->prepare("UPDATE `mario-kart-world-users` SET username = :username, locale = :locale WHERE id = :id");
   $stmt->bindParam(':username', $_PUT['username'], PDO::PARAM_STR);
   $stmt->bindParam(':locale', $_PUT['locale'], PDO::PARAM_STR);
   $stmt->bindParam(':id', $currentUser['id'], PDO::PARAM_INT);
   $stmt->execute();

   echo json_encode(["success" => true]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "error" => true,
        "message" => "Database error: " . $e->getMessage()
    ]);
}