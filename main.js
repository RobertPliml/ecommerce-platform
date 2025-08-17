window.calculatedTotal = 0.00;

function getCart () 
{
    return JSON.parse(localStorage.getItem("cart")) || {};
}

function subtractFromCart (itemId)
{
    cart = getCart();
    if (cart[itemId] > 1)
    {
        cart[itemId] = cart[itemId] - 1;
    }
    else
    {
        delete cart[itemId];
    }
    localStorage.setItem("cart", JSON.stringify(cart));
}

function setCartQuantity(id, qty) 
{
    const cart = getCart();
    if (qty <= 0) 
    {
    delete cart[id];
    }
    else 
    {
        cart[id] = qty;
    }
    localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartDisplay () 
{
    console.log("Cart:", localStorage.getItem("cart"));
    const cart = getCart();
    const items = Object.entries(cart).map(([id, quantity]) => 
        ({
            id : parseInt(id),
            quantity: parseInt(quantity)
        }));
    
        if (items.length === 0)
        {
            $("#cart-items-wrapper").html("<p id='cart-is-empty'>Cart is empty.</p>");
            return;
        }
    $.ajax
    ({
        type: "POST",
        url: "shop_cart_server.php",
        data: JSON.stringify
        ({
            csrf_token : csrf_token,
            items : items
        }),
        contentType: "application/json",
        success: function (items) 
        {
            let html = "";
            let grand_total = 0;
            //console.log("items from server:", items);
            if (!Array.isArray(items)) 
            {
                // if we've been sent back nothing
                $("#cart-items-wrapper").html("<p>Something went wrong loading the cart.</p>");
                return;
            }
            items.forEach(item => {
                let quantity = cart[item.item_id];
                const stock = calculateStock(item.item_quantity, quantity);
                const amount = item.item_quantity - quantity;
                let color = 'black';
                if (item.do_not_update === true)
                {
                    color = 'rgb(230, 5, 117)';
                    setCartQuantity(item.item_id, item.item_quantity);
                    quantity = item.item_quantity;
                }
                else
                {
                    if (amount > 5) // there are 6 or more quantity than stock
                    {
                        color = "rgb(0, 209, 153)";
                    }
                    else if (amount <= 5 && amount > 0)
                    {
                        color = "rgb(38, 145, 252)";
                    }
                    else
                    {
                        color = "rgb(230, 5, 117)";
                    }
                }
                const totalPrice = (item.item_price * quantity).toFixed(2);
                // add the data to the new html object
                html += `
                    <style>
                    #stock-${item.item_id}
                    {
                        color : ${color}
                    }
                    </style>
                  <div class="cart-item">
                    <div style="background-image: url('${item.item_image_url}'); background-size: ${item.background_size_x}% ${item.background_size_y}%; background-position: ${item.background_pos}" class="shopping-cart-img"></div>
                    <h4 class="cart-item-info">${item.item_name}</h4>
                    <p class="cart-item-info">Price: $${totalPrice}</p>
                    <div class="cart-counter-container">
                        <div class="cart-counter-subtract" id="subtract-${item.item_id}">-</div>
                        <div class="cart-counter-value">${quantity}</div>
                        <div class="cart-counter-add" id="add-${item.item_id}">+</div>  
                    </div>
                    <p class="stock-counter" id="stock-${item.item_id}">${stock}</p>
                  </div>
                `;
                grand_total+=parseFloat(totalPrice);
            });
            html += 
            `<div id="cart-subtotal">
                <p id="subtotal">Subtotal: $${grand_total.toFixed(2)}</p>
                <div id="empty-cart"><i class="bi bi-trash"></i></div>
                <div id="submit-cart"><i class="bi bi-check"></i></div>
            </div>`;
            // now commit our new html to the shopping cart
            $('#cart-subtotal').remove();
            $("#cart-items-wrapper").html(html);
        },
        error : function () 
        {
            $('#cart-items-wrapper').html("<p>Shopping cart failed to update as expected.</p>");
        } 
    });
}

function calculateStock(stock, quantity)
{
    let amount = stock - quantity;
    if (amount > 5) // there are 6 or more quantity than stock
    {
        return "In Stock";
    }
    else if (amount <= 5 && amount > 0)
    {
        return amount + " left in Stock";
    }
    else
    {
        return "Limit Reached!";
    }
}

function updateCheckoutDisplay () 
{
    grand_total = 0;
    $('#checkout-cart-subtotal').remove();
    const cart = getCart();
    const items = Object.entries(cart).map(([id, quantity]) => 
        ({
            id : parseInt(id),
            quantity: parseInt(quantity)
        }));
    
        if (items.length === 0)
        {
            $("#checkout-items-wrapper").html("<p id='cart-is-empty'>Cart is empty.</p>");
            $("#paypal-button-container").remove();
            return;
        }
    $.ajax
    ({
        type: "POST",
        url: "shop_cart_server.php",
        data: JSON.stringify
        ({
            csrf_token : csrf_token,
            items : items
        }),
        contentType: "application/json",
        success: function (items) 
        {
            let html = "";
            let html_2 = "";
            let grand_total = 0;
            //console.log("items from server:", items);
            if (!Array.isArray(items)) 
            {
                // if we've been sent back nothing
                $("#checkout-items-wrapper").html("<p>Something went wrong loading the cart.</p>");
                return;
            }
            items.forEach(item => {
                let quantity = cart[item.item_id];
                const stock = calculateStock(item.item_quantity, quantity);
                const amount = item.item_quantity - quantity;
                let color = 'black';
                if (item.do_not_update === true)
                {
                    color = 'rgb(230, 5, 117)';
                    setCartQuantity(item.item_id, item.item_quantity);
                    quantity = item.item_quantity;
                }
                else
                {
                    if (amount > 5) // there are 6 or more quantity than stock
                    {
                        color = "rgb(0, 209, 153)";
                    }
                    else if (amount <= 5 && amount > 0)
                    {
                        color = "rgb(38, 145, 252)";
                    }
                    else
                    {
                        color = "rgb(230, 5, 117)";
                    }
                }
                const totalPrice = item.item_price * quantity;
                // add the data to the new html object
                html += `
                <style>
                #stock-${item.item_id}
                {
                    color : ${color}
                }
                </style>
                <div class="checkout-cart-item">
                    <div style="background-image: url('${item.item_image_url}'); background-size: ${item.background_size_x}% ${item.background_size_y}%; background-position: ${item.background_pos}" class="shopping-cart-img-checkout"></div>
                    <h4 class="checkout-cart-item-info">${item.item_name}</h4>
                    <p class="checkout-cart-item-info">Price: $${totalPrice}</p>
                    <div class="checkout-cart-counter-container">
                        <div class="cart-counter-subtract" id="checkoutsubtract-${item.item_id}">-</div>
                        <div class="cart-counter-value">${quantity}</div>
                        <div class="cart-counter-add" id="checkoutadd-${item.item_id}">+</div>  
                    </div>
                    <p class="checkout-stock-counter" id="stock-${item.item_id}">${stock}</p>
                </div>
                `;
                grand_total+=totalPrice;
            });
            html_2 += 
            `<div id="checkout-cart-subtotal">
                <p id="checkout-subtotal">Subtotal: $${grand_total.toFixed(2)}</p>
            </div>`;
            // now commit our new html to the shopping cart
            $("#checkout-items-wrapper").html(html);
            $("#checkout-cart-subtotal").remove();
            $("#checkout-list-wrapper").append(html_2);
            window.calculatedTotal = parseFloat(grand_total);
            //console.log("REGISTERED ON MAIN.JS: " + window.calculatedTotal);
            waitForPayPal();
        },
        error : function () 
        {
            $('#checkout-items-wrapper').html("<p>Shopping cart failed to update as expected.</p>");
        } 
    });
}

function addToCart (itemId) 
{
    let cart = JSON.parse(localStorage.getItem("cart")) || {};
    cart[itemId] = (cart[itemId] || 0) +  1;
    localStorage.setItem("cart", JSON.stringify(cart));
}

function clearCart () 
{
    localStorage.removeItem("cart");
    $("#cart-items-wrapper").html("<p id='cart-is-empty'>Cart is empty.</p>");
}

function log(msg) // for debugging on my phone because my macbook hates me
{
    const logBox = document.getElementById('debug-log');
    logBox.textContent = (logBox.textContent + '\n' + msg).slice(-500); // keep last ~500 chars
}

$(document).ready(function () 
{   
    updateCartDisplay();
    updateCheckoutDisplay();
    /*setTimeout(() => {
        const el = document.querySelector(".cart-item");
        if (el) {
            console.log("Found cart item:", el);
            console.log("Width is:", getComputedStyle(el).width);
        } else {
            console.log("No .cart-item found in the DOM");
        }
    }, 1000);*/
    console.log('DOM LOADED');     

    // caseid#20949316 
    // Controls for login box
    // Naming it something arbitrary like 'meta-control' is an intentional added security step. 
    // likely not needed. still.
    const meta_control = document.getElementsByClassName('meta-control');
    // SEARCH BAR

    if (meta_control.length > 0)
    {
        // Button open and close
        $('#navigation').on('click',
            '.meta-control',
            function() 
            {
                const task = 'open_close';
                $.ajax
                ({
                    type: 'POST',
                    url: 'admin-login.php',
                    data: 
                    {
                        csrf_token : csrf_token,
                        task : task
                    },
                    cache: false,
                    success : function (data) 
                    {
                        $("#navigation").load(location.href + " #navigation > *");
                    },
                    error : function (xhr, status, error)
                    {
                        console.error(xhr);
                    }
                });
            }
        );
        // Login 
        $('#navigation').on('click',
            '.submit-login',
            function () 
            {
                const task = 'login';
                const username = $('#username').val();
                const password = $('#password').val();
                let scrollTop = $(window).scrollTop();
                $.ajax
                ({
                    type: 'POST',
                    url: 'admin-login.php',
                    data: 
                    {
                        csrf_token : csrf_token,
                        task : task,
                        username : username,
                        password : password
                    },
                    cache: false,
                    success : function (data) 
                    {
                        // reload page & reset scroll position to where it was before request
                        location.reload();
                        $(window).scrollTop(scrollTop);
                    },
                    error : function (xhr, status, error)
                    {
                        console.error(xhr);
                    }
                });
            }
        )

        $('#navigation').on('click',
            '.submit-logout',
            function () 
            {
                const task = 'logout';
                let scrollTop = $(window).scrollTop();
                $.ajax
                ({
                    type: 'POST',
                    url: 'admin-login.php',
                    data: 
                    {
                        csrf_token : csrf_token,
                        task : task
                    },
                    cache: false,
                    success : function (data) 
                    {
                        location.reload();
                        $(window).scrollTop(scrollTop);
                    },
                    error : function (xhr, status, error)
                    {
                        console.error(xhr);
                    }
                });
            }
        )
    }

    // Dropdown Menu functions
    let timesClicked = 0;
    if (!('ontouchstart' in window || navigator.maxTouchPoints > 0))
    {
        $("#navigation").on('mouseenter',
        '.listItems',    
            function () 
            {
                var idStr = $(this).attr('id');
                var id = idStr.split('-')[1];
                var catName = idStr.split('-')[2];
                $('#paypal-button-container').css('opacity', '0.99');
                // seperate the way in which the 'shop all' menu displays v others
                if (catName === 'Shop\ All')
                {
                    $('#dropdown-' + id).css({
                        'display' : 'flex',
                        'padding' : '0.5rem'
                    });
                }
                else
                {
                    $('#dropdown-' + id).css({
                        'display' : 'block',
                        'padding' : '0.5rem'
                    });
                }
            }
        );
        $("#navigation").on('mouseleave',
            '.listItems',
            function () 
            {
                let idStr = $(this).attr('id');
                let id = idStr.split('-')[1];
                $('#dropdown-' + id).css({
                    'display' : 'none',
                    'padding' : '0'
                });
                $('#paypal-button-container').css('opacity', '1'); 
            }
        );
        $("#navigation").on('click',
            '.header-wrapper',
            function ()
            {
                let id = $(this).attr('id').split('-')[1];
                console.log(id);
                $.ajax
                ({
                    type: 'POST',
                    url: 'shop_page_server.php',
                    data : 
                    {
                        cat_id : id,
                        grand_cat : true
                    },
                    cache: false,
                    success: function ()
                    {
                        window.location.href = 'shopping_page.php';
                    }
                });
            }
        );
    }
    else
    {
        $('#navigation').on('touchstart',
            '.listItems',
            function ()
            {
                $('#paypal-button-container').css('opacity', '0');
            }
        );
        $("#navigation").on('touchstart',
            '.header-wrapper',    
            function () 
            {
                var idStr = $(this).attr('id');
                var id = idStr.split('-')[0];
                var grandCatId = idStr.split('-')[1];
                var catName = idStr.split('-')[2];
                // seperate the way in which the 'shop all' menu displays v others
                if (timesClicked === 0)
                {
                    if (catName === 'Shop\ All')
                    {
                        $('#dropdown-' + id).css
                        ({
                            'display' : 'flex',
                            'flex-direction' : 'column',
                            'padding' : '0.5rem'
                        });
                    }
                    else
                    {
                        $('#dropdown-' + id).css({
                            'display' : 'block',
                            'padding' : '0.5rem'
                        });
                    }
                    timesClicked = 1;
                }
                else
                {
                    $.ajax
                    ({
                        type: 'POST',
                        url: 'shop_page_server.php',
                        data : 
                        {
                            cat_id : grandCatId,
                            grand_cat : true
                        },
                        cache: false,
                        success: function ()
                        {
                            window.location.href = 'shopping_page.php';
                        }
                    });
                    timesClicked = 0;
                }
            }
        );
        $("#navigation").on('mouseleave',
            '.listItems',
            function () 
            {
                let idStr = $(this).attr('id');
                let id = idStr.split('-')[1];
                $('#dropdown-' + id).css({
                    'display' : 'none',
                    'padding' : '0'
                });
                timesClicked = 0;
                $('#paypal-button-container').css('opacity', '1');
            }
        );
    }
    // Drop Down Menu Editing Functions

    $('#navigation').on('mouseenter',
        '.subcatText-edit',
        function () 
        {
            let idStr = $(this).attr('id');
            let id_1 = idStr.split('-')[1];
            $('#subcat-dropdown-' + id_1).css('display', 'block');
        }
    );

    $('#navigation').on('mouseleave',
        '.subcatText-edit',
        function () 
        {
            let idStr = $(this).attr('id');
            let id_1 = idStr.split('-')[1];
            $('#subcat-dropdown-' + id_1).css('display', 'none');
        }
    );

    // Header button functions
    $('#navigation').on('mouseenter',
        '#menu-bar-edit',
        function () 
        {
            if (checkEditMenuBar === false)
            {
                $('#header-options').css('border', 'solid black 1px');
                $(this).css('border', 'solid black 1px');
            }
        }
    )
    $('#navigation').on('mouseleave',
        '#menu-bar-edit',
        function () 
        {
            if (checkEditMenuBar === false)
            {
                $('#header-options').css('border', 'solid transparent 1px');
                $(this).css('border', 'solid transparent 1px');
            }
            else if (checkEditMenuBar === true)
            {
                $('#header-options').css('border', 'solid red 1px');
                $(this).css('border', 'solid red 1px');
            }
        }
    )
    $('#navigation').on('click',
        '#menu-bar-edit',
        function () 
        {
            console.log(csrf_token);
            $.ajax
            ({
                type: 'POST',
                url: 'admin-edit.php',
                data: 
                {
                    csrf_token : csrf_token,
                    editMenuBar : true
                },
                cache: false,
                success : function (data)
                {
                    $('#top').load(location.href + ' #top > *', function(response, status, xhr) 
                    {
                        if (status === "success") 
                            {
                            // Find the script tags in the response (the content reloaded from the server)
                            var scripts = $(response).find('script');

                            // Loop through each script in the reloaded content
                            scripts.each(function() 
                            {
                                if ($(this).attr('id') === 'checkMenuBarEdit')
                                {
                                    var scriptContent = $(this).html(); // Get the content of the script
                                    var newScript = document.createElement('script');
                                    newScript.setAttribute('nonce', CSP_NONCE); 
                                    newScript.text = scriptContent;  // Set the content to the extracted script
                                    $("#top").append(newScript);
                                }
                            });
                        }
                    });
                    $('#header-options').css('border', 'solid red 1px');
                    $(this).css('border', 'solid red 1px');
                },
                error : function (xhr, status, error)
                {
                    console.error(xhr);
                }
            });
        }
    )
    // CAT MODAL HANDLERS
    $('#navigation').on('click',
        '.add-cat',
        function ()
        {
            $('.menubar-modal').css('display', 'block');
            $('.close-modal-button').css('display', 'block');
            $('.header-modal').css('display', 'flex');
        }
    )
    $('#navigation').on('click',
        '.edit-cat-remove',
        function ()
        {
            $('.menubar-modal').css('display', 'block');
            $('.close-modal-button').css('display', 'block');
            tempId = $(this).attr('id');
            id = tempId.split('-')[2];
            $('#remove-item-modal-' + id).css('display', 'block');
        }
    )
    $('#navigation').on('click',
        '.edit-cat-rename',
        function ()
        {
            $('.menubar-modal').css('display', 'block');
            $('.close-modal-button').css('display', 'block');
            tempId = $(this).attr('id');
            id = tempId.split('-')[2];
            $('#rename-item-modal-' + id).css('display', 'flex');
        }
    )
    // SUBCAT HANDLERS
    $('#navigation').on('click',
        '.add-subcat-item',
        function ()
        {
            $('.menubar-modal').css('display', 'block');
            $('.close-modal-button').css('display', 'block');
            tempId = $(this).attr('id');
            id = tempId.split('-')[2];
            $('#modal-add-subcat-' + id).css('display', 'flex');
        }
    )
    $('#navigation').on('click',
        '.subcat-edit-remove',
        function ()
        {
            let idStr = $(this).attr('id');
            let id = idStr.split('-')[1];
            $('.menubar-modal').css('display', 'block');
            $('.close-modal-button').css('display', 'block');
            $('#modal-remove-' + id).css('display', 'block');
        }
    )
    $('#navigation').on('click',
        '.subcat-edit-edit',
        function ()
        {
            let idStr = $(this).attr('id');
            let id = idStr.split('-')[1];
            $('.menubar-modal').css('display', 'block');
            $('.close-modal-button').css('display', 'block');
            $('#modal-edit-' + id).css('display', 'flex');
        }
    )
    // CLOSE
    $('#navigation').on('click',
        '.close-modal-button',
        function ()
        {
            $('.menubar-modal').css('display', 'none');
            $('.close-modal-button').css('display', 'none');
            $('.header-modal').css('display', 'none');
            $('.header-modal-remove-item').css('display', 'none');
            $('.header-modal-rename-item').css('display', 'none');
            $('.header-modal-add-subcat').css('display', 'none');
            $('.header-modal-remove-subcat').css('display', 'none');
            $('.header-modal-edit-subcat').css('display', 'none');
        }
    )
    $('#navigation').on('click',
        '.right-modal-button',
        function () 
        {
            $('.menubar-modal').css('display', 'none');
            $('.close-modal-button').css('display', 'none');
            $('.header-modal-remove-item').css('display', 'none');
            $('.header-modal-remove-subcat').css('display', 'none');
        }
    )
    $('#navigation').on('click',
        '.enter-button',
        function () 
        {
            let tempId = $(this).attr('id');
            let tempIdSplit = tempId.split('-');
            switch (tempIdSplit[0])
            {
                case 'addnewcat' :
                    var func = 'add-to-cats';
                    var catName = $('#new-cat-input').val();
                    var add_to_shopall = $('#add-to-shopall').prop('checked');
                    $.ajax
                    ({
                        type: 'POST',
                        url: 'admin-edit.php',
                        data: 
                        {
                            csrf_token : csrf_token,
                            catName : catName,
                            add_to_shopall : add_to_shopall,
                            func : func
                        },
                        cache: false,
                        success : function (data)
                        {
                            $('#top').load(location.href + ' #top > *');
                        },
                        error : function (xhr, status, error)
                        {
                            console.error(xhr);
                        }
                    });
                    break;
                case 'renameCat':
                    func = 'rename-cat';
                    var id = tempIdSplit[1];
                    catName = $('#new-cat-name-' + id).val();
                    $.ajax
                    ({
                        type: 'POST',
                        url: 'admin-edit.php',
                        data: 
                        {
                            csrf_token : csrf_token,
                            catName : catName,
                            id : id,
                            func : func
                        },
                        cache: false,
                        success : function (data)
                        {
                            $('#top').load(location.href + ' #top > *');
                        },
                        error : function (xhr, status, error)
                        {
                            console.error(xhr);
                        }
                    });
                    break;
                case 'addsubcat' :
                    catName = tempIdSplit[1];
                    console.log(catName);
                    id = tempIdSplit[2];
                    func = 'add-subcat';
                    var subcatName = $('#subcat-name-input-' + id).val();
                    $.ajax
                    ({
                        type: 'POST',
                        url: 'admin-edit.php',
                        data: 
                        {
                            csrf_token : csrf_token,
                            catName : catName,
                            subcatName : subcatName,
                            func : func
                        },
                        cache: false,
                        success : function (data)
                        {
                            $('#top').load(location.href + ' #top > *');
                        },
                        error : function (xhr, status, error)
                        {
                            console.error(xhr);
                        }
                    });
                    break;
                case 'editSubcat' :
                    catName = tempIdSplit[1];
                    id = tempIdSplit[2];
                    var newName = $('#subcat-input-' + id).val();
                    func = 'edit-subcat';
                    $.ajax
                    ({
                        type: 'POST',
                        url: 'admin-edit.php',
                        data: 
                        {
                            csrf_token : csrf_token,
                            catName : catName,
                            newName : newName,
                            id : id,
                            func : func
                        },
                        cache: false,
                        success : function (data)
                        {
                            $('#top').load(location.href + ' #top > *');
                        },
                        error : function (xhr, status, error)
                        {
                            console.error(xhr);
                        }
                    });
                    break;
            }
        }
    )
    
    $('#navigation').on('click',
        '.left-modal-button-cats',
        function () 
        {
            let tempId = $(this).attr('id');
            let tempId_split = tempId.split('-');
            let id = tempId_split[2];
            let catName = tempId_split[1];
            if (tempId_split[0] === 'remove')
            {
                let func = 'remove-cat';
                $.ajax
                ({
                    type: 'POST',
                    url: 'admin-edit.php',
                    data: 
                    {
                        csrf_token : csrf_token,
                        id : id,
                        func : func,
                        catName : catName
                    },
                    cache: false,
                    success : function (data)
                    {
                        $('#top').load(location.href + ' #top > *');
                    },
                    error : function (xhr, status, error)
                    {
                        console.error(xhr);
                    }
                });
            }
        }
    )
    
    $('#navigation').on('click',
        '.left-modal-button-subcats',
        function () 
        {
            let tempId = $(this).attr('id');
            let tempId_split = tempId.split('-');
            let id = tempId_split[1];
            let catName = tempId_split[2];
            if (tempId_split[0] === 'removeSubcats')
            {
                let func = 'remove-subcat';
                $.ajax
                ({
                    type: 'POST',
                    url: 'admin-edit.php',
                    data: 
                    {
                        csrf_token : csrf_token,
                        id : id,
                        func : func,
                        catName : catName
                    },
                    cache: false,
                    success : function (data)
                    {
                        $('#top').load(location.href + ' #top > *');
                    },
                    error : function (xhr, status, error)
                    {
                        console.error(xhr);
                    }
                });
            }
        }
    )
    $("#navigation").on('click',
        '.subcat-text',
        function (event)
        {
            event.preventDefault();
            let id = $(this).attr('id').split('-')[2];
            console.log(id);
            $.ajax
            ({
                type: 'POST',
                url: 'shop_page_server.php',
                data:
                {
                    cat_id : id,
                    grand_cat : false
                },
                cache: false,
                success : function (data)
                {
                    //alert (data);
                    window.location.href = 'shopping_page.php';
                },
                error : function (xhr, status, error)
                {
                    console.error (xhr);
                }
            });
        }
    )
    $("#navigation").on('click',
        '.logo',
        function ()
        {
            window.location.href = 'index.php';
        }
    )
    $("#shopping-page-main").on('click',
        '.sidebar-subcats',
        function () 
        {
            let id = $(this).attr('id');
            $.ajax
            ({
                type: 'POST',
                url: 'shop_page_server.php',
                data: 
                {
                    cat_id : id,
                    action: 'sidebar-findpage'
                },
                cache: false,
                success : function (data) 
                {
                    //alert(data);
                    window.location.reload();
                },
                error : function (xhr, status, error) 
                {
                    console.error(xhr);
                }
            })
        }
    )
    $('#shopping-page-main').on('click',
        '.sidebar-cats',
        function ()
        {
            let id = $(this).attr('id');
            $.ajax
            ({
                type: 'POST',
                url: 'shop_page_server.php',
                data: 
                {
                    cat_id : id,
                    grand_cat : true
                },
                cache: false,
                success : function (data) 
                {
                    //alert(data);
                    window.location.reload();
                },
                error : function (xhr, status, error) 
                {
                    console.error(xhr);
                }
            })
        }
    )

    // SHOPPING CART

    cartOpen = false;

    $('#navigation').on('click',
        '#cart',
        function () 
        {
            console.log('innit');
            window.location.assign('checkout.php');
        }
    )
    $('#shopping-cart-container').on('click',
        '#shopping-cart-slider',
        function () 
        {
            if (cartOpen === false)
            {
                $('#shopping-cart-container').css
                ({
                    'transform' : 'translateX(0)',
                    'box-shadow' : '-2rem 0 5rem rgba(0,0,0,0.6)',
                    'opacity' : '1'
                });
                $('#shopping-cart-slider').text('>');
                cartOpen = true;
            }
            else if (cartOpen === true)
            {
                $('#shopping-cart-container').css
                ({
                    'transform' : 'translateX(20rem)',
                    'box-shadow' : 'none',
                    'opacity' : '0.5'
                });
                $('#shopping-cart-slider').text('<');
                cartOpen = false;
            }
        }
    )
    $('#shopping-cart-container').on('mouseenter',
        '#shopping-cart-slider',
        function () 
        {
            $('#shopping-cart-container').css('opacity', '1');
        }
    );
    $('#shopping-cart-container').on('mouseleave',
        '#shopping-cart-slider',
        function () 
        {   
            if (cartOpen === true)
            {
                $('#shopping-cart-container').css('opacity', '1');
            }
            else
            {
                $('#shopping-cart-container').css('opacity', '0.5');
            }
        }
    );
    // function for handling the adding of objects to cart
    $('#shopping-page-main').on('click',
        '.item-div',
        function () 
        {
            let item_id = $(this).attr('id').split('-')[1];
            console.log(item_id);
            addToCart(item_id);
            updateCartDisplay();
            updateCheckoutDisplay();
        }
    )
    $('#shopping-cart-main').on('click',
        '.cart-counter-add',
        function () 
        {
            let item_id = $(this).attr('id').split('-')[1];
            console.log(item_id);
            addToCart(item_id);
            updateCartDisplay();
            updateCheckoutDisplay();
        }
    )
    $('#checkout-page-main').on('click',
        '.cart-counter-add',
        function () 
        {
            let item_id = $(this).attr('id').split('-')[1];
            console.log(item_id);
            addToCart(item_id);
            updateCartDisplay();
            updateCheckoutDisplay();
        }
    )

    // subtracting from cart
    $('#shopping-cart-main').on('click',
        '.cart-counter-subtract',
        function () 
        {
            let item_id = $(this).attr('id').split('-')[1];
            console.log(item_id);
            subtractFromCart(item_id);
            updateCartDisplay();
            updateCheckoutDisplay();
        }
    )
    $('#checkout-page-main').on('click',
        '.cart-counter-subtract',
        function () 
        {
            let item_id = $(this).attr('id').split('-')[1];
            console.log(item_id);
            subtractFromCart(item_id);
            updateCartDisplay();
            updateCheckoutDisplay();
        }
    )

    // deleting entire cart
    $('#shopping-cart-main').on('click',
        '#empty-cart',
        function () 
        {
            clearCart();
        }
    )
    $('#shopping-cart-main').on('click',
        '#submit-cart',
        function () 
        {
            window.location.assign('checkout.php');
        }
    );
    // ORDER CONFIRMED 

    $('#order-confirm-main').on('click',
        '#return-home',
        function ()
        {
            window.location.assign('index.php');
        }
    );

    // more ui stuff
    $('.item-div').on('click', function(e) 
    {
        const $btn = $(this);
        const offset = $btn.offset();
        const x = e.pageX - offset.left;
        const y = e.pageY - offset.top;
      
        // Add Ripple
        const $ripple = $('<span class="ripple"></span>').css({
          left: x - 50,
          top: y - 50,
          width: '8rem',
          height: '8rem',
        });
      
        $btn.append($ripple);
        setTimeout(() => $ripple.remove(), 600);
      
        // Add Sparkles
        for (let i = 0; i < 6; i++) 
        {
          const angle = Math.random() * 2 * Math.PI;
          const radius = 40 + Math.random() * 20;
          const dx = Math.cos(angle) * radius + 'px';
          const dy = Math.sin(angle) * radius + 'px';
      
          const $sparkle = $('<span class="sparkle"></span>').css({
            left: x,
            top: y,
            '--x': dx,
            '--y': dy
          });
      
          $btn.append($sparkle);
          setTimeout(() => $sparkle.remove(), 600);
        }
    });
    $('#main').on('click',
        '#get-started-button',
        function ()
        {
            $.post('shop_page_server.php', {action : 'go-to-shopall'}).then(function(data)
            {
                window.location.assign('shopping_page.php');
            });
        }
    );
    $('#socialMedia').on('mouseenter',
        '.insta-cell',
        function () 
        {
            let i = $(this).attr('id').split('-')[2];
            $("#gradient-overlay-" + i).css('display', 'block');
            $("#icon-wrapper-outter-" + i).css('display', 'flex');
        }
    );
    $('#socialMedia').on('mouseleave',
        '.insta-cell',
        function () 
        {
            let i = $(this).attr('id').split('-')[2];
            $("#gradient-overlay-" + i).css('display', 'none');
            $("#icon-wrapper-outter-" + i).css('display', 'none');
        }
    );
});

// fancy scroll effects for select elements

$(window).scroll(function() 
{
    var scrollPosition = $(window).scrollTop();
    var offset = scrollPosition * 0.05;

    $('#board-container').css('transform', 'translateY(' + offset + 'px)');
    $('#main-reviews-container-inner').css('transform', 'translateY(' + offset + 'px)');
});