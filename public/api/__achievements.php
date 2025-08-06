<?php

function hasUnlockedAchievement($pdo, $userId, $achievementId) {
    $stmt = $pdo->prepare(
        "SELECT id_user
        FROM `mario-kart-world-users-unlocked-achievements`
        WHERE id_user = :userId AND id_achievement = :achievementId");
    $stmt->execute(['userId' => $userId, 'achievementId' => $achievementId]);

    return $stmt->fetchColumn() !== false;
}

function unlockAchievement($pdo, $userId, $achievementId) {
    if (hasUnlockedAchievement($pdo, $userId, $achievementId)) {
        return false;
    }

    $stmt = $pdo->prepare(
        "INSERT INTO `mario-kart-world-users-unlocked-achievements` (id_user, id_achievement)
        VALUES (:userId, :achievementId)");
    $stmt->execute(['userId' => $userId, 'achievementId' => $achievementId]);

    return true;
}