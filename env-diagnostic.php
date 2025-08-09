<?php
require_once __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

header('Content-Type: application/json');

echo json_encode([
    'EMAIL_USERNAME' => $_ENV['EMAIL_USERNAME'] ?? 'not found',
    'EMAIL_PASSWORD' => $_ENV['EMAIL_PASSWORD'] ?? 'not found',
    'APP_ENV'        => $_ENV['APP_ENV'] ?? 'not found',
    'DIR'            => __DIR__,
    'CWD'            => getcwd(),
]);
