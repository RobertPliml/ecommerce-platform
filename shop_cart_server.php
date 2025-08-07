<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
session_start();
header('Content-Type: application/json');
include "dbconnect.php";
$response = ['success' => false, 'message' => 'Unknown error occured.'];
try 
{
    $input = json_decode(file_get_contents('php://input'), true);
    $items = $input['items'] ?? [];
    $action = $input['action'] ?? '';
    $price = $input['price'] ?? 0;
    $address = $input['address'] ?? '';
    $order_status = $input['order_status'] ?? '';  
    $filteredItems = array_filter($items, function ($item) 
    {
        return isset($item['id'], $item['quantity']) && 
        filter_var($item['id'], FILTER_VALIDATE_INT) !== false &&
        filter_var($item['quantity'], FILTER_VALIDATE_INT) !== false;
    });
    $itemData = array_values($filteredItems);  
    switch ($action)
    {
        case "updateCartDisplay" :
            $itemIds = array_column($itemData, 'id');
            if (empty($itemIds)) 
            {
                echo json_encode([]);
                exit;
            }
            $placeholders = implode(',', array_fill(0, count($itemIds), '?'));
            $query = "SELECT item_id, item_name, item_price, item_quantity, item_image_url, background_size_x, background_size_y, background_pos FROM items WHERE item_id IN ($placeholders)";
            $stm = $DB->prepare($query);
            $stm->execute($itemIds);
            $dbItems = $stm->fetchAll(PDO::FETCH_ASSOC);
            $result = [];
            foreach ($dbItems as $dbItem)
            {
                $matchingInput = array_filter($itemData, function ($item) use ($dbItem)
                {
                    return $item['id'] == $dbItem['item_id'];
                });
                $inputItem = array_shift($matchingInput);
                $requestedQty = $inputItem['quantity'] ?? 0;
                $stockQty = $dbItem['item_quantity'] ?? 0;
                $dbItem['requested_quantity'] = $requestedQty;
                $dbItem['do_not_update'] = $requestedQty > $stockQty;
                $result[] = $dbItem;
            }
            echo json_encode($result);
            break;
        case "submitCart" :

            $order_id = uniqid('order#', true);
            $query = "INSERT INTO orders (order_id, price, street_address, order_status) 
            VALUES (:order_id, :price, :street_address, :order_status)";
            $stm = $DB->prepare($query);
            $stm->bindValue(':order_id', $order_id, PDO::PARAM_STR);
            $stm->bindValue(':price', $price, PDO::PARAM_STR);
            $stm->bindValue(':street_address', $address, PDO::PARAM_STR);
            $stm->bindValue(':order_status', $order_status, PDO::PARAM_STR);
            $stm->execute();
            foreach ($itemData as $item)
            {
                $query = "INSERT INTO order_items (order_id, item_id, quantity) VALUES (:order_id, :item_id, :quantity)";
                $stm = $DB->prepare($query);
                $stm->bindValue(':order_id', $order_id, PDO::PARAM_STR);
                $stm->bindValue(':item_id', $item['id'], PDO::PARAM_INT);
                $stm->bindValue(':quantity', $item['quantity'], PDO::PARAM_INT);
                $stm->execute();
            }
            echo json_encode(['success' => true, 'order_id' => $order_id]);
            exit();
    }
}
catch (Exception $e)
{
    http_response_code(500);
    echo json_encode(['error' => 'Failed to load cart items: ' . $e->getMessage()]);
}
