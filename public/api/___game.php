<?php

function getSurvivalMinimumScore($difficulty, $historyLength) {
    $baseLimits = [
        '50cc' => 3000,
        '100cc' => 3250,
        '150cc' => 3500,
        'mirror' => 3500
    ];

    return min($baseLimits[$difficulty] + floor($historyLength / 8) * 250, 4500);
}

function getChronoTimeLimitMs($difficulty) {
    $limits = [
        '50cc' => 50000,
        '100cc' => 40000,
        '150cc' => 30000,
        'mirror' => 30000,
    ];

    return isset($limits[$difficulty]) ? $limits[$difficulty] : 30000;
}

/**
 * Total "thinking time" already spent on a game, in milliseconds.
 * Sums the per-guess thinking_ms (NULL values counted as 0 so legacy/older
 * guesses degrade gracefully). Used by chrono mode to know the remaining time.
 */
function getChronoElapsedMs($pdo, $gameId) {
    $stmt = $pdo->prepare(
        "SELECT COALESCE(SUM(thinking_ms), 0) AS elapsed
        FROM `mario-kart-world-suggestions`
        WHERE game_id = :gameId");
    $stmt->bindParam(':gameId', $gameId, PDO::PARAM_INT);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    return (int) ($row ? $row['elapsed'] : 0);
}

/**
 * Writes the goal/survival/chrono leaderboard entry (and cups/achievements)
 * for a finished game. Shared by add-guess.php (game finished naturally) and
 * give-up.php (chrono game ended because the time ran out).
 *
 * Requires ___achievements.php to be included by the caller (unlockAchievement).
 *
 * @return array|null The computed cup data ('cup' + 'starRank'), or null.
 */
function recordGoalSurvivalChronoResult($pdo, $playerId, $mode, $difficulty, $photoCount, $totalScore) {
    // A game with no completed guess (e.g. chrono timed out before any guess)
    // has nothing to rank: keep the leaderboard untouched.
    if ($photoCount <= 0) {
        return null;
    }

    $photoCountOrderType = $mode === 'survival' ? 'DESC' : 'ASC';
    $rowLeaderBoardOrderBy = $mode === 'chrono'
        ? "ORDER BY score DESC, photo_count DESC, performed_at DESC"
        : "ORDER BY photo_count $photoCountOrderType, score DESC, performed_at DESC";

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
    $stmt->bindValue(':playerId', $playerId, PDO::PARAM_INT);
    $stmt->bindValue(':score', $totalScore, PDO::PARAM_INT);
    $stmt->bindValue(':photoCount', $photoCount, PDO::PARAM_INT);

    $stmt->execute();

    $cupData = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($cupData["cup"] === 'gold') {
        unlockAchievement($pdo, $playerId, implode('_', ['gold', $difficulty, $mode]));
    }

    if ($cupData["cup"] !== 'none') {
        $cupStmt = $pdo->prepare(
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

        $cupStmt->bindParam(':playerId', $playerId, PDO::PARAM_INT);
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
    $selectLeaderBoardStmt->bindParam(':playerId', $playerId, PDO::PARAM_INT);
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
        $leaderboardStmt->bindParam(':playerId', $playerId, PDO::PARAM_INT);
        $leaderboardStmt->bindParam(':difficulty', $difficulty, PDO::PARAM_STR);
        $leaderboardStmt->bindParam(':mode', $mode, PDO::PARAM_STR);
        $leaderboardStmt->bindParam(':photoCount', $photoCount, PDO::PARAM_INT);

        $leaderboardStmt->execute();
    }

    return $cupData;
}