<?php

$accessTokenData = [
    'accessToken' => null,
    'refreshToken' => null,
    'expiredAt' => null,
];

try {
    $anonymousUserId = $currentUser['id'];

     try {
        $pdo->beginTransaction();

        $updates = [
            ['table' => 'mario-kart-world-games', 'field' => 'player_id'],
            ['table' => 'mario-kart-world-tokens', 'field' => 'user_id'],
        ];

        // If new user, no risks to update leaderboards
        if ($isNewUser) {
            $updates[] = ['table' => 'mario-kart-world-leaderboard-daily', 'field' => 'player_id'];
            $updates[] = ['table' => 'mario-kart-world-leaderboard-goal-survival', 'field' => 'player_id'];
        }

        foreach ($updates as $update) {
            $stmt = $pdo->prepare(
                "UPDATE `{$update['table']}`
                SET {$update['field']} = :userId
                WHERE {$update['field']} = :anonymousUserId");
            $stmt->bindParam(':anonymousUserId', $anonymousUserId, PDO::PARAM_INT);
            $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
            $stmt->execute();
        }

        if (!$isNewUser) {
            // It's a user that was already registered,
            // we have to check leaderboard previous results before overwrite them

            // First daily leaderboard
            $stmt = $pdo->prepare(
                "SELECT daily_id
                FROM `mario-kart-world-leaderboard-daily`
                WHERE player_id = :anonymousUserId
                AND daily_id NOT IN (
                    SELECT daily_id FROM `mario-kart-world-leaderboard-daily`
                    WHERE player_id = :userId
                )"
            );
            $stmt->bindParam(':anonymousUserId', $anonymousUserId, PDO::PARAM_INT);
            $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
            $stmt->execute();
            $ids = $stmt->fetchAll(PDO::FETCH_COLUMN);

            if (!empty($ids)) {
                $placeholders = implode(',', array_fill(0, count($ids), '?'));

                $update = $pdo->prepare(
                    "UPDATE `mario-kart-world-leaderboard-daily`
                    SET player_id = ?
                    WHERE player_id = ? AND daily_id IN ($placeholders)"
                );

                $params = array_merge([$userId, $anonymousUserId], $ids);
                $update->execute($params);
            }

     

            // Then goal/survival/chrono leaderboard
            $stmt = $pdo->prepare(
                "SELECT difficulty, mode, photo_count, score, performed_at
                FROM `mario-kart-world-leaderboard-goal-survival`
                WHERE player_id = :anonymousUserId
            ");
            $stmt->bindParam(':anonymousUserId', $anonymousUserId, PDO::PARAM_INT);
            $stmt->execute();
            $anonymousResults = $stmt->fetchAll(PDO::FETCH_ASSOC);

            foreach ($anonymousResults as $result) {
                $checkStmt = $pdo->prepare(
                    "SELECT photo_count, score
                    FROM `mario-kart-world-leaderboard-goal-survival`
                    WHERE player_id = :userId AND difficulty = :difficulty AND mode = :mode
                    LIMIT 1"
                );
                $checkStmt->bindParam(':userId', $userId, PDO::PARAM_INT);
                $checkStmt->bindParam(':difficulty', $result['difficulty']);
                $checkStmt->bindParam(':mode', $result['mode']);
                $checkStmt->execute();
                $userScore = $checkStmt->fetch(PDO::FETCH_ASSOC);

                if ($userScore) {
                    $shouldUpdate = false;
                    if ($result['mode'] === 'goal') {
                        $shouldUpdate = (
                            ($result['photo_count'] < $userScore['photo_count']) ||
                            ($result['photo_count'] === $userScore['photo_count'] && $result['score'] > $userScore['score'])
                        );
                    } else if ($result['mode'] === 'survival') {
                        $shouldUpdate = (
                            ($result['photo_count'] > $userScore['photo_count']) ||
                            ($result['photo_count'] === $userScore['photo_count'] && $result['score'] > $userScore['score'])
                        );
                    }  else if ($result['mode'] === 'chrono') {
                        $shouldUpdate = $result['score'] > $userScore['score'];
                    }

                    if ($shouldUpdate) {
                        $updateStmt = $pdo->prepare(
                            "UPDATE `mario-kart-world-leaderboard-goal-survival`
                            SET photo_count = :photo_count, score = :score, performed_at = :performed_at
                            WHERE player_id = :userId AND difficulty = :difficulty AND mode = :mode"
                        );
                        $updateStmt->bindParam(':photo_count', $result['photo_count'], PDO::PARAM_INT);
                        $updateStmt->bindParam(':score', $result['score'], PDO::PARAM_INT);
                        $updateStmt->bindParam(':performed_at', $result['performed_at']);
                        $updateStmt->bindParam(':userId', $userId, PDO::PARAM_INT);
                        $updateStmt->bindParam(':difficulty', $result['difficulty']);
                        $updateStmt->bindParam(':mode', $result['mode']);
                        $updateStmt->execute();
                    }
                } else {
                    $insertStmt = $pdo->prepare(
                        "INSERT INTO `mario-kart-world-leaderboard-goal-survival`
                        (player_id, difficulty, mode, photo_count, score, performed_at)
                        VALUES (:userId, :difficulty, :mode, :photo_count, :score, :performed_at)"
                    );
                    $insertStmt->bindParam(':userId', $userId, PDO::PARAM_INT);
                    $insertStmt->bindParam(':difficulty', $result['difficulty']);
                    $insertStmt->bindParam(':mode', $result['mode']);
                    $insertStmt->bindParam(':photo_count', $result['photo_count'], PDO::PARAM_INT);
                    $insertStmt->bindParam(':score', $result['score'], PDO::PARAM_INT);
                    $insertStmt->bindParam(':performed_at', $result['performed_at']);
                    $insertStmt->execute();
                }
            }
        }

        $updateErrorTrackerStmt = $pdo->prepare(
            "UPDATE `mario-kart-world-errors-tracker`
            SET user_id = ?
            WHERE user_id = ?"
        );

        $errorTrackerParams = array_merge([$userId, $anonymousUserId]);
        $updateErrorTrackerStmt->execute($errorTrackerParams);

        $deleteStmt = $pdo->prepare("DELETE FROM `mario-kart-world-leaderboard-daily` WHERE player_id = :anonymousUserId");
        $deleteStmt->bindParam(':anonymousUserId', $anonymousUserId, PDO::PARAM_INT);
        $deleteStmt->execute();

        $deleteStmt = $pdo->prepare(
            "DELETE FROM `mario-kart-world-leaderboard-goal-survival` WHERE player_id = :anonymousUserId"
        );
        $deleteStmt->bindParam(':anonymousUserId', $anonymousUserId, PDO::PARAM_INT);
        $deleteStmt->execute();

        $deleteStmt = $pdo->prepare("DELETE FROM `mario-kart-world-users` WHERE id = :anonymousUserId");
        $deleteStmt->bindParam(':anonymousUserId', $anonymousUserId, PDO::PARAM_INT);
        $deleteStmt->execute();

        $pdo->commit();
    } catch (Exception $e) {
        $pdo->rollBack();
        throw $e;
    }

    if (!$isNewUser) {  
        $stmt = $pdo->prepare("DELETE FROM `mario-kart-world-tokens` WHERE user_id = :userId AND expired_at <= NOW() - INTERVAL 7 DAY");
        $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
        $stmt->execute();
    }

    $accessTokenData = storeNewAccessToken($userId, $email, $pdo);
  
} catch (Exception $e) {
    die('{"error":true,"message": '. $e->getMessage() .'}');
}

http_response_code(201);

echo json_encode([
    'id' => $userId,
    'email' => $email,
    'username' => $name,
    'marioCharacter' => $marioCharacter,
    'distanceUnit' => $distanceUnit,
    'accessToken' => $accessTokenData['accessToken'],
    'refreshToken' => $accessTokenData['refreshToken'],
    'expiredAt' => $accessTokenData['expiredAt'],
    'isNewUser' => $isNewUser,
]);