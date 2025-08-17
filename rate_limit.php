<?php
function checkRateLimit($clientId, $maxRequests = 100, $timeWindow = 60) {
    $redis = new Redis();
    $redis->connect('127.0.0.1', 6379);

    $key = "rate_limit:" . $clientId;
    $count = $redis->incr($key);

    if ($count === 1) 
    {
        $redis->expire($key, $timeWindow);
    }

    if ($count > $maxRequests) 
    {
        error_log("[" . date('Y-m-d H:i:s') . "] Rate limit exceeded for client [$clientId]\n", 3, __DIR__ . "/error_logs/general_error_log.log");
        http_response_code(429);
        echo json_encode(['error' => 'Rate limit exceeded. Please try again later.']);
        exit;
    }
}