<?php
session_start();
session_regenerate_id();
include "dbconnect.php";
$new_key = filter_input(INPUT_POST, 'new_key', FILTER_SANITIZE_SPECIAL_CHARS);
if ($new_key)
{
    $_SESSION['admin_tool'] = $new_key;
}
$item_id = filter_input(INPUT_POST, 'item_id', FILTER_SANITIZE_SPECIAL_CHARS);
$method = filter_input(INPUT_POST, 'method', FILTER_SANITIZE_SPECIAL_CHARS);
if ($item_id && $method) 
{
    if ($method === "add")
    {
        $query = "SELECT item_quantity FROM items WHERE item_id = :item_id";
        $stm = $DB->prepare($query);
        $stm->bindValue(":item_id", $item_id, PDO::PARAM_INT);
        $stm->execute();
        $item_info = $stm->fetch();
        $new_quantity = intval($item_info['item_quantity']) + 1;
        echo $new_quantity;
        $query = "UPDATE items SET item_quantity = :new_quantity WHERE item_id = :item_id";
        $stm = $DB->prepare($query);
        $stm->bindValue(":new_quantity", $new_quantity, PDO::PARAM_STR);
        $stm->bindValue(":item_id", $item_id, PDO::PARAM_INT);
        $stm->execute();
    }
    else
    {
        $query = "SELECT item_quantity FROM items WHERE item_id = :item_id";
        $stm = $DB->prepare($query);
        $stm->bindValue(":item_id", $item_id, PDO::PARAM_INT);
        $stm->execute();
        $item_info = $stm->fetch();
        $new_quantity = intval($item_info['item_quantity']) - 1;
        echo $new_quantity;
        $query = "UPDATE items SET item_quantity = :new_quantity WHERE item_id = :item_id";
        $stm = $DB->prepare($query);
        $stm->bindValue(":new_quantity", $new_quantity, PDO::PARAM_STR);
        $stm->bindValue(":item_id", $item_id, PDO::PARAM_INT);
        $stm->execute();
    }
}