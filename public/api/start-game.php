<?php 

require_once __DIR__ . '/___middleware.php';

require_once __DIR__ . '/___coordinates.php';

require_once __DIR__ . '/___photos.php';

require_once __DIR__ . '/___game.php';

allowMethod('POST');

if (empty($currentUser)) {
    http_response_code(401);
    echo json_encode(['error' => true, 'message' => 'Unauthorized']);
    exit;
}

$possibleModes = ['daily', 'survival', 'goal', 'chrono'];

if (
    !isset($_POST['mode']) ||
    !in_array($_POST['mode'], $possibleModes) 
) {
    http_response_code(400);
    die('{"error":true,"message":"Invalid mode"}');
}

$possibleDifficulties = ['50cc', '100cc', '150cc', 'mirror'];

$isDailyMode = $_POST['mode'] === 'daily';

if (!$isDailyMode && (!isset($_POST['difficulty']) || !in_array($_POST['difficulty'], $possibleDifficulties))) {
    http_response_code(400);
    die('{"error":true,"message":"Invalid difficulty"}');
}

try {
    $selectGameStmt = $pdo->prepare(
        "SELECT
            g.id AS id,
            g.difficulty AS difficulty,
            g.current_photo_id as currentPhotoId,
            photoAuthor.author_id as authorId,
            u.username as authorName,
            u.mario_character as authorCharacter,
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
        LEFT JOIN `mario-kart-world-photos` photoAuthor ON g.current_photo_id = photoAuthor.id
        LEFT JOIN `mario-kart-world-users` u ON photoAuthor.author_id = u.id
        WHERE
            g.player_id = :player_id
            AND g.mode = :mode
            AND ".($isDailyMode ? 'g.difficulty IS NULL' : 'g.difficulty = :difficulty')."
            AND ".($isDailyMode ? 'DATE(g.started_at) = CURDATE()' : 'g.finished_at IS NULL')."
        GROUP BY g.id
        LIMIT 1");

    $selectGameStmt->bindParam(':player_id', $currentUser['id'], PDO::PARAM_INT);
    $selectGameStmt->bindParam(':mode', $_POST['mode'], PDO::PARAM_STR);

    if (!$isDailyMode) {
        $selectGameStmt->bindParam(':difficulty', $_POST['difficulty'], PDO::PARAM_STR);
    }
   
    $selectGameStmt->execute();
    
    $game = $selectGameStmt->fetch(PDO::FETCH_ASSOC);

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

        $history = array_map(function($guess) use ($game) {
            $distanceInKm = distanceBetweenCoordinatesInKilometers(
                ['x' => $guess['guess_x'], 'y' => $guess['guess_y']],
                ['x' => $guess['actual_x'], 'y' => $guess['actual_y']]
            );

            $score = getScoreFromDistanceInKilometers($distanceInKm, $game['difficulty'] ?: '150cc');

            return $score;
        }, $game['guesses']);

        $totalScore = array_sum($history);

        // Reset the per-photo timing baseline so image loading / time spent away
        // from the game isn't counted against the player (notably for chrono).
        if (!empty($game['currentPhotoId'])) {
            $resetServedAtStmt = $pdo->prepare(
                "UPDATE `mario-kart-world-games` SET current_photo_served_at = NOW() WHERE id = :gameId");
            $resetServedAtStmt->bindParam(':gameId', $game['id'], PDO::PARAM_INT);
            $resetServedAtStmt->execute();
        }

        $remainingTime = $_POST['mode'] === 'chrono'
            ? max(0, getChronoTimeLimitMs($_POST['difficulty']) - getChronoElapsedMs($pdo, $game['id']))
            : null;

        echo json_encode([
            'id' => $game['id'],
            'history' => $history,
            'totalScore' => $totalScore,
            'currentPhoto' => empty($game['currentPhotoId']) ? null : [
                'id' => $game['currentPhotoId'],
                'author' => [
                    'id' => $game['authorId'] ?? null,
                    'name' => $game['authorName'] ?? null,
                    'character' => $game['authorCharacter'] ?? null,
                ],
            ],
            'minimumScoreToContinue' => $_POST['mode'] === 'survival' ? getSurvivalMinimumScore($_POST['difficulty'], count($history)) : null,
            'remainingTime' => $remainingTime,
        ]);
        exit;
    }

    $firstPhoto = $isDailyMode
        ? getDailyPhoto($pdo)
        : getRandomPhoto($pdo, $_POST['difficulty'], $currentUser['id']);

    $createGameStmt = $pdo->prepare(
        "INSERT INTO `mario-kart-world-games` (player_id, mode, difficulty, current_photo_id, current_photo_served_at)
        VALUES (:player_id, :mode, :difficulty, :currentPhotoId, NOW())"
    );
    $createGameStmt->bindParam(':player_id', $currentUser['id'], PDO::PARAM_INT);
    $createGameStmt->bindParam(':mode', $_POST['mode'], PDO::PARAM_STR);
    if ($isDailyMode) {
        $createGameStmt->bindValue(':difficulty', null, PDO::PARAM_NULL);
    } else {
        $createGameStmt->bindParam(':difficulty', $_POST['difficulty'], PDO::PARAM_STR);
    }
    $createGameStmt->bindParam(':currentPhotoId', $firstPhoto['id'], PDO::PARAM_STR);
    $createGameStmt->execute();
    $gameId = $pdo->lastInsertId();

    http_response_code(201);
    echo json_encode([
        'id' => intval($gameId),
        'history' => [],
        'totalScore' => 0,
        'currentPhoto' => empty($firstPhoto) ? null : [
            'id' => $firstPhoto['id'],
            'author' => [
                'id' => $firstPhoto['authorId'] ?? null,
                'name' => $firstPhoto['authorName'] ?? null,
                'character' => $firstPhoto['authorCharacter'] ?? null,
            ],
        ],
        'minimumScoreToContinue' => $_POST['mode'] === 'survival' ? getSurvivalMinimumScore($_POST['difficulty'], 0) : null,
        'remainingTime' => $_POST['mode'] === 'chrono' ? getChronoTimeLimitMs($_POST['difficulty']) : null,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error']);
}