<?php

require_once __DIR__ . '/___middleware.php';

require_once __DIR__ . '/___create_jwt.php';

allowMethod('POST');

if (empty($accessToken)) {
    http_response_code(401);
    die('{"error":true,"message":"Unauthorized"}');
}

if (empty($_POST['refreshToken'])) {
    http_response_code(400);
    die('{"error":true,"message":"Missing refresh token"}');
}

try {
    $stmt = $pdo->prepare("SELECT t.token, u.id, u.email, u.username
                        FROM `mario-kart-world-tokens` t
                        JOIN `mario-kart-world-users` u ON t.user_id = u.id
                        WHERE t.token = :token
                        AND t.refresh_token = :refreshToken");
    
    $stmt->bindParam(':token', $accessToken, PDO::PARAM_STR);
    $stmt->bindParam(':refreshToken', $_POST['refreshToken'], PDO::PARAM_STR);
    
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        http_response_code(401);
        die('{"error":true,"message":"Invalid refresh token"}');
    }

    $stmt = $pdo->prepare("DELETE FROM `mario-kart-world-tokens` WHERE token = :token OR (user_id = :userId AND expired_at < NOW())");
    $stmt->bindParam(':token', $user['token'], PDO::PARAM_STR);
      $stmt->bindParam(':userId', $user['id'], PDO::PARAM_INT);
    $stmt->execute();


    $accessTokenData = storeNewAccessToken($user['id'], $user['email'], $pdo);
    
    http_response_code(201);
    
    echo json_encode([
        'id' => $user['id'],
        'email' => $user['email'],
        'name' => $user['username'],
        'accessToken' => $accessTokenData['accessToken'],
        'refreshToken' => $accessTokenData['refreshToken'],
        'expiredAt' => $accessTokenData['expiredAt'],
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "error" => true,
        "message" => "Database error: " . $e->getMessage()
    ]);
}