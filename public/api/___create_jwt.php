<?php

require_once __DIR__ . '/___environment.php';

function base64url_encode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function create_jwt($payload) {
    $secret = getenv('JWT_TOKEN_SECRET');

    $header = ['typ' => 'JWT', 'alg' => 'HS256'];
    $segments = [];
    $segments[] = base64url_encode(json_encode($header));
    $segments[] = base64url_encode(json_encode($payload));
    $signing_input = implode('.', $segments);
    $signature = hash_hmac('sha256', $signing_input, $secret, true);
    $segments[] = base64url_encode($signature);
    return implode('.', $segments);
}

function storeNewAccessToken($userId, $email, $pdo) {
    $expiredAt = date('c', strtotime('+6 hour'));

    $jwt = create_jwt([
        'user_id' => $userId,
        'email'   => $email,
        'exp'     => $expiredAt,
    ]);

    $refreshToken = bin2hex(random_bytes(16));

    $stmt = $pdo->prepare("INSERT INTO `mario-kart-world-tokens` (token, refresh_token, user_id, expired_at) VALUES (:token, :refreshToken, :userId, DATE_ADD(NOW(), INTERVAL 6 HOUR))");
    
    $stmt->bindParam(':token', $jwt, PDO::PARAM_STR);
    $stmt->bindParam(':refreshToken', $refreshToken, PDO::PARAM_STR);
    $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
    
    $stmt->execute();

    return [
        'accessToken' => $jwt,
        'refreshToken' => $refreshToken,
        'expiredAt' => $expiredAt,
    ];
}