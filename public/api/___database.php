<?php

require_once __DIR__ . '/___environment.php';

$pdo = new \PDO(getenv('DATABASE_DSN'), getenv('DATABASE_USER'), getenv('DATABASE_PASSWORD'));