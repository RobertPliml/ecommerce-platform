<?php
require_once 'vendor/autoload.php';  // Make sure to include the Composer autoload file

        $dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
        $dotenv->load();
        try 
        {
            $dsn = 'mysql:host=' . $_ENV['DB_HOST'] . ';dbname=' . $_ENV['DB_NAME'] . ';port=' . $_ENV['DB_PORT'];
            $username = $_ENV['DB_USER'];
            $password = $_ENV['DB_PASS'];
        
            // Create a PDO instance
            $DB = new PDO($dsn, $username, $password);
        
            // Set the PDO error mode to exception
            $DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            // echo "Connected successfully"; 
        
        } 
        catch (PDOException $e) 
        {
            echo "Cannot connect to database: " . $e->getMessage();
        }