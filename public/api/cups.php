<?php 

require_once __DIR__ . '/___middleware.php';

require_once __DIR__ . '/___coordinates.php';

allowMethod('GET');

if (empty($currentUser)) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$possibleModes = ['survival', 'goal'];
$mode = $_GET['mode'];

if (!isset($mode) || !in_array($mode, $possibleModes)) {
    http_response_code(400);
    die('{"error":true,"message":"Invalid mode"}');
}

try {
    $stmt = $pdo->prepare(
        "SELECT 
           t.difficulty,
            CASE
                WHEN t.rank = 1 THEN 'gold'
                WHEN t.rank = 2 THEN 'silver'
                WHEN t.rank = 3 THEN 'bronze'
                ELSE 'none'
            END AS cup,
            IF(t.rank = 1, (
            	CASE
            		WHEN t.averageScore >= 4250 THEN 'rank-3'
            		WHEN t.averageScore >= 4000 THEN 'rank-2'
            		WHEN t.averageScore >= 3750 THEN 'rank-1'
            		ELSE 'rank-0'
            	END
            	
            ), NULL) starRank
        FROM (
            SELECT 
                l.player_id,
                l.difficulty,
                (l.score / l.photo_count) as averageScore,
                ROW_NUMBER() OVER (
                    PARTITION BY difficulty
                    ORDER BY photo_count ".($mode === "goal" ? "ASC" : "DESC").", score DESC, performed_at DESC
                ) AS rank
            FROM `mario-kart-world-leaderboard-goal-survival` l
            WHERE l.player_id IN (3,4,5,6,:playerId)
            AND mode = :mode
        ) t
        WHERE t.player_id = :playerId");

        
    $stmt->bindValue(':playerId', $currentUser['id'], PDO::PARAM_INT);
    $stmt->bindValue(':mode', $mode, PDO::PARAM_STR);

    $stmt->execute();
    
    $fetchedCups = $stmt->fetchAll(PDO::FETCH_ASSOC);  

    $cups = [
        '50cc' => ['cup' => 'none', 'starRank' => null],
        '100cc' => ['cup' => 'none', 'starRank' => null],
        '150cc' => ['cup' => 'none', 'starRank' => null],
        'mirror' => ['cup' => 'none', 'starRank' => null],
    ];

    foreach($fetchedCups as $fetchedCup) {
        $cups[$fetchedCup['difficulty']] = [
            'cup' => $fetchedCup['cup'],
            'starRank' => $fetchedCup['starRank']
        ];
    }
  
    echo json_encode($cups);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'error' => $e->getMessage(),
        'message' => 'Database error: ' . $e->getMessage(),
    ]);
}