<?php
session_start();
session_regenerate_id();
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
        <!--<form>
            <input id="address-line-1" type="text" placeholder="Address line 1" required>
            <input id="address-line-2" type="text" placeholder="Address line 2" required>
            <input id="city" type="text" placeholder="City" required>
            <select id="state" required>
                <option>Alabama</option>
                <option>Alaska</option>
                <option>Arizona</option>
                <option>Arkansas</option>
                <option>California</option>
                <option>Colorado</option>
                <option>Connecticut</option>
                <option>Delaware</option>
                <option>Florida</option>
                <option>Georgia</option>
                <option>Hawaii</option>
                <option>Idaho</option>
                <option>Illinois</option>
                <option>Indiana</option>
                <option>Iowa</option>
                <option>Kansas</option>
                <option>Kentucky</option>
                <option>Louisiana</option>
                <option>Maine</option>
                <option>Maryland</option>
                <option>Massachusetts</option>
                <option>Michigan</option>
                <option>Minnesota</option>
                <option>Mississippi</option>
                <option>Missouri</option>
                <option>Montana</option>
                <option>Nebraska</option>
                <option>Nevada</option>
                <option>New Hampshire</option>
                <option>New Jersey</option>
                <option>New Mexico</option>
                <option>New York</option>
                <option>North Carolina</option>
                <option>North Dakota</option>
                <option>Ohio</option>
                <option>Oklahoma</option>
                <option>Oregon</option>
                <option>Pennsylvania</option>
                <option>Rhode Island</option>
                <option>South Carolina</option>
                <option>South Dakota</option>
                <option>Tennessee</option>
                <option>Texas</option>
                <option>Utah</option>
                <option>Vermont</option>
                <option>Virginia</option>
                <option>Washington</option>
                <option>West Virginia</option>
                <option>Wisconsin</option>
                <option>Wyoming</option>
            </select>
            <input id="zip" type="text" placeholder="Zipcode" required>
            <input id="email" type="email" placeholder="Email Address" required>
            <input id="del-notes" type="text" placeholder="Additional Delivery Instructions (max 60 characters)">
        </form>-->
        <div id="paypal-button-container"></div>
    </div>
    <div id="error-box">
        <p id="error-text"></p>
    </div>
</div>
<?php
include "footer.php";