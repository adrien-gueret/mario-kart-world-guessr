<?php 

require_once __DIR__ . '/___middleware.php';

require_once __DIR__ . '/___coordinates.php';

require_once __DIR__ . '/___album.php';

allowMethod('GET');

if (empty($currentUser)) {
    http_response_code(401);
    echo json_encode(['error' => true, 'message' => 'Unauthorized']);
    exit;
}

$albumId = $_GET['id'];

if (!isset($albumId) || !is_numeric($albumId)) {
    http_response_code(400);
    die('{"error":true,"message":"Invalid album ID"}');
}

try {
    $albumData = getAlbumById($pdo, $albumId, $currentUser['id']);

    if (empty($albumData)) {
        http_response_code(404);
        die('{"error":true,"message":"Album not found."}');
    }
  
    echo json_encode($albumData);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'error' => $e->getMessage(),
        'message' => 'Database error: ' . $e->getMessage(),
    ]);
}