<?php 

require_once __DIR__ . '/___middleware.php';

require_once __DIR__ . '/___coordinates.php';

require_once __DIR__ . '/___album-game.php';

allowMethod('GET');

$possibleModes = ['survival', 'goal', 'daily', 'chrono', 'album'];

if (!isset($_GET['mode']) || !in_array($_GET['mode'], $possibleModes)) {
    http_response_code(400);
    die('{"error":true,"message":"Invalid mode"}');
}

$possibleDifficulties = ['50cc', '100cc', '150cc', 'mirror'];

$isDailyMode = $_GET['mode'] === 'daily';
$isAlbumMode = $_GET['mode'] === 'album';

if (!$isDailyMode && !$isAlbumMode && (!isset($_GET['difficulty']) || !in_array($_GET['difficulty'], $possibleDifficulties))) {
    http_response_code(400);
    die('{"error":true,"message":"Invalid difficulty"}');
}

if ($isAlbumMode && (!isset($_GET['albumId']) || !is_numeric($_GET['albumId']))) {
    http_response_code(400);
    die('{"error":true,"message":"Invalid album ID"}');
}

try {
    $anonymousUserName = $headers['accept-language'] === 'fr' ? 'Anonyme' : 'Anonymous';
    
    if ($isDailyMode) {
        $date = isset($_GET['date']) ? $_GET['date'] : 'today';

        if ($date === 'today') {
            $date = date('Y-m-d');
        }

        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
            http_response_code(400);
            die('{"error":true,"message":"Invalid date format"}');
        }

         $stmt = $pdo->prepare(
            "SELECT
                l.player_id playerId,
                l.score,
                5 as photoCount,
                IF(u.email IS NULL, '$anonymousUserName', u.username) AS playerName,
                IF(u.email IS NULL, 1, 0) AS isAnonymous,
                u.mario_character marioCharacter,
                ROW_NUMBER() OVER (ORDER BY score DESC) AS rank
            FROM `mario-kart-world-leaderboard-daily` l
            LEFT JOIN `mario-kart-world-users` u ON l.player_id = u.id
            LEFT JOIN `mario-kart-world-dailies` d ON l.daily_id = d.id
            WHERE d.daily_date = :dailyDate AND l.player_id NOT IN (3,4,5,6)
        ");

        $stmt->bindParam(':dailyDate', $date, PDO::PARAM_STR);
    } else if ($isAlbumMode) {
        $albumId = (int) $_GET['albumId'];
        $photosHash = computeAlbumPhotosHash($pdo, $albumId);

        $stmt = $pdo->prepare(
            "SELECT
                l.player_id playerId,
                l.score,
                NULL as photoCount,
                IF(u.email IS NULL, '$anonymousUserName', u.username) AS playerName,
                IF(u.email IS NULL, 1, 0) AS isAnonymous,
                u.mario_character marioCharacter,
                ROW_NUMBER() OVER (ORDER BY l.score DESC, l.created_at ASC) AS rank
            FROM `mario-kart-world-leaderboard-album` l
            LEFT JOIN `mario-kart-world-users` u ON l.player_id = u.id
            WHERE l.album_id = :albumId AND l.photos_hash = :photosHash AND l.player_id NOT IN (3,4,5,6)
        ");

        $stmt->bindParam(':albumId', $albumId, PDO::PARAM_INT);
        $stmt->bindParam(':photosHash', $photosHash, PDO::PARAM_STR);
    } else {
        $photoCountOrderType = $_GET['mode'] === 'survival' ? 'DESC' : 'ASC';
        $rowLeaderBoardOrderBy = $_GET['mode'] === 'chrono'
            ? "ORDER BY score DESC, photo_count DESC, performed_at DESC"
            : "ORDER BY photo_count $photoCountOrderType, score DESC, performed_at DESC";
        
        $stmt = $pdo->prepare(
            "SELECT
                l.player_id playerId,
                l.score,
                l.photo_count photoCount,
                l.performed_at,
                IF(u.email IS NULL, '$anonymousUserName', u.username) AS playerName,
                IF(u.email IS NULL, 1, 0) AS isAnonymous,
                u.mario_character marioCharacter,
                ROW_NUMBER() OVER ($rowLeaderBoardOrderBy) AS rank
            FROM `mario-kart-world-leaderboard-goal-survival` l
            LEFT JOIN `mario-kart-world-users` u ON l.player_id = u.id
            WHERE l.difficulty = :difficulty and l.mode = :mode AND l.player_id NOT IN (3,4,5,6)
        ");

        $stmt->bindParam(':difficulty', $_GET['difficulty'], PDO::PARAM_STR);
        $stmt->bindParam(':mode', $_GET['mode'], PDO::PARAM_STR);
    }

    $stmt->execute();
    
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);  
  
    echo json_encode($users);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'error' => true,
        'message' => 'Database error: ' . $e->getMessage(),
    ]);
}