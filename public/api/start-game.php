<?php 

require_once __DIR__ . '/___middleware.php';

require_once __DIR__ . '/___coordinates.php';

require_once __DIR__ . '/___photos.php';

allowMethod('POST');

if (empty($currentUser)) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$possibleModes = ['daily', 'survival', 'goal'];

if (!isset($_POST['mode']) || !in_array($_POST['mode'], $possibleModes)) {
    http_response_code(400);
    die('{"error":true,"message":"Invalid mode"}');
}

$possibleDifficulties = ['50cc', '100cc', '150cc', 'mirror'];

if ($_POST['mode'] !== 'daily' && (!isset($_POST['difficulty']) || !in_array($_POST['difficulty'], $possibleDifficulties))) {
    http_response_code(400);
    die('{"error":true,"message":"Invalid difficulty"}');
}

try {
    // TODO: handle daily mode separately
    $stmt = $pdo->prepare(
        "SELECT
            g.id AS id,
            g.current_photo_id as currentPhotoId,
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
            g.player_id = :player_id
            AND g.mode = :mode
            AND g.difficulty = :difficulty
            AND g.finished_at IS NULL
            GROUP BY g.id
            LIMIT 1");

    $stmt->bindParam(':player_id', $currentUser['id'], PDO::PARAM_INT);
    $stmt->bindParam(':mode', $_POST['mode'], PDO::PARAM_STR);

    if ($_POST['mode'] === 'daily') {
        $stmt->bindValue(':difficulty', null, PDO::PARAM_NULL);
    } else {
        $stmt->bindParam(':difficulty', $_POST['difficulty'], PDO::PARAM_STR);
    }
   
    $stmt->execute();
    
    $game = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!empty($game)) {
        http_response_code(200);

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

        $game["totalScore"] = array_sum($game["history"]);

        echo json_encode($game);
        exit;
    }

    $firstPhoto = $mode === 'daily'
        ? getDailyPhoto($pdo, 0)
        : getRandomPhoto($pdo, $_POST['difficulty'], $currentUser['id']);

    $stmt = $pdo->prepare(
        "INSERT INTO `mario-kart-world-games` (player_id, mode, difficulty, current_photo_id)
        VALUES (:player_id, :mode, :difficulty, :currentPhotoId)"
    );
    $stmt->bindParam(':player_id', $currentUser['id'], PDO::PARAM_INT);
    $stmt->bindParam(':mode', $_POST['mode'], PDO::PARAM_STR);
    $stmt->bindParam(':difficulty', $_POST['difficulty'], PDO::PARAM_STR);
    $stmt->bindParam(':currentPhotoId', $firstPhoto['id'], PDO::PARAM_STR);
    $stmt->execute();
    $gameId = $pdo->lastInsertId();

    http_response_code(201);
    echo json_encode([
        'id' => intval($gameId),
        'history' => [],
        'totalScore' => 0,
        'currentPhotoId' => $firstPhoto['id'],
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error']);
}