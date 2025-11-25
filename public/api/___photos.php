<?php

function getRandomPhoto($pdo, $difficulty, $currentUserId, $gameId = null) {
    $params = [$currentUserId];

    $photoDifficulty = '';

    switch ($difficulty) {
        case '50cc':
            $photoDifficulty = 'AND p.difficulty = "easy"';
            break;
        case '100cc':
            $photoDifficulty = 'AND p.difficulty IN ("easy","medium")';
            break;
        default:
            $photoDifficulty = '';
            break;
    }

    $inGameJoin = '';
    $excludeCondition = '';
    if ($gameId !== null) {
        $params[] = $gameId;
        $inGameJoin =
            "LEFT JOIN (
                SELECT photo_id
                FROM `mario-kart-world-suggestions`
                WHERE game_id = ?
            ) s_in_game ON s_in_game.photo_id = p.id";
        $excludeCondition = 'AND s_in_game.photo_id IS NULL';
    }

    $sql = 
        "SELECT
            p.id,
            p.author_id AS authorId,
            u.username AS authorName,
            u.mario_character AS authorCharacter,
            COUNT(s.photo_id) AS viewCount,
            IFNULL(user_sugg.userViewCount, 0) AS userViewCount
        FROM `mario-kart-world-photos` p
        LEFT JOIN `mario-kart-world-suggestions` s 
            ON p.id = s.photo_id
        LEFT JOIN `mario-kart-world-games` g
            ON s.game_id = g.id
            AND (g.player_id IS NULL OR g.player_id != p.author_id)
        LEFT JOIN `mario-kart-world-users` u
            ON p.author_id = u.id
        LEFT JOIN (
            SELECT
                s.photo_id,
                COUNT(*) AS userViewCount
            FROM `mario-kart-world-suggestions` s
            LEFT JOIN `mario-kart-world-games` g ON s.game_id = g.id
            WHERE g.player_id = ?
            GROUP BY s.photo_id
        ) user_sugg ON user_sugg.photo_id = p.id
        $inGameJoin
        WHERE
            p.validated_at IS NOT NULL
            AND p.validated_at <= NOW() - INTERVAL 5 MINUTE
            $photoDifficulty
            $excludeCondition
        GROUP BY p.id
        ORDER BY userViewCount ASC, viewCount ASC, RAND()
        LIMIT 1;";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    $photo = $stmt->fetch(PDO::FETCH_ASSOC);

    return $photo ?: getRandomPhoto($pdo, $difficulty, $currentUserId);
}

function getDailyPhoto($pdo, $gameId = null) {
    if ($gameId === null) {
        $stmt = $pdo->prepare(
            "SELECT d.photo_1_id as id,
                p.author_id as authorId,
                u.username as authorName,
                u.mario_character as authorCharacter
            FROM `mario-kart-world-dailies` d
            LEFT JOIN `mario-kart-world-photos` p ON d.photo_1_id = p.id
            LEFT JOIN `mario-kart-world-users` u ON p.author_id = u.id
            WHERE daily_date = CURDATE()"
        );

        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    $stmt = $pdo->prepare(
        "SELECT 
            g.id AS game_id,
            g.started_at,
            COUNT(s.id) AS suggestions_count
        FROM 
            `mario-kart-world-games` g
        LEFT JOIN 
            `mario-kart-world-suggestions` s
        ON s.game_id = g.id
        WHERE
            g.id = :gameId
            AND g.mode = 'daily'
            AND g.finished_at IS NULL
        GROUP BY g.id"
    );
    $stmt->bindParam(':gameId', $gameId, PDO::PARAM_INT);
    $stmt->execute();

    $game = $stmt->fetch(PDO::FETCH_ASSOC);

    if (empty($game)) {
        return null;
    }

    $index = min((int)$game['suggestions_count'], 4) + 1;
    $col = "d.photo_{$index}_id";

    $stmt = $pdo->prepare(
        "SELECT $col as id,
            p.author_id as authorId,
            u.username as authorName,
            u.mario_character as authorCharacter
        FROM `mario-kart-world-dailies` d
        LEFT JOIN `mario-kart-world-photos` p ON $col = p.id
        LEFT JOIN `mario-kart-world-users` u ON p.author_id = u.id
        WHERE d.daily_date = :dailyDate"
    );
    $date = (new DateTime($game['started_at']))->format('Y-m-d');
    $stmt->bindParam(':dailyDate', $date, PDO::PARAM_STR);
    $stmt->execute();

    $photo = $stmt->fetch(PDO::FETCH_ASSOC);

    return $photo;
}