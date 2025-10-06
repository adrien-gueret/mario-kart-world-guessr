<?php 

require_once __DIR__ . '/___middleware.php';

allowMethod('GET');

try {
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
    
    if ($page < 1) $page = 1;
    if ($limit < 1 || $limit > 50) $limit = 10;
    
    $offset = ($page - 1) * $limit;
    
    $stmt = $pdo->prepare(
        "SELECT 
            p.id,
            p.difficulty,
            p.validated_at AS validatedAt,
            COALESCE(SUM(CASE WHEN g.player_id <> p.author_id THEN 1 ELSE 0 END),0) AS suggestionCount,
            CASE
                WHEN p.validated_at IS NOT NULL 
                    AND p.validated_at <= NOW() - INTERVAL 5 MINUTE
                THEN CONCAT('https://www.mariouniversalis.fr/mario-kart-world-guessr/photos/', p.id, '.jpg')
                ELSE CONCAT('https://www.mariouniversalis.fr/mario-kart-world-guessr/api/photo-proxy?pr_id=', p.github_pr_number)
            END AS photoUrl
        FROM `mario-kart-world-photos` p
        LEFT JOIN `mario-kart-world-suggestions` s 
            ON s.photo_id = p.id
        LEFT JOIN `mario-kart-world-games` g
            ON g.id = s.game_id
        GROUP BY p.id, p.difficulty, p.validated_at, p.github_pr_number
        ORDER BY (p.validated_at IS NULL) DESC, p.validated_at DESC
        LIMIT :offset, :limit"
    );
    $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
    $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
    $stmt->execute();
    
    $photos = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $countStmt = $pdo->prepare("SELECT COUNT(id) as total 
    FROM `mario-kart-world-photos` 
    WHERE validated_at IS NOT NULL");
    $countStmt->execute();
    $totalCount = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];
    
    $totalPages = ceil($totalCount / $limit);
    
    echo json_encode([
        'data' => $photos,
        'pagination' => [
            'current_page' => $page,
            'per_page' => $limit,
            'total_items' => $totalCount,
            'total_pages' => $totalPages,
            'has_next' => $page < $totalPages,
        ]
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error']);
}