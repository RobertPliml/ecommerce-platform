<?php
session_start();
session_regenerate_id();
include "dbconnect.php";
$new_key = filter_input(INPUT_POST, 'new_key', FILTER_SANITIZE_SPECIAL_CHARS);
$_SESSION['admin_tool'] = $new_key;