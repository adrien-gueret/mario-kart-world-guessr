<?php

require_once __DIR__ . '/___middleware.php';

require_once __DIR__ . '/___coordinates.php';

require_once __DIR__ . '/___achievements.php';

require_once __DIR__ . '/___photos.php';

require_once __DIR__ . '/___game.php';

allowMethod('POST');

$photoId = isset($_POST['photoId']) ? $_POST['photoId'] : null;
$x = isset($_POST['x']) ? intval($_POST['x']) : null;
$y = isset($_POST['y']) ? intval($_POST['y']) : null;

if (!$photoId || $x === null || $y === null ) {
    http_response_code(400);
    die('{"error":true,"message":"Missing parameters."}');
}

try {
    $insertSuggestionStmt = $pdo->prepare("INSERT INTO `mario-kart-world-suggestions` (photo_id, x, y, game_id) VALUES (:photoId, :x, :y, :gameId)");
    
    $insertSuggestionStmt->bindParam(':photoId', $photoId, PDO::PARAM_STR);
    $insertSuggestionStmt->bindParam(':x', $x, PDO::PARAM_INT);
    $insertSuggestionStmt->bindParam(':y', $y, PDO::PARAM_INT);

    $game = null;

    if (empty($currentUser) || empty($_POST['gameId'])) {
        http_response_code(400);
        echo json_encode([
            "error" => true,
            "message" => "User or game missing."
        ]);
        die;
    }

    $selectGameStmt = $pdo->prepare(
        "SELECT g.id, g.difficulty, g.mode, g.started_at,
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
        WHERE g.id = :gameId AND g.player_id = :playerId
    ");
    $selectGameStmt->bindParam(':gameId', $_POST['gameId'], PDO::PARAM_INT);
    $selectGameStmt->bindParam(':playerId', $currentUser['id'], PDO::PARAM_INT);
    $selectGameStmt->execute();
    $game = $selectGameStmt->fetch(PDO::FETCH_ASSOC);

    if (!$game) {
        http_response_code(401);
        die('{"error":true,"message":"Invalid game ID or not owned by current user."}');
    }

    if (isset($game['guesses'])) {
        $game['guesses'] = json_decode($game['guesses'], true);
        $game['guesses'] = array_values(array_filter($game['guesses'], function($item) {
            return $item !== null;
        }));
    } else {
        $game['guesses'] = [];
    }

    $difficulty = empty($game['difficulty']) ? '150cc' : $game['difficulty'];
    if (!in_array($difficulty, ['50cc', '100cc', '150cc', 'mirror'])) {
        $difficulty = '150cc';
    }

    $game['history'] = array_map(function($guess) use ($difficulty) {
        $distanceInKm = distanceBetweenCoordinatesInKilometers(
            ['x' => $guess['guess_x'], 'y' => $guess['guess_y']],
            ['x' => $guess['actual_x'], 'y' => $guess['actual_y']]
        );

        $score = getScoreFromDistanceInKilometers($distanceInKm, $difficulty ?: '150cc');

        return $score;
    }, $game['guesses']);

    unset($game['guesses']);

    $insertSuggestionStmt->bindParam(':gameId', $_POST['gameId'], PDO::PARAM_INT);

    $mode = $game['mode'];
    // TODO: remove check on user id
    if (!in_array($mode, ['goal', 'daily', 'survival', 'chrono']) || ($mode === 'chrono' && $currentUser['id'] !== 1)) {
        http_response_code(400);
        die('{"error":true,"message":"Invalid game mode."}');
    }

    if (!isset($_POST['noRegister']) || $_POST['noRegister'] !== '1') {
        $insertSuggestionStmt->execute();
    }
   
    $selectPhotoStmt = $pdo->prepare(
        "SELECT 
            p.id AS photoId,
            p.x,
            p.y,
            md.guess_median_x,
            md.guess_median_y,
            COUNT(DISTINCT s.id) AS guess_count
        FROM `mario-kart-world-photos` p
        LEFT JOIN `mario-kart-world-suggestions` s 
            ON p.id = s.photo_id
        LEFT JOIN `mario-kart-world-games` g 
            ON s.game_id = g.id
            AND (g.player_id IS NULL OR g.player_id != p.author_id)
        LEFT JOIN (
            SELECT 
                s.photo_id,
                PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY s.x) 
                    OVER (PARTITION BY s.photo_id) AS guess_median_x,
                PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY s.y) 
                    OVER (PARTITION BY s.photo_id) AS guess_median_y
            FROM `mario-kart-world-suggestions` s
            LEFT JOIN `mario-kart-world-games` g ON s.game_id = g.id
            WHERE s.photo_id = :id
            AND (g.player_id IS NULL OR g.player_id != (
                SELECT author_id FROM `mario-kart-world-photos` WHERE id = :id
            ))
        ) md ON p.id = md.photo_id
        WHERE p.id = :id         
        AND (g.player_id IS NULL OR g.player_id != p.author_id)
        GROUP BY p.id, p.x, p.y, md.guess_median_x, md.guess_median_y
        ORDER BY p.validated_at DESC;
    ");
    $selectPhotoStmt->bindParam(':id', $photoId, PDO::PARAM_STR);
    $selectPhotoStmt->execute();
    
    $photo = $selectPhotoStmt->fetch(PDO::FETCH_ASSOC);

    http_response_code(201);

    $distanceInKm = distanceBetweenCoordinatesInKilometers([
        'x' => $photo['x'],
        'y' => $photo['y'],
    ], [
        'x' => $x,
        'y' => $y,
    ]);

    $newScore = getScoreFromDistanceInKilometers($distanceInKm, $difficulty);
    $game['history'] = array_merge($game['history'], [$newScore]);

    if ($newScore >= 5000) {
        unlockAchievement($pdo, $currentUser['id'], '5000_points');
    }

    $photoCount = count($game['history']);
    $totalScore = array_sum($game["history"]);

    if ($photoCount >= 3) {
        $lastThreeScores = array_slice($game['history'], -3);
        $areLastThreeScoresHigh = count(array_filter($lastThreeScores, function($score) {
            return $score >= 4000;
        })) === 3;

        if ($areLastThreeScoresHigh) {
            unlockAchievement($pdo, $currentUser['id'], '4000_three_in_a_row');
        }
    }

    $isFinished = false;

    switch($mode) {
        case 'daily':
            $isFinished = $photoCount >= 5;
        break;

        case 'survival':
            $minimumScoreToContinue = getSurvivalMinimumScore($difficulty, $photoCount - 1);
            $isFinished = $newScore < $minimumScoreToContinue;
        break;

        case 'goal':
            $isFinished = $totalScore >= 50000;
        break;

        case 'chrono':
            $isFinished = false; // TODO : calculate based on remaining time
        break;
    }

    $nextPhoto = null;
    $cupData = null;

    if ($isFinished) {
        $updateGameStmt = $pdo->prepare(
            "UPDATE `mario-kart-world-games`
            SET finished_at = NOW(), current_photo_id = NULL
            WHERE id = :gameId");
        $updateGameStmt->bindParam(':gameId', $game['id'], PDO::PARAM_INT);
        $updateGameStmt->execute();

        if ($mode === 'daily') {
            $leaderboardStmt = $pdo->prepare(
                "INSERT INTO `mario-kart-world-leaderboard-daily` (player_id, daily_id, score)
                VALUES (
                    :playerId,
                    (
                        SELECT d.id
                        FROM `mario-kart-world-dailies` d
                        JOIN `mario-kart-world-games` g ON DATE(g.started_at) = d.daily_date
                        WHERE g.id = :gameId
                        LIMIT 1
                    ),
                    :score
                )");

            $leaderboardStmt->bindParam(':playerId', $currentUser['id'], PDO::PARAM_INT);
            $leaderboardStmt->bindParam(':score', $totalScore, PDO::PARAM_INT);
            $leaderboardStmt->bindParam(':gameId', $game['id'], PDO::PARAM_INT);

            $leaderboardStmt->execute();
        } else {
            // Check achievements
            $photoCountOrderType = $mode === 'survival' ? 'DESC' : 'ASC';
            $rowLeaderBoardOrderBy = $mode === 'chrono' ? "ORDER BY score DESC, photo_count DESC, performed_at DESC" : "ORDER BY photo_count $photoCountOrderType, score DESC, performed_at DESC";

            $stmt = $pdo->prepare(
                "WITH
                all_players AS (
                    SELECT
                        u.id,
                        l.score,
                        l.photo_count,
                        l.performed_at,
                        (l.score / l.photo_count) as average_score
                    FROM `mario-kart-world-leaderboard-goal-survival` l
                    LEFT JOIN `mario-kart-world-users` u ON l.player_id = u.id
                    WHERE l.difficulty = :difficulty and l.mode = :mode
                    AND l.player_id IN (3,4,5,6)
                    
                    UNION ALL

                    SELECT
                        :playerId as player_id,
                        CAST(:score AS UNSIGNED) AS score,
                        CAST(:photoCount AS UNSIGNED) AS photo_count,
                        NOW() AS performed_at,
                        CAST(:score AS UNSIGNED) / CAST(:photoCount AS UNSIGNED) AS average_score
                ),
                ranked AS (
                    SELECT                
                        id,
                        score,
                        photo_count,
                        performed_at,
                        average_score,
                        ROW_NUMBER() OVER ($rowLeaderBoardOrderBy) AS player_rank
                    FROM all_players
                    )
                SELECT
                    CASE
                        WHEN player_rank = 1 THEN 'gold'
                        WHEN player_rank = 2 THEN 'silver'
                        WHEN player_rank = 3 THEN 'bronze'
                        ELSE 'none'
                    END AS cup,
                    IF(player_rank = 1, (
                        CASE
                            WHEN average_score >= 4250 THEN 'rank-3'
                            WHEN average_score >= 4000 THEN 'rank-2'
                            WHEN average_score >= 3750 THEN 'rank-1'
                            ELSE 'rank-0'
                        END                   
                    ), NULL) starRank
                FROM ranked
                WHERE id = :playerId");

            $stmt->bindValue(':difficulty', $difficulty, PDO::PARAM_STR);
            $stmt->bindValue(':mode', $mode, PDO::PARAM_STR);
            $stmt->bindValue(':playerId', $currentUser['id'], PDO::PARAM_INT);
            $stmt->bindValue(':score', $totalScore, PDO::PARAM_INT);
            $stmt->bindValue(':photoCount', $photoCount, PDO::PARAM_INT);

            $stmt->execute();
            
            $cupData = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($cupData["cup"] === 'gold') {
                unlockAchievement($pdo, $currentUser['id'], implode('_', ['gold', $difficulty, $mode]));
            }

            if ($cupData["cup"] !== 'none') {
                 $cupStmt =$pdo->prepare(
                    "INSERT INTO `mario-kart-world-cups` (player_id, difficulty, mode, cup, star_rank)
                    VALUES (:playerId, :difficulty, :mode, :cup, :starRank)
                    ON DUPLICATE KEY UPDATE
                    cup = CASE
                        WHEN FIELD(VALUES(cup), 'none','bronze','silver','gold') > FIELD(cup, 'none','bronze','silver','gold')
                        THEN VALUES(cup) ELSE cup END,
                    star_rank = CASE
                        WHEN star_rank IS NULL THEN VALUES(star_rank)
                        WHEN FIELD(VALUES(star_rank), 'rank-0','rank-1','rank-2','rank-3') > FIELD(star_rank, 'rank-0','rank-1','rank-2','rank-3')
                        THEN VALUES(star_rank) ELSE star_rank END
                ");

                $cupStmt->bindParam(':playerId', $currentUser['id'], PDO::PARAM_INT);
                $cupStmt->bindParam(':difficulty', $difficulty, PDO::PARAM_STR);
                $cupStmt->bindParam(':mode', $mode, PDO::PARAM_STR);
                $cupStmt->bindParam(':cup', $cupData["cup"], PDO::PARAM_STR);
                $cupStmt->bindParam(':starRank', $cupData["starRank"], PDO::PARAM_STR);
                $cupStmt->execute();
            }

            // Then update leaderboards
            $selectLeaderBoardStmt = $pdo->prepare(
                "SELECT photo_count, score FROM `mario-kart-world-leaderboard-goal-survival`
                WHERE player_id = :playerId
                AND mode = :mode
                AND difficulty = :difficulty
            ");
            $selectLeaderBoardStmt->bindParam(':playerId', $currentUser['id'], PDO::PARAM_INT);
            $selectLeaderBoardStmt->bindParam(':mode', $mode, PDO::PARAM_STR);
            $selectLeaderBoardStmt->bindParam(':difficulty', $difficulty, PDO::PARAM_STR);
            $selectLeaderBoardStmt->execute();

            $best = $selectLeaderBoardStmt->fetch(PDO::FETCH_ASSOC);
          
            $leaderboardStmt = null;
            
            if (empty($best)) {
                $leaderboardStmt = $pdo->prepare(
                    "INSERT INTO `mario-kart-world-leaderboard-goal-survival` (player_id, difficulty, mode, photo_count, score)
                    VALUES (:playerId, :difficulty, :mode, :photoCount, :score)
                ");

                 $leaderboardStmt->bindValue(':score', $totalScore, PDO::PARAM_INT);
            } else {
                $bestPhotoCount = $best['photo_count'];
                $bestScore = $best['score'];

                if (($mode === 'goal' && $photoCount <= $bestPhotoCount) || ($mode === 'survival' && $photoCount >= $bestPhotoCount) || ($mode === 'chrono' && $totalScore >= $bestScore)) {
                    $leaderboardStmt = $pdo->prepare(
                        "UPDATE `mario-kart-world-leaderboard-goal-survival` SET photo_count = :photoCount, score = :score, performed_at = NOW()
                        WHERE player_id = :playerId AND difficulty = :difficulty AND mode = :mode
                    ");

                    $scoreToStore = $totalScore > $bestScore ? $totalScore : $bestScore;
                    $leaderboardStmt->bindValue(':score', $scoreToStore, PDO::PARAM_INT);
                }
            }

            if (!empty($leaderboardStmt)) {
                $leaderboardStmt->bindParam(':playerId', $currentUser['id'], PDO::PARAM_INT);
                $leaderboardStmt->bindParam(':difficulty', $difficulty, PDO::PARAM_STR);
                $leaderboardStmt->bindParam(':mode', $mode, PDO::PARAM_STR);
                $leaderboardStmt->bindParam(':photoCount', $photoCount, PDO::PARAM_INT);
               
                $leaderboardStmt->execute();
            }
        }
    } else {
        $updateGameStmt = $pdo->prepare("UPDATE `mario-kart-world-games` SET current_photo_id = :photoId WHERE id = :gameId");

        $nextPhoto = $mode === 'daily'
            ? getDailyPhoto($pdo, $game['id'])
            : getRandomPhoto($pdo, $difficulty, $currentUser['id'], $game['id']);

        $nextPhotoId = $nextPhoto['id'];

        if (empty($nextPhotoId)) {
            $updateGameStmt->bindValue(':photoId', null, PDO::PARAM_NULL);
        } else {
            $updateGameStmt->bindParam(':photoId', $nextPhotoId, PDO::PARAM_STR);
        }
        $updateGameStmt->bindParam(':gameId', $game['id'], PDO::PARAM_INT);
        $updateGameStmt->execute();
    }

    echo json_encode([
        "actualCoordinates" => [
            "x" => $photo['x'],
            "y" => $photo['y'],
        ],
        "playersMedianCoordinates" => [
            "x" => $photo['guess_median_x'],
            "y" => $photo['guess_median_y'],
        ],
        "playersGuessCount" => $photo['guess_count'],
        "currentPlayerGuess" => [
            "distanceInKm" => $distanceInKm,
            "newScore" => $newScore,
        ],
        "gameData" => [
            "totalScore" => $totalScore,
            "isFinished" => $isFinished || empty($nextPhotoId),
            "cupData" => $cupData,
            "history" => $game['history'],
            "minimumScoreToContinue" => $mode === 'survival' ? getSurvivalMinimumScore($difficulty, $photoCount) : null,
            // TODO: remainingTime
            "nextPhoto" => empty($nextPhotoId) ? null : [
                'id' => $nextPhotoId,
                'author' => [
                    'id' => $nextPhoto['authorId'] ?? null,
                    'name' => $nextPhoto['authorName'] ?? null,
                    'character' => $nextPhoto['authorCharacter'] ?? null,
                ],
            ],
        ],
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "error" => true,
        "message" => "Database error: " . $e->getMessage()
    ]);
}