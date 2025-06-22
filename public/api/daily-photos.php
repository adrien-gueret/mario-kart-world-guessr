<?php 

require_once __DIR__ . '/___middleware.php';

allowMethod('GET');

try {
    $stmt = $pdo->prepare("
        SELECT id as photoName, author_name as authorName
        FROM `mario-kart-world-photos`
        WHERE validated_at IS NOT NULL AND validated_at < CURDATE()
        ORDER BY RAND(TO_DAYS(CURDATE()))
        LIMIT 5;"
    );
    $stmt->execute();
    
    $photos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $todayDailyDate = new DateTime('today midnight');
    $nextDailyDate = new DateTime('tomorrow midnight');
    
    echo json_encode([
        'photos' => $photos,
        'todayDailyDate' => $todayDailyDate->format(\DateTime::ATOM),
        'nextDailyDate' => $nextDailyDate->format(\DateTime::ATOM),
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error']);
}