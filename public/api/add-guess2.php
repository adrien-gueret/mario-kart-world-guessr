<?php

require_once __DIR__ . '/___middleware.php';

require_once __DIR__ . '/___coordinates.php';

require_once __DIR__ . '/___photos.php';

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

    $game['history'] = array_map(function($guess) {
        $distanceInKm = distanceBetweenCoordinatesInKilometers(
            ['x' => $guess['guess_x'], 'y' => $guess['guess_y']],
            ['x' => $guess['actual_x'], 'y' => $guess['actual_y']]
        );

        $score = getScoreFromDistanceInKilometers($distanceInKm, empty($_POST['difficulty']) ? '150cc' : $_POST['difficulty']);

        return $score;
    }, $game['guesses']);

    unset($game['guesses']);

    $insertSuggestionStmt->bindParam(':gameId', $_POST['gameId'], PDO::PARAM_INT);

    $difficulty = $game['difficulty'];
    if (!in_array($difficulty, ['50cc', '100cc', '150cc', 'mirror'])) {
        $difficulty = '150cc';
    }

    $mode = $game['mode'];
    if (!in_array($mode, ['goal', 'daily', 'survival'])) {
        http_response_code(400);
        die('{"error":true,"message":"Invalid game mode."}');
    }
   
    $insertSuggestionStmt->execute();
    $lastInsertId = $pdo->lastInsertId();

    $selectPhotoStmt = $pdo->prepare(
        "SELECT DISTINCT
            p.id as photoId, p.x, p.y,
            md.guess_median_x, md.guess_median_y,
            COUNT(s.photo_id) as guess_count
        FROM `mario-kart-world-photos` p
        LEFT JOIN `mario-kart-world-suggestions` s 
            ON p.id = s.photo_id
        LEFT JOIN `mario-kart-world-games` g 
            ON s.game_id = g.id
        LEFT JOIN (
            SELECT DISTINCT
                s.photo_id,
                MEDIAN(s.x) OVER (PARTITION BY s.photo_id) AS guess_median_x,
                MEDIAN(s.y) OVER (PARTITION BY s.photo_id) AS guess_median_y
            FROM 
                `mario-kart-world-suggestions` s
            LEFT JOIN `mario-kart-world-games` g ON s.game_id = g.id
            WHERE (g.player_id IS NULL OR g.player_id != 1)
        ) md ON p.id = md.photo_id
        WHERE p.id = :id 
        AND p.validated_at IS NOT NULL
        AND (g.player_id IS NULL OR g.player_id != 1)
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

    $photoCount = count($game['history']);
    $totalScore = array_sum($game["history"]);

    $isFinished = false;
    $newRecord = false;

    switch($mode) {
        case 'daily':
            $isFinished = $photoCount >= 5;
        break;

        case 'survival':
            $isFinished =
                ($difficulty === "50cc" && $newScore < 2500) ||
                ($difficulty === "100cc" && $newScore < 3000) ||
                ($difficulty === "150cc" && $newScore < 3500) ||
                ($difficulty === "mirror" && $newScore < 3500);
        break;

        case 'goal':
            $isFinished = $totalScore >= 50000;
        break;
    }

    $nextPhotoId = null;

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
            $whatToSelect = $mode === 'goal' ? 'MIN(photo_count)' : 'MAX(photo_count)';

            $selectLeaderBoardStmt = $pdo->prepare(
                "SELECT $whatToSelect FROM `mario-kart-world-leaderboard-goal-survival`
                WHERE player_id = :playerId
                AND mode = :mode
                AND difficulty = :difficulty
            ");
            $selectLeaderBoardStmt->bindParam(':playerId', $currentUser['id'], PDO::PARAM_INT);
            $selectLeaderBoardStmt->bindParam(':mode', $mode, PDO::PARAM_STR);
            $selectLeaderBoardStmt->bindParam(':difficulty', $difficulty, PDO::PARAM_STR);
            $selectLeaderBoardStmt->execute();

            $best = $selectLeaderBoardStmt->fetchColumn();

            $leaderboardStmt = null;
            
            if (empty($best)) {
                $leaderboardStmt = $pdo->prepare(
                    "INSERT INTO `mario-kart-world-leaderboard-goal-survival` (player_id, difficulty, mode, photo_count, score)
                    VALUES (:playerId, :difficulty, :mode, :photoCount, :score)
                ");
            } else if (($mode === 'goal' && $photoCount <= $best) || ($mode === 'survival' && $photoCount >= $best)) {
                $leaderboardStmt = $pdo->prepare(
                    "UPDATE `mario-kart-world-leaderboard-goal-survival` SET photo_count = :photoCount, score = :score, performed_at = NOW()
                    WHERE player_id = :playerId AND difficulty = :difficulty AND mode = :mode
                ");

                $newRecord = true;
            }

            if (!empty($leaderboardStmt)) {
                $leaderboardStmt->bindParam(':playerId', $currentUser['id'], PDO::PARAM_INT);
                $leaderboardStmt->bindParam(':difficulty', $difficulty, PDO::PARAM_STR);
                $leaderboardStmt->bindParam(':mode', $mode, PDO::PARAM_STR);
                $leaderboardStmt->bindParam(':photoCount', $photoCount, PDO::PARAM_INT);
                $leaderboardStmt->bindParam(':score', $totalScore, PDO::PARAM_INT);

                $leaderboardStmt->execute();
            }
        }
    } else {
        $updateGameStmt = $pdo->prepare("UPDATE `mario-kart-world-games` SET current_photo_id = :photoId WHERE id = :gameId");

        $nextPhoto = $mode === 'daily'
            ? getDailyPhoto($pdo, $game['id'])
            : getRandomPhoto($pdo, $difficulty, $currentUser['id']);

        $nextPhotoId = $nextPhoto['id'];

        if (empty($nextPhotoId)) {
            $updateGameStmt->bindParam(':photoId', null, PDO::PARAM_NULL);
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
            "newRecord" => $isFinished ? $newRecord : null,
            "history" => $game['history'],
            "nextPhotoId" => $nextPhotoId,
        ],
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "error" => true,
        "message" => "Database error: " . $e->getMessage()
    ]);
}