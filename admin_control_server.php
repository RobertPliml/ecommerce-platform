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
        try 
        {
            $DB->beginTransaction();
            $stm = $DB->prepare("SELECT item_quantity FROM items WHERE item_id = :item_id");
            $stm->execute([':item_id' => $item_id]);
            $item_info = $stm->fetch();
            $new_quantity = intval($item_info['item_quantity']) + 1;
            echo $new_quantity;
            $query = "UPDATE items SET item_quantity = :new_quantity WHERE item_id = :item_id";
            $stm = $DB->prepare($query);
            $stm->execute([':new_quantity' => $new_quantity, ':item_id' => $item_id]);
            $DB->commit();
        }
        catch (PDOException $e)
        {
            $DB->rollBack();
            echo "Error: " . $e->getMessage();
        }
    }
    else
    {
        try
        {
            $DB->beginTransaction();
            $stm = $DB->prepare("SELECT item_quantity FROM items WHERE item_id = :item_id");
            $stm->execute([':item_id' => $item_id]);
            $item_info = $stm->fetch();
            $new_quantity = intval($item_info['item_quantity']) - 1;
            echo $new_quantity;
            $query = "UPDATE items SET item_quantity = :new_quantity WHERE item_id = :item_id";
            $stm = $DB->prepare($query);
            $stm->execute([':new_quantity' => $new_quantity, ':item_id' => $item_id]);
            $DB->commit();
        }
        catch (PDOException $e)
        {
            $DB->rollBack();
            echo "Error: " . $e->getMessage();
        }
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
        try
        {
            $DB->beginTransaction();
            $stm = $DB->prepare("DELETE FROM order_items WHERE order_id = :order_id");
            $stm->execute(['order_id' => $order_id]);
            $stm = $DB->prepare("DELETE FROM orders WHERE order_id = :order_id");
            $stm->execute(['order_id' => $order_id]);
            $DB->commit();
            exit();
        }
        catch (PDOException $e)
        {
            $DB->rollBack();
            echo "Error: " . $e->getMessage();
        }
    }
    else if ($flag === false && $delete_order === false)
    {
        try
        {
            $DB->beginTransaction();
            $query = "SELECT order_status FROM orders WHERE order_id = :order_id";
            $stm = $DB->prepare($query);
            $stm->execute([':order_id' => $order_id]);
            $status = $stm->fetch(PDO::FETCH_ASSOC);
            $DB->commit();
        }
        catch (PDOException $e)
        {
            $DB->rollBack();
            echo "Error: " . $e->getMessage();
        }
        if ($status['order_status'] === 'pending' || $status['order_status'] === 'flagged')
        {
            try
            {
                $DB->beginTransaction();
                $query = "UPDATE orders SET order_status = :order_status WHERE order_id = :order_id";
                $stm = $DB->prepare($query);
                $stm->execute([':order_status' => 'confirmed', 'order_id' => $order_id]);
                $DB->commit();
            }
            catch (PDOException $e)
            {
                $DB->rollBack();
                echo "Error: " . $e->getMessage();
            }
            exit();
        }
        else if ($status['order_status'] === 'confirmed')
        {
            try
            {
                $DB->beginTransaction();
                $query = "UPDATE orders SET order_status = :order_status WHERE order_id = :order_id";
                $stm = $DB->prepare($query);
                $stm->execute([':order_status' => 'shipped', 'order_id' => $order_id]);
                $stm = $DB->prepare("SELECT item_id, quantity FROM order_items WHERE order_id = :order_id");
                $stm->execute([':order_id' => $order_id]);
                $data = $stm->fetchAll(PDO::FETCH_ASSOC);
                foreach ($data as $d)
                {
                    $item_id = $d['item_id'];
                    $orderQuantity = $d['quantity'];
                    $stm = $DB->prepare("SELECT item_quantity FROM items WHERE item_id = :item_id");
                    $stm->execute([':item_id' => $item_id]);
                    $oldData = $stm->fetch(PDO::FETCH_ASSOC);
                    $itemQuantity = $oldData['item_quantity'];
                    $quantity = $itemQuantity - $orderQuantity;
                    $stm = $DB->prepare("UPDATE items SET item_quantity = :quantity WHERE item_id = :item_id");
                    $stm->execute([':quantity' => $quantity, ':item_id' => $item_id]);
                }
                $DB->commit();
                exit();
            }
            catch (PDOException $e)
            {
                $DB->rollBack();
                echo "Error: " . $e->getMessage();
            }
        }
        else
        {
            try
            {
                $DB->beginTransaction();
                $stm = $DB->prepare("SELECT order_id, price, street_address FROM orders WHERE order_id = :order_id");
                $stm->execute([':order_id' => $order_id]);
                $itemInfo = $stm->fetchAll(PDO::FETCH_ASSOC);
                $query = "INSERT INTO archived_orders (order_id, street_address, price) VALUES (:order_id, :street_address, :price)";
                $stm = $DB->prepare($query);
                foreach ($itemInfo as $item)
                {
                    $stm->execute([
                        ':order_id' => $item['order_id'],
                        ':street_address' => $item['street_address'],
                        ':price' => $item['price']
                    ]);
                }
                $query = "SELECT order_id, item_id, quantity FROM order_items WHERE order_id = :order_id";
                $stm = $DB->prepare($query);
                $stm->execute([':order_id' => $order_id]);
                $itemInfo = $stm->fetchAll(PDO::FETCH_ASSOC);
                $query = "INSERT INTO archived_order_items (order_id, item_id, quantity) VALUES (:order_id, :item_id, :quantity)";
                $stm = $DB->prepare($query);
                foreach ($itemInfo as $item)
                {
                    $stm->execute([
                        ':order_id' => $item['order_id'],
                        ':item_id' => $item['item_id'],
                        ':quantity' => $item['quantity']
                    ]);
                }
                $stm = $DB->prepare("DELETE FROM order_items WHERE order_id = :order_id");
                $stm->execute(['order_id' => $order_id]);
                $stm = $DB->prepare("DELETE FROM orders WHERE order_id = :order_id");
                $stm->execute(['order_id' => $order_id]);
                $DB->commit();
                exit();
            }
            catch (PDOException $e)
            {
                $DB->rollBack();
                echo "Error: " . $e->getMessage();
            }
        }
    }
    if ($action && $action === 'previewOrder')
    {
        if ($_SESSION['admin_tool'] === 'archived')
        {
            $query = "SELECT oi.item_id, oi.quantity, i.item_name, i.item_price, i.item_image_url FROM archived_order_items oi JOIN items i ON oi.item_id = i.item_id WHERE oi.order_id = :order_id";
        }
        else
        {
            $query = "SELECT oi.item_id, oi.quantity, i.item_name, i.item_price, i.item_image_url FROM order_items oi JOIN items i ON oi.item_id = i.item_id WHERE oi.order_id = :order_id";
        }
        try
        {
            $DB->beginTransaction();
            $stm = $DB->prepare($query);
            $stm->execute([':order_id' => $order_id]);
            $order_items = $stm->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($order_items);
            $DB->commit();
        }
        catch (PDOException $e)
        {
            $DB->rollBack();
            echo "Error: " . $e->getMessage();
        }
        exit();
    }
}