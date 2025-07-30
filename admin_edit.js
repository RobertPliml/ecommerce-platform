function updateAdminToolBar (key)
{
    $.ajax
    ({
        type: "POST",
        url: "admin_control_server.php",
        data: 
        {
            new_key : key
        },
        cache: false,
        success : function (data) 
        {
            $("#admin-main").load(location.href + " #admin-main > *");
        },
        error : function (xhr, status, error) 
        {
            console.error(xhr);
        }
    });
}

function updateStock(method, item_id) 
{
    const scrollLeft = $('#admin-tools-container').scrollLeft();
    $.ajax
    ({
        type: "POST",
        url: "admin_control_server.php",
        data: 
        {
            method : method,
            item_id : item_id
        },
        cache: false,
        success : function (data) 
        {
            $("#admin-main").load(location.href + " #admin-main > *", function () 
            {
                $('#admin-tools-container').scrollLeft(scrollLeft);
            });
        },
        error : function (xhr, status, error) 
        {
            console.error(xhr);
        }
    });
}

function updateOrderStatus (order_id, flag, delete_order)
{
    if (typeof order_id !== 'string') 
    {
        throw new TypeError('order_id must be a string');
    }
    if (typeof flag !== 'boolean') 
    {
        throw new TypeError('flag must be a boolean');
    }
    if (typeof delete_order !== 'boolean') 
    {
        throw new TypeError('flag must be a boolean');
    }
    $.ajax
    ({
        type: "POST",
        url: "admin_control_server.php",
        data: 
        {
            order_id : order_id,
            flag : flag,
            delete_order : delete_order
        },
        cache: false,
        success : function (data) 
        {
            $("#admin-main").load(location.href + " #admin-main > *");
        },
        error : function (xhr, status, error) 
        {
            console.error(xhr);
        }
    });
}

function previewOrder (order_id) 
{
    $.ajax
    ({
        type: "POST",
        url: "admin_control_server.php",
        data: 
        {
            order_id : order_id,
            action : 'previewOrder'
        },
        dataType: 'json',
        cache: false,
        success : function (order_items) 
        {
            let previewBox = $('<div id="preview-box"></div>').appendTo('#admin-main');
            let closePreview = $('<div id="close-preview">X</div>').appendTo('#admin-main');
            let previewModal = $('<div id="preview-modal"></div>').appendTo('#admin-main');
            let screen_width = $(window).width();
            let screen_height = $(window).height();
            previewBox.css
            ({
                'position' : 'fixed',
                'height' : screen_height,
                'width' : screen_width / 2,
                'left' : screen_width / 4,
                'top' : '0',
                'z-index' : '10',
                'background-color' : 'white',
                'display' : 'flex',
                'align-items' : 'flex-start',
                'flex-direction' : 'column',
                'overflow-x' : 'hidden',
                'overflow-y' : 'auto',
                'border' : 'solid 1px',
                'font-family' : 'font_3'
            });
            closePreview.css
            ({
                'position' : 'fixed',
                'height' : '6rem',
                'width' : '6rem',
                'top' : '0',
                'left' : '2%',
                'font-size' : '5rem',
                'z-index' : '10',
                'color' : 'white'
            });
            previewModal.css
            ({
                'position' : 'fixed',
                'top' : '0',
                'left' : '0',
                'height' : screen_height,
                'width' : screen_width,
                'background-color' : 'rgba(0, 0, 0, 0.7)',
                'z-index' : '9'
            });
            let raw_html = "";
            let grand_total = 0;
            order_items.forEach (order_item => 
            {
                raw_html += `
                <div class='preview-item' id='item-${order_item.item_id}'>
                    <div class='div-wrapper'>
                        <div class='preview-img' style='background-image: url("${order_item.item_image_url}")'></div>
                        <div class='preview-info-wrapper'>
                            <div class='preview-info'>QUANTITY: ${order_item.quantity}</div>
                            <div class='preview-info'>ITEM NAME: ${order_item.item_name}</div>
                            <div class='preview-info'>PRICE: $${order_item.item_price * order_item.quantity}</div>
                        </div>
                    </div>
                </div>
                `;
                grand_total+=(order_item.item_price * order_item.quantity);
            });
            raw_html += 
            `
            <div class='preview-item' id='preview-grandTotal'>Order Total: $${grand_total}</div>
            `;
            $('#preview-box').html(raw_html);
            $('.preview-item').css
            ({
                'position' : 'relative',
                'min-height' : '25%',
                'width' : '100%',
                'flex-grow' : '1'
            });
            $('.div-wrapper').css
            ({
                'position' : 'relative',
                'display' : 'flex',
                'height' : '100%',
                'width' : '100%'
            });
            $('.preview-img').css
            ({
                'position' : 'relative',
                'flex-grow' : '1',
                'width' : '30%',
                'background-size' : 'cover',
                'border-bottom' : 'solid 1px',
                'border-right' : 'solid 1px'
            });
            $('.preview-info-wrapper').css
            ({
                'position' : 'relative',
                'flex-grow' : '1',
                'border-bottom' : 'solid 0.5px',
                'width' : '70%',
                'display' : 'flex',
                'flex-direction' : 'column'
            });
            $('.preview-info').css
            ({
                'position' : 'relative',
                'border-bottom' : 'solid 1px',
                'min-height' : '33.33%',
                'width' : '100%',
                'flex-grow' : '1',
                'display' : 'flex',
                'justify-content' : 'center',
                'align-items' : 'center'
            });
            $('#preview-grandTotal').css
            ({
                'display' : 'flex',
                'justify-content' : 'center',
                'align-items' : 'center',
                'font-size' : '4rem'
            });
        },
        error : function (xhr, status, error) 
        {
            console.error(xhr);
        }
    });
}

