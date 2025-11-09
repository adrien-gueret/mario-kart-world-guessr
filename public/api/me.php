<?php 

require_once __DIR__ . '/___middleware.php';

require_once __DIR__ . '/___create_jwt.php';

allowMethod('GET');

if (empty($currentUser)) {
    try {
        $isFrench = $headers['accept-language'] === 'fr';
        $newAnonymousUserName = $isFrench ? 'Vous !' : 'You!';
        $newAnonymousUserLocale = $isFrench ? 'fr' : 'en';
        $newAnonymousUserDistanceUnit = $isFrench ? 'km' : 'miles';
        $stmt = $pdo->prepare(
            "INSERT INTO `mario-kart-world-users` (username, locale, distance_unit)
            VALUES (:username, :locale, :distance_unit)"
        );
        $stmt->bindParam(':username', $newAnonymousUserName, PDO::PARAM_STR);
        $stmt->bindParam(':locale', $newAnonymousUserLocale, PDO::PARAM_STR);
        $stmt->bindParam(':distance_unit', $newAnonymousUserDistanceUnit, PDO::PARAM_STR);

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