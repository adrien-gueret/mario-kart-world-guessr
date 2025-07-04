<?php 

require_once __DIR__ . '/___middleware.php';

allowMethod('GET');

try {
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
    
    if ($page < 1) $page = 1;
    if ($limit < 1 || $limit > 50) $limit = 10;
    
    $offset = ($page - 1) * $limit;
    
    $stmt = $pdo->prepare("SELECT id as photoName
        FROM `mario-kart-world-photos`
        WHERE validated_at IS NOT NULL AND validated_at <= NOW() - INTERVAL 5 MINUTE
        ORDER BY validated_at DESC, photoName
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