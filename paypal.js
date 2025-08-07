function renderPaypalButtons()
{
    $('#paypal-button-container').empty();
    
}
function waitForPayPal() 
{
    console.log("REGISTERED ON PAYPAL.JS: " + window.calculatedTotal);
    const cart = JSON.parse(localStorage.getItem("cart")) || {};
    const items = Object.entries(cart).map(([id, quantity]) => 
    ({
        id : parseInt(id),
        quantity: parseInt(quantity)
    }));
    if (items.length === 0)
    {
        //$("#cart-items-wrapper").html("<p id='cart-is-empty'>Cart is empty.</p>");
        return Promise.resolve(false);
    }
    if (typeof paypal === 'undefined') 
    {
        setTimeout(waitForPayPal, 50);
    } 
    else
    {
        $('#paypal-button-container').empty();
        if ($('#paypal-button-container').length) 
            {
            paypal.Buttons({
                style: 
                {
                    layout: 'vertical',   // 'vertical' or 'horizontal'
                    size: 'small',        // 'small', 'medium', 'large', or 'responsive'
                    color: 'black',        // 'gold', 'blue', 'silver', 'black'
                    shape: 'rect',        // 'rect' or 'pill'
                    label: 'paypal'       // 'paypal', 'checkout', 'pay', or 'buynow'
                  },
                createOrder: function (data, actions) 
                {
                const total = window.calculatedTotal ? window.calculatedTotal.toFixed(2) : 0.00;
                return actions.order.create
                ({
                    purchase_units: [{
                    amount: 
                    {
                        value: total // ← Replace with your actual dynamic cart total
                    }
                    }],
                    application_context: 
                    {
                        shipping_preference: 'GET_FROM_FILE', // Or 'SET_PROVIDED_ADDRESS', or 'NO_SHIPPING'
                    }
                });
            },
            
                onApprove: function (data, actions) 
                {
                    console.log('onApprove data:', data);
                    return actions.order.capture().then(function (details) 
                    {
                        // jQuery AJAX POST to your PHP endpoint
                        $.ajax({
                        url: 'confirm-payment.php', // ← your PHP handler
                        type: 'POST',
                        contentType: 'application/json',
                        dataType: 'json',
                        data: JSON.stringify
                        ({
                            orderID: data.orderID,
                            payerID: data.payerID,
                            details: details,
                            items : items
                        }),
                        success: function (res) 
                        {
                            alert(res);
                            console.log('Server response:', res);
                            localStorage.removeItem("cart");
                            window.location.assign('order_confirm.php');
                        },
                        error: function (xhr, status, error) 
                        {
                            console.error('Payment confirmation failed:', error);
                            alert('Something went wrong. Please contact support.');
                            alert(status + ", " + error);
                            console.error('Raw response:', xhr.responseText); 
                        }
                        });
                    });
                }
            }).render('#paypal-button-container');
        }
    }
}