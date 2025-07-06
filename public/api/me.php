<?php 

require_once __DIR__ . '/___middleware.php';

allowMethod('GET');

http_response_code(200);

echo json_encode([
    'user' => $currentUser
]);