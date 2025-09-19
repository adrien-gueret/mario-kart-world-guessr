<?php

require_once __DIR__ . '/___middleware.php';

require_once __DIR__ . '/___github.php';

allowMethod('GET');

if (empty($currentUser)) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT p.id, p.difficulty, p.validated_at as validatedAt, COUNT(s.id) as suggestionCount,
        CASE
            WHEN p.validated_at IS NOT NULL AND p.validated_at <= NOW() - INTERVAL 5 MINUTE
                THEN CONCAT('https://www.mariouniversalis.fr/mario-kart-world-guessr/photos/', p.id, '.jpg')
            ELSE CONCAT('https://www.mariouniversalis.fr/mario-kart-world-guessr/api/photo-proxy?pr_id=', p.github_pr_number)
        END AS photoUrl
        FROM `mario-kart-world-photos` p
        LEFT JOIN `mario-kart-world-suggestions` s ON s.photo_id = p.id
        WHERE p.author_id = :authorId
        GROUP BY p.id
        ORDER BY (p.validated_at IS NULL) DESC, p.validated_at DESC"
    );

    $stmt->bindParam(':authorId', $currentUser['id'], PDO::PARAM_INT);
    $stmt->execute();

    $photos = $stmt->fetchAll(PDO::FETCH_ASSOC);  

    echo json_encode($photos);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error']);
}