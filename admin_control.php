<?php
session_start();
session_regenerate_id();
if (!$_SESSION['isAdmin'])
{
    header("Location: index.php");
    exit;
}
include "dbconnect.php";
include "header.php";
include "navigation.php";

?>
<div id="admin-main">
    <?php
    echo 
    "
        <style>
        #admin-tools-menubar-stock
        {
            ";
            if ($_SESSION['admin_tool'] === "stock")
            {
                echo "
                border-top: solid 0.5px;
                /*border-left: solid 0.5px;*/
                border-right: solid 0.5px;
                ";
            }
            else
            {
                echo "
                border-bottom: solid 0.5px;
                ";
            }
            echo"
        }
        #admin-tools-menubar-pending
        {
            ";
            if ($_SESSION['admin_tool'] === "pending")
            {
                echo "
                border-top: solid 0.5px;
                border-left: solid 0.5px;
                border-right: solid 0.5px;
                ";
            }
            else
            {
                echo "
                border-bottom: solid 0.5px;
                ";
            }
            echo"
        }
        #admin-tools-menubar-confirmed
        {
            ";
            if ($_SESSION['admin_tool'] === "confirmed")
            {
                echo "
                border-top: solid 0.5px;
                border-left: solid 0.5px;
                border-right: solid 0.5px;
                ";
            }
            else
            {
                echo "
                border-bottom: solid 0.5px;
                ";
            }
            echo"
        }
        #admin-tools-menubar-shipped
        {
            ";
            if ($_SESSION['admin_tool'] === "shipped")
            {
                echo "
                border-top: solid 0.5px;
                border-left: solid 0.5px;
                border-right: solid 0.5px;
                ";
            }
            else
            {
                echo "
                border-bottom: solid 0.5px;
                ";
            }
            echo"
        }
        #admin-tools-menubar-flagged
        {
            ";
            if ($_SESSION['admin_tool'] === "flagged")
            {
                echo "
                border-top: solid 0.5px;
                border-left: solid 0.5px;
                border-right: solid 0.5px;
                ";
            }
            else
            {
                echo "
                border-bottom: solid 0.5px;
                ";
            }
            echo"
        }
        #admin-tools-menubar-archived
        {
            ";
            if ($_SESSION['admin_tool'] === "archived")
            {
                echo "
                border-top: solid 0.5px;
                border-left: solid 0.5px;
                border-right: solid 0.5px;
                ";
            }
            else
            {
                echo "
                border-bottom: solid 0.5px;
                ";
            }
            echo"
        }
        </style>
    ";
    ?>
    <div id="admin-tools-menubar">
        <div class="admin-tools-menubar-buttons" id="admin-tools-menubar-stock">Stock</div>
        <div class="admin-tools-menubar-buttons" id="admin-tools-menubar-pending">Orders: Pending</div>
        <div class="admin-tools-menubar-buttons" id="admin-tools-menubar-confirmed">Orders: Confirmed</div>
        <div class="admin-tools-menubar-buttons" id="admin-tools-menubar-shipped">Orders: Shipped</div>
        <div class="admin-tools-menubar-buttons" id="admin-tools-menubar-flagged">Orders: Flagged</div>
        <div class="admin-tools-menubar-buttons" id="admin-tools-menubar-archived">Orders: Archived</div>
    </div>
    <div id="admin-tools-container">
            <?php 
            echo "
            <style>
            #admin-tools-container
            {
                display: flex;
                flex-direction: column;
            ";
            if ($_SESSION['admin_tool'] === 'stock') 
            {
                echo "
                flex-wrap: wrap;
                overflow: auto;";
            } 
            else 
            {
                echo "
                flex-wrap: nowrap;
                overflow-x: hidden;";
            }
            echo "
            }
            .order-bar
            {
                position: relative;
                width: 100%;
                height: 20%;
                border: solid 1px;
                margin-top: 1%;
                margin-bottom: 1%;
                display: flex;
                justify-content: flex-start;
                flex-wrap: nowrap;
                flex-shrink: 0;
                border-radius: 0.5rem;
                box-shadow: 0 4px 8px rgba(0,0,0,0.05);
                border: 1px solid #e0e0e0;
                background-color: #fff;
                overflow: hidden;
            }
            .order-bar-order_id
            {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 25%;
                max-width: 25%;
                height: 100%;
                overflow-x: hidden;
                padding: 1rem;
                border-right: 1px solid #e0e0e0;
                background-color: #fff;
            }
            .order-bar-price
            {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 10%;
                max-width: 10%;
                height: 100%;
                overflow-x: hidden;
                padding: 1rem;
                border-right: 1px solid #e0e0e0;
                background-color: #fff;
            }
            .order-bar-address
            {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 35%;
                max-width: 35%;
                height: 100%;
                padding: 1rem;
                border-right: 1px solid #e0e0e0;
                background-color: #fff;
                overflow-x: hidden;
            }
            .order-bar-viewOrder
            {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 10%;
                max-width: 10%;
                height: 100%;
                padding: 1rem;
                border-right: 1px solid #e0e0e0;
                background-color: #fff;
                overflow-x: hidden;
            }
            .order-bar-flagged,
            .order-bar-delete,
            .order-bar-archived
            {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 10%;
                max-width: 10%;
                height: 100%;
                padding: 1rem;
                border-right: 1px solid #e0e0e0;
                background-color: #fff;
                overflow-x: hidden;
            }
            .order-bar-confirmOrder,
            .order-bar-shipOrder,
            .order-bar-archiveOrder,
            .order-bar-archived-2
            {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 10%;
                max-width: 10%;
                height: 100%;
                padding: 1rem;
                background-color: #fff;
                overflow: hidden;
            }
            .order-bar-viewOrder:hover,
            .order-bar-flagged:hover,
            .order-bar-confirmOrder:hover,
            .order-bar-delete:hover,
            .order-bar-shipOrder:hover,
            .order-bar-archiveOrder:hover
            {
                cursor: pointer;
            }
            </style>
            ";
            switch ($_SESSION['admin_tool'])
            {
                case "stock" :
                    $query = "SELECT * FROM items";
                    $stm = $DB->prepare($query);
                    $stm->execute();
                    $items = $stm->fetchAll();
                    foreach ($items as $item)
                    {
                        $item_id = $item['item_id'];
                        $item_name = $item['item_name'];
                        $item_quantity = $item['item_quantity'];
                        $item_img_url = $item['item_image_url'];
                        $background_size_x = $item['background_size_x'];
                        $background_size_y = $item['background_size_y'];
                        $background_pos = $item['background_pos'];
                        echo "
                        <style>
                        .inventory-item
                        {
                            position: relative;
                            height: 80%;
                            width: 40%;
                            display: flex;
                            margin: 2.5%;
                            box-shadow: 8px 2px 10px gray;
                            justify-content: space-between;
                            align-items: center;
                        }
                        #inventory-item-".$item_id."
                        {
                            background-image: url('".$item_img_url."');
                            background-size: ".$background_size_x."% ".$background_size_y."%;
                            background-position: ".$background_pos.";
                        }
                        .subtract-stock
                        {
                            position: relative;
                            width: 10%;
                            height: 100%;
                            border-right: solid 1px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            cursor: pointer;
                            background-color: white;
                        }
                        .add-stock
                        {
                            position: relative;
                            width: 10%;
                            height: 100%;
                            border-left: solid 1px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            cursor: pointer;
                            background-color: white;
                        }
                        .center-wrapper
                        {
                            display: flex;
                            width: 25%;
                            justify-content: center;
                            align-items: center;
                            height: 30%;
                            border-radius: 0.5rem;
                            background-color: rgba(0, 0, 0, 0.5);
                        }
                        .stock-count
                        {
                            font-size: 5rem;
                            color: white;
                        }
                        </style>
                        <div class='inventory-item' id='inventory-item-".$item_id."'>
                            <div class='subtract-stock' id='subtract-stock-".$item_id."'><</div>
                            <div class='center-wrapper'>
                                <div class='stock-count'>".$item_quantity."</div>
                            </div>
                            <div class='add-stock' id='add-stock-".$item_id."'>></div>
                        </div>
                        ";
                        }
                    break;
                case "pending" :
                    $query = "SELECT * FROM orders WHERE order_status = :order_status";
                    $stm = $DB->prepare($query);
                    $stm->execute(['order_status' => 'pending']);
                    $orders = $stm->fetchAll(PDO::FETCH_ASSOC);
                    foreach($orders as $order)
                    {
                        echo "
                        <div class='order-bar'>
                            <div class='order-bar-order_id'>".$order['order_id']."</div>
                            <div class='order-bar-price'>$".$order['price']."</div>
                            <div class='order-bar-address'>".$order['street_address']."</div>
                            <div class='order-bar-viewOrder' id='vieworder-".$order['order_id']."'>View Order</div>
                            <div class='order-bar-flagged' id='flag-order-".$order['order_id']."'>Flag!</div>
                            <div class='order-bar-confirmOrder' id='confirm-order-".$order['order_id']."'>Confirm Order</div>
                        </div>
                        ";
                    }
                    break;
                case "confirmed" :
                    $query = "SELECT * FROM orders WHERE order_status = :order_status";
                    $stm = $DB->prepare($query);
                    $stm->execute(['order_status' => 'confirmed']);
                    $orders = $stm->fetchAll(PDO::FETCH_ASSOC);
                    foreach($orders as $order)
                    {
                        echo "
                        <div class='order-bar'>
                            <div class='order-bar-order_id'>".$order['order_id']."</div>
                            <div class='order-bar-price'>$".$order['price']."</div>
                            <div class='order-bar-address'>".$order['street_address']."</div>
                            <div class='order-bar-viewOrder' id='vieworder-".$order['order_id']."'>View Order</div>
                            <div class='order-bar-flagged' id='flag-order-".$order['order_id']."'>Flag!</div>
                            <div class='order-bar-shipOrder' id='ship-order-".$order['order_id']."'>Ship Order</div>
                        </div>
                        ";
                    }
                    break;
                case "shipped" :
                    $query = "SELECT * FROM orders WHERE order_status = :order_status";
                    $stm = $DB->prepare($query);
                    $stm->execute(['order_status' => 'shipped']);
                    $orders = $stm->fetchAll(PDO::FETCH_ASSOC);
                    foreach($orders as $order)
                    {
                        echo "
                        <div class='order-bar'>
                            <div class='order-bar-order_id'>".$order['order_id']."</div>
                            <div class='order-bar-price'>$".$order['price']."</div>
                            <div class='order-bar-address'>".$order['street_address']."</div>
                            <div class='order-bar-viewOrder' id='vieworder-".$order['order_id']."'>View Order</div>
                            <div class='order-bar-flagged' id='flag-order-".$order['order_id']."'>Flag!</div>
                            <div class='order-bar-archiveOrder' id='confirm-order-".$order['order_id']."'>Archive Order</div>
                        </div>
                        ";
                    }
                    break;
                case "flagged" :
                    $query = "SELECT * FROM orders WHERE order_status = :order_status";
                    $stm = $DB->prepare($query);
                    $stm->execute(['order_status' => 'flagged']);
                    $orders = $stm->fetchAll(PDO::FETCH_ASSOC);
                    foreach($orders as $order)
                    {
                        echo "
                        <div class='order-bar'>
                            <div class='order-bar-order_id'>".$order['order_id']."</div>
                            <div class='order-bar-price'>$".$order['price']."</div>
                            <div class='order-bar-address'>".$order['street_address']."</div>
                            <div class='order-bar-viewOrder' id='vieworder-".$order['order_id']."'>View Order</div>
                            <div class='order-bar-delete' id='delete-order-".$order['order_id']."'>Delete</div>
                            <div class='order-bar-confirmOrder' id='confirm-order-".$order['order_id']."'>Confirm Order</div>
                        </div>
                        ";
                    }
                    break;
                case "archived" :
                    $stm = $DB->prepare("SELECT * FROM archived_orders");
                    $stm->execute();
                    $orders = $stm->fetchAll(PDO::FETCH_ASSOC);
                    foreach($orders as $order)
                    {
                        echo "
                        <div class='order-bar'>
                            <div class='order-bar-order_id'>".$order['order_id']."</div>
                            <div class='order-bar-price'></div>
                            <div class='order-bar-address'></div>
                            <div class='order-bar-viewOrder' id='vieworder-".$order['order_id']."'>View Order</div>
                            <div class='order-bar-archived'></div>
                            <div class='order-bar-archived-2'></div>
                        </div>
                        ";
                    }
                    break;
            }
            ?>
    </div>
</div>
<?php
include "footer.php";
?>