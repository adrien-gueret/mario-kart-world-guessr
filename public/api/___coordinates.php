<?php

define('MAP_SIZE_IN_PIXELS', [
    'width' => 1431,
    'height' => 1303,
]);

define('MAP_SIZE_IN_KM', [
    'width' => 10,
    'height' => 9,
]);

const SCORE_MAX = 5000;

const DIFFICULTY_TO_TOLERANCE_FOR_MAX_SCORE = [
    '50cc'   => 80,
    '100cc'  => 70,
    '150cc'  => 60,
    'mirror' => 60,
];

const DIFFICULTY_TO_THRESHOLD = [
    '50cc'   => 6,
    '100cc'  => 8,
    '150cc'  => 10,
    'mirror' => 10,
];

function getDistMax(): float {
    return sqrt(
        MAP_SIZE_IN_KM['width'] ** 2 + MAP_SIZE_IN_KM['height'] ** 2
    );
}

function makeCoordinates(float $x, float $y): array {
    return ['x' => $x, 'y' => $y];
}

function distanceBetweenCoordinatesInKilometers(array $pointA, array $pointB): float {
    $deltaXPixels = $pointB['x'] - $pointA['x'];
    $deltaYPixels = $pointB['y'] - $pointA['y'];

    $distanceInPixels = sqrt($deltaXPixels * $deltaXPixels + $deltaYPixels * $deltaYPixels);

    $kmPerPixelX = MAP_SIZE_IN_KM['width'] / MAP_SIZE_IN_PIXELS['width'];
    $kmPerPixelY = MAP_SIZE_IN_KM['height'] / MAP_SIZE_IN_PIXELS['height'];

    $averageKmPerPixel = ($kmPerPixelX + $kmPerPixelY) / 2;

    $distanceInKm = $distanceInPixels * $averageKmPerPixel;

    return $distanceInKm;
}

function getScoreFromDistanceInKilometers(float $distanceInKm, string $difficulty): int {
    $distanceInMeters = $distanceInKm * 1000;

    $tolerance = DIFFICULTY_TO_TOLERANCE_FOR_MAX_SCORE[$difficulty];

    if ($distanceInMeters <= $tolerance) {
        return SCORE_MAX;
    }

    $threshold = DIFFICULTY_TO_THRESHOLD[$difficulty];
    $distMax = getDistMax();

    return (int)ceil(SCORE_MAX * exp((- $threshold * $distanceInKm) / $distMax));
}