$(document).ready(function () 
{
    var editbar_open = false;
    var file = '';
    var text_box_width = null;
    var text_box_height = null;
    var text_box_content = null;
    var text_color = null;
    var background_color = null;
    var text_font = null;
    var text_size = null;
    var edit_id = 0;
    var editing_existing_box = true;
    var editing = false;
    var text_box_cat = '';
    var lock_xy = false;

    // CREATE NEW DIV 

    $("#shopping-page-main").on('click',
        '.new-item-button',
        function () 
        {
            $('#blank-item').css('display', 'none');
            blank_item = $('<div id="blankItem"></div>').appendTo('#shopping-items-container');
            close_blank_item = $('<div id="exit-add-item">X</div>').appendTo('#blankItem');
            item_settings_wrapper = $('<div id="item-settings-wrapper"></div>').appendTo('#blankItem');
            toggle_edit = $('<div id="toggle-edit"></div>').appendTo('#blankItem');
            add_name = $('<div id="add-name"></div>').appendTo('#item-settings-wrapper');
            add_price = $('<div id="add-price"></div>').appendTo('#item-settings-wrapper');
            add_image = $('<div id="add-image"></div>').appendTo('#item-settings-wrapper');
            add_image_input = $(`<div id="add-image-form">
                    <form id="add-image-formId">
                        <label class="add-image" for="imageinput">Select an image:</label>
                        <input class="add-image" type="file" name="imageinput" id="image" accept="image/*">
                    </form>
                    <div id="image-pos-edit-wrapper">
                        <div class="image-pos-edit" id="image-x-minus"><</div>
                        <div id="y-plus-minus-wrapper">
                            <div class="image-pos-edit" id="image-y-plus">^</div>
                            <div class="image-pos-edit" id="image-y-minus">v</div>
                        </div>
                        <div class="image-pos-edit" id="image-x-plus">></div>
                    </div>
                    <div id="lock-axis"></div>
                    <span id="lock-axis-label">Lock X and Y axis</span>
                    <label id="x-pos-label" for="image-size-slider-x">X</label>
                    <input id="image-size-slider-x" type="range" min="100" max="200" step="10" value="150">
                    <label id="y-pos-label" for="image-size-slider-y">Y</label>
                    <input id="image-size-slider-y" type="range" min="100" max="200" step="10" value="150">
                </div>`).appendTo('#blankItem');
            add_price_input = $(`<div id="add-image-form-2">
                <form id="add-image-formId-2">
                    <label class="add-name-label" for="add-name-input">Set Name: </label>
                    <input type="text" class="add-name-input">
                    <label class="add-price-label" for="add-price-input">Set Price: </label>
                    <input type="text" class="add-price-input">
                    <label class="add-quantity-label" for="add-quantity-input">Set Quantity: </label>
                    <input type="text" class="add-quantity-input">
                </form>
            </div>`).appendTo('#blankItem');
            add_item = $('<div id="add-item" type="submit"></div>').appendTo('#item-settings-wrapper');
            blank_item.css
            ({
                'position' : 'relative',
                'height' : '19rem',
                'width' : '19rem',
                'background-color' : 'white',
                'display' : 'flex'
            })
            close_blank_item.css
            ({
                'z-index' : '2',
                'position' : 'absolute',
                'top' : '0',
                'left' : '0',
                'height' : '1rem',
                'width' : '1rem',
                'border' : 'solid .5px',
                'display' : 'flex',
                'justify-content' : 'center',
                'align-items' : 'center',
                'background-color' : 'white'
            })
            toggle_edit.css
            ({
                'z-index' : '2',
                'position' : 'absolute',
                'height' : '16%',
                'width' : '16%',
                'right' : '5%',
                'top' : '5%',
                'background-image' : 'url("uploads/settings-logo.png")',
                'background-size' : 'cover',
                'border-radius' : '90%',
                'background-position' : '50% 0%'
            });
            item_settings_wrapper.css
            ({
                'position' : 'absolute',
                'height' : '70%',
                'width' : '16%',
                'right' : '5%',
                'bottom' : '5%',
                'display' : 'flex',
                'flex-direction' : 'column',
                'justify-content' : 'space-between'
            });
            add_name.css
            ({
                'z-index' : '2',
                'position' : 'relative',
                'height' : '20%',
                'width' : '100%',
                'background-image' : 'url("uploads/pencilAndPaper-logo.png")',
                'background-size' : 'cover',
                'display' : 'none',
                'background-size' : '110% 100%',
                'background-position' : '10% 0%'
            })
            add_price.css
            ({
                'z-index' : '2',
                'position' : 'relative',
                'height' : '20%',
                'width' : '100%',
                'background-image' : 'url("uploads/cost-logo.png")',
                'background-size' : 'cover',
                'display' : 'none',
                'background-position' : '0% 60%',
                'background-size' : '98% 98%'
            })
            add_image.css
            ({
                'z-index' : '2',
                'position' : 'relative',
                'height' : '20%',
                'width' : '100%',
                'background-image' : 'url("uploads/background-logo.png")',
                'background-size' : 'cover',
                'display' : 'none',
                'border' : 'solid 1px',
                'background-position' : '0% 40%'
            })
            add_image_input.css
            ({
                'z-index' : '2',
                'position' : 'relative',
                'left' : '5%',
                'top' : '47%',
                'width' : '15rem',
                'height' : '9rem',
                'overflow' : 'visible',
                'display' : 'none'
            })
            add_price_input.css
            ({
                'z-index' : '2',
                'position' : 'relative',
                'left' : '5%',
                'top' : '32%',
                'width' : '15rem',
                'height' : '7rem',
                'overflow' : 'visible',
                'display' : 'none'
            })
            add_item.css
            ({
                'z-index' : '2',
                'position' : 'relative',
                'height' : '20%',
                'width' : '100%',
                'background-image' : 'url("uploads/save-logo.png")',
                'background-size' : 'cover',
                'display' : 'none',
                'background-size' : '96% 99%'
            })
            $('#image-pos-edit-wrapper').css
            ({
                'z-index' : '4',
                'position' : 'absolute',
                'top' : '60%',
                'left' : '3%',
                'height' : '35%',
                'width' : '30%',
                'display' : 'flex',
                'justify-content' : 'space-between',
                'flex-direction' : 'row'
            });
            $('#y-plus-minus-wrapper').css
            ({
                'display' : 'flex',
                'flex' : '1',
                'flex-direction' : 'column'
            });
            $('.image-pos-edit').css
            ({
                'position' : 'relative',
                'border' : 'solid 1px',
                'display' : 'flex',
                'justify-content' : 'center',
                'align-items' : 'center',
                'font-size' : '0.5rem',
                'cursor' : 'pointer'
            });
            $('#image-y-plus').css('flex', '1');
            $('#image-y-minus').css('flex', '1');
            $('#image-x-plus').css('flex', '0.4');
            $('#image-x-minus').css('flex', '0.4');
            $('#image-size-slider-x').css
            ({
                'z-index' : '4',
                'position' : 'absolute',
                'width' : '40%',
                'height' : '15%',
                'top' : '65%',
                'left' : '40%',
                'cursor' : 'pointer'
            });
            $('#image-size-slider-y').css
            ({
                'z-index' : '4',
                'position' : 'absolute',
                'width' : '40%',
                'height' : '15%',
                'top' : '80%',
                'left' : '40%',
                'cursor' : 'pointer'
            });
            $('#x-pos-label').css
            ({
                'z-index' : '4',
                'position' : 'absolute',
                'top' : '68%',
                'left' : '36%',
                'font-size' : '0.5rem'
            });
            $('#y-pos-label').css
            ({
                'z-index' : '4',
                'position' : 'absolute',
                'top' : '83%',
                'left' : '36%',
                'font-size' : '0.5rem'
            });
            $('#lock-axis').css
            ({
                'z-index' : '4',
                'position' : 'absolute',
                'top' : '53%',
                'left' : '40%',
                'height' : '1rem',
                'width' : '1rem',
                'border' : 'solid 0.5px'
            });
            $('#lock-axis-label').css
            ({
                'z-index' : '4',
                'position' : 'absolute',
                'top' : '54%',
                'left' : '50%',
                'font-size' : '0.5rem'
            });
            svg_ribbon = $('<svg id="addImage-ribbon" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" height="100%" width="100%" viewBox="0 0 150 90"><polygon points="0 0, 130 0, 150 45, 130 90, 0 90" fill="rgb(225, 225, 225)" stroke="#333" stroke-width="1" /></svg>').appendTo('#add-image-form');
            // svg_ribbon viewbox aspect ratio is 5:3, use for all scaling
            svg_ribbon_2 = $('<div id="svg-div-2"><svg id="addImage-ribbon" xmlns="http://www.w3.org/2000/svg" height="100%" width="100%" viewBox="0 0 150 70"><polygon points="0 0, 120 0, 150 35, 120 70, 0 70" fill="rgb(225, 225, 225)" stroke="#333" stroke-width="1" /></svg></div>').appendTo('#add-image-form-2');
            close_add_image = $('<div id="close-add-image">X</div>').appendTo('#add-image-form');
            close_add_price = $('<div id="close-add-price">X</div>').appendTo('#add-image-form-2');
            $('#addImage-ribbon').css
            ({
                'position' : 'absolute',
                'top' : '0',
                'left' : '0',
                'z-index' : '3',
                'height' : '100%',
                'display' : 'block'
            });
            $("#add-image-formId").css
            ({
                'position' : 'absolute',
                'top' : '12%',
                'width' : '100%'
            });
            svg_ribbon_2.css
            ({
                'position' : 'absolute',
                'top' : '0',
                'left' : '0',
                'z-index' : '3'
            });
            $('.add-image').css
            ({
                'z-index' : '4',
                'position' : 'relative',
                'top' : '15%',
                'left' : '5%'
            });
            $('.add-price-label').css
            ({
                'z-index' : '4',
                'position' : 'relative',
                'max-width' : '50%',
                'font-size' : '0.75rem'
            });
            $('.add-name-label').css
            ({
                'z-index' : '4',
                'position' : 'relative',
                'max-width' : '50%',
                'font-size' : '0.75rem'
            });
            $('.add-quantity-label').css
            ({
                'z-index' : '4',
                'position' : 'relative',
                'max-width' : '50%',
                'font-size' : '0.75rem'
            });
            $('.add-price-input').css
            ({
                'z-index' : '4',
                'position' : 'relative',
                'width' : '20%',
                'height' : '1rem'
            });
            $('.add-name-input').css
            ({
                'z-index' : '4',
                'position' : 'relative',
                'width' : '60%',
                'height' : '1rem'
            });
            $('.add-quantity-input').css
            ({
                'z-index' : '4',
                'position' : 'relative',
                'width' : '20%',
                'height' : '1rem'
            });
            close_add_image.css
            ({
                'position' : 'absolute',
                'height' : '1rem',
                'width' : '1rem',
                'top' : '0',
                'left' : '0',
                'display' : 'flex',
                'background-color' : 'white',
                'border' : 'solid 1px',
                'justify-content' : 'center',
                'align-items' : 'center',
                'z-index' : '3'
            });
            close_add_price.css
            ({
                'position' : 'absolute',
                'height' : '1rem',
                'width' : '1rem',
                'top' : '0',
                'left' : '0',
                'display' : 'flex',
                'background-color' : 'white',
                'border' : 'solid 1px',
                'justify-content' : 'center',
                'align-items' : 'center',
                'z-index' : '3'
            });
        }
    )

    // TOGGLE FOR EDITING

    $("#shopping-page-main").on('click',
        '#toggle-edit',
        function () 
        {
            if (editbar_open === false)
            {
                add_name.show()
                add_price.show()
                add_image.show()
                add_item.show()
                editbar_open = true;
            }
            else if (editbar_open === true) 
            {
                add_name.hide();
                add_price.hide();
                add_image.hide();
                add_item.hide();
                editbar_open = false;
            }
        }
    )

    $('#shopping-page-main').on('click',
        '#image-x-plus',
        function ()
        {
            let image_pos = $('#blankItem').css('background-position');
            let image_x = parseInt(image_pos.split('%')[0]);
            let image_y = parseInt(image_pos.split('%')[1]);
            let new_x = image_x + 10;
            let new_pos = new_x + "% " + image_y + "%";
            if (new_x < 100)
            {
                console.log(new_pos);
                $('#blankItem').css('background-position', new_pos);
            }
        }
    );
    $('#shopping-page-main').on('click',
        '#image-x-minus',
        function ()
        {
            let image_pos = $('#blankItem').css('background-position');
            let image_x = parseInt(image_pos.split('%')[0]);
            let image_y = parseInt(image_pos.split('%')[1]);
            let new_x = image_x - 10;
            let new_pos = new_x + "% " + image_y + "%";
            if (new_x > 0)
            {
                console.log(new_pos);
                $('#blankItem').css('background-position', new_pos);
            }
        }
    );
    $('#shopping-page-main').on('click',
        '#image-y-plus',
        function ()
        {
            let image_pos = $('#blankItem').css('background-position');
            let image_x = parseInt(image_pos.split('%')[0]);
            let image_y = parseInt(image_pos.split('%')[1]);
            let new_y = image_y - 10;
            let new_pos = image_x + "% " + new_y + "%";
            if (new_y > 0)
            {
                console.log(new_pos);
                $('#blankItem').css('background-position', new_pos);
            }
        }
    );
    $('#shopping-page-main').on('click',
        '#image-y-minus',
        function ()
        {
            let image_pos = $('#blankItem').css('background-position');
            let image_x = parseInt(image_pos.split('%')[0]);
            let image_y = parseInt(image_pos.split('%')[1]);
            let new_y = image_y + 10;
            let new_pos = image_x + "% " + new_y + "%";
            if (new_y < 100)
            {
                console.log(new_pos);
                $('#blankItem').css('background-position', new_pos);
            }
        }
    );

    $('#shopping-page-main').on('input',
        '#image-size-slider-x',
        function ()
        {
            let new_val = $(this).val();
            if (lock_xy === false)
            {
                let old_val = $('#blankItem').css('background-size').split('%')[1];
                let new_val_str = new_val + "% " + old_val + "%";
                $('#blankItem').css('background-size', new_val_str);
            }
            else
            {
                let new_val_str = new_val + "% " + new_val + "%";
                $('#blankItem').css('background-size', new_val_str);
                $('#image-size-slider-y').val(new_val);
            }
        }
    );
    $('#shopping-page-main').on('input',
        '#image-size-slider-y',
        function ()
        {
            let new_val = $(this).val();
            if (lock_xy === false)
            {
                let old_val = $('#blankItem').css('background-size').split('%')[0];
                let new_val_str = old_val + "% " + new_val + "%";
                $('#blankItem').css('background-size', new_val_str);
            }
            else
            {
                let new_val_str = new_val + "% " + new_val + "%";
                $('#blankItem').css('background-size', new_val_str);
                $('#image-size-slider-x').val(new_val);
            }
        }
    );
    $('#shopping-page-main').on('click',
        '#lock-axis',
        function () 
        {
            console.log('clicked');
            if (lock_xy === false)
            {
                lock_xy = true;
                $(this).css('background-color', 'black');
            }
            else if (lock_xy === true)
            {
                lock_xy = false;
                $(this).css('background-color', 'transparent');
            }
        }
    )

    // EVENT HANDLERS FOR EDITING

    $("#shopping-page-main").on('click',
        '#close-add-image',
        function () 
        {
            console.log('register click');
            add_image_input.css
            ({
                'display' : 'none'
            })
        }
    )
    $("#shopping-page-main").on('mouseenter mouseleave',
        '#close-add-image',
        function () 
        {
            $('#close-add-image').css
            ({
                'cursor' : 'pointer'
            })
        }
    )
    $("#shopping-page-main").on('click',
        '#add-image',
        function () 
        {
            add_image_input.css
            ({
                'display' : 'block'
            })
        }
    )
    $("#shopping-page-main").on('mouseenter mouseleave',
        '#add-image',
        function () 
        {
            $('#add-image').css
            ({
                'cursor' : 'pointer'
            })
        }
    )
    $("#shopping-page-main").on('mouseenter mouseleave',
        '#exit-add-item',
        function () 
        {
            close_blank_item.css
            ({
                'cursor' : 'pointer'
            })
        }
    )
    $("#shopping-page-main").on('mouseenter mouseleave',
        '#add-item',
        function ()
        {
            add_item.css
            ({
                'cursor' : 'pointer'
            })
        }
    )
    $("#shopping-page-main").on('mouseenter mouseleave',
        '#add-name',
        function ()
        {
            add_name.css
            ({
                'cursor' : 'pointer'
            })
        }
    )
    $("#shopping-page-main").on('mouseenter mouseleave',
        '#add-price',
        function ()
        {
            add_price.css
            ({
                'cursor' : 'pointer'
            })
        }
    )
    $("#shopping-page-main").on('click',
        '#exit-add-item',
        function () 
        {
            blank_item.remove();
            $('#blank-item').css('display', 'block');
        }
    )
    $("#shopping-page-main").on('click',
        '.finished-add-item',
        function () 
        {
            $.ajax
            ({
                type: 'POST',
                url: 'shop_page_server.php',
                data: 
                {
                    csrf_token : csrf_token,
                    item_id : page_search_id
                },
                cache: false,
                success : function (data)
                {
                    alert(data);
                },
                error : function (xhr, status, error)
                {
                    console.error(xhr);
                }
            });
        }
    )
    $('#shopping-page-main').on('change', 
        '#image',
        function (event) 
        {
            file = event.target.files[0];
            if (file)
            {
                const reader = new FileReader();

                reader.onload = function (e) 
                {
                    $('#blankItem').css('background-image', 'url(' + e.target.result + ')');
                    $('#blankItem').css('background-size', '150% 150%');  
                    $('#blankItem').css('background-position', '50% 50%');
                    add_item_img = e.target.result;
                }
                reader.readAsDataURL(file);
            }
        }
    )

    // EVENT HANDLER TO CREATE <TEXTAREA> FOR INSIDE THE #BLANKITEM

    $('#shopping-page-main').on('click',
        '#add-name',
        function () 
        {
            if (editing === false)
            {
                name_tag = $('<textarea id="name-tag"></textarea>').appendTo('#blankItem');
                name_menu = $('<div id="name-menu"></div>').appendTo('#blankItem');
                close_name_tag = $('<div id="close-name-tag">X</div>').appendTo('#name-menu');
                add_name_tag = $('<div id="add-name-tag">O</div>').appendTo('#name-menu');
                font_size_tag = $('<div id="font-size-tag">Font Size:</div>').appendTo('#name-menu');
                font_size_select = $('<select id="font-size-select">' +
                    '<option id="font-small">S</option>' + 
                    '<option id="font-medium" selected>M</option>' + 
                    '<option id="font-large">L</option>' + 
                    '</select>').appendTo('#name-menu');
                font_tag = $('<div id="font-tag">Font:</div>').appendTo('#name-menu');
                font_options = $('<select id="font-options">' +
                    '<option>Roboto</option>' +
                    '<option>Helvetica</option>' +
                    '<option selected>Arial</option>' +
                    '<option>Georgia</option>' +
                    '</select>').appendTo('#name-menu');
                color_tag = $('<div id="color-tag">Color:</div>').appendTo('#name-menu');
                font_color = $('<div id="font-color"></div>').appendTo('#name-menu');
                background_color = $('<div id="background-color"></div>').appendTo('#name-menu');
            }      
            name_tag.css
            ({
                'z-index' : '1',
                'position' : 'absolute',
                'text-align' : 'center',
                'bottom' : '0',
                'font-size' : '2rem',
                'font-family' : 'font_3',
                'max-height' : '50%',
                'height' : '3rem',
                'width' : '100%',
                'overflow-y' : 'auto',
                'resize' : 'none',
                'background-color' : 'transparent'
            });
            name_menu.css
            ({
                'position' : 'absolute',
                'left' : '0',
                'width' : '100%',
                'height' : '5%',
                'border' : 'solid 1px',
                'display' : 'flex',
                'align-items' : 'center',
                'z-index' : '40',
                'background-color' : 'white'
            });
            close_name_tag.css
            ({
                'position' : 'absolute',
                'height' : '100%',
                'width' : '1rem',
                'left' : '0',
                'background-color' : 'red',
                'display' : 'flex',
                'align-items' : 'center',
                'justify-content' : 'center',
                'border' : 'solid 0.5px'
            });
            add_name_tag.css
            ({
                'position' : 'absolute',
                'height' : '100%',
                'width' : '1rem',
                'left' : '1rem',
                'background-color' : 'green',
                'display' : 'flex',
                'align-items' : 'center',
                'justify-content' : 'center',
                'border' : 'solid 0.5px'
            });
            font_size_tag.css
            ({
                'position' : 'absolute',
                'height' : '100%',
                'width' : '4rem',
                'left' : '2rem',
                'background-color' : 'white',
                'display' : 'flex',
                'align-items' : 'center',
                'justify-content' : 'center',
                'font-size' : '.75rem'
            });
            font_size_select.css
            ({
                'position' : 'absolute',
                'height' : '100%',
                'width' : '1rem',
                'left' : '6rem',
                'background-color' : 'goldenrod',
                'border' : 'solid 0.5px',
                'font-size' : '.80rem',
                'appearance' : 'none',
                'text-align' : 'right',
                'line-height' : '0.5rem'
            });
            font_tag.css
            ({
                'position' : 'absolute',
                'height' : '100%',
                'width' : '2rem',
                'left' : '7rem',
                'background-color' : 'white',
                'display' : 'flex',
                'align-items' : 'center',
                'justify-content' : 'center',
                'font-size' : '.75rem'
            });
            font_options.css
            ({
                'position' : 'absolute',
                'height' : '100%',
                'width' : '4rem',
                'left' : '9rem',
                'background-color' : 'white',
                'display' : 'flex',
                'align-items' : 'center',
                'justify-content' : 'center',
                'font-size' : '.75rem',
                'appearance' : 'none',
                'line-height' : '0.5rem',
                'text-align' : 'center'
            });
            color_tag.css
            ({
                'position' : 'absolute',
                'height' : '100%',
                'width' : '2rem',
                'left' : '13.5rem',
                'background-color' : 'white',
                'display' : 'flex',
                'align-items' : 'center',
                'justify-content' : 'center',
                'font-size' : '.75rem'
            });
            font_color.css
            ({
                'position' : 'absolute',
                'height' : '100%',
                'width' : '1rem',
                'left' : '16rem',
                'background-color' : 'black',
                'display' : 'flex',
                'align-items' : 'center',
                'justify-content' : 'center',
                'font-size' : '.75rem',
                'border' : 'solid 0.5px'
            });
            background_color.css
            ({
                'position' : 'absolute',
                'height' : '100%',
                'width' : '1rem',
                'left' : '17.5rem',
                'background-color' : 'white',
                'display' : 'flex',
                'align-items' : 'center',
                'justify-content' : 'center',
                'font-size' : '.75rem',
                'border' : 'solid 0.5px'
            });
            editing = true;
            name_menu_height = name_menu.height();
            new_top_pos = parseFloat(name_tag.css('top')) - name_menu_height;
            name_menu.css('top', new_top_pos);
        }
    )

    // EVENT HANDLERS FOR EDITING <TEXTAREA>

    $('#shopping-page-main').on('change',
        '#font-size-select',
        function () 
        {
            let new_font_size = $('#font-size-select').val();
            switch (new_font_size)
            {
                case 'S' :
                    name_tag.css('font-size', '1.5rem');
                    break;
                case 'M' :
                    name_tag.css('font-size', '2rem');
                    break;
                case 'L' :
                    name_tag.css('font-size', '2.5rem');
                    break;
            }
        }
    )
    $('#shopping-page-main').on('change',
        '#font-options',
        function () 
        {
            let new_font = $('#font-options').val();
            switch (new_font)
            {
                case 'Roboto' :
                    name_tag.css('font-family', new_font);
                    break;
                case 'Helvetica' :
                    name_tag.css('font-family', new_font);
                    break;
                case 'Arial' :
                    name_tag.css('font-family', new_font);
                    break;
                case 'Georgia' :
                    name_tag.css('font-family', new_font);
                    break;
            }
        }
    )
    $('#shopping-page-main').on('click',
        '#name-tag',
        function (e) 
        {
            e.stopPropagation();
            name_tag.css
            ({
                'z-index': '4',
                'border': 'solid 1px'
            });
            name_menu.css
            ({
                'display': 'flex'
            });
            $(document).on('click', function (e) 
            {
                if ((!name_tag.is(e.target) || !name_menu.is(e.target)) && (name_tag.has(e.target).length === 0 || name_menu.has(e.target).length === 0)) 
                    {
                    name_tag.css
                    ({
                        'z-index': '1'
                    });
                }
            });
        }
    )
    $('#shopping-page-main').on('mouseenter mouseleave',
        '#close-name-tag',
        function () 
        {
            close_name_tag.css
            ({
                'cursor' : 'pointer'
            });
        }
    )
    $('#shopping-page-main').on('click',
        '#close-name-tag',
        function () 
        {
            name_tag.remove();
            name_menu.remove();
            editing = false;
        }
    )
    $('#shopping-page-main').on('mouseenter mouseleave',
        '#add-name-tag',
        function () 
        {
            add_name_tag.css
            ({
                'cursor' : 'pointer'
            });
        }
    )
    $('#shopping-page-main').on('click',
        '#add-name-tag',
        function () 
        {
            name_menu.css
            ({
                'display' : 'none'
            });
            name_tag.css('border', 'none');
        }
    )
    $('#shopping-page-main').on('mouseenter mouseleave',
        '#font-size-select',
        function () 
        {
            font_size_select.css
            ({
                'cursor' : 'pointer'
            });
        }
    )
    $('#shopping-page-main').on('mouseenter mouseleave',
        '#font-options',
        function () 
        {
            font_options.css
            ({
                'cursor' : 'pointer'
            });
        }
    )
    $('#shopping-page-main').on('mouseenter mouseleave',
        '#font-color',
        function () 
        {
            font_color.css
            ({
                'cursor' : 'pointer'
            });
        }
    )

    // EVENT HANDLERS TO BRING UP COLOR WHEEL

    $('#shopping-page-main').on('click',
        '#font-color',
        function (e) 
        {
            e.stopPropagation();
            if ($('#color-picker-container').length > 0) 
            {
                $('#color-picker-container').remove();
            }
            var color_input = $('<input>', 
                {
                    type: 'color',
                    id: 'color-picker',
                    value: '#000000',
                }); 
            var picker_container = $('<div>', 
                {
                    id: 'color-picker-container'
                }).append(color_input).appendTo('#blankItem');
            picker_container.show();
            color_input.on('input', function ()
            {
                var selectedColor = $(this).val();
                font_color.css('background-color', selectedColor);
                name_tag.css
                ({
                    'color' : selectedColor
                });
            });
            $(document).on('click', function (e)
            {
                if (!picker_container.is(e.target) && picker_container.has(e.target).length === 0)
                {
                    picker_container.remove();
                }
            })
            picker_container.on('click', function (e) 
            {
                e.stopPropagation();
            });
        }
    )
    $('#shopping-page-main').on('click',
        '#background-color',
        function (e) 
        {
            e.stopPropagation();
            if ($('#color-picker-container').length > 0) 
            {
                $('#color-picker-container').remove();
            }
            var color_input = $('<input>', 
                {
                    type: 'color',
                    id: 'color-picker',
                    value: '#000000',
                }); 
            var picker_container = $('<div>', 
                {
                    id: 'color-picker-container'
                }).append(color_input).appendTo('#blankItem');
            picker_container.show();
            color_input.on('input', function ()
            {
                var selectedColor = $(this).val();
                background_color.css('background-color', selectedColor);
                name_tag.css
                ({
                    'background-color' : selectedColor
                });
            });
            $(document).on('click', function (e)
            {
                if (!picker_container.is(e.target) && picker_container.has(e.target).length === 0)
                {
                    picker_container.remove();
                }
            })
            picker_container.on('click', function (e) 
            {
                e.stopPropagation();
            });
        }
    )
    $('#shopping-page-main').on('input',
        '#name-tag',
        function () 
        {
            const parentHeight = $('#blankItem').height();
            // store full height of blankItem
            var maxHeight = parentHeight / 2;
            // half height of blankItem, used as threshold to stop growing of input field
            const barHeight = ($('#blankItem').height() / 100) * 11; 
            // 11% of blankItem, used as threshold to decide when to move #name-menu, our 
            // editing bar
            const initTopPercentage = 84;
            
            // initial top % of #name-menu
            if (this.scrollHeight > maxHeight) // if input height grows taller than allowed
            {
                // if too tall, remove last character in input to limit growth.
                // get our current input length first
                var currentLength = $(this).val().length;
                // set new input value to a new string, that is the same string, but with
                // the last character removed
                $(this).val($(this).val().substring(0, currentLength - 1));
            }
            else
            {
                // if within height, set input height to fit content 
                this.style.height = this.scrollHeight + 'px';
            }
            // now make sure if the inputs height exceeds our 11% starting position, that
            // we adjust the height of #name-menu, again, our editing bar
            if (this.scrollHeight > barHeight)
            {
                // offset represents how far past the start pos we've gone
                let offset = this.scrollHeight - barHeight;
                // we give a new top percentage to #name-menu by (offset / parentHeight) * 100
                // which turns the distance in pixels, into a useable percentage, then we
                // subtract it from the original top percentage, to get our new top percentage.
                const newTopPercentage = initTopPercentage - (offset / parentHeight) * 100;
                $('#name-menu').css
                ({
                    'top' : newTopPercentage + '%'
                });
                //$('#name-menu')[0].getBoundingClientRect(); probably old testing 
            }
            else
            {
                // if #name-menu makes its way below the 11% threshold/start pos, reset
                $('#name-menu').css('top', initTopPercentage + '%');
            }
        }
    )
    $('#shopping-page-main').on('click',
        '#add-price',
        function () 
        {
            $('#add-image-form-2').css
            ({
                'display' : 'block'
            });
            $('#add-image-formId-2').css
            ({
                'position' : 'absolute',
                'top' : '0',
                'left' : '10%',
                'display' : 'flex',
                'flex-direction' : 'column',
                'justify-content' : 'flex-start'
            });
        }
    )
    $('#shopping-page-main').on('click',
        '#close-add-price',
        function () 
        {
            add_price_input.css
            ({
                'display' : 'none',
                'cursor' : 'pointer'
            });
        }
    )

    // SUBMIT THE NEW ITEM

    $("#shopping-page-main").on('click',
        '#add-item',
        function (event)
        {
            event.preventDefault();
            editing = false;
            let name_tag = $("#name-tag");
            if (name_tag.length > 0)
            {
                text_box_height = name_tag.height();
                text_box_width = name_tag.width();
                text_box_content = name_tag.val();
                text_color = name_tag.css('color');
                text_font = name_tag.css('font-family');
                text_size = name_tag.css('font-size').split('p')[0];
                background_color = name_tag.css('background-color');
            }
            background_size_x = $('#blankItem').css('background-size').split('%')[0];
            background_size_y = $('#blankItem').css('background-size').split('%')[1];
            background_pos = $('#blankItem').css('background-position');
            text_box_cat = $('#subcat-name').text();
            item_price = $('.add-price-input').val();
            item_name = $('.add-name-input').val();
            item_quantity = $('.add-quantity-input').val();
            var formData = new FormData();
            var fileInput = $('#image')[0].files[0];
            formData.append('csrf_token', csrf_token);
            if (fileInput)
            {
                formData.append('file', fileInput);
            }
            if (text_box_height)
            {
                console.log(text_box_height);
                formData.append('text_box_height', text_box_height);
            }
            if (text_box_width)
            {
                console.log(text_box_width);
                formData.append('text_box_width', text_box_width);
            }
            if (text_box_content)
            {
                console.log(text_box_content);
                formData.append('text_box_content', text_box_content);
            }
            if (text_color)
            {
                console.log(text_color);
                formData.append('text_color', text_color);
            }
            if (background_color)
            {
                console.log(background_color);
                formData.append('background_color', background_color);
            }
            if (text_font)
            {
                console.log(text_font);
                formData.append('text_font', text_font);
            }
            if (text_size)
            {
                console.log(text_size);
                formData.append('text_size', text_size);
            }
            if (text_box_cat)
            {
                console.log(text_box_cat);
                formData.append('text_box_cat', text_box_cat);
            }
            if (item_price)
            {
                formData.append('item_price', item_price);
            }
            if (item_name)
            {
                console.log(item_name);
                formData.append('item_name', item_name);
            }
            if (item_quantity)
            {
                formData.append('item_quantity', item_quantity);
            }
            if (background_size_x)
            {
                formData.append('background_size_x', background_size_x);
            }
            if (background_size_y)
            {
                formData.append('background_size_y', background_size_y);
            }
            if (background_pos)
            {
                formData.append('background_pos', background_pos);
            }
            $.ajax
            ({
                type: 'POST',
                url: 'add_item.php',
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
                success : function (data)
                {
                    location.reload();
                },
                error : function (xhr, status, error)
                {
                    console.error(xhr);
                }
            });
        }
    )

    // EDIT THE ITEMS

    $('#shopping-page-main').on('dblclick',
        '.item-div',
        function () 
        {
            edit_id = $(this).attr('id').split('-')[1];
            var edit_textbox = $('#textbox-' + edit_id);
            var edit_box_pos = $(this).offset();
            var edit_box_top = edit_box_pos.top + $('#shopping-items-container').scrollTop();
            var edit_box_left = edit_box_pos.left;
            var border = 1;
            edit_box_top -= border;
            edit_box_left -= border;
            var edit_box_img = $(this).css('background-image');
            var edit_img_size_x = $(this).css('background-size').split('%')[0];
            var edit_img_size_y = $(this).css('background-size').split('%')[1];
            var edit_img_pos = $(this).css('background-position');
            var container_height_25percent = parseFloat($('#shopping-page-main').css('height')) / 4;
            var page_width_20percent = $(window).width() / 5;
            edit_box_top -= container_height_25percent;
            edit_box_left -= page_width_20percent;
            edit_textbox_height = edit_textbox.height();
            edit_textbox_width = edit_textbox.width();
            edit_textbox_content = edit_textbox.val();
            edit_textbox_font = edit_textbox.css('font-family');
            edit_textbox_color = edit_textbox.css('color');
            edit_textbox_background = edit_textbox.css('background-color');
            edit_textbox_size = edit_textbox.css('font-size');

            $(this).css('opacity', '0');

            blank_item_edit = $('<div id="blankItemEdit"></div>').appendTo('#shopping-items-container');
            close_edit = $('<div id="close_edit">X</div>').appendTo('#blankItemEdit');
            text_box_edit = $('<textarea id="name-tag-edit">'+ edit_textbox_content +'</textarea>').appendTo('#blankItemEdit');

            blank_item_edit.css
            ({
                'position' : 'absolute',
                'height' : '19rem',
                'width' : '19rem',
                'top' : edit_box_top + 'px',
                'left' : edit_box_left + 'px',
                'background-image' : edit_box_img,
                'background-size' : edit_img_size_x + "% " + edit_img_size_y + "%",
                'background-position' : edit_img_pos
            });
            close_edit.css
            ({
                'position' : 'absolute',
                'top' : '0',
                'left' : '0',
                'height' : '1rem',
                'width' : '1rem',
                'border' : 'solid .5px',
                'display' : 'flex',
                'justify-content' : 'center',
                'align-items' : 'center',
                'background-color' : 'white'
            });
            text_box_edit.css
            ({
                'z-index' : '1',
                'position' : 'absolute',
                'text-align' : 'center',
                'bottom' : '0',
                'font-size' : edit_textbox_size,
                'font-family' : edit_textbox_font,
                'max-height' : '50%',
                'height' : edit_textbox_height,
                'width' : edit_textbox_width,
                'overflow-y' : 'auto',
                'resize' : 'none',
                'background-color' : edit_textbox_background,
                'color' : edit_textbox_color,
                'border' : 'none'
            });
            item_settings_wrapper_edit = $('<div id="item-settings-wrapper"></div>').appendTo('#blankItemEdit');
            toggle_edit_edit = $('<div id="toggle-edit-edit"></div>').appendTo('#blankItemEdit');
            add_name_edit = $('<div id="add-name-edit"></div>').appendTo('#item-settings-wrapper');
            add_price_edit = $('<div id="add-price-edit"></div>').appendTo('#item-settings-wrapper');
            add_image_input = $(`<div id="add-image-form">
                    <form id="add-image-formId-edit">
                        <label class="add-image" for="imageinput">Select an image:</label>
                        <input class="add-image" type="file" name="imageinput" id="image-edit" accept="image/*">
                    </form>
                    <div id="image-pos-edit-wrapper-edit">
                        <div class="image-pos-edit-edit" id="image-x-minus-edit"><</div>
                        <div id="y-plus-minus-wrapper-edit">
                            <div class="image-pos-edit-edit" id="image-y-plus-edit">^</div>
                            <div class="image-pos-edit-edit" id="image-y-minus-edit">v</div>
                        </div>
                        <div class="image-pos-edit-edit" id="image-x-plus-edit">></div>
                    </div>
                    <div id="lock-axis-edit"></div>
                    <span id="lock-axis-label-edit">Lock X and Y axis</span>
                    <label id="x-pos-label-edit" for="image-size-slider-x">X</label>
                    <input id="image-size-slider-x-edit" type="range" min="100" max="200" step="10" value="${edit_img_size_x}">
                    <label id="y-pos-label-edit" for="image-size-slider-y">Y</label>
                    <input id="image-size-slider-y-edit" type="range" min="100" max="200" step="10" value="${edit_img_size_y}">
                </div>`).appendTo('#blankItemEdit');
            add_price_input = $(`<div id="add-price-form">
                    <form id="add-price-formId">
                        <label class="add-name-label-edit" for="add-name-input-edit">Change Name: </label>
                        <input type="text" class="add-name-input-edit">
                        <label class="add-price-label-edit" for="add-price-input-edit">Change Price: </label>
                        <input type="text" class="add-price-input-edit">
                        <label class="add-quantity-label-edit" for="add-quantity-input-edit">Change Quantity: </label>
                        <input type="text" class="add-quantity-input-edit">
                    </form>
                </div>`).appendTo('#blankItemEdit');
            add_image_edit = $('<div id="add-image"></div>').appendTo('#item-settings-wrapper');
            add_item_edit = $('<div id="add-item-edit" type="submit"></div>').appendTo('#item-settings-wrapper');
            toggle_edit_edit.css
            ({
                'z-index' : '2',
                'position' : 'absolute',
                'height' : '16%',
                'width' : '16%',
                'right' : '5%',
                'top' : '5%',
                'background-image' : 'url("uploads/settings-logo.png")',
                'background-size' : 'cover',
                'border-radius' : '90%',
                'background-position' : '50% 0%'
            });
            item_settings_wrapper_edit.css
            ({
                'position' : 'absolute',
                'height' : '70%',
                'width' : '16%',
                'right' : '5%',
                'bottom' : '5%',
                'display' : 'flex',
                'flex-direction' : 'column',
                'justify-content' : 'space-between'
            });
            add_name_edit.css
            ({
                'z-index' : '2',
                'position' : 'relative',
                'height' : '20%',
                'width' : '100%',
                'background-image' : 'url("uploads/pencilAndPaper-logo.png")',
                'background-size' : 'cover',
                'display' : 'none',
                'background-size' : '110% 100%',
                'background-position' : '10% 0%',
                'border' : 'solid 0.5px'
            })
            add_price_edit.css
            ({
                'z-index' : '2',
                'position' : 'relative',
                'height' : '20%',
                'width' : '100%',
                'background-image' : 'url("uploads/cost-logo.png")',
                'background-size' : 'cover',
                'display' : 'none',
                'background-position' : '0% 60%',
                'background-size' : '98% 98%',
                'border' : 'solid 0.5px'
            })
            add_image_edit.css
            ({
                'z-index' : '2',
                'position' : 'relative',
                'height' : '20%',
                'width' : '100%',
                'background-image' : 'url("uploads/background-logo.png")',
                'background-size' : 'cover',
                'display' : 'none',
                'border' : 'solid 1px',
                'background-position' : '0% 40%',
                'border' : 'solid 0.5px'
            })
            add_image_input.css
            ({
                'z-index' : '2',
                'position' : 'relative',
                'left' : '5%',
                'top' : '50%',
                'width' : '15rem',
                'height' : '9rem',
                'overflow' : 'visible',
                'display' : 'none'
            })
            add_price_input.css
            ({
                'z-index' : '2',
                'position' : 'relative',
                'left' : '5%',
                'top' : '30%',
                'width' : '15rem',
                'height' : '7rem',
                'overflow' : 'visible',
                'display' : 'none'
            })
            add_item_edit.css
            ({
                'z-index' : '2',
                'position' : 'relative',
                'height' : '20%',
                'width' : '100%',
                'background-image' : 'url("uploads/save-logo.png")',
                'background-size' : 'cover',
                'display' : 'none',
                'background-size' : '96% 99%',
                'border' : 'solid 0.5px'
            })
            $('#image-pos-edit-wrapper-edit').css
            ({
                'z-index' : '4',
                'position' : 'absolute',
                'top' : '60%',
                'left' : '3%',
                'height' : '35%',
                'width' : '30%',
                'display' : 'flex',
                'justify-content' : 'space-between',
                'flex-direction' : 'row'
            });
            $('#y-plus-minus-wrapper-edit').css
            ({
                'display' : 'flex',
                'flex' : '1',
                'flex-direction' : 'column'
            });
            $('.image-pos-edit-edit').css
            ({
                'position' : 'relative',
                'border' : 'solid 1px',
                'display' : 'flex',
                'justify-content' : 'center',
                'align-items' : 'center',
                'font-size' : '0.5rem',
                'cursor' : 'pointer'
            });
            $('#image-y-plus-edit').css('flex', '1');
            $('#image-y-minus-edit').css('flex', '1');
            $('#image-x-plus-edit').css('flex', '0.4');
            $('#image-x-minus-edit').css('flex', '0.4');
            $('#image-size-slider-x-edit').css
            ({
                'z-index' : '4',
                'position' : 'absolute',
                'width' : '40%',
                'height' : '15%',
                'top' : '65%',
                'left' : '40%',
                'cursor' : 'pointer'
            });
            $('#image-size-slider-y-edit').css
            ({
                'z-index' : '4',
                'position' : 'absolute',
                'width' : '40%',
                'height' : '15%',
                'top' : '80%',
                'left' : '40%',
                'cursor' : 'pointer'
            });
            $('#x-pos-label-edit').css
            ({
                'z-index' : '4',
                'position' : 'absolute',
                'top' : '68%',
                'left' : '36%',
                'font-size' : '0.5rem'
            });
            $('#y-pos-label-edit').css
            ({
                'z-index' : '4',
                'position' : 'absolute',
                'top' : '83%',
                'left' : '36%',
                'font-size' : '0.5rem'
            });
            $('#lock-axis-edit').css
            ({
                'z-index' : '4',
                'position' : 'absolute',
                'top' : '53%',
                'left' : '40%',
                'height' : '1rem',
                'width' : '1rem',
                'border' : 'solid 0.5px'
            });
            $('#lock-axis-label-edit').css
            ({
                'z-index' : '4',
                'position' : 'absolute',
                'top' : '54%',
                'left' : '50%',
                'font-size' : '0.5rem'
            });
            svg_ribbon = $('<svg id="addImage-ribbon-edit" xmlns="http://www.w3.org/2000/svg" height="100%" width="100%" viewBox="0 0 150 90"><polygon points="0 0, 130 0, 150 45, 130 90, 0 90" fill="rgb(225, 225, 225)" stroke="#333" stroke-width="1" /></svg>').appendTo('#add-image-form');
            svg_ribbon_2 = $('<div id="svg-div-2"><svg id="addImage-ribbon" xmlns="http://www.w3.org/2000/svg" height="100%" width="100%" viewBox="0 0 150 70"><polygon points="0 0, 120 0, 150 35, 120 70, 0 70" fill="rgb(225, 225, 225)" stroke="#333" stroke-width="1" /></svg></div>').appendTo('#add-price-form');
            close_add_image = $('<div id="close-add-image">X</div>').appendTo('#add-image-form');
            close_add_price = $('<div id="close-add-price">X</div>').appendTo('#add-price-form');
            $('#addImage-ribbon-edit').css
            ({
                'position' : 'absolute',
                'top' : '0',
                'left' : '0',
                'z-index' : '3',
                'height' : '100%',
                'display' : 'block'
            })
            $("#add-image-formId-edit").css
            ({
                'position' : 'absolute',
                'top' : '10%',
                'width' : '100%'
            });
            svg_ribbon_2.css
            ({
                'position' : 'absolute',
                'top' : '0',
                'left' : '0',
                'z-index' : '3'
            })
            $('.add-image').css
            ({
                'z-index' : '4',
                'position' : 'relative',
                'top' : '15%',
                'left' : '5%'
            })
            $('.add-price-label-edit').css
            ({
                'z-index' : '4',
                'position' : 'relative',
                'max-width' : '50%',
                'font-size' : '0.75rem'
            });
            $('.add-name-label-edit').css
            ({
                'z-index' : '4',
                'position' : 'relative',
                'max-width' : '50%',
                'font-size' : '0.75rem'
            });
            $('.add-quantity-label-edit').css
            ({
                'z-index' : '4',
                'position' : 'relative',
                'max-width' : '50%',
                'font-size' : '0.75rem'
            });
            $('.add-price-input-edit').css
            ({
                'z-index' : '4',
                'position' : 'relative',
                'width' : '20%',
                'height' : '1rem'
            });
            $('.add-name-input-edit').css
            ({
                'z-index' : '4',
                'position' : 'relative',
                'width' : '60%',
                'height' : '1rem'
            });
            $('.add-quantity-input-edit').css
            ({
                'z-index' : '4',
                'position' : 'relative',
                'width' : '20%',
                'height' : '1rem'
            });
            close_add_image.css
            ({
                'position' : 'absolute',
                'height' : '1rem',
                'width' : '1rem',
                'top' : '0',
                'left' : '0',
                'display' : 'flex',
                'background-color' : 'white',
                'border' : 'solid 1px',
                'justify-content' : 'center',
                'align-items' : 'center',
                'z-index' : '3'
            })
            close_add_price.css
            ({
                'position' : 'absolute',
                'height' : '1rem',
                'width' : '1rem',
                'top' : '0',
                'left' : '0',
                'display' : 'flex',
                'background-color' : 'white',
                'border' : 'solid 1px',
                'justify-content' : 'center',
                'align-items' : 'center',
                'z-index' : '3'
            })
            name_menu_edit = $('<div id="name-menu-edit"></div>').appendTo('#blankItemEdit');
            close_name_tag_edit = $('<div id="close-name-tag-edit">X</div>').appendTo('#name-menu-edit');
            add_name_tag_edit = $('<div id="add-name-tag-edit">O</div>').appendTo('#name-menu-edit');
            font_size_tag_edit = $('<div id="font-size-tag">Font Size:</div>').appendTo('#name-menu-edit');
            font_size_select_edit = $('<select id="font-size-select-edit">' +
                '<option id="font-small">S</option>' + 
                '<option id="font-medium" selected>M</option>' + 
                '<option id="font-large">L</option>' + 
                '</select>').appendTo('#name-menu-edit');
            font_tag_edit = $('<div id="font-tag">Font:</div>').appendTo('#name-menu-edit');
            font_options_edit = $('<select id="font-options-edit">' +
                '<option>Roboto</option>' +
                '<option>Helvetica</option>' +
                '<option selected>Arial</option>' +
                '<option>Georgia</option>' +
                '</select>').appendTo('#name-menu-edit');
            color_tag_edit = $('<div id="color-tag">Color:</div>').appendTo('#name-menu-edit');
            font_color_edit = $('<div id="font-color-edit"></div>').appendTo('#name-menu-edit');
            background_color_edit = $('<div id="background-color-edit"></div>').appendTo('#name-menu-edit');      
            name_menu_edit.css
            ({
                'position' : 'absolute',
                'left' : '0',
                'width' : '100%',
                'height' : '5%',
                'border' : 'solid 1px',
                'display' : 'flex',
                'align-items' : 'center',
                'z-index' : '40',
                'background-color' : 'white'
            });
            close_name_tag_edit.css
            ({
                'position' : 'absolute',
                'height' : '100%',
                'width' : '1rem',
                'left' : '0',
                'background-color' : 'red',
                'display' : 'flex',
                'align-items' : 'center',
                'justify-content' : 'center',
                'border' : 'solid 0.5px'
            });
            add_name_tag_edit.css
            ({
                'position' : 'absolute',
                'height' : '100%',
                'width' : '1rem',
                'left' : '1rem',
                'background-color' : 'green',
                'display' : 'flex',
                'align-items' : 'center',
                'justify-content' : 'center',
                'border' : 'solid 0.5px'
            });
            font_size_tag_edit.css
            ({
                'position' : 'absolute',
                'height' : '100%',
                'width' : '4rem',
                'left' : '2rem',
                'background-color' : 'white',
                'display' : 'flex',
                'align-items' : 'center',
                'justify-content' : 'center',
                'font-size' : '.75rem'
            });
            font_size_select_edit.css
            ({
                'position' : 'absolute',
                'height' : '100%',
                'width' : '1rem',
                'left' : '6rem',
                'background-color' : 'goldenrod',
                'border' : 'solid 0.5px',
                'font-size' : '.80rem',
                'appearance' : 'none',
                'text-align' : 'right',
                'line-height' : '0.5rem'
            });
            font_tag_edit.css
            ({
                'position' : 'absolute',
                'height' : '100%',
                'width' : '2rem',
                'left' : '7rem',
                'background-color' : 'white',
                'display' : 'flex',
                'align-items' : 'center',
                'justify-content' : 'center',
                'font-size' : '.75rem'
            });
            font_options_edit.css
            ({
                'position' : 'absolute',
                'height' : '100%',
                'width' : '4rem',
                'left' : '9rem',
                'background-color' : 'white',
                'display' : 'flex',
                'align-items' : 'center',
                'justify-content' : 'center',
                'font-size' : '.75rem',
                'appearance' : 'none',
                'line-height' : '0.5rem',
                'text-align' : 'center'
            });
            color_tag_edit.css
            ({
                'position' : 'absolute',
                'height' : '100%',
                'width' : '2rem',
                'left' : '13.5rem',
                'background-color' : 'white',
                'display' : 'flex',
                'align-items' : 'center',
                'justify-content' : 'center',
                'font-size' : '.75rem'
            });
            font_color_edit.css
            ({
                'position' : 'absolute',
                'height' : '100%',
                'width' : '1rem',
                'left' : '16rem',
                'background-color' : 'black',
                'display' : 'flex',
                'align-items' : 'center',
                'justify-content' : 'center',
                'font-size' : '.75rem',
                'border' : 'solid 0.5px'
            });
            background_color_edit.css
            ({
                'position' : 'absolute',
                'height' : '100%',
                'width' : '1rem',
                'left' : '17.5rem',
                'background-color' : 'white',
                'display' : 'flex',
                'align-items' : 'center',
                'justify-content' : 'center',
                'font-size' : '.75rem',
                'border' : 'solid 0.5px'
            });
            name_menu_edit.css
            ({
                'display': 'none'
            });
            name_menu_height = name_menu_edit.height();
            name_tag_top = parseFloat(text_box_edit.css('top'));
            starting_menu_pos = name_tag_top - name_menu_height;
            name_menu_edit.css
            ({
                'top' : starting_menu_pos
            });
            $('#image-edit').val('')
        }
    )
    $('#shopping-page-main').on('click',
        '#image-x-plus-edit',
        function ()
        {
            let image_pos = $('#blankItemEdit').css('background-position');
            let image_x = parseInt(image_pos.split('%')[0]);
            let image_y = parseInt(image_pos.split('%')[1]);
            let new_x = image_x + 10;
            let new_pos = new_x + "% " + image_y + "%";
            if (new_x < 100)
            {
                console.log(new_pos);
                $('#blankItemEdit').css('background-position', new_pos);
            }
        }
    );
    $('#shopping-page-main').on('click',
        '#image-x-minus-edit',
        function ()
        {
            let image_pos = $('#blankItemEdit').css('background-position');
            let image_x = parseInt(image_pos.split('%')[0]);
            let image_y = parseInt(image_pos.split('%')[1]);
            let new_x = image_x - 10;
            let new_pos = new_x + "% " + image_y + "%";
            if (new_x > 0)
            {
                console.log(new_pos);
                $('#blankItemEdit').css('background-position', new_pos);
            }
        }
    );
    $('#shopping-page-main').on('click',
        '#image-y-plus-edit',
        function ()
        {
            let image_pos = $('#blankItemEdit').css('background-position');
            let image_x = parseInt(image_pos.split('%')[0]);
            let image_y = parseInt(image_pos.split('%')[1]);
            let new_y = image_y - 10;
            let new_pos = image_x + "% " + new_y + "%";
            if (new_y > 0)
            {
                console.log(new_pos);
                $('#blankItemEdit').css('background-position', new_pos);
            }
        }
    );
    $('#shopping-page-main').on('click',
        '#image-y-minus-edit',
        function ()
        {
            let image_pos = $('#blankItemEdit').css('background-position');
            let image_x = parseInt(image_pos.split('%')[0]);
            let image_y = parseInt(image_pos.split('%')[1]);
            let new_y = image_y + 10;
            let new_pos = image_x + "% " + new_y + "%";
            if (new_y < 100)
            {
                console.log(new_pos);
                $('#blankItemEdit').css('background-position', new_pos);
            }
        }
    );

    $('#shopping-page-main').on('input',
        '#image-size-slider-x-edit',
        function ()
        {
            let new_val = $(this).val();
            if (lock_xy === false)
            {
                let old_val = $('#blankItemEdit').css('background-size').split('%')[1];
                let new_val_str = new_val + "% " + old_val + "%";
                $('#blankItemEdit').css('background-size', new_val_str);
            }
            else
            {
                let new_val_str = new_val + "% " + new_val + "%";
                $('#blankItemEdit').css('background-size', new_val_str);
                $('#image-size-slider-y-edit').val(new_val);
            }
        }
    );
    $('#shopping-page-main').on('input',
        '#image-size-slider-y-edit',
        function ()
        {
            let new_val = $(this).val();
            if (lock_xy === false)
            {
                let old_val = $('#blankItemEdit').css('background-size').split('%')[0];
                let new_val_str = old_val + "% " + new_val + "%";
                $('#blankItemEdit').css('background-size', new_val_str);
            }
            else
            {
                let new_val_str = new_val + "% " + new_val + "%";
                $('#blankItemEdit').css('background-size', new_val_str);
                $('#image-size-slider-x-edit').val(new_val);
            }
        }
    );

    $('#shopping-page-main').on('mouseenter mouseleave',
        '#close_edit',
        function () 
        {
            close_edit.css('cursor', 'pointer');
        }
    )
    $('#shopping-page-main').on('click',
        '#close_edit',
        function () 
        {
            blank_item_edit.remove();
            $('#item-' + edit_id).css('opacity', '1');
            editing_existing_box = true;
            editing = false;
        }
    )
    $('#shopping-page-main').on('click',
        '#add-price-edit',
        function ()
        {
            add_price_input.css('display', 'block');
            $('#add-price-formId').css
            ({
                'position' : 'absolute',
                'top' : '0',
                'left' : '10%',
                'display' : 'flex',
                'flex-direction' : 'column'
            });
        }
    )
    $('#shopping-page-main').on('click',
        '#close-add-price',
        function ()
        {
            add_price_input.css('display', 'none');
        }
    )

    // EDIT BACKGROUND IMAGE

    $('#shopping-page-main').on('change', 
        '#image-edit',
        function (event) 
        {
            file = event.target.files[0];
            if (file)
            {
                const reader = new FileReader();

                reader.onload = function (e) 
                {
                    $('#blankItemEdit').css('background-image', 'url(' + e.target.result + ')');
                    //$('#blankItemEdit').css('background-size', '50% 50%');  
                    //$('#blankItemEdit').css('background-position', '150% 150%');
                    add_item_img = e.target.result;
                }
                reader.readAsDataURL(file);
            }
        }
    )

    // EDIT TEXTAREA

    $('#shopping-page-main').on('click',
        '#add-name-edit',
        function (e) 
        {
            e.stopPropagation();
            console.log(editing);
            if (editing_existing_box === false)
            {
                console.log('registered click, there isnt a textbox, ');
                if (editing === false)
                {
                    console.log('and editing is false');
                    text_box_edit = $('<textarea id="name-tag-edit"></textarea>').appendTo('#blankItemEdit');
                    text_box_edit.css
                    ({
                        'z-index' : '1',
                        'position' : 'absolute',
                        'text-align' : 'center',
                        'bottom' : '0',
                        'font-size' : '2rem',
                        'font-family' : 'font_3',
                        'max-height' : '50%',
                        'height' : '3rem',
                        'width' : '100%',
                        'overflow-y' : 'auto',
                        'resize' : 'none',
                        'background-color' : 'transparent'
                    });
                }
            }
            name_menu_height = name_menu_edit.height();
            name_tag_top = parseFloat(text_box_edit.css('top'));
            starting_menu_pos = name_tag_top - name_menu_height;
            name_menu_edit.css
            ({
                'top' : starting_menu_pos,
                'display' : 'flex'
            });
        }
    )
    $('#shopping-page-main').on('mouseenter mouseleave',
        '#add-name-edit',
        function () 
        {
            add_name_edit.css('cursor', 'pointer');
        }
    )
    $('#shopping-page-main').on('mouseenter mouseleave',
        '#close-name-tag-edit',
        function () 
        {
            close_name_tag_edit.css
            ({
                'cursor' : 'pointer'
            });
        }
    )
    $('#shopping-page-main').on('click',
        '#close-name-tag-edit',
        function () 
        {
            console.log('clicked delete text box');
            text_box_edit.remove();
            name_menu_edit.css
            ({
                'display': 'none'
            });
            editing_existing_box = false;
            editing = false;
        }
    )
    $('#shopping-page-main').on('input',
        '#name-tag-edit',
        function () 
        {
            var maxHeight = $('#blankItemEdit').height() / 2;
            const barHeight = ($('#blankItemEdit').height() / 100) * 11;
            const parentHeight = $('#blankItemEdit').height();
            const initTopPercentage = 84;
            if (this.scrollHeight > maxHeight)
            {
                var currentLength = $(this).val().length;
                $(this).val($(this).val().substring(0, currentLength - 1));
            }
            else
            {
                this.style.height = (this.scrollHeight) + 'px';
            }
            if (this.scrollHeight > barHeight)
            {
                let offset = this.scrollHeight - barHeight;
                const newTopPercentage = initTopPercentage - (offset / parentHeight) * 100;
                $('#name-menu-edit').css
                ({
                    'top' : newTopPercentage + '%'
                });
                //$('#name-menu-edit')[0].getBoundingClientRect(); 
            }
            else
            {
                $('#name-menu-edit').css('top', initTopPercentage + '%');
            }
        }
    )
    $('#shopping-page-main').on('click',
        '#name-tag-edit',
        function (e) 
        {
            e.stopPropagation();
            editing = true;
            editing_existing_box = true;
            text_box_edit.css
            ({
                'z-index': '4',
                'border': 'solid 1px'
            });
            name_menu_edit.css
            ({
                'display': 'flex'
            });
            $(document).on('click', function (e) 
            {
                if (!text_box_edit.is(e.target) && text_box_edit.has(e.target).length === 0 && !name_menu_edit.is(e.target) && name_menu_edit.has(e.target).length === 0 && !add_name_edit.is(e.target) && add_name_edit.has(e.target).length === 0) 
                    {
                    text_box_edit.css
                    ({
                        'z-index': '1',
                        'border' : 'none'
                    });
                    console.log('clicking outside targets');
                    name_menu_edit.css
                    ({
                        'display': 'none'
                    });
                }
            });
        }
    )
    $('#shopping-page-main').on('click',
        '#add-name-tag-edit',
        function () 
        {
            name_menu_edit.css
            ({
                'display' : 'none'
            });
            text_box_edit.css('border', 'none');
            editing = false;
        }
    )

     // EVENT HANDLERS FOR EDITING <TEXTAREA> IN EDIT MODE  

     $('#shopping-page-main').on('change',
        '#font-size-select-edit',
        function () 
        {
            let new_font_size = $(this).val();
            switch (new_font_size)
            {
                case 'S' :
                    text_box_edit.css('font-size', '1.5rem');
                    break;
                case 'M' :
                    text_box_edit.css('font-size', '2rem');
                    break;
                case 'L' :
                    text_box_edit.css('font-size', '2.5rem');
                    break;
            }
        }
    )
    $('#shopping-page-main').on('change',
        '#font-options-edit',
        function () 
        {
            let new_font = $(this).val();
            switch (new_font)
            {
                case 'Roboto' :
                    text_box_edit.css('font-family', new_font);
                    break;
                case 'Helvetica' :
                    text_box_edit.css('font-family', new_font);
                    break;
                case 'Arial' :
                    text_box_edit.css('font-family', new_font);
                    break;
                case 'Georgia' :
                    text_box_edit.css('font-family', new_font);
                    break;
            }
        }
    )
    $("#shopping-page-main").on('click',
        '#toggle-edit-edit',
        function () 
        {
            if (editbar_open === false)
            {
                add_name_edit.show()
                add_price_edit.show()
                add_image_edit.show()
                add_item_edit.show()
                editbar_open = true;
            }
            else if (editbar_open === true) 
            {
                add_name_edit.hide();
                add_price_edit.hide();
                add_image_edit.hide();
                add_item_edit.hide();
                editbar_open = false;
            }
        }
    )
    $('#shopping-page-main').on('click',
        '#font-color-edit',
        function (e) 
        {
            e.stopPropagation();
            if ($('#color-picker-container').length > 0) 
            {
                $('#color-picker-container').remove();
            }
            var color_input = $('<input>', 
                {
                    type: 'color',
                    id: 'color-picker',
                    value: '#000000',
                }); 
            var picker_container = $('<div>', 
                {
                    id: 'color-picker-container'
                }).append(color_input).appendTo('#blankItemEdit');
            picker_container.show();
            color_input.on('input', function ()
            {
                var selectedColor = $(this).val();
                font_color_edit.css('background-color', selectedColor);
                text_box_edit.css
                ({
                    'color' : selectedColor
                });
            });
            $(document).on('click', function (e)
            {
                if (!picker_container.is(e.target) && picker_container.has(e.target).length === 0)
                {
                    picker_container.remove();
                }
            })
            picker_container.on('click', function (e) 
            {
                e.stopPropagation();
            });
        }
    )
    $('#shopping-page-main').on('click',
        '#background-color-edit',
        function (e) 
        {
            e.stopPropagation();
            if ($('#color-picker-container').length > 0) 
            {
                $('#color-picker-container').remove();
            }
            var color_input = $('<input>', 
                {
                    type: 'color',
                    id: 'color-picker',
                    value: '#000000',
                }); 
            var picker_container = $('<div>', 
                {
                    id: 'color-picker-container'
                }).append(color_input).appendTo('#blankItemEdit');
            picker_container.show();
            color_input.on('input', function ()
            {
                var selectedColor = $(this).val();
                background_color_edit.css('background-color', selectedColor);
                text_box_edit.css
                ({
                    'background-color' : selectedColor
                });
            });
            $(document).on('click', function (e)
            {
                if (!picker_container.is(e.target) && picker_container.has(e.target).length === 0)
                {
                    picker_container.remove();
                }
            })
            picker_container.on('click', function (e) 
            {
                e.stopPropagation();
            });
        }
    )

    // SUBMIT EDITED ITEM
    $("#shopping-page-main").on('click',
        '#add-item-edit',
        function (event)
        {
            event.preventDefault();
            text_box_height = text_box_edit.height();
            text_box_width = text_box_edit.width();
            text_box_content = text_box_edit.val();
            text_color = text_box_edit.css('color');
            background_color = text_box_edit.css('background-color');
            background_size_x = $('#blankItemEdit').css('background-size').split('%')[0];
            background_size_y = $('#blankItemEdit').css('background-size').split('%')[1];
            background_pos = $('#blankItemEdit').css('background-position');
            text_font = text_box_edit.css('font-family');
            item_name = $('.add-name-input-edit').val();
            item_price = $('.add-price-input-edit').val();
            item_quantity = $('.add-quantity-input-edit').val();
            text_size = text_box_edit.css('font-size').split('p')[0];
            var formDataEdit = new FormData();
            if ($('#image-edit')[0].files && $('#image-edit')[0].files.length > 0)
            {
                fileInput = $('#image-edit')[0].files[0];
            }
            else
            {
                fileInputStr = blank_item_edit.css('background-image');
                split_part = fileInputStr.split('project_2/')[1];
                fileInput = split_part.split('"')[0];
            }
            console.log(fileInput);
            var edit_sub = true;
            formDataEdit.append('csrf_token', csrf_token);
            formDataEdit.append('edit_sub', edit_sub);
            console.log(edit_sub);
            if (fileInput)
            {
                formDataEdit.append('file', fileInput);
            }
            if (text_box_height)
            {
                console.log(text_box_height);
                formDataEdit.append('text_box_height', text_box_height);
            }
            if (text_box_width)
            {
                console.log(text_box_width);
                formDataEdit.append('text_box_width', text_box_width);
            }
            if (text_box_content)
            {
                console.log(text_box_content);
                formDataEdit.append('text_box_content', text_box_content);
            }
            if (text_color)
            {
                console.log(text_color);
                formDataEdit.append('text_color', text_color);
            }
            if (background_color)
            {
                console.log(background_color);
                formDataEdit.append('background_color', background_color);
            }
            if (text_font)
            {
                console.log(text_font);
                formDataEdit.append('text_font', text_font);
            }
            if (text_size)
            {
                console.log(text_size);
                formDataEdit.append('text_size', text_size);
            }
            if (edit_id)
            {
                formDataEdit.append('edit_id', edit_id);
            }
            if (item_name)
            {
                formDataEdit.append('item_name', item_name);
            }
            if (item_price)
            {
                formDataEdit.append('item_price', item_price);
            }
            if (item_quantity)
            {
                formDataEdit.append('item_quantity', item_quantity);
            }
            if (background_size_x)
            {
                formDataEdit.append('background_size_x', background_size_x);
                console.log(background_size_x);
            }
            if (background_size_y)
            {
                formDataEdit.append('background_size_y', background_size_y);
                console.log(background_size_y);
            }
            if (background_pos)
            {
                formDataEdit.append('background_pos', background_pos);
                console.log(background_pos);
            }
            $.ajax
            ({
                type: 'POST',
                url: 'add_item.php',
                data: formDataEdit,
                cache: false,
                contentType: false,
                processData: false,
                success : function (data)
                {
                    location.reload();
                },
                error : function (xhr, status, error)
                {
                    console.error(xhr);
                }
            });
        }
    )
    $("#navigation").on('click',
        '#isAdmin',
        function () 
        {
            window.location.assign("admin_control.php");
        }
    )
    $("#admin-main").on('click',
        '.admin-tools-menubar-buttons',
        function () 
        {
            let new_key = $(this).attr('id').split('-')[3];
            updateAdminToolBar(new_key);
        }
    )
    /*$("#admin-main").on('mouseenter',
        '.inventory-item',
        function () 
        {
            $(this).css('opacity', '0.5');
        }
    )
    $("#admin-main").on('mouseleave',
        '.inventory-item',
        function () 
        {
            $(this).css('opacity', '1');
        }
    ) we're going to improve this later*/
    $("#admin-main").on('click',
        '.inventory-item',
        function () 
        {
            // do shtuff
        }
    )
    $("#admin-main").on('click',
        '.add-stock',
        function () 
        {
            let method = "add";
            item_id = $(this).attr('id').split('-')[2];
            updateStock(method, item_id);
        }
    )
    $("#admin-main").on('click',
        '.subtract-stock',
        function () 
        {
            let method = "subtract";
            item_id = $(this).attr('id').split('-')[2];
            updateStock(method, item_id);
        }
    )
    $("#admin-main").on('click',
        '.order-bar-flagged',
        function () 
        {
            order_id = $(this).attr('id').split('-')[2];
            updateOrderStatus(order_id, true, false);
        }
    )
    $("#admin-main").on('click',
        '.order-bar-confirmOrder',
        function () 
        {
            order_id = $(this).attr('id').split('-')[2];
            updateOrderStatus(order_id, false, false);
        }
    )
    $("#admin-main").on('click',
        '.order-bar-shipOrder',
        function () 
        {
            order_id = $(this).attr('id').split('-')[2];
            updateOrderStatus(order_id, false, false);
        }
    )
    $("#admin-main").on('click',
        '.order-bar-archiveOrder',
        function () 
        {
            order_id = $(this).attr('id').split('-')[2];
            updateOrderStatus(order_id, false, false);
        }
    )
    $("#admin-main").on('click',
        '.order-bar-delete',
        function () 
        {
            order_id = $(this).attr('id').split('-')[2];
            updateOrderStatus(order_id, false, true);
        }
    )
    $("#admin-main").on('click',
        '.order-bar-viewOrder',
        function () 
        {
            order_id = $(this).attr('id').split('-')[1];
            previewOrder(order_id);
        }
    )
    $("#admin-main").on('mouseenter',
        '#close-preview',
        function () 
        {
            $(this).css
            ({
                'cursor' : 'pointer',
                'color' : 'black'
            });
        }
    )
    $("#admin-main").on('mouseleave',
        '#close-preview',
        function () 
        {
            $(this).css('color', 'white');
        }
    )
    $("#admin-main").on('click',
        '#close-preview',
        function () 
        {
            $("#close-preview").remove();
            $("#preview-modal").remove();
            $("#preview-box").remove();
        }
    )
});