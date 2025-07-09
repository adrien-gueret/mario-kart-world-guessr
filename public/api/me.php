<?php 

require_once __DIR__ . '/___middleware.php';

require_once __DIR__ . '/___create_jwt.php';

allowMethod('GET');

if (empty($currentUser)) {
    try {
        $newAnonymousUserName = $headers['Accept-Language'] === 'fr' ? 'Vous !' : 'You!';
        $stmt = $pdo->prepare("INSERT INTO `mario-kart-world-users` (username) VALUES (:username)");
        $stmt->bindParam(':username', $newAnonymousUserName, PDO::PARAM_STR);

        $stmt->execute();

        $userId = intval($pdo->lastInsertId());

        $accessTokenData = storeNewAccessToken($userId, 'anonymous@mariouniversalis.fr', $pdo);

        $currentUser = [
            'id' => $userId,
            'username' => $newAnonymousUserName,
            'email' => null,
            'accessToken' => $accessTokenData['accessToken'],
            'refreshToken' => $accessTokenData['refreshToken'],
            'expiredAt' => $accessTokenData['expiredAt'],
        ];
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            "error" => true,
            "message" => "Database error: " . $e->getMessage()
        ]);
    }   
}

http_response_code(200);

echo json_encode($currentUser);