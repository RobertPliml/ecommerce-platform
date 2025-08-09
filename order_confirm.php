<?php 
session_start();
include "dbconnect.php";
include "header.php";
?>
<div id="order-confirm-main">
    <div id="main-wrapper-order-confirm">
        <div id="return-home"><i class="bi bi-file-arrow-up"></i></div>
        <div id="secondary-wrapper-order-confirm">
            <span id="order-confirm-main-text">ORDER PLACED!</span>
            <span id="order-email-text">An email confirming your order has been sent to
                <?php 
                echo $_SESSION['order_email'];
                unset($_SESSION['order_email']);
                ?>
            </span>
        </div>
    </div>
</div>
</body>