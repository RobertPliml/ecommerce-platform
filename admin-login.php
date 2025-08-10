<?php
session_start();
require_once 'vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();
$admin_username = $_ENV['ADMIN_USERNAME'];
$admin_password = $_ENV['ADMIN_PASSWORD'];
$csrf_token = filter_input(INPUT_POST, 'csrf_token', FILTER_SANITIZE_SPECIAL_CHARS);
$task = filter_input(INPUT_POST, 'task', FILTER_SANITIZE_SPECIAL_CHARS);
$username = filter_input(INPUT_POST, 'username', FILTER_SANITIZE_SPECIAL_CHARS);
$password = filter_input(INPUT_POST, 'password', FILTER_SANITIZE_SPECIAL_CHARS);
// echo "this is the task: ".$task.", and this is the token #".$csrf_token;
// echo $username.", ".$password.", ".$admin_password;
if ($csrf_token && $csrf_token === $_SESSION['csrf_token'])
{
    switch ($task)
    {
        case 'open_close' :
            if ($_SESSION['show_login_container'] === true)
            {
                $_SESSION['show_login_container'] = false;
            }
            else if($_SESSION['show_login_container'] === false)
            {
                $_SESSION['show_login_container'] = true;
            }
            break;
        case 'login' :
            // echo "login recognized";
            if ($username === $admin_username && $password === $admin_password)
            {
                // echo "good anakin, goooooood";
                $_SESSION['isAdmin'] = true;
            }
            else
            {
                if(!isset($_SESSION['error']))
                {
                    $_SESSION['error'] = 'Incorrect username or password.';
                }
                else
                {
                    $_SESSION['error'] = 'Incorrect username or password.';
                }
            }
            break;
        case 'logout' :
            $_SESSION['isAdmin'] = false;
            break;
    }
}