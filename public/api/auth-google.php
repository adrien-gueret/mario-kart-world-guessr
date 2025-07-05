<?php

require_once __DIR__ . '/___middleware.php';

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

$CLIENT_ID = '1063543539522-m89mibo9kp0esu299c8jgj2bali17ltl.apps.googleusercontent.com';

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

if (empty($payload['email'])) {
    http_response_code(400);
     die('{"error":true,"message":"Missing email"}');
}


$user_email = $payload['email'];
$user_name = isset($payload['name']) ? $payload['name'] : '';
$user_given_name = isset($payload['given_name']) ? $payload['given_name'] : '';

print_r(json_encode($payload));