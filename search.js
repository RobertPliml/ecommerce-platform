$(document).ready(function ()
{
    let searchBarOpen = false;
    let searchBarBottomOpen = false;

    function debounce(fn, delay)
    {
        let timeoutId;
        return function (...args)
        {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn.apply(this, args), delay);
        }
    }
    
    function handleSearchInput(e)
    {
        const query = $(e.target).val();
        $.post('search.php', {query}).then(function (data)
        {
            if (searchBarBottomOpen)
            {
                $('#results-footer').html(data);
            }
            else if (searchBarOpen)
            {
                $('#results').html(data);
            }
        }).catch(function (err)
        {
            console.error("Error: ", err);
        });
    }

    $('#navigation').on('click',
        '#search',
        function ()
        {
            if (searchBarOpen === false)
            {
                $('#search-bar').css('display', 'block');
                $('#results').css('display', 'flex');
                $('#paypal-button-container').css('opacity', '0.99');
                searchBarOpen = true;
            }
            else
            {
                $('#search-bar').css('display', 'none');
                $('#results').css('display', 'none');
                $('#paypal-button-container').css('opacity', '1');
                searchBarOpen = false;
            }
        }
    )
    $("#footer-div").on('click',
        '#footer-search',
        function ()
        {
            if (searchBarBottomOpen === false)
            {
                $('#search-bar-footer').css('display', 'block');
                $('#results-footer').css('display', 'flex');
                searchBarBottomOpen = true;
            }
            else
            {
                $('#search-bar-footer').css('display', 'none');
                $('#results-footer').css('display', 'none');
                searchBarBottomOpen = false;
            }
            console.log(searchBarOpen);
        }
    );

    $('#navigation').on('click',
        '.result-item',
        function ()
        {
            let id = $(this).attr('id');

            $.ajax
            ({
                type: 'POST',
                url: 'shop_page_server.php',
                data : 
                {
                    cat_id : id,
                    action : 'findpage'
                },
                cache: false,
                success: function (data)
                {
                    window.location.href = 'shopping_page.php';
                }
            });
        }
    )
    $('#footer-div').on('click',
        '.result-item',
        function ()
        {
            let id = $(this).attr('id');

            $.ajax
            ({
                type: 'POST',
                url: 'shop_page_server.php',
                data : 
                {
                    cat_id : id,
                    action : 'findpage'
                },
                cache: false,
                success: function (data)
                {
                    window.location.href = 'shopping_page.php';
                }
            });
        }
    )

    const debouncedSearch = debounce(handleSearchInput, 300);

    $('#search-bar').on('input', debouncedSearch);
    $('#search-bar-footer').on('input', debouncedSearch);
});