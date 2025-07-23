<?php
session_start();
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
    exit();
}
$order_id = filter_input(INPUT_POST, 'order_id', FILTER_SANITIZE_SPECIAL_CHARS);
$flag = filter_input(INPUT_POST, 'flag', FILTER_VALIDATE_BOOLEAN);
$delete_order = filter_input(INPUT_POST, 'delete_order', FILTER_VALIDATE_BOOLEAN);
$action = filter_input(INPUT_POST, 'action', FILTER_SANITIZE_SPECIAL_CHARS);
if ($order_id) 
{
    if ($flag === true)
    {
        $query = "UPDATE orders SET order_status = :order_status WHERE order_id = :order_id";
        $stm = $DB->prepare($query);
        $stm->execute([':order_status' => 'flagged', 'order_id' => $order_id]);
        exit();
    }
    else if ($delete_order === true)
    {
        $query = "DELETE FROM orders WHERE order_id = :order_id";
        $stm = $DB->prepare($query);
        $stm->execute(['order_id' => $order_id]);
        exit();
    }
    else if ($flag === false && $delete_order === false)
    {
        $query = "SELECT order_status FROM orders WHERE order_id = :order_id";
        $stm = $DB->prepare($query);
        $stm->execute([':order_id' => $order_id]);
        $status = $stm->fetch(PDO::FETCH_ASSOC);
        if ($status['order_status'] === 'pending' || $status['order_status'] === 'flagged')
        {
            $query = "UPDATE orders SET order_status = :order_status WHERE order_id = :order_id";
            $stm = $DB->prepare($query);
            $stm->execute([':order_status' => 'confirmed', 'order_id' => $order_id]);
            exit();
        }
        else if ($status['order_status'] === 'confirmed')
        {
            $query = "UPDATE orders SET order_status = :order_status WHERE order_id = :order_id";
            $stm = $DB->prepare($query);
            $stm->execute([':order_status' => 'shipped', 'order_id' => $order_id]);
            exit();
        }
        else
        {
            $query = "UPDATE orders SET order_status = :order_status WHERE order_id = :order_id";
            $stm = $DB->prepare($query);
            $stm->execute([':order_status' => 'archived', 'order_id' => $order_id]);
            exit();
        }
    }
    if ($action && $action === 'previewOrder')
    {
        $query = "SELECT oi.item_id, oi.quantity, i.item_name, i.item_price, i.item_image_url FROM order_items oi JOIN items i ON oi.item_id = i.item_id WHERE oi.order_id = :order_id";
        $stm = $DB->prepare($query);
        $stm->execute([':order_id' => $order_id]);
        $order_items = $stm->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($order_items);
        exit();
    }
}