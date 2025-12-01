<?php

require_once __DIR__ . '/___middleware.php';

require_once __DIR__ . '/___achievements.php';

$_POST = allowMethod('POST');

if (empty($currentUser)) {
    http_response_code(400);
    echo json_encode([
        "error" => true,
        "message" => "Unauthorized."
    ]);
    die;
}

if (empty($_POST['pathname']) || empty($_POST['errorContent'])) {
    http_response_code(400);
    echo json_encode([
        "error" => true,
        "message" => "Missing parameters."
    ]);
    die;
}

try {
    unlockAchievement($pdo, $currentUser['id'], 'break_everything');

    $stmt = $pdo->prepare(
        "INSERT INTO `mario-kart-world-errors-tracker` (user_id, pathname, error_content)
        VALUES (:userId, :pathname, :errorContent)");
    $stmt->bindParam(':userId', $currentUser['id'], PDO::PARAM_INT);
    $stmt->bindParam(':pathname', $_POST['pathname'], PDO::PARAM_STR);
    $stmt->bindParam(':errorContent', $_POST['errorContent'], PDO::PARAM_STR);
    $stmt->execute();

    if ($stmt->rowCount() === 0) {
        http_response_code(500);
        echo json_encode([
            "error" => true,
            "message" => "Cannot track error."
        ]);
        die;
    }

    http_response_code(201);
    echo json_encode([
        "error" => false,
        "message" => "Error tracked successfully."
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "error" => true,
        "message" => "Database error: " . $e->getMessage()
    ]);
}