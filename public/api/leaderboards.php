<?php 

require_once __DIR__ . '/___middleware.php';

allowMethod('GET');

$possibleModes = ['daily', 'survival', 'goal'];

if (!isset($_GET['mode']) || !in_array($_GET['mode'], $possibleModes)) {
    http_response_code(400);
    die('{"error":true,"message":"Invalid mode"}');
}

$possibleDifficulties = ['50cc', '100cc', '150cc', 'mirror'];

if ($_GET['mode'] !== 'daily' && (!isset($_GET['difficulty']) || !in_array($_GET['difficulty'], $possibleDifficulties))) {
    http_response_code(400);
    die('{"error":true,"message":"Invalid difficulty"}');
}

try {
    if($_GET['mode'] === 'daily') {
        $table = "mario-kart-world-leaderboard-daily";

        if (isset($_GET['score'])) {
            $stmt = $pdo->prepare("WITH
            all_players AS (
                SELECT
                    l.player_id,
                    l.score,
                    u.username
                FROM `$table` l
                LEFT JOIN `mario-kart-world-users` u ON l.player_id = u.id
                WHERE l.daily_date IS NULL OR l.daily_date = CURDATE()
                
                UNION ALL

                SELECT
                    CAST(NULL AS UNSIGNED) AS player_id,
                    CAST(:score AS UNSIGNED) AS score,
                    :username AS username
            ),
            ranked AS (
                SELECT
                    player_id,
                    score,
                    username,
                    ROW_NUMBER() OVER (
                        ORDER BY score DESC
                    ) AS rank
                FROM all_players
                ),
            your_rank AS (
                SELECT rank AS your_rank FROM ranked WHERE player_id IS NULL LIMIT 1
            ),
            max_rank AS (
                SELECT MAX(rank) AS max_rank FROM ranked
            ),
            window_bounds AS (
                SELECT
                    GREATEST(
                        LEAST(your_rank - 2, max_rank - 4), 
                        1
                    ) AS window_start
                FROM your_rank, max_rank
            )
            SELECT
                player_id as playerId,
                score,
                username
            FROM ranked, window_bounds
            WHERE ranked.rank BETWEEN window_bounds.window_start AND window_bounds.window_start + 4
            ORDER BY ranked.rank");

            $stmt->bindParam(':score', $_GET['score'], PDO::PARAM_INT);
            $stmt->bindValue(':username', empty($_GET['username']) ? 'You' : $_GET['username'], PDO::PARAM_STR);
        } else {
            $stmt = $pdo->prepare("SELECT l.player_id as playerId, l.score, u.username
                            FROM `$table` l
                            LEFT JOIN `mario-kart-world-users` u ON l.player_id = u.id
                            WHERE l.daily_date IS NULL OR l.daily_date = CURDATE()
                            ORDER BY l.score DESC"
                        );
        }
    } else {
        $table = '';
        $photoCountOrderType = $_GET['mode'] === 'survival' ? 'DESC' : 'ASC';
        $table = "mario-kart-world-leaderboard-goal-survival";

        if (isset($_GET['score']) && isset($_GET['photoCount'])) {
            $stmt = $pdo->prepare("WITH
            all_players AS (
                SELECT
                    l.player_id,
                    l.score,
                    l.photo_count,
                    l.performed_at,
                    u.username
                FROM `$table` l
                LEFT JOIN `mario-kart-world-users` u ON l.player_id = u.id
                WHERE l.difficulty = :difficulty and l.mode = :mode
                
                UNION ALL

                SELECT
                    CAST(NULL AS UNSIGNED) AS player_id,
                    CAST(:score AS UNSIGNED) AS score,
                    CAST(:photo_count AS UNSIGNED) AS photo_count,
                    NOW() AS performed_at,
                    :username AS username
            ),
            ranked AS (
                SELECT
                    player_id,
                    score,
                    photo_count,
                    performed_at,
                    username,
                    ROW_NUMBER() OVER (
                        ORDER BY photo_count $photoCountOrderType, score DESC, performed_at DESC
                    ) AS rank
                FROM all_players
                ),
            your_rank AS (
                SELECT rank AS your_rank FROM ranked WHERE player_id IS NULL LIMIT 1
            ),
            max_rank AS (
                SELECT MAX(rank) AS max_rank FROM ranked
            ),
            window_bounds AS (
                SELECT
                    GREATEST(
                        LEAST(your_rank - 2, max_rank - 4), 
                        1
                    ) AS window_start
                FROM your_rank, max_rank
            )
            SELECT
                player_id as playerId,
                score,
                photo_count as photoCount,
                username
            FROM ranked, window_bounds
            WHERE ranked.rank BETWEEN window_bounds.window_start AND window_bounds.window_start + 4
            ORDER BY ranked.rank");

            $stmt->bindParam(':difficulty', $_GET['difficulty'], PDO::PARAM_STR);
            $stmt->bindParam(':mode', $_GET['mode'], PDO::PARAM_STR);
            $stmt->bindParam(':score', $_GET['score'], PDO::PARAM_INT);
            $stmt->bindParam(':photo_count', $_GET['photoCount'], PDO::PARAM_INT);
            $stmt->bindValue(':username', empty($_GET['username']) ? 'You' : $_GET['username'], PDO::PARAM_STR);
        } else {
            $stmt = $pdo->prepare("SELECT l.player_id as playerId, l.score, l.photo_count as photoCount, u.username
                            FROM `$table` l
                            LEFT JOIN `mario-kart-world-users` u ON l.player_id = u.id
                            WHERE difficulty = :difficulty AND mode = :mode
                            ORDER BY l.photo_count $photoCountOrderType, l.score DESC, l.performed_at DESC"
                        );
                        
            $stmt->bindParam(':difficulty', $_GET['difficulty'], PDO::PARAM_STR);
            $stmt->bindParam(':mode', $_GET['mode'], PDO::PARAM_STR);
        }
    }

    $stmt->execute();
    
    $photos = $stmt->fetchAll(PDO::FETCH_ASSOC);  
  
    echo json_encode($photos);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error']);
}