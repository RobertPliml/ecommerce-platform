<?php
session_start();
session_regenerate_id(true);
$csrf_token = filter_input(INPUT_POST, 'csrf_token', FILTER_SANITIZE_SPECIAL_CHARS);
$cat_id = filter_input(INPUT_POST, 'cat_id', FILTER_VALIDATE_INT);
if ($csrf_token && $csrf_token === $_SESSION['csrf_token'])
{
    $_SESSION['page_search_id'] = $cat_id;
}