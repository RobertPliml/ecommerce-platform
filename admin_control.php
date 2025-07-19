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
            $query = "SELECT * FROM items";
            $stm = $DB->prepare($query);
            $stm->execute();
            $items = $stm->fetchAll();
            foreach ($items as $item)
            {
                $item_id = $item['item_id'];
                $item_name = $item['item_name'];
                $item_quantity = $item['item_quantity'];
            }
            ?>
    </div>
</div>
<?php
include "footer.php";
?>