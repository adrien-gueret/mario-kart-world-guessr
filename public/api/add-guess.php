<?php

require_once __DIR__ . '/___middleware.php';

allowMethod('POST');

$photoName = isset($_POST['photoName']) ? $_POST['photoName'] : null;
$x = isset($_POST['x']) ? intval($_POST['x']) : null;
$y = isset($_POST['y']) ? intval($_POST['y']) : null;
$authorEmail = isset($_POST['authorEmail']) ? $_POST['authorEmail'] : null;

if (!$photoName || $x === null || $y === null ) {
    http_response_code(400);
    die('{"error":true,"message":"Missing parameters."}');
}

try {
    $stmt = $pdo->prepare("INSERT INTO `mario-kart-world-suggestions` (photo_id, x, y, author_email) VALUES (:photoName, :x, :y, :authorEmail)");
    
    $stmt->bindParam(':photoName', $photoName, PDO::PARAM_STR);
    $stmt->bindParam(':x', $x, PDO::PARAM_INT);
    $stmt->bindParam(':y', $y, PDO::PARAM_INT);
    $stmt->bindParam(':authorEmail', $authorEmail, PDO::PARAM_STR);
    
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