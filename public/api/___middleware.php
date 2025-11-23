<?php
     header('Access-Control-Allow-Headers: Authorization');
     header('Access-Control-Allow-Credentials: true');

     $origin = isset($_SERVER['HTTP_ORIGIN'])
        ? $_SERVER['HTTP_ORIGIN']
        : (
            isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : '*'
        );
     
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        header("Access-Control-Allow-Origin: " . $origin);
        header("Access-Control-Allow-Methods: OPTIONS, GET, POST, PUT, PATCH, DELETE");
        http_response_code(204);
        die('{"success":true}');
    }

    require_once __DIR__ . '/___environment.php';

    require_once __DIR__ . '/___database.php';

    $headers = getallheaders();

    $currentUser = null;
    $isConnected = false;
    $isDev = false;

    $authorizationHeader = isset($headers['authorization']) ? $headers['authorization'] : null;

    if ($authorizationHeader) {
        $authorizationParts = explode(' ', $authorizationHeader);
        $accessToken = null;

        if ($authorizationParts[0] === 'Bearer') {
            $isDev = $authorizationParts[1] === getenv('MU_SECRET');
            $accessTokenIndex = $isDev ? 2 : 1;

            $accessToken = isset($authorizationParts[$accessTokenIndex]) ? $authorizationParts[$accessTokenIndex] : null;
           
            if ($accessToken) {
                $stmt = $pdo->prepare("SELECT u.id, u.email, u.username, u.mario_character as marioCharacter,
                                        u.locale, u.distance_unit as distanceUnit,
                                        t.token as accessToken, t.refresh_token as refreshToken,
                                        t.expired_at as expiredAt
                                        FROM `mario-kart-world-users` u
                                        JOIN `mario-kart-world-tokens` t
                                        ON t.user_id = u.id
                                        WHERE t.token = :accessToken
                                        AND t.expired_at > NOW()");
                $stmt->bindParam(':accessToken', $accessToken, PDO::PARAM_STR);
                $stmt->execute();
                $currentUser = $stmt->fetch(PDO::FETCH_ASSOC) ?: null;

                $isConnected = $currentUser !== null && !empty($currentUser['email']);
            }
        }
    }
    

    if ($isDev) {
        header("Access-Control-Allow-Origin: " . $origin);
    } else {
        $allowed_origin = "https://www.mariouniversalis.fr";

        if (isset($_SERVER['HTTP_ORIGIN']) && $_SERVER['HTTP_ORIGIN'] !== $allowed_origin) {
            http_response_code(403);
            die('Forbidden: Invalid origin');
        }
        
        header("Access-Control-Allow-Origin: " . $allowed_origin);
    }

    header("Access-Control-Allow-Headers: Content-Type");
    header("Content-Type: application/json; charset=UTF-8");

    function allowMethod($method) {
        header("Access-Control-Allow-Methods: OPTIONS," . $method);

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(204);
            die('{"success":true}');
        }

        if ($_SERVER['REQUEST_METHOD'] !== $method) {
            http_response_code(405);
            die('{"error":true}');
        }

        switch ($method) {
            case 'PUT':
            case 'PATCH':
            case 'DELETE':
                $input = file_get_contents("php://input");
                $bodyParams = [];
            
                $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
                if (strpos($contentType, 'multipart/form-data') !== false) {
                    preg_match('/boundary=(.+)$/', $contentType, $matches);
                    if (isset($matches[1])) {
                        $boundary = '--' . $matches[1];
                        $parts = explode($boundary, $input);
                        
                        foreach ($parts as $part) {
                            if (empty(trim($part)) || strpos($part, 'Content-Disposition') === false) {
                                continue;
                            }
       
                            if (preg_match('/name="([^"]+)"/', $part, $nameMatch)) {
                                $name = $nameMatch[1];
                                $value = trim(substr($part, strpos($part, "\r\n\r\n") + 4));
                                $value = rtrim($value, "\r\n");
                                $bodyParams[$name] = $value;
                            }
                        }
                    }
                } else {
                    parse_str($input, $bodyParams);
                }
                
                return $bodyParams;
            case 'POST':
                return $_POST;
            case 'GET':
                return $_GET;
            default:
                http_response_code(405);
                die('{"error":true}');
        }
    }