<?php
session_start();
header('Content-Type: application/json');
session_regenerate_id(true);
include "dbconnect.php";
try 
{
    $input = json_decode(file_get_contents('php://input'), true);
    $rawIds = $input['item_ids'] ?? [];
    $itemIds = array_filter($rawIds, function ($id) 
    {
        return filter_var($id, FILTER_VALIDATE_INT) !== false;
    });

    $itemIds = array_values($itemIds);

    if (empty($itemIds)) 
    {
        echo json_encode([]);
        exit;
    }
    $placeholders = implode(',', array_fill(0, count($itemIds), '?'));
    $query = "SELECT item_id, item_name, item_price, item_image_url FROM items WHERE item_id IN ($placeholders)";
    $stm = $DB->prepare($query);
    $stm->execute($itemIds);
    $items = $stm->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($items);
}
catch (Exception $e)
{
    http_response_code(500);
    echo json_encode(['error' => 'Failed to load cart items: ' . $e->getMessage()]);
}
?>