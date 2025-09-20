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