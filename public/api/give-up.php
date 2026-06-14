<?php

require_once __DIR__ . '/___middleware.php';

require_once __DIR__ . '/___coordinates.php';

require_once __DIR__ . '/___achievements.php';

require_once __DIR__ . '/___game.php';

$_PUT = allowMethod('PUT');

if (empty($currentUser) || empty($_PUT['gameId'])) {
    http_response_code(400);
    echo json_encode([
        "error" => true,
        "message" => "User or game missing."
    ]);
    die;
}

try {
    // Fetch the game first so we know its mode/difficulty and can compute the
    // accumulated score. For chrono, giving up (or the timer running out) still
    // records the score the player has accumulated so far on the leaderboard.
    $selectGameStmt = $pdo->prepare(
        "SELECT g.id, g.mode, g.difficulty,
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
        WHERE g.id = :gameId AND g.player_id = :playerId AND g.finished_at IS NULL
        GROUP BY g.id");
    $selectGameStmt->bindParam(':gameId', $_PUT['gameId'], PDO::PARAM_INT);
    $selectGameStmt->bindParam(':playerId', $currentUser['id'], PDO::PARAM_INT);
    $selectGameStmt->execute();
    $game = $selectGameStmt->fetch(PDO::FETCH_ASSOC);

    $updateGameStmt = $pdo->prepare(
        "UPDATE `mario-kart-world-games`
        SET finished_at = NOW(), current_photo_id = NULL
        WHERE id = :gameId AND player_id = :playerId AND finished_at IS NULL");
    $updateGameStmt->bindParam(':gameId', $_PUT['gameId'], PDO::PARAM_INT);
    $updateGameStmt->bindParam(':playerId', $currentUser['id'], PDO::PARAM_INT);
    $updateGameStmt->execute();

    if ($updateGameStmt->rowCount() === 0) {
        http_response_code(409);
        echo json_encode([
            "error" => true,
            "message" => "Cannot stop given game."
        ]);
        die;
    }

    if ($game && $game['mode'] === 'chrono') {
        $difficulty = empty($game['difficulty']) ? '150cc' : $game['difficulty'];
        if (!in_array($difficulty, ['50cc', '100cc', '150cc', 'mirror'])) {
            $difficulty = '150cc';
        }

        $guesses = json_decode($game['guesses'], true) ?: [];
        $guesses = array_values(array_filter($guesses, function($item) {
            return $item !== null;
        }));

        $history = array_map(function($guess) use ($difficulty) {
            $distanceInKm = distanceBetweenCoordinatesInKilometers(
                ['x' => $guess['guess_x'], 'y' => $guess['guess_y']],
                ['x' => $guess['actual_x'], 'y' => $guess['actual_y']]
            );

            return getScoreFromDistanceInKilometers($distanceInKm, $difficulty);
        }, $guesses);

        recordGoalSurvivalChronoResult(
            $pdo,
            $currentUser['id'],
            'chrono',
            $difficulty,
            count($history),
            array_sum($history)
        );
    }

    echo json_encode([
        "error" => false,
        "message" => "Game stopped successfully."
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "error" => true,
        "message" => "Database error: " . $e->getMessage()
    ]);
}