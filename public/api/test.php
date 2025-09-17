<?php 

require_once __DIR__ . '/___middleware.php';

require_once __DIR__ . '/___environment.php';

allowMethod('GET');

echo getenv('DATABASE_USER');