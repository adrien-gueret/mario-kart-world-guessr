<?php 

require_once __DIR__ . '/___middleware.php';

allowMethod('GET');

ini_set('session.cookie_samesite', 'None');
ini_set('session.cookie_secure', 1);
ini_set('session.gc_maxlifetime', 2592000); 
ini_set('session.cookie_lifetime', 2592000);

session_start();

if (!isset($_SESSION['seen_photos'])) {
    $_SESSION['seen_photos'] = [];
}

$difficulty = isset($_GET['difficulty']) ? $_GET['difficulty'] : '150cc';

$avalaibleDifficulties = ['50cc', '100cc', '150cc', 'mirror'];

if (!in_array($difficulty, $avalaibleDifficulties)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid difficulty']);
    exit;
}

function getRandomPhoto($pdo, $difficulty, $excludeIds = []) {
    $where = "WHERE p.validated_at IS NOT NULL AND p.validated_at <= NOW() - INTERVAL 5 MINUTE";
    
    if (!empty($excludeIds)) {
        $placeholders = rtrim(str_repeat('?,', count($excludeIds)), ',');
        $where .= " AND p.id NOT IN ($placeholders)";
    }

    switch ($difficulty) {
        case '50cc':
        case '100cc':
            $sql = "SELECT
                        p.id as photoName, COUNT(s.photo_id) as viewCount
                    FROM `mario-kart-world-photos` p
                    LEFT JOIN `mario-kart-world-suggestions` s ON p.id = s.photo_id
                    LEFT JOIN (
                        SELECT DISTINCT
                        s.photo_id,
                        MEDIAN(
                            SQRT(
                            POW(CAST(s.x AS SIGNED) - CAST(p.x AS SIGNED), 2) +
                            POW(CAST(s.y AS SIGNED) - CAST(p.y AS SIGNED), 2)
                            )
                        ) OVER (PARTITION BY s.photo_id) AS median_distance
                        FROM 
                        `mario-kart-world-suggestions` s
                        JOIN
                        `mario-kart-world-photos` p ON s.photo_id = p.id
                    ) md ON p.id = md.photo_id
                    $where AND md.median_distance <= ".($difficulty === '50cc' ? 90 : 200)."
                    GROUP BY p.id
                    HAVING viewCount >= 5
                    ORDER BY viewCount ASC, RAND()
                    LIMIT 1";
            break;

            default:
                $sql = "SELECT p.id as photoName,
                        COUNT(s.photo_id) as viewCount
                        FROM `mario-kart-world-photos` p
                        LEFT JOIN `mario-kart-world-suggestions` s ON p.id = s.photo_id
                        $where
                        GROUP BY p.id
                        ORDER BY viewCount ASC, RAND()
                        LIMIT 1";
            break;
    }
    
    $stmt = $pdo->prepare($sql);
    
    if (!empty($excludeIds)) {
        $stmt->execute($excludeIds);
    } else {
        $stmt->execute();
    }
    
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

try {
    $photo = getRandomPhoto($pdo, $difficulty, $_SESSION['seen_photos']);
    
    if (!$photo) {
        $_SESSION['seen_photos'] = [];
        $photo = getRandomPhoto($pdo, $difficulty);
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
