<?php
require_once __DIR__ . '/vendor/autoload.php';
use Dotenv\Dotenv;
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();
$email_username = $_ENV['EMAIL_USERNAME'];
$email_password = $_ENV['EMAIL_PASSWORD'];
$clientId = $_ENV['CLIENT_ID'];
$clientSecret = $_ENV['CLIENT_SECRET'];
require_once 'init.php';
header("Content-type: application/json");
include 'dbconnect.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
$mail = new PHPMailer(true);
// ------------------------------
// CONFIG
// ------------------------------
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
if (!isset($data['csrf_token'], $_SESSION['csrf_token']) || 
!hash_equals($_SESSION['csrf_token'], $data['csrf_token']))
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
//file_put_contents(__DIR__ . '/debug-orderData.json', json_encode($orderData, JSON_PRETTY_PRINT));

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

    /* OPTIONAL LATER with monthly cost: filter out invalid address with google maps api.
    // If address is empty after filtering, fallback to default message
    $address = urlencode($shippingAddress);
    $apiKey = 'YOUR_API_KEY';

    $url = "https://maps.googleapis.com/maps/api/geocode/json?address=$address&key=$apiKey";
    $response = file_get_contents($url);
    $data = json_decode($response, true);

    if ($data['status'] === 'OK') 
    {
        $formattedAddress = $data['results'][0]['formatted_address'];
        // Address is valid!
    } 
    else 
    {
        // Address invalid
        exit();
    }*/
    if (empty($shippingAddress)) 
    {
        $shippingAddress = 'No shipping info';
    }
}
$payerEmail = $payer['email_address'] ?? '';
$Date = new dateTime();
$paymentDate = $Date->format('Y-m-d H:i:s');
try 
{
    // Server settings
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = $email_username;
    $mail->Password   = $email_password;
    $mail->SMTPSecure = 'tls';
    $mail->Port       = 587;

    // Sender & recipient
    $mail->setFrom($email_username, 'Kathryn Pliml');
    $mail->addAddress(strval($payerEmail), $shippingData['name']['full_name']);
    $confirmation_number = explode('.', $order_id)[1];
    // Email content
    $mail->isHTML(true);
    $mail->Subject = 'Order Confirmation';
    $mail->Body    = "Thank you for your purchase from Corpselotion! We are excited to let you know that we've received your order and it is currently being processed.<br>

<b>Order Summary:</b><br>
<b>Confirmation Number: #$confirmation_number</b><br>
<b>Payment Date: $paymentDate</b><br>
<b>Amount: $$amount</b><br>

<b><Shipping To:</b><br>
$shippingAddress<br>

You will receive another email with tracking details as soon as your order ships. In the meantime, if you have any questions or need to make a change, feel free to reply to this email or send a new message to kathrynfrances2019@gmail.com.
<br>
Thank you for supporting original artwork and handmade creations — your order means the world to us.
<br>
Warmly,<br>
Kathyrn Pliml<br>
corpselotion.com<br>
@corpselotion";

    $mail->send();
    if ($payerEmail)
    {
        $_SESSION['order_email'] = $payerEmail;
    }
    else
    {
        echo "Error: No email provided";
        exit();
    }
} 
catch (Exception $e) 
{
    echo "Email could not be sent. Mailer Error: {$mail->ErrorInfo}";
}

$currency = $orderData['purchase_units'][0]['amount']['currency_code'] ?? 'USD';

// === Step 5: Insert into DB
try 
{
    $DB->beginTransaction();

    $stmt = $DB->prepare("INSERT INTO orders (order_id, price, street_address, order_status, email_address, payer_name) VALUES (:order_id, :price, :order_address, :order_status, :email_address, :payer_name)");
    $stmt->execute([
        ':order_id' => $order_id,
        ':price' => $amount,
        ':order_address' => $shippingAddress,
        ':order_status' => 'pending',
        ':email_address' => $payerEmail,
        ':payer_name' => strval($shippingData['name']['full_name'])
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
    //file_put_contents(__DIR__ . '/log.txt', 'DB ERROR: ' . $e->getMessage() . "\n", FILE_APPEND);
    http_response_code(500);
    echo json_encode(['error' => 'DB error']);
    exit;
}

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
