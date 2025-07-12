<?php 

require_once __DIR__ . '/___middleware.php';

require_once __DIR__ . '/___coordinates.php';

allowMethod('GET');


if (!isset($_GET['gameId'])) {
    http_response_code(400);
    die('{"error":true,"message":"Missing game id"}');
}

try {
    $stmt = $pdo->prepare("SELECT
            g.id AS id,
            g.player_id,
            g.mode,
            g.difficulty,
            g.started_at,
            g.finished_at,
            COALESCE(
                JSON_ARRAYAGG(
                    CASE
                        WHEN s.id IS NOT NULL THEN JSON_OBJECT(
                            'guess_x', s.x,
                            'guess_y', s.y,
                            'actual_x', p.x,
                            'actual_y', p.y
                        )
                        ELSE NULL
                    END
                ),
                JSON_ARRAY()
            ) AS guesses
        FROM `mario-kart-world-games` g
        LEFT JOIN `mario-kart-world-suggestions` s ON s.game_id = g.id
        LEFT JOIN `mario-kart-world-photos` p ON s.photo_id = p.id
        WHERE
            g.id = :gameId
        GROUP BY g.id
        LIMIT 1");
    $stmt->bindParam(':gameId', $_GET['gameId'], PDO::PARAM_INT);
    $stmt->execute();
    $game = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$game) {
        http_response_code(404);
        die('{"error":true,"message":"Game not found"}');
    }

    if ($game['player_id'] !== $currentUser['id']) {
        http_response_code(401);
        die('{"error":true,"message":"Given game does not belong to current user"}');
    }

    if (isset($game['guesses'])) {
        $game['guesses'] = json_decode($game['guesses'], true);
        $game['guesses'] = array_values(array_filter($game['guesses'], function($item) {
            return $item !== null;
        }));
    } else {
        $game['guesses'] = [];
    }

    $history = array_map(function($guess) {
        $distanceInKm = distanceBetweenCoordinatesInKilometers(
            ['x' => $guess['guess_x'], 'y' => $guess['guess_y']],
            ['x' => $guess['actual_x'], 'y' => $guess['actual_y']]
        );

        $score = getScoreFromDistanceInKilometers($distanceInKm, empty($_POST['difficulty']) ? '150cc' : $_POST['difficulty']);

        return $score;
    }, $game['guesses']);

    $totalScore = array_sum($history);
    $photoCount = count($history);

    if($game['mode'] === 'daily') {
        $stmt = $pdo->prepare("WITH
        all_players AS (
            SELECT
                l.player_id,
                l.score,
                u.username
            FROM `mario-kart-world-leaderboard-daily` l
            LEFT JOIN `mario-kart-world-users` u ON l.player_id = u.id
            WHERE (l.daily_id IS NULL OR l.daily_id = (
                SELECT id FROM `mario-kart-world-dailies` WHERE daily_date = :startedAt
            )) AND l.player_id != :playerId AND l.player_id != 1 AND u.email IS NOT NULL
            
            UNION ALL

            SELECT
                CAST(:playerId AS UNSIGNED) AS player_id,
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
            SELECT rank AS your_rank FROM ranked WHERE player_id = :playerId LIMIT 1
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
            username as playerName,
            ranked.rank
        FROM ranked, window_bounds
        WHERE ranked.rank BETWEEN window_bounds.window_start AND window_bounds.window_start + 4
        ORDER BY ranked.rank");

        $stmt->bindParam(':score', $totalScore, PDO::PARAM_INT);
        $stmt->bindParam(':playerId', $currentUser['id'], PDO::PARAM_INT);
        $stmt->bindValue(':username', $currentUser['username'], PDO::PARAM_STR);
        $startedAtDate = (new DateTime($game['started_at']))->format('Y-m-d');
        $stmt->bindValue(':startedAt', $startedAtDate, PDO::PARAM_STR);
    } else {
        $photoCountOrderType = $game['mode'] === 'survival' ? 'DESC' : 'ASC';
       
        $stmt = $pdo->prepare("WITH
        all_players AS (
            SELECT
                l.player_id,
                l.score,
                l.photo_count,
                l.performed_at,
                u.username
            FROM `mario-kart-world-leaderboard-goal-survival` l
            LEFT JOIN `mario-kart-world-users` u ON l.player_id = u.id
            WHERE l.difficulty = :difficulty and l.mode = :mode
            AND l.player_id != :playerId AND u.email IS NOT NULL
            
            UNION ALL

            SELECT
                CAST(:playerId AS UNSIGNED) AS player_id,
                CAST(:score AS UNSIGNED) AS score,
                CAST(:photoCount AS UNSIGNED) AS photo_count,
                :performedAt AS performed_at,
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
            SELECT rank AS your_rank FROM ranked WHERE player_id = :playerId LIMIT 1
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
            username as playerName,
            ranked.rank
        FROM ranked, window_bounds
        WHERE ranked.rank BETWEEN window_bounds.window_start AND window_bounds.window_start + 4
        ORDER BY ranked.rank");

        $stmt->bindParam(':difficulty', $game['difficulty'], PDO::PARAM_STR);
        $stmt->bindParam(':mode', $game['mode'], PDO::PARAM_STR);
        $stmt->bindParam(':score', $totalScore, PDO::PARAM_INT);
        $stmt->bindParam(':photoCount', $photoCount, PDO::PARAM_INT);
        $stmt->bindValue(':username', $currentUser['username'], PDO::PARAM_STR);
        $stmt->bindValue(':performedAt', $game['finished_at'], PDO::PARAM_STR);
        $stmt->bindParam(':playerId', $currentUser['id'], PDO::PARAM_INT); 
    }

    $stmt->execute();
    
    $photos = $stmt->fetchAll(PDO::FETCH_ASSOC);  
  
    echo json_encode($photos);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'error' => true,
        'message' => 'Database error: ' . $e->getMessage(),
    ]);
}