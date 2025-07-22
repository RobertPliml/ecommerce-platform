<?php
session_start();
session_regenerate_id();
include "header.php";
include "dbconnect.php";
include "navigation.php";
?>
<div id="checkout-page-main">
    <div id="checkout-list-wrapper">
        <div id="checkout-items-wrapper"></div>
    </div>
    <div id="checkout-shipping-info">
        <input id="address-line-1" type="text" placeholder="Address line 1" required>
        <input id="address-line-2" type="text" placeholder="Address line 2" required>
        <input id="city" type="text" placeholder="City" required>
        <select id="state" required>
            <option>State</option>
        </select>
        <input id="zip" type="text" placeholder="Zipcode" required>
        <input id="del-notes" type="text" placeholder="Additional Delivery Instructions (max 60 characters)">
    </div>
    <div id="checkout-payment-info">
        <div id="checkout-submit-order">SUBMIT ORDER</div>
    </div>
</div>
<?php
include "footer.php";