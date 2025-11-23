<?php

require_once __DIR__ . '/___environment.php';

require_once __DIR__ . '/___middleware.php';

require_once __DIR__ . '/___create_jwt.php';

allowMethod('POST');

function base64url_decode($data) {
    $remainder = strlen($data) % 4;
    if ($remainder) {
        $addlen = 4 - $remainder;
        $data .= str_repeat('=', $addlen);
    }
    $data = strtr($data, '-_', '+/');
    return base64_decode($data);
}


function encodeLength($length) {
    if ($length <= 0x7F) return chr($length);
    $temp = ltrim(pack('N', $length), "\x00");
    return chr(0x80 | strlen($temp)) . $temp;
}

function jwkToPem($n, $e) {
    $modulus = "\x00" . base64url_decode($n);
    $exponent = base64url_decode($e);

    $components = [
        'modulus' => $modulus,
        'publicExponent' => $exponent,
    ];

    $modulus = pack('Ca*a*', 2, encodeLength(strlen($components['modulus'])), $components['modulus']);
    $publicExponent = pack('Ca*a*', 2, encodeLength(strlen($components['publicExponent'])), $components['publicExponent']);
    $rsaPublicKey = pack('Ca*a*a*', 48, encodeLength(strlen($modulus . $publicExponent)), $modulus, $publicExponent);

    $rsaOID = pack('H*', '300d06092a864886f70d0101010500');
    $publicKey = pack('Ca*a*', 3, encodeLength(strlen($rsaPublicKey) + 1), "\0" . $rsaPublicKey);
    $der = pack('Ca*a*a*', 48, encodeLength(strlen($rsaOID . $publicKey)), $rsaOID, $publicKey);

    return "-----BEGIN PUBLIC KEY-----\r\n" .
        chunk_split(base64_encode($der), 64) .
        "-----END PUBLIC KEY-----";
}


if (!isset($_POST['token'])) {
    http_response_code(400);
    die('{"error":true,"message":"Missing token"}');
}
$token = $_POST['token'];

$jwtParts = explode('.', $token);

if (count($jwtParts) !== 3) {
    http_response_code(400);
    die('{"error":true,"message":"Invalid token"}');
}

list($headerb64, $payloadb64, $signatureb64) = $jwtParts;

$header = json_decode(base64url_decode($headerb64), true);
$payload = json_decode(base64url_decode($payloadb64), true);

if (!$header || !$payload) {
    http_response_code(400);
    die('{"error":true,"message":"Unreadable token"}');
}

$jwks = json_decode(file_get_contents('https://www.googleapis.com/oauth2/v3/certs'), true);
if (!$jwks || !isset($jwks['keys'])) {
    http_response_code(500);
    die('{"error":true,"message":"Cannot connect to Google JWKS"}');
}

$key = null;
foreach ($jwks['keys'] as $jwk) {
    if ($jwk['kid'] === $header['kid']) {
        $key = $jwk;
        break;
    }
}
if (!$key) {
    http_response_code(401);
    die('{"error":true,"message":"Unkwown Google key"}');
}

$pem = jwkToPem($key['n'], $key['e']);

$dataToVerify = $headerb64 . '.' . $payloadb64;
$signature = base64url_decode($signatureb64);

$ok = openssl_verify($dataToVerify, $signature, $pem, OPENSSL_ALGO_SHA256);
if ($ok !== 1) {
    http_response_code(401);
    die('{"error":true,"message":"Invalid Google signature"}');
}

$CLIENT_ID = getenv('GOOGLE_CLIENT_ID');

if (!isset($payload['aud']) || $payload['aud'] !== $CLIENT_ID) {
    http_response_code(401);
    die('{"error":true,"message":"Invalid Google audience"}');
}

if (!isset($payload['iss']) ||
    ($payload['iss'] !== 'https://accounts.google.com' && $payload['iss'] !== 'accounts.google.com')) {
    http_response_code(401);
    die('{"error":true,"message":"Invalid Google issuer"}');
}

if (!isset($payload['exp']) || $payload['exp'] < time()) {
    http_response_code(401);
    die('{"error":true,"message":"Expired token"}');
}

if (empty($payload['sub']) || empty($payload['email']) || empty($payload['name'])) {
    http_response_code(400);
    die('{"error":true,"message":"Missing user infos"}');
}

$stmt = $pdo->prepare("SELECT id, username, email, mario_character as marioCharacter, distance_unit as distanceUnit, with_safe_area as withSafeArea FROM `mario-kart-world-users` WHERE id_google = ?");
$stmt->execute([$payload['sub']]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

$hasBeenFoundFromGoogle = (bool) $user;

if (!$user) {
    $stmt = $pdo->prepare("SELECT id, username, email, mario_character as marioCharacter, distance_unit as distanceUnit, with_safe_area as withSafeArea FROM `mario-kart-world-users` WHERE email = ?");
    $stmt->execute([$payload['email']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
}

$isNewUser = !$user;

if (!$isNewUser && !$hasBeenFoundFromGoogle) {
    $updateUserStmt = $pdo->prepare(
        "UPDATE `mario-kart-world-users`
        SET id_google = :idGoogle
        WHERE id = :userId");
    $updateUserStmt->bindParam(':idGoogle', $payload['sub'], PDO::PARAM_STR);
    $updateUserStmt->bindParam(':userId', $user['id'], PDO::PARAM_INT);
    $updateUserStmt->execute();
}

$userId = 0;
$userGoogleId = $payload['sub'];
$email = $payload['email'];
$name = $payload['name'];
$marioCharacter = null;
$distanceUnit = null;

if ($isNewUser) {
    try {
        $stmt = $pdo->prepare("INSERT INTO `mario-kart-world-users` (id_google, username, email) VALUES (:idGoogle, :username, :email)");
        
        $stmt->bindParam(':idGoogle', $payload['sub'], PDO::PARAM_STR);
        $stmt->bindParam(':username', $payload['name'], PDO::PARAM_STR);
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
    $distanceUnit = $user['distanceUnit'];
}

require_once __DIR__ . '/___auth_response.php';