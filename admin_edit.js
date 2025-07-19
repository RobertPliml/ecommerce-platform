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

$(document).ready(function () 
{
    var editbar_open = false;
    var file = '';
    var text_box_width = 0;
    var text_box_height = 0;
    var text_box_content = '';
    var text_color = '';
    var background_color = '';
    var text_font = '';
    var text_size = 0;
    var edit_id = 0;
    var editing_existing_box = true;
    var editing = false;
    var text_box_cat = '';

    // CREATE NEW DIV 

    $("#shopping-page-main").on('click',
        '.new-item-button',
        function () 
        {
            $('#blank-item').css('display', 'none');
            blank_item = $('<div id="blankItem"></div>').appendTo('#shopping-items-container');
            close_blank_item = $('<div id="exit-add-item">X</div>').appendTo('#blankItem');
            toggle_edit = $('<div id="toggle-edit"></div>').appendTo('#blankItem');
            add_name = $('<div id="add-name"></div>').appendTo('#blankItem');
            add_price = $('<div id="add-price"></div>').appendTo('#blankItem');
            add_image_input = $('<div id="add-image-form"><form id="add-image-formId"><label class="add-image" for="imageinput">Select an image:</label><input class="add-image" type="file" name="imageinput" id="image" accept="image/*"></form></div>').appendTo('#blankItem');
            add_image = $('<div id="add-image"></div>').appendTo('#blankItem');
            add_item = $('<div id="add-item" type="submit"></div>').appendTo('#blankItem');
            blank_item.css
            ({
                'position' : 'relative',
                'height' : '19rem',
                'width' : '19rem',
                'background-color' : 'white'
            })
            close_blank_item.css
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
            })
            toggle_edit.css
            ({
                'z-index' : '2',
                'position' : 'absolute',
                'height' : '16%',
                'width' : '16%',
                'right' : '5%',
                'top' : '5%',
                'background-color' : 'gray'
            });
            add_name.css
            ({
                'z-index' : '2',
                'position' : 'absolute',
                'height' : '16%',
                'width' : '16%',
                'right' : '5%',
                'top' : '40%',
                'background-color' : 'red',
                'display' : 'none'
            })
            add_price.css
            ({
                'z-index' : '2',
                'position' : 'absolute',
                'height' : '16%',
                'width' : '16%',
                'right' : '5%',
                'top' : '60%',
                'background-color' : 'pink',
                'display' : 'none'
            })
            add_image.css
            ({
                'z-index' : '2',
                'position' : 'absolute',
                'height' : '16%',
                'width' : '16%',
                'right' : '5%',
                'top' : '20%',
                'background-color' : 'skyblue',
                'display' : 'none'
            })
            add_image_input.css
            ({
                'position' : 'absolute',
                'left' : '5%',
                'top' : '10%',
                'width' : '15rem',
                'height' : '7rem',
                'overflow' : 'visible',
                'display' : 'none'
            })
            $("#add-image-formId").css
            ({
                'position' : 'absolute',
                'top' : '15%'
            });
            add_item.css
            ({
                'z-index' : '2',
                'position' : 'absolute',
                'height' : '16%',
                'width' : '16%',
                'right' : '5%',
                'top' : '80%',
                'background-color' : 'purple',
                'display' : 'none'
            })
            svg_ribbon = $('<div id="svg-div"><svg id="addImage-ribbon" xmlns="http://www.w3.org/2000/svg" height="100%" width="100%" viewBox="0 0 150 70"><polygon points="0 0, 120 0, 150 35, 120 70, 0 70" fill="skyblue" stroke="#333" stroke-width="1" /></svg></div>').appendTo('#add-image-form');
            close_add_image = $('<div id="close-add-image">X</div>').appendTo('#add-image-form');
            svg_ribbon.css
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

    // EVENT HANDLERS FOR EDITING

    $("#shopping-page-main").on('click',
        '#close-add-image',
        function () 
        {
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
                    $('#blankItem').css('background-size', 'cover');  
                    $('#blankItem').css('background-position', 'center');
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
            var maxHeight = $('#blankItem').height() / 2;
            const barHeight = ($('#blankItem').height() / 100) * 11;
            const parentHeight = $('#blankItem').height();
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
                $('#name-menu').css
                ({
                    'top' : newTopPercentage + '%'
                });
                $('#name-menu')[0].getBoundingClientRect(); 
            }
            else
            {
                $('#name-menu').css('top', initTopPercentage + '%');
            }
        }
    )
    $('#shopping-page-main').on('click',
        '#add-price',
        function () 
        {
            
        }
    )

    // SUBMIT THE NEW ITEM

    $("#shopping-page-main").on('click',
        '#add-item',
        function (event)
        {
            event.preventDefault();
            editing = false;
            text_box_height = name_tag.height();
            text_box_width = name_tag.width();
            text_box_content = name_tag.val();
            text_color = name_tag.css('color');
            background_color = name_tag.css('background-color');
            text_font = name_tag.css('font-family');
            text_size = name_tag.css('font-size').split('p')[0];
            text_box_cat = $('#subcat-name').text();
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
                    alert(data);
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
                'background-size' : 'cover',
                'background-position' : 'center'
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
            toggle_edit_edit = $('<div id="toggle-edit-edit"></div>').appendTo('#blankItemEdit');
            add_name_edit = $('<div id="add-name-edit"></div>').appendTo('#blankItemEdit');
            add_price_edit = $('<div id="add-price-edit"></div>').appendTo('#blankItemEdit');
            add_image_input = $('<div id="add-image-form"><form id="add-image-formId"><label class="add-image" for="imageinput">Select an image:</label><input class="add-image" type="file" name="imageinput" id="image-edit" accept="image/*"></form></div>').appendTo('#blankItemEdit');
            add_image_edit = $('<div id="add-image"></div>').appendTo('#blankItemEdit');
            add_item_edit = $('<div id="add-item-edit" type="submit"></div>').appendTo('#blankItemEdit');
            toggle_edit_edit.css
            ({
                'z-index' : '2',
                'position' : 'absolute',
                'height' : '16%',
                'width' : '16%',
                'right' : '5%',
                'top' : '5%',
                'background-color' : 'gray'
            });
            add_name_edit.css
            ({
                'z-index' : '2',
                'position' : 'absolute',
                'height' : '16%',
                'width' : '16%',
                'right' : '5%',
                'top' : '40%',
                'background-color' : 'red',
                'display' : 'none'
            })
            add_price_edit.css
            ({
                'z-index' : '2',
                'position' : 'absolute',
                'height' : '16%',
                'width' : '16%',
                'right' : '5%',
                'top' : '60%',
                'background-color' : 'pink',
                'display' : 'none'
            })
            add_image_edit.css
            ({
                'z-index' : '2',
                'position' : 'absolute',
                'height' : '16%',
                'width' : '16%',
                'right' : '5%',
                'top' : '20%',
                'background-color' : 'skyblue',
                'display' : 'none'
            })
            add_image_input.css
            ({
                'position' : 'absolute',
                'left' : '5%',
                'top' : '10%',
                'width' : '15rem',
                'height' : '7rem',
                'overflow' : 'visible',
                'display' : 'none'
            })
            $("#add-image-formId").css
            ({
                'position' : 'absolute',
                'top' : '15%'
            });
            add_item_edit.css
            ({
                'z-index' : '2',
                'position' : 'absolute',
                'height' : '16%',
                'width' : '16%',
                'right' : '5%',
                'top' : '80%',
                'background-color' : 'purple',
                'display' : 'none'
            })
            svg_ribbon = $('<div id="svg-div"><svg id="addImage-ribbon" xmlns="http://www.w3.org/2000/svg" height="100%" width="100%" viewBox="0 0 150 70"><polygon points="0 0, 120 0, 150 35, 120 70, 0 70" fill="skyblue" stroke="#333" stroke-width="1" /></svg></div>').appendTo('#add-image-form');
            close_add_image = $('<div id="close-add-image">X</div>').appendTo('#add-image-form');
            svg_ribbon.css
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
                    $('#blankItemEdit').css('background-size', 'cover');  
                    $('#blankItemEdit').css('background-position', 'center');
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
                $('#name-menu-edit')[0].getBoundingClientRect(); 
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
                        'z-index': '1'
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
            text_font = text_box_edit.css('font-family');
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
});