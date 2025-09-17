<?php

require_once __DIR__ . '/___environment.php';

require_once __DIR__ . '/___middleware.php';

require_once __DIR__ . '/___create_jwt.php';

allowMethod('POST');

if (!isset($_POST['token'])) {
    http_response_code(400);
    die('{"error":true,"message":"Missing token"}');
}
$code = $_POST['token'];

$client_id = getenv('DISCORD_CLIENT_ID');
$client_secret = getenv('DISCORD_CLIENT_SECRET');
$redirect_uri = $isDev ? 'https://localhost:5173/' : 'https://www.mariouniversalis.fr/mario-kart-world-guessr/';

$data = [
    'client_id' => $client_id,
    'client_secret' => $client_secret,
    'grant_type' => 'authorization_code',
    'code' => $code,
    'redirect_uri' => $redirect_uri
];

$options = [
    'http' => [
        'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
        'method'  => 'POST',
        'content' => http_build_query($data)
    ]
];
$context  = stream_context_create($options);
$result = file_get_contents('https://discord.com/api/oauth2/token', false, $context);

$tokenData = json_decode($result, true);

$access_token = $tokenData['access_token'];

$opts = [
    "http" => [
        "header" => "Authorization: Bearer $access_token\r\n"
    ]
];
$context = stream_context_create($opts);
$userJson = file_get_contents("https://discord.com/api/users/@me", false, $context);

$payload = json_decode($userJson, true);

if (!$payload || !isset($payload['id']) || !isset($payload['email']) || !isset($payload['username'])) {
    http_response_code(401);
    die('{"error":true,"message":"Invalid Discord token"}');
}

$stmt = $pdo->prepare("SELECT id, username, email, mario_character as marioCharacter FROM `mario-kart-world-users` WHERE id_discord = ?");
$stmt->execute([$payload['id']]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

$hasBeenFoundFromDiscord = (bool) $user;

if (!$user) {
    $stmt = $pdo->prepare("SELECT id, username, email, mario_character as marioCharacter FROM `mario-kart-world-users` WHERE email = ?");
    $stmt->execute([$payload['email']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
}

$isNewUser = !$user;

if (!$isNewUser && !$hasBeenFoundFromDiscord) {
    $updateUserStmt = $pdo->prepare(
        "UPDATE `mario-kart-world-users`
        SET id_discord = :idDiscord
        WHERE id = :userId");
    $updateUserStmt->bindParam(':idDiscord', $payload['id'], PDO::PARAM_STR);
    $updateUserStmt->bindParam(':userId', $user['id'], PDO::PARAM_INT);
    $updateUserStmt->execute();
}

$userId = 0;
$userDiscordId = $payload['id'];
$email = $payload['email'];
$name = $payload['username'];
$marioCharacter = null;

if ($isNewUser) {
    try {
        $stmt = $pdo->prepare("INSERT INTO `mario-kart-world-users` (id_discord, username, email) VALUES (:idDiscord, :username, :email)");
        
        $stmt->bindParam(':idDiscord', $payload['id'], PDO::PARAM_STR);
        $stmt->bindParam(':username', $payload['username'], PDO::PARAM_STR);
        $stmt->bindParam(':email', $payload['email'], PDO::PARAM_STR);
        
        $stmt->execute();
        
        $userId = $pdo->lastInsertId();
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            "error" => true,
            "message" => "Database error: " . $e->getMessage()
        ]);
    }
} else {
    $userId = $user['id'];
    $email = $user['email'];
    $name = $user['username'];
    $marioCharacter = $user['marioCharacter'];
}

require_once __DIR__ . '/___auth_response.php';