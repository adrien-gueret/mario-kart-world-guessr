<?php

function getRandomPhoto($pdo, $difficulty, $currentUserId) {
    $params = [$currentUserId];
  
    $where = "WHERE p.validated_at IS NOT NULL AND p.validated_at <= NOW() - INTERVAL 5 MINUTE AND (g.player_id IS NULL OR g.player_id != 1)";
    $userJoin = "LEFT JOIN (
        SELECT
            s.photo_id,
            COUNT(*) as userViewCount
        FROM `mario-kart-world-suggestions` s
        LEFT JOIN `mario-kart-world-games` g ON s.game_id = g.id
        WHERE g.player_id = ?
        GROUP BY s.photo_id
    ) user_sugg ON user_sugg.photo_id = p.id";
    $selectUserView = ", IFNULL(user_sugg.userViewCount, 0) as userViewCount";
    $orderBy = "ORDER BY userViewCount ASC, viewCount ASC, RAND()";

    switch ($difficulty) {
        case '50cc':
        case '100cc':
            $medianDistance = $difficulty === '50cc' ? 90 : 200;
            $sql = "SELECT
                        p.id,
                        COUNT(s.photo_id) as viewCount
                        $selectUserView
                    FROM `mario-kart-world-photos` p
                    LEFT JOIN `mario-kart-world-suggestions` s 
                        ON p.id = s.photo_id
                    LEFT JOIN `mario-kart-world-games` g
                        ON s.game_id = g.id
                    LEFT JOIN (
                        SELECT DISTINCT
                            s.photo_id,
                            MEDIAN(
                                SQRT(
                                    POW(CAST(s.x AS SIGNED) - CAST(p.x AS SIGNED), 2) +
                                    POW(CAST(s.y AS SIGNED) - CAST(p.y AS SIGNED), 2)
                                )
                            ) OVER (PARTITION BY s.photo_id) AS median_distance
                        FROM 
                            `mario-kart-world-suggestions` s
                        JOIN
                            `mario-kart-world-photos` p ON s.photo_id = p.id
                        LEFT JOIN `mario-kart-world-games` g ON s.game_id = g.id
                        WHERE (g.player_id IS NULL OR g.player_id != 1)
                    ) md ON p.id = md.photo_id
                    $userJoin
                    $where AND md.median_distance <= $medianDistance
                    GROUP BY p.id
                    HAVING viewCount >= 5
                    $orderBy
                    LIMIT 1";
            break;

        default:
            $sql = "SELECT
                        p.id,
                        COUNT(s.photo_id) as viewCount
                        $selectUserView
                    FROM `mario-kart-world-photos` p
                    LEFT JOIN `mario-kart-world-suggestions` s 
                        ON p.id = s.photo_id
                    LEFT JOIN `mario-kart-world-games` g
                        ON s.game_id = g.id
                    $userJoin
                    $where
                    GROUP BY p.id
                    $orderBy
                    LIMIT 1";
            break;
    }

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    return $stmt->fetch(PDO::FETCH_ASSOC);
}

function getDailyPhoto($pdo, $gameId = null) {
    if ($gameId === null) {
        $stmt = $pdo->prepare(
            "SELECT photo_1_id as id
            FROM `mario-kart-world-dailies`
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
    $col = "photo_{$index}_id";

    $stmt = $pdo->prepare(
        "SELECT $col as id
        FROM `mario-kart-world-dailies`
        WHERE daily_date = :dailyDate"
    );
    $date = (new DateTime($game['started_at']))->format('Y-m-d');
    $stmt->bindParam(':dailyDate', $date, PDO::PARAM_STR);
    $stmt->execute();

    $photo = $stmt->fetch(PDO::FETCH_ASSOC);

    return $photo;
}