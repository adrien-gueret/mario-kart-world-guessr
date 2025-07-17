<?php

require_once __DIR__ . '/___middleware.php';

$_PUT = allowMethod('PUT');

if (empty($currentUser) || empty($currentUser['email'])) {
    http_response_code(401);
    echo json_encode(['error' => true, 'message' => 'Unauthorized']);
    die;
}

if (empty($_PUT['username']) || empty($_PUT['locale'])) {
    http_response_code(400);
    echo json_encode(['error' => true, 'message' => 'Username and locale are required']);
    die;
}

$username = trim($_PUT['username']);
if (strlen($username) < 2 || strlen($username) > 100) {
    http_response_code(400);

    echo json_encode([
        'error' => true,
        'message' => $headers['accept-language'] === 'fr'
            ? 'Le pseudonyme doit faire entre 2 et 100 caractères.'
            : 'Username must be between 2 and 100 characters.'
    ]);
    die;
}

$locale = $_PUT['locale'] === 'fr' || $_PUT['locale'] === 'en' ? $_PUT['locale'] : 'en';

try {
   $stmt = $pdo->prepare("UPDATE `mario-kart-world-users` SET username = :username, locale = :locale WHERE id = :id");
   $stmt->bindParam(':username', $username, PDO::PARAM_STR);
   $stmt->bindParam(':locale', $locale, PDO::PARAM_STR);
   $stmt->bindParam(':id', $currentUser['id'], PDO::PARAM_INT);
   $stmt->execute();

    $stmt = $pdo->prepare("SELECT u.id, u.email, u.username, u.mario_character as marioCharacter,
                        u.locale,
                        t.token as accessToken, t.refresh_token as refreshToken,
                        t.expired_at as expiredAt
                        FROM `mario-kart-world-users` u
                        JOIN `mario-kart-world-tokens` t
                        ON t.user_id = u.id
                        WHERE u.id = :userId");
    $stmt->bindParam(':userId', $currentUser['id'], PDO::PARAM_INT);
    $stmt->execute();
    $currentUser = $stmt->fetch(PDO::FETCH_ASSOC) ?: null;

   echo json_encode(["success" => true, "user" => $currentUser]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "error" => true,
        "message" => "Database error: " . $e->getMessage()
    ]);
}