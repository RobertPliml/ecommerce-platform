$(document).ready(function () 
{
    var pos_x_centered = 0;
    var pos_y_centered = 0;
    var div_type = '';
    var div_type_ajax = '';
    var pos_x_ajax = 0;
    var pos_y_ajax = 0;
    var lineElement = null;
    var tempDiv = null;
    var translateY = 0;
    var dragBox = false;
    var rem = parseFloat($("html").css("font-size"));
    var width = parseFloat($("#board").css('width'));
    var width_from_edge = (width / 50);
    var creating = false;
    var able_to_edit = false;
    var sizing = false;
    var width_ajax = 0;
    var height_ajax = 0;

    $('#board').on('mouseover',
        '.select-option',
        function ()
        {
            switch ($(this).attr('id').split('-')[1])
            {
                case 'one' :
                    div_type = "div-one";
                    break;
                case 'two' :
                    div_type = "div-two";
                    break;
                case 'three' :
                    div_type = "div-three";
                    break;
                case 'four' :
                    div_type = "div-four";
                    break;
                case 'five' :
                    div_type = "div-five";
                    break;
                case 'six' :
                    div_type = "div-six";
                    break;
            }
        }
    );
    $('#board').on('mouseout',
        '.select-option',
        function ()
        {
            div_type = '';
        }
    );
    $('#board').on('mouseover',
        '.drmbd-div',
        function ()
        {
            able_to_edit = true;
        }
    );
    $('#board').on('mouseout',
        '.drmbd-div',
        function ()
        {
            able_to_edit = false;
        }
    );
    $('#board').on('mousedown',
        '#board-container',
        function (event)
        {
            if (event.button === 0 && creating === false && able_to_edit === false) // only accept left clicks
            {
                var size_in_pix = 8 * rem;
                var parent_offset = $(this).offset();
                var transform = $(this).css('transform');
                if (transform !== 'none')
                {
                    var matrix = transform.match(/^matrix.*\((.+)\)$/);
                    if (matrix)
                    {
                        matrix = matrix[1].split(', ');
                        translateY = parseFloat(matrix[5]);
                    }
                }
                pos_x = event.pageX - parent_offset.left;
                pos_y = (event.pageY - parent_offset.top) + translateY;
                pos_x_centered = pos_x - ((size_in_pix / 2) - width_from_edge);
                pos_y_centered = pos_y - (size_in_pix / 2);
                $("#select-wheel").css
                ({
                    'left' : pos_x_centered + "px",
                    'top' : pos_y_centered + "px",
                    'cursor' : 'pointer',
                    'user-select' : 'none',
                    '-webkit-user-select' : 'none'
                });
                lineElement = $('<div id="tether-line"></div>').appendTo('#board');
                lineElement.css
                ({
                    'position' : 'absolute',
                    'background-color' : 'black',
                    'height' : '.1rem',
                    'transform-origin' : '0 0'
                });
                $("#select-wheel").css("display", "block");
            }
            else if (event.button === 1 || event.button === 2)
            {
                console.log("DO NOTHING AS OF NOW");
            }
        }
    );
    $('#board').on('mousemove',
        function (event)
        {
            var board_offset = $('#board-container').offset();
            var parent_transform = $('#board-container').css('transform');
            if (parent_transform !== 'none')
            {
                var matrix = parent_transform.match(/^matrix.*\((.+)\)$/);
                if (matrix)
                {
                    matrix = matrix[1].split(', ');
                    translateY = parseFloat(matrix[5]);
                }
            }
            var wheelCenterX = pos_x_centered + ($("#select-wheel").width() / 2);
            var wheelCenterY = pos_y_centered + ($("#select-wheel").height() / 2);

            var mouseX = event.pageX;
            var mouseY = (event.pageY - board_offset.top) + translateY;

            // Calculate angle and distance between center of circle and mouse position
            var angle = Math.atan2(mouseY - wheelCenterY, mouseX - wheelCenterX);
            // var angle_in_degrees = angle * (180 / Math.PI);
            var distance = (Math.sqrt(Math.pow(mouseX - wheelCenterX, 2) + Math.pow(mouseY - wheelCenterY, 2))) - 2;

            // Update the line position and rotation
            if ($("#select-wheel").css("display") === "block" && lineElement) 
            {
                lineElement.css
                ({
                    'left': wheelCenterX + 'px',
                    'top': wheelCenterY + 'px',
                    'width': distance + 'px',
                    'transform-origin': '0 50%',
                    'transform': 'rotate(' + angle + 'rad)',
                });
            }
            if (dragBox === true && sizing === false)
            {
                drag_x_centered = mouseX - (($("#temp-div").width() / 2) + (width_from_edge * 1.75));
                drag_y_centered = mouseY - (($("#temp-div").height() / 2) + (width_from_edge * 2));
                $('#temp-div').css
                ({
                    'left' : drag_x_centered,
                    'top' : drag_y_centered
                });
                pos_x_ajax = drag_x_centered;
                pos_y_ajax = drag_y_centered;
            }
            if (sizing === true)
            {
                let box_x = parseFloat($('#temp-div').css('left')) + parseFloat($('#temp-div').width()) + width_from_edge + rem;
                let box_y = parseFloat($('#temp-div').css('top')) + parseFloat($('#temp-div').height()) + translateY + rem;
                var new_width = (mouseX - box_x) + $("#temp-div").width();
                var new_height = (mouseY - box_y) + $("#temp-div").height();
                $("#temp-div").css
                ({
                    'height' : new_height,
                    'width' : new_width
                });
                width_ajax = new_width / rem;
                height_ajax = new_height / rem;
            }
        }
    );
    $('#board').on('mouseup',
        '#select-wheel',
        function ()
        {
            lineElement.remove();
            $("#select-wheel").css("display", "none");
            if (div_type !== '')
            {
                div_type_ajax = div_type;
                creating = true;
                tempDiv = $('<div id="temp-div"><div class="cancel-create">Cancel</div><div class="confirm-create">Create</div></div>').appendTo('#board-container');
                switch(div_type)
                {
                    case 'div-one' :
                        tempDiv.css
                        ({
                            'position' : 'absolute',
                            'left' : pos_x_centered,
                            'top' : pos_y_centered,
                            'height' : '10rem',
                            'width' : '10rem',
                            'border' : 'dotted 4px'
                        });
                        $('.cancel-create').css
                        ({
                            'position' : 'absolute',
                            'height' : '2rem',
                            'width' : '4rem',
                            'bottom' : '-4rem',
                            'left' : '0',
                            'border' : 'solid 1px'
                        });
                        $('.confirm-create').css
                        ({
                            'position' : 'absolute',
                            'height' : '2rem',
                            'width' : '4rem',
                            'bottom' : '-4rem',
                            'right' : '0',
                            'border' : 'solid 1px'
                        });
                        break;
                    case 'div-two' :
                        // code
                        break;
                    case 'div-three' :
                        // code
                        break;
                    case 'div-four' :
                        // code
                        break;
                    case 'div-five' :
                        // code
                        break;
                    case 'div-six' :
                        // code
                        break;
                }
            }
        }
    );
    $('#board').on('mouseup',
        '#board-container',
        function () 
        {
            dragBox = false;
            sizing = false;
            if (lineElement)
            {
                lineElement.remove();
            }
            $("#select-wheel").css("display", "none");
        }
    );
    $('#board').on('mouseover',
        '#temp-div',
        function ()
        {
            $(this).css('cursor', 'pointer');
        }
    );
    $('#board').on('mousedown',
        '#temp-div',
        function ()
        {
            dragBox = true;
        }
    );
    $('#board').on('mouseup',
        '#temp-div',
        function ()
        {
            dragBox = false;
            sizing = false;
        }
    );
    $('#board').on('click',
        '.cancel-create',
        function ()
        {
            tempDiv.remove();
            div_type = '';
            creating = false;
            let scrollTop = $(window).scrollTop();
            $.ajax
            ({
                type: 'POST',
                url: 'dreamboard.php',
                data: 
                {
                    editing : false
                },
                cache: false,
                success : function (data)
                {
                    //alert(data);
                    location.reload();
                    $(window).scrollTop(scrollTop);
                },
                error : function (xhr, status, error)
                {
                    console.error(xhr);
                }
            });
        }
    );
    $('#board').on('click',
        '.confirm-create',
        function ()
        {
            $.ajax
            ({
                type: 'POST',
                url: 'dreamboard.php',
                data:
                {
                    pos_x : pos_x_ajax,
                    pos_y : pos_y_ajax,
                    new_width : width_ajax,
                    new_height : height_ajax,
                    div_type : div_type_ajax
                },
                cache: false,
                success : function (data) 
                {
                    $('#board-container').load(location.href + " #board-container > *");
                },
                error : function (xhr, status, error) 
                {
                    console.error(xhr);
                }
            });
            tempDiv.remove();
            creating = false;
        }
    );
    $('#board').on('click',
        '.edit-create',
        function () 
        {
            let posX = $(this).attr('id').split('_')[1];
            let posY = $(this).attr('id').split('_')[2];
            let itemId = $(this).attr('id').split('_')[3];
            div_type = $(this).attr('id').split('_')[4];
            let scrollTop = $(window).scrollTop();
            $.ajax
            ({
                type: 'POST',
                url: 'dreamboard.php',
                data: 
                {
                    editing : true,
                    itemId : itemId,
                    pos_x : posX,
                    pos_y : posY,
                    div_type : div_type
                },
                cache: false,
                success : function (data)
                {
                    //alert(data);
                    location.reload();
                    $(window).scrollTop(scrollTop);
                },
                error : function (xhr, status, error)
                {
                    console.error(xhr);
                }
            });
        }
    );
    $("#board").on('click',
        '.cancel-edit',
        function ()
        {
            div_type = '';
            creating = false;
            let scrollTop = $(window).scrollTop();
            let itemId = parseInt($(this).attr('id').split('-')[1]);
            console.log(width_ajax + ", " + height_ajax + ", " + itemId);
            $.ajax
            ({
                type: 'POST',
                url: 'dreamboard.php',
                data: 
                {
                    editing : false,
                    itemId : itemId,
                    pos_x : pos_x_ajax,
                    pos_y : pos_y_ajax,
                    new_width : width_ajax,
                    new_height : height_ajax
                },
                cache: false,
                success : function (data)
                {
                    //alert(data);
                    location.reload();
                    $(window).scrollTop(scrollTop);
                },
                error : function (xhr, status, error)
                {
                    console.error(xhr);
                }
            });
        }
    );
    $("#board").on('click',
        '.confirm-delete',
        function ()
        {
            let delete_id = parseInt($(this).attr('id').split('-')[1]);
            console.log(delete_id);
            let scrollTop = $(window).scrollTop();
            $.ajax
            ({
                type: 'POST',
                url: 'dreamboard.php',
                data:
                {
                    editing : false,
                    delete_id : delete_id
                },
                cache: false, 
                success : function (data)
                {
                    //alert(data);
                    location.reload();
                    $(window).scrollTop(scrollTop);
                },
                error : function (xhr, status, error)
                {
                    console.error(xhr);
                }
            });
        }
    );
    $("#board").on('mousedown',
        '.sizing-box',
        function ()
        {
            sizing = true;
        }
    );
    $("#board").on('mouseup',
        '.sizing-box',
        function () 
        {
            dragging = false;
            let scrollTop = $(window).scrollTop();
            /*$.ajax
            ({
                type: 'POST',
                url: 'dreamboard.php',
                data:
                {
                    // 
                },
                cache: false, 
                success : function (data)
                {
                    //alert(data);
                    location.reload();
                    $(window).scrollTop(scrollTop);
                },
                error : function (xhr, status, error)
                {
                    console.error(xhr);
                }
            });*/
        }
    );
    if (edit_mode === true)
    {
        creating = true;
        tempDiv = $('<div id="temp-div"><div id="cancel-' + edit_div_id +'" class="cancel-edit">Done</div><div id="cancel-' + edit_div_id + '" class="confirm-delete">Delete</div><div class="sizing-box"></div></div>').appendTo('#board-container');
        switch(edit_div_type)
        {
            case 'div-one' :
                tempDiv.css
                ({
                    'position' : 'absolute',
                    'left' : edit_pos_x + 'px',
                    'top' : edit_pos_y + 'px',
                    'height' : '10rem',
                    'width' : '10rem',
                    'border' : 'dotted 4px'
                });
                $('.cancel-edit').css
                ({
                    'position' : 'absolute',
                    'height' : '2rem',
                    'width' : '4rem',
                    'bottom' : '-4rem',
                    'left' : '0',
                    'border' : 'solid 1px'
                });
                $('.confirm-delete').css
                ({
                    'position' : 'absolute',
                    'height' : '2rem',
                    'width' : '4rem',
                    'bottom' : '-4rem',
                    'right' : '0',
                    'border' : 'solid 1px'
                });
                $('.sizing-box').css
                ({
                    'position' : 'absolute',
                    'height' : '2rem',
                    'width' :  '2rem',
                    'bottom' : '-1rem',
                    'right' : '-1rem',
                    'border' : 'solid 1px'
                });
                break;
            case 'div-two' :
                // code
                break;
            case 'div-three' :
                // code
                break;
            case 'div-four' :
                // code
                break;
            case 'div-five' :
                // code
                break;
            case 'div-six' :
                // code
                break;
        }
    }
});