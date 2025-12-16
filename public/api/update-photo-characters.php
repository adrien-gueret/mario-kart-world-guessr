<?php

require_once __DIR__ . '/___middleware.php';

require_once __DIR__ . '/___check-album-author.php';

require_once __DIR__ . '/___album-cover.php';

$_POST = allowMethod('POST');

if (empty($currentUser) || $currentUser['id'] > 1) {
    http_response_code(401);
    echo json_encode(['error' => true, 'message' => 'Unauthorized']);
    die;
}

if (empty($_POST['photoId'])) {
    http_response_code(400);
    echo json_encode(['error' => true, 'message' => 'Photo ID is required']);
    die;
}

try {
    $characters = isset($_POST['characters']) ? $_POST['characters'] : [];

    $insert = [];
    $params = [];

    $stmt = $pdo->prepare(
        "DELETE FROM `mario-kart-world-characters-photos`
         WHERE id_photo = ?"
    );
    $stmt->execute([$_POST['photoId']]);

    if (count($characters) > 0) {
        foreach ($characters as $character) {
            $insert[] = "(?, ?)";
            $params[] = $character;
            $params[] = $_POST['photoId'];         
        }

        $stmt = $pdo->prepare(
            "INSERT INTO `mario-kart-world-characters-photos`
            (id_character, id_photo) VALUES "
            . implode(", ", $insert)
        );

        $stmt->execute($params);
    }
    
    echo json_encode(["success" => true]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "error" => true,
        "message" => "Database error: " . $e->getMessage()
    ]);
}