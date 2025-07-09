<?php

require_once __DIR__ . '/___middleware.php';

require_once __DIR__ . '/___coordinates.php';

allowMethod('POST');

$photoName = isset($_POST['photoName']) ? $_POST['photoName'] : null;
$x = isset($_POST['x']) ? intval($_POST['x']) : null;
$y = isset($_POST['y']) ? intval($_POST['y']) : null;

if (!$photoName || $x === null || $y === null ) {
    http_response_code(400);
    die('{"error":true,"message":"Missing parameters."}');
}

try {
    $stmt = $pdo->prepare("INSERT INTO `mario-kart-world-suggestions` (photo_id, x, y, game_id) VALUES (:photoName, :x, :y, :gameId)");
    
    $stmt->bindParam(':photoName', $photoName, PDO::PARAM_STR);
    $stmt->bindParam(':x', $x, PDO::PARAM_INT);
    $stmt->bindParam(':y', $y, PDO::PARAM_INT);

    $game = null;

    if (empty($currentUser) || empty($currentUser['id']) || empty($_POST['gameId'])) {
        $stmt->bindValue(':gameId', null, PDO::PARAM_NULL);
    } else {
        $selectStmt = $pdo->prepare("SELECT id, difficulty, mode FROM `mario-kart-world-games` WHERE id = :gameId AND player_id = :playerId");
        $selectStmt->bindParam(':gameId', $_POST['gameId'], PDO::PARAM_INT);
        $selectStmt->bindParam(':playerId', $currentUser['id'], PDO::PARAM_INT);
        $selectStmt->execute();
        $game = $selectStmt->fetch(PDO::FETCH_ASSOC);

        if (!$game) {
            http_response_code(401);
            die('{"error":true,"message":"Invalid game ID or not owned by current user."}');
        }

        $stmt->bindParam(':gameId', $_POST['gameId'], PDO::PARAM_INT);
    }

    $difficulty = empty($game) ? (
        empty($_POST['difficulty']) ? null : $_POST['difficulty']
    ) : (
        empty($game['difficulty']) ? null : $game['difficulty']
    );
    if (!in_array($difficulty, ['50cc', '100cc', '150cc', 'mirror'])) {
        $difficulty = '150cc';
    }

    $mode = empty($game) ? (
        empty($_POST['mode']) ? null : $_POST['mode']
    ) : (
        empty($game['mode']) ? null : $game['mode']
    );
    if (!in_array($mode, ['goal', 'daily', 'survival'])) {
        http_response_code(400);
        die('{"error":true,"message":"Invalid game mode."}');
    }
   
    $stmt->execute();
    $lastInsertId = $pdo->lastInsertId();

    $stmt = $pdo->prepare(
        "SELECT DISTINCT
            p.id as photoName, p.x, p.y,
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
    $stmt->bindParam(':id', $photoName, PDO::PARAM_STR);
    $stmt->execute();
    
    $photo = $stmt->fetch(PDO::FETCH_ASSOC);

    http_response_code(201);

    $distanceInKm = distanceBetweenCoordinatesInKilometers([
        'x' => $photo['x'],
        'y' => $photo['y'],
    ], [
        'x' => $x,
        'y' => $y,
    ]);

    $newScore = getScoreFromDistanceInKilometers($distanceInKm, $difficulty);

    // TODO: calculate total score for the game (how to handle anonymous games?)
    // TODO: check if game is finished according to the mode

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
            "totalScore" => 0, // TODO  
            "isFinished" => false, // TODO
        ],
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "error" => true,
        "message" => "Database error: " . $e->getMessage()
    ]);
}