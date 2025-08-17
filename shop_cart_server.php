<?php
require_once 'init.php';
header('Content-Type: application/json');
include "dbconnect.php";
try
{
    $input = json_decode(file_get_contents('php://input'), true);
    $items = $input['items'] ?? [];
    $csrf_token = $input['csrf_token'] ?? '';
    if (hash_equals($_SESSION['csrf_token'], $csrf_token))
    {
        $filteredItems = array_filter($items, function ($item) 
        {
            return isset($item['id'], $item['quantity']) && 
            filter_var($item['id'], FILTER_VALIDATE_INT) !== false &&
            filter_var($item['quantity'], FILTER_VALIDATE_INT) !== false;
        });
        $itemData = array_values($filteredItems);  
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
    }
    else if (!isset($_SESSION['csrf_token']) || !hash_equals($_SESSION['csrf_token'], $csrf_token)) 
    {
        http_response_code(403);
        echo json_encode(['error' => 'Invalid CSRF token.']);
        exit();
    }
}
catch (PDOException $e)
{
    http_response_code(500);
    echo json_encode(['error' => 'Failed to load cart items. Try again later.']);
}
