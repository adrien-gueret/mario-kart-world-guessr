<?php 

require_once __DIR__ . '/___middleware.php';

allowMethod('GET');

$stmt = $pdo->query("SELECT DATE_ADD(MAX(daily_date), INTERVAL 1 DAY) AS next_daily_date FROM `mario-kart-world-dailies`");
$row = $stmt->fetch(PDO::FETCH_ASSOC);

$serverTz = date_default_timezone_get();
$date = new DateTime($row['next_daily_date'] . ' 00:00:00', new DateTimeZone('Europe/Paris'));
$date->setTimezone(new DateTimeZone('UTC'));

echo json_encode([
    'nextDailyDate' => $date->format('c'),
    'tz' => $serverTz
]);