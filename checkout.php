<?php
include "header.php";
include "dbconnect.php";
include "navigation.php";
?>
<div id="checkout-page-main">
    <div id="checkout-header">Checkout</div>
    <div id="checkout-list-wrapper">
        <div id="checkout-items-wrapper"></div>
    </div>
    <div id="checkout-shipping-info">
        <div id="paypal-button-container"></div>
    </div>
    <div id="error-box">
        <p id="error-text"></p>
    </div>
</div>
<?php
include "footer.php";