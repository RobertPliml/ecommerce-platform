<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
include 'dbconnect.php';
header("Content-type: application/json");
// ------------------------------
// CONFIG
// ------------------------------
$clientId = 'Acj3BplD7LjMhQ2Oik8RcEgg7rw5OEL5ul2FHSokUQmyAW-lTlrmrFM_zIycl9hH5n_WbS2g3u-A_N02';
$clientSecret = 'ENS9YjYg1ugLBWTlzV_yDff48FWi7jAKoMfbE_oT7Y9riOZfHGmSeKoXkBXTI2Ui2FVwacKK2GZTtozi';
$paypalApiBase = 'https://api-m.sandbox.paypal.com'; // change to live for production

// ------------------------------
// GET JSON POST DATA
// ------------------------------
$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if (!$data || !isset($data['orderID'])) 
{
    http_response_code(400);
    echo json_encode(['error' => 'Invalid request']);
    exit;
}
$order_id = uniqid('order#', true);
$orderId = $data['orderID'];
$items = $data['items'] ?? [];
$filteredItems = array_filter($items, function ($item) 
{
    return isset($item['id'], $item['quantity']) && 
    filter_var($item['id'], FILTER_VALIDATE_INT) !== false &&
    filter_var($item['quantity'], FILTER_VALIDATE_INT) !== false;
});
$itemData = array_values($filteredItems);  

// ------------------------------
// GET PAYPAL ACCESS TOKEN
// ------------------------------
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => "$paypalApiBase/v1/oauth2/token",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_USERPWD => "$clientId:$clientSecret",
    CURLOPT_POSTFIELDS => "grant_type=client_credentials",
    CURLOPT_HTTPHEADER => [
        "Accept: application/json",
        "Accept-Language: en_US"
    ]
]);
$response = curl_exec($ch);
curl_close($ch);

$tokenData = json_decode($response, true);
$accessToken = $tokenData['access_token'] ?? null;

if (!$accessToken) 
{
    http_response_code(500);
    echo json_encode(['error' => 'Failed to get access token']);
    exit;
}

// ------------------------------
// GET ORDER DETAILS FROM PAYPAL
// ------------------------------
$ch = curl_init("$paypalApiBase/v2/checkout/orders/$orderId");
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        "Content-Type: application/json",
        "Authorization: Bearer $accessToken"
    ]
]);
$response = curl_exec($ch);
curl_close($ch);

$orderData = json_decode($response, true);
file_put_contents(__DIR__ . '/debug-orderData.json', json_encode($orderData, JSON_PRETTY_PRINT));

if (!$orderData || !isset($orderData['status'])) 
{
    http_response_code(500);
    echo json_encode(['error' => 'Could not retrieve order data']);
    exit;
}

if ($orderData['status'] !== 'COMPLETED') 
{
    http_response_code(400);
    echo json_encode(['error' => 'Payment not completed']);
    exit;
}

// ------------------------------
// OPTIONAL: STORE TO DATABASE HERE
// ------------------------------
// Example fields:
$amount = $orderData['purchase_units'][0]['amount']['value'] ?? '0.00';
$payer = $orderData['payer'] ?? [];
$payerName = ($payer['name']['given_name'] ?? '') . ' ' . ($payer['name']['surname'] ?? '');
$shippingData = $orderData['purchase_units'][0]['shipping'] ?? null;
$shippingAddress = 'No shipping info';
if ($shippingData && isset($shippingData['address'])) 
{
    $address = $shippingData['address'];

    // Build full address string by concatenating all available parts
    $parts = [
        $shippingData['name']['full_name'] ?? '',            // Full name
        $address['address_line_1'] ?? '',                     // Street line 1
        $address['address_line_2'] ?? '',                     // Street line 2 (optional)
        $address['admin_area_2'] ?? '',                        // City
        $address['admin_area_1'] ?? '',                        // State
        $address['postal_code'] ?? '',                         // Postal code
        $address['country_code'] ?? ''                         // Country code
    ];

    // Remove empty parts and join with commas
    $shippingAddress = implode(', ', array_filter($parts));

    // If address is empty after filtering, fallback to default message
    if (empty($shippingAddress)) {
        $shippingAddress = 'No shipping info';
    }
}
$payerEmail = $payer['email_address'] ?? '';
$currency = $orderData['purchase_units'][0]['amount']['currency_code'] ?? 'USD';

// === Step 5: Insert into DB
$order_id = uniqid('order#', true);
try 
{
    $DB->beginTransaction();

    $stmt = $DB->prepare("INSERT INTO orders (order_id, price, street_address, order_status) VALUES (:order_id, :price, :address, :status)");
    $stmt->execute([
        ':order_id' => $order_id,
        ':price' => $amount,
        ':address' => $shippingAddress,
        ':status' => 'pending'
    ]);

    $filteredItems = array_filter($items, fn($item) =>
        isset($item['id'], $item['quantity']) &&
        is_numeric($item['id']) && is_numeric($item['quantity'])
    );

    foreach ($filteredItems as $item) 
    {
        $stmt = $DB->prepare("INSERT INTO order_items (order_id, item_id, quantity) VALUES (:order_id, :item_id, :quantity)");
        $stmt->execute([
            ':order_id' => $order_id,
            ':item_id' => $item['id'],
            ':quantity' => $item['quantity']
        ]);
    }
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
} 
catch (PDOException $e) 
{
    $DB->rollBack();
    file_put_contents(__DIR__ . '/log.txt', 'DB ERROR: ' . $e->getMessage() . "\n", FILE_APPEND);
    http_response_code(500);
    echo json_encode(['error' => 'DB error']);
    exit;
}

// You'd insert this into your DB here.

// ------------------------------
// SUCCESS RESPONSE
// ------------------------------
echo json_encode([
    'orderId' => $orderId,
    'amount' => $amount,
    'currency' => $currency,
    'payerEmail' => $payerEmail,
    'payerName' => $payerName
]);
