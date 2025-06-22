<?php 

require_once __DIR__ . '/___middleware.php';

allowMethod('GET');

ini_set('session.cookie_samesite', 'None');
ini_set('session.cookie_secure', 1);
ini_set('session.cookie_lifetime', 2592000);

session_start();

if (!isset($_SESSION['seen_photos'])) {
    $_SESSION['seen_photos'] = [];
}

function getRandomPhoto($pdo, $excludeIds = []) {
    $where = "WHERE p.validated_at IS NOT NULL";
    
    if (!empty($excludeIds)) {
        $placeholders = rtrim(str_repeat('?,', count($excludeIds)), ',');
        $where .= " AND p.id NOT IN ($placeholders)";
    }
    
    $sql = "SELECT p.id as photoName, p.author_name as authorName,
            COUNT(s.photo_id) as viewCount
            FROM `mario-kart-world-photos` p
            LEFT JOIN `mario-kart-world-suggestions` s ON p.id = s.photo_id
            $where
            GROUP BY p.id, p.author_name
            ORDER BY viewCount ASC, RAND()
            LIMIT 1";
    
    $stmt = $pdo->prepare($sql);
    
    if (!empty($excludeIds)) {
        $stmt->execute($excludeIds);
    } else {
        $stmt->execute();
    }
    
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

try {
    $photo = getRandomPhoto($pdo, $_SESSION['seen_photos']);
    
    if (!$photo) {
        $_SESSION['seen_photos'] = [];
        $photo = getRandomPhoto($pdo);
    }
    
    if ($photo) {
        $_SESSION['seen_photos'][] = $photo['photoName'];
    } else {
        throw new Exception('No photos available');
    }
    
    echo json_encode($photo);
    
} catch (PDOException $e) {
    http_response_code(500);    
    echo json_encode(['error' => 'Database error']);
}
