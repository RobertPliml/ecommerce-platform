<?php
require_once 'vendor/autoload.php';

        $dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
        $dotenv->load();
        try 
        {
            $dsn = 'mysql:host=' . $_ENV['DB_HOST'] . ';dbname=' . $_ENV['DB_NAME'] . ';port=' . $_ENV['DB_PORT'];
            $username = $_ENV['DB_USER'];
            $password = $_ENV['DB_PASS'];
        
            $DB = new PDO($dsn, $username, $password);
        
            $DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);       
        } 
        catch (PDOException $e) 
        {
            error_log("[" . date('Y-m-d H:i:s') . "]DB connection failed. DB Error: [" . $e->getMessage() . "]\n", 3, __DIR__ . "/error_logs/general_error_log.log");
            http_response_code(500);
            echo json_encode(['Error:' => 'DB connection failure.']);
        }