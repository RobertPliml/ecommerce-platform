$(document).ready(function ()
{
    let searchBarOpen = false;

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
            $('#results').html(data);
            $('#results-footer').html(data);
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
                searchBarOpen = true;
            }
            else
            {
                $('#search-bar').css('display', 'none');
                $('#results').css('display', 'none');
                searchBarOpen = false;
            }
        }
    )
    $("#footer-div").on('click',
        '#footer-search',
        function ()
        {
            if (searchBarOpen === false)
            {
                $('#search-bar-footer').css('display', 'block');
                $('#results-footer').css('display', 'flex');
                searchBarOpen = true;
            }
            else
            {
                $('#search-bar-footer').css('display', 'none');
                $('#results-footer').css('display', 'none');
                searchBarOpen = false;
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
                success: function ()
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