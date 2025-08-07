<div id="navigation">
        <?php
        // CSP protection before going to production
        /*$nonce = base64_encode(random_bytes(16));
        $_SESSION['nonce'] = $nonce;
        header("Content-Security-Policy: script-src 'self' 'nonce-$nonce';");*/
        session_set_cookie_params([
            'lifetime' => 0, // session cookie expires when the browser closes
            'path' => '/',
            'domain' => '', // specify your domain if needed
            'secure' => false, // ensure the cookie is sent over HTTPS
            'httponly' => true, // prevent JS from accessing the cookie
        ]);

        session_start();
        include "dbconnect.php";

        // Session variable declaration
        if (!isset($_SESSION['isAdmin']))
        {
            $_SESSION['isAdmin'] = false;
        }

        if (!isset($_SESSION['show_login_container']))
        {
            $_SESSION['show_login_container'] = false;
        }

        if (!isset($_SESSION['grand_cat']))
        {
            $_SESSION['grand_cat'] = false;
        }

        if (!isset($_SESSION['csrf_token']))
        {
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        }

        if (!isset($_SESSION['editMenuBar']))
        {
            $_SESSION['editMenuBar'] = false;
        }

        if (!isset($_SESSION['editing']))
        {
            $_SESSION['editing'] = false;
        }
        //$_SESSION['editing'] = false;

        if (!isset($_SESSION['edit_id']))
        {
            $_SESSION['edit_id'] = 0;
        }

        if (!isset($_SESSION['edit_pos_x']))
        {
            $_SESSION['edit_pos_x'] = 0;
        }

        if (!isset($_SESSION['edit_pos_y']))
        {
            $_SESSION['edit_pos_y'] = 0;
        }

        if (!isset($_SESSION['edit_div_type']))
        {
            $_SESSION['edit_div_type'] = '';
        }

        if (!isset($_SESSION['edit_div_id']))
        {
            $_SESSION['edit_div_id'] = 0;
        }

        if (!isset($_SESSION['page_search_id']))
        {
            $_SESSION['page_search_id'] = 0;
        }

        if (!isset($_SESSION['admin_tool']))
        {
            $_SESSION['admin_tool'] = "stock";
        }

        ?>
        <script>
            const csrf_token = <?= json_encode($_SESSION['csrf_token']); ?>;
            var edit_mode = <?= json_encode($_SESSION['editing']); ?>;
            var edit_pos_x = <?= json_encode($_SESSION['edit_pos_x']); ?>;
            var edit_pos_y = <?= json_encode($_SESSION['edit_pos_y']); ?>;
            var edit_div_type = <?= json_encode($_SESSION['edit_div_type']); ?>;
            var edit_div_id = <?= json_encode($_SESSION['edit_div_id']); ?>;
            var page_search_id = <?= json_encode($_SESSION['page_search_id']); ?>;
        </script>
        <div id="top">
        <script id="checkMenuBarEdit">
            var checkEditMenuBar = <?= json_encode($_SESSION['editMenuBar']); ?>;
        </script>
        <?php
        $query = "SELECT * FROM cats";
        $stm = $DB->prepare($query);
        $stm->execute();
        $cats = $stm->fetchAll();
        $subcat_id_array = [];
        $cat_id_array = [];

        echo "

            <style>
                .listItems
                {
                    list-style: none; 
                    color: white;
                    display: inline-block;
                    padding-left: 4%;
                    padding-right: 4%; 
                    margin-left: 0;
                    margin-right: 0;
                    font-size: x-large;
                    font-family: 'font_3_bold';
                    font-weight: bold;
                    position: relative;
                    text-wrap: nowrap;
                }

                .listItems:hover,
                .listItems:focus
                {
                    cursor: pointer;
                    color: black;
                    background-color: #E8F5E9;
                }

                #header-options
                {
                    position: relative;
                    width: 75%;
                    max-width: 75%;
                    z-index: 3;
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                    justify-content: space-around;
                    ";
                    if ($_SESSION['editMenuBar'] === false)
                    {
                        echo "border: solid 1px transparent;";
                    }
                    else if ($_SESSION['editMenuBar'] === true)
                    {
                        echo "border: solid 1px red;";
                    }
                echo"
                }

                .logo
                {
                    max-width: 20%;
                }

                #site-logo
                {
                    position: relative;
                    height: 5rem;
                    width: 5rem;
                    background-image: url('uploads/logo.jpeg');
                    background-size: cover;
                    border: solid 4px;
                    border-radius: 90%;
                }

                .logo:hover,
                .logo:focus
                {
                    cursor: pointer;
                }

                .alt-header
                {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-around;
                    flex-wrap: wrap;
                    max-height: 100%;
                    max-width: 15%;
                }

                #search
                {
                    position: relative;
                    height: 2.5rem;
                    width: 2.5rem;
                    background-image: url('images/searchIcon.png');
                    background-size: cover;
                }

                #cart
                {
                    position: relative;
                    height: 2.5rem;
                    width: 2.5rem;
                    background-image: url('images/cart.png');
                    background-size: cover;
                }

                #search:hover,
                #cart:hover
                {
                    cursor: pointer;
                }

                @media(max-width: 600px)
                {
                    #header-options
                    {
                        justify-content: flex-start;
                    }
                }

            </style>
            <div class='logo'>
                <div id='site-logo'></div>
            </div>
            <ul id='header-options'>
            ";
            $counter = 0;
            foreach ($cats as $cat)
            {
                $counter_2 = 0;
                $catName = htmlspecialchars($cat['cat_name'], ENT_QUOTES, 'UTF-8');
                $catId = htmlspecialchars($cat['id'], ENT_QUOTES, 'UTF-8');
                $cat_id_array[0][] = $catId;
                $cat_id_array[1][] = $catName;
                echo"
                <style>

                #add-cat-button
                {
                    position: relative;
                    height: 1.5rem;
                    width: 1.5rem;
                    top: 5%;
                    background-image: url('images/add.jpeg');
                    background-size: cover;
                    border: solid transparent 1px;
                    border-radius: 50%;
                    display: inline-block;
                }

                #add-cat-button:hover,
                #add-cat-button:focus
                {
                    cursor: pointer;
                    border: solid yellow 1px;
                }

                .dropdown,
                .sub-dropdown
                {
                    z-index: 9999;
                    text-wrap: nowrap;
                    background-color: white;
                    padding: .5rem;
                }

                #dropdown-".$counter."
                {
                    display: none;
                    background-color: #E8F5E9;
                    ";
                    if ($catName === 'Shop All')
                    {
                        echo"
                        position: fixed;
                        width: 100%;
                        height: 36.75rem;
                        left: 0;
                        ";
                    }
                    else
                    {
                        echo"
                        position: absolute;
                        left: 0;
                        ";
                    }
                    echo"
                }

                .subcat-text
                {
                    text-decoration: none;
                    font-family: 'font_3', 'sans-serif';
                    color: black;
                }

                .subcatText,
                .subcatText-edit,
                .subcatText-shopAll,
                .edit-cat-buttons
                {
                    position: relative;
                    top: 0;
                    left: 0;
                    margin-top: 0;
                    margin-bottom: 0;
                }

                .subcatText:hover,
                .subcatText:focus,
                .subcatText-edit:hover,
                .subcatText-edit:focus,
                .subcatText-shopAll:hover,
                .subcatText-shopAll:focus
                {
                    background-color: #9FE2BF;
                }

                .shop-all-col
                {
                    border: solid black 1px;
                    flex: 1;
                }

                .shop-all-header
                {
                    font-size: large;
                }

                .edit-button
                {
                    border-radius: 0 0 10px 10px;
                    border: solid transparent 1px;
                    font-family: 'font_2';
                }

                .edit-button:hover,
                .edit-button:focus
                {
                    cursor: pointer;
                }

                #menu-bar-edit
                {
                    position: absolute;
                    left: 48%;
                    color: yellow;
                    bottom: -1.5rem;
                    height: 1.5rem;
                    width: 3rem;
                    ";
                    if ($_SESSION['editMenuBar'] === false)
                    {
                        echo "border: solid 1px transparent;";
                    }
                    else if ($_SESSION['editMenuBar'] === true)
                    {
                        echo "border: solid 1px red;";
                    }
                echo"
                }

                .subcat-edit-remove
                {
                    position: absolute;
                    width: 50%;
                    left: 0;
                    top: 0;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-right: solid 1px;
                }
                    
                .subcat-edit-edit
                {
                    position: absolute;
                    width: 50%;
                    left: 50%;
                    top: 0;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-left: solid 1px;
                }

                .edit-cat-rename
                {
                    position: absolute;
                    width: 50%;
                    left: 50%;
                    top: 0;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-left: solid 1px;
                }

                .edit-cat-remove
                {
                    position: absolute;
                    width: 50%;
                    left: 0;
                    top: 0;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-right: solid 1px;
                }

                #add-item-".$catId."
                {
                    border: solid 1px;
                    min-width: 16rem;
                    height: 5rem;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 3rem;
                }

                #cat-edit-".$counter."
                {
                    position: relative;
                    left: 0;
                    border: solid black 1px;
                    min-width: 16rem;
                    height: 3rem;
                }

                @keyframes shimmer-animation
                {
                    0% 
                    {
                        background-position: -200% 0;
                    }
                    100% 
                    {
                        background-position: 200% 0;
                    }
                }

                #edit-cat-".$catId.":hover,
                #edit-cat-".$catId.":focus
                {
                    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                    background-size: 200% 100%;
                    animation: shimmer-animation 2s infinite;
                }

                #add-item-".$catId.":hover,
                #add-item-".$catId.":focus
                {
                    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                    background-size: 200% 100%;
                    animation: shimmer-animation 2s infinite;
                }

                #delete-cat-".$catId.":hover,
                #delete-cat-".$catId.":focus
                {
                    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                    background-size: 200% 100%;
                    animation: shimmer-animation 2s infinite;
                }

                .subcat-edit-remove:hover,
                .subcat-edit-remove:focus
                {
                    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                    background-size: 200% 100%;
                    animation: shimmer-animation 2s infinite;
                }

                .subcat-edit-edit:hover,
                .subcat-edit-edit:focus
                {
                    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                    background-size: 200% 100%;
                    animation: shimmer-animation 2s infinite;
                }

                .menubar-modal
                {
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    height: 40rem;
                    width: 100%;
                    background: rgba(0, 0, 0, 0.75);
                    z-index: 5;
                }

                .close-modal-button
                {
                    display: none;
                    position: fixed;
                    top: 1rem;
                    left: 2rem;
                    color: white;
                    font-size: 40px;
                    z-index: 6;
                }

                .close-modal-button:hover,
                .close-modal-button:focus
                {
                    cursor: pointer;
                }

                .header-modal,
                .header-modal-remove-item,
                .header-modal-rename-item,
                .header-modal-add-subcat,
                .header-modal-remove-subcat,
                .header-modal-edit-subcat
                {
                    display: none;
                    z-index: 6;
                    position: fixed;
                    width: 60%;
                    left: 20%;
                    top: 8rem;
                    min-height: 10rem;
                    background-color: rgb(225, 225, 225);
                    font-family: 'font_3', 'sans-serif';
                }

                .header-item-input
                {
                    position: relative;
                    width: 90%;
                    top: 1rem;
                    height: 4rem;
                    font-size: 25px;
                    text-align: center;
                }

                .modal-header-h1
                {
                    position: relative;
                    text-align: center;
                    top: 1rem;
                }

                .header-item-input-edit
                {
                    position: relative;
                    width: 90%;
                    height: 4rem;
                    font-size: 25px;
                    text-align: center;
                }

                .modal-header-h1-edit
                {
                    position: relative;
                    text-align: center;
                }

                .modal-header-h2-edit
                {
                    position: relative;
                    text-align: center;
                }

                .left-modal-button-cats,
                .left-modal-button-subcats
                {
                    position: absolute;
                    left: 32.5%;
                    height: 20%;
                    width: 15%;
                    bottom: 25%;
                    border: solid 1px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .right-modal-button
                {
                    position: absolute;
                    right: 32.5%;
                    height: 20%;
                    width: 15%;
                    bottom: 25%;
                    border: solid 1px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .left-modal-button-cats:hover,
                .left-modal-button-cats:focus,
                .left-modal-button-subcats:hover,
                .left-modal-button-subcats:focus,
                .right-modal-button:hover,
                .right-modal-button:focus
                {
                    cursor: pointer;
                    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                    background-size: 200% 100%;
                    animation: shimmer-animation 2s infinite;
                }

                .check-box-shopall
                {
                    position: absolute;
                    bottom: 29%;
                    left: 70%;
                    height: 5rem;
                    width: 5rem;
                }

                .modal-header-h2
                {
                    position: absolute;
                    bottom: 35%;
                    left: 30%;
                }

                .enter-button
                {
                    position: relative;
                    width: 30%;
                    height: 3rem;
                    left: 35%;
                    margin-top: 2rem;
                    margin-bottom: 2rem;
                    border: solid 1px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .enter-button:focus,
                .enter-button:hover
                {
                    cursor: pointer;
                    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                    background-size: 200% 100%;
                    animation: shimmer-animation 2s infinite;
                }

                </style>
                <li class='listItems' id='listItem-".$counter."-".$catName."'><div id='".$counter."-".$catId."-".$catName."' class='header-wrapper'>".$catName."</div>
                    <div class='dropdown' id='dropdown-".$counter."'>
                        ";
                        $query = "SELECT * FROM subcats WHERE cat_name = :cat_name";
                        $stm = $DB->prepare($query);
                        $stm->bindParam(':cat_name', $catName, PDO::PARAM_STR);
                        $stm->execute();
                        $subcats = $stm->fetchAll();
                        if ($catName != 'Shop All' && $_SESSION['editMenuBar'] === true)
                        {
                            echo"
                            <div class='edit-cat-buttons' id='cat-edit-".$counter."'>
                                <div class='edit-cat-rename' id='edit-cat-".$catId."'>Rename</div>
                                <div class='edit-cat-remove' id='delete-cat-".$catId."'>Remove</div>
                            </div>
                            ";
                        }
                        foreach($subcats as $subcat) 
                        {
                            $subcat_name = htmlspecialchars($subcat['subcat_name'], ENT_QUOTES, 'UTF-8');
                            $subcat_url = htmlspecialchars($subcat['subcat_url'], ENT_QUOTES, "UTF-8");
                            $subcat_id = htmlspecialchars($subcat['subcat_id'], ENT_QUOTES, "UTF-8");
                            $subcat_id_array[0][] = $subcat_id;
                            $subcat_id_array[1][] = $subcat_name;
                            echo"
                            <style>
                                #subcat-dropdown-".$subcat_id."
                                {
                                    display: none;
                                    position: relative;
                                    left: 0;
                                    border: solid black 1px;
                                    min-width: 16rem;
                                    height: 2rem;
                                }
                            </style>
                            ";
                            if ($catName === 'Shop All')
                            {
                                echo "
                                <div class='shop-all-col'>
                                    <h1 class='shop-all-header'>".$subcat_name."</h1>
                                    ";
                                    $query = "SELECT * FROM subcats WHERE cat_name = :cat_name";
                                    $stm = $DB->prepare($query);
                                    $stm->bindParam(':cat_name', $subcat_name, PDO::PARAM_STR);
                                    $stm->execute();
                                    $sub_subcats = $stm->fetchAll();
                                    foreach($sub_subcats as $sub_subcat)
                                    {
                                        $sub_subcat_name = htmlspecialchars($sub_subcat['subcat_name'], ENT_QUOTES, 'UTF-8');
                                        $sub_subcat_url = htmlspecialchars($sub_subcat['subcat_url'], ENT_QUOTES, "UTF-8");
                                        $sub_subcat_id = htmlspecialchars($sub_subcat['subcat_id'], ENT_QUOTES, 'UTF-8');
                                        echo "<p id='".$sub_subcat_id."' class='subcatText-shopAll'><a class='subcat-text' href='".$sub_subcat_url."'>".$sub_subcat_name."</a></p>";
                                    }
                                    echo"
                                </div>
                                ";
                            }
                            else
                            {
                                if ($_SESSION['editMenuBar'] === false)
                                {
                                    echo "<p class='subcatText'><a class='subcat-text' id='subcat-id-".$subcat_id."'>".$subcat_name."</a></p>";
                                }
                                else if ($_SESSION['editMenuBar'] === true && $_SESSION['isAdmin'] === true)
                                {
                                    echo "
                                    <div class='subcatText-edit' id='subcat-".$subcat_id."'>".$subcat_name."
                                        <div class='sub-dropdown' id='subcat-dropdown-".$subcat_id."'>
                                            <div class='subcat-edit-remove' id='remove-".$subcat_id."'>Remove</div>
                                            <div class='subcat-edit-edit' id='edit-".$subcat_id."'>Edit</div>
                                        </div>
                                    </div>
                                    ";
                                }
                            }
                            $counter_2++;
                        }
                        if ($catName != 'Shop All' && $_SESSION['editMenuBar'] === true)
                        {
                            echo"<div class='add-subcat-item' id='add-item-".$catId."'>+</div>";
                        }
                    echo"</div>";
                    echo"
                </li>
                ";
                if ($_SESSION['isAdmin'] === true)
                {
                    if ($_SESSION['editMenuBar'] === true)
                    {
                        // MODALS ONLY ACCESSIBLE UNDER ADMIN EDIT
                        for ($i = 0; $i < count($subcat_id_array[0]); $i++)
                        {
                            $subcat_id_copy = $subcat_id_array[0][$i];
                            $subcat_name_copy = $subcat_id_array[1][$i];
                            echo 
                            "<div class='header-modal-remove-subcat' id='modal-remove-".$subcat_id_copy."'>
                                <h1 class='modal-header-h1'>Remove Sub-category</h1>
                                <div class='left-modal-button-subcats' id='removeSubcats-".$subcat_id_copy."'>Yes</div>
                                <div class='right-modal-button'>No</div>
                            </div>
                            <div class='header-modal-edit-subcat' id='modal-edit-".$subcat_id_copy."'>
                                <h1 class='modal-header-h1-edit'>Edit Sub-category</h1>
                                <h2 class='modal-header-h2-edit'>Rename</h2>
                                <input class='header-item-input-edit' id='subcat-input-".$subcat_id_copy."' type='text' placeholder='ex: butts' required>
                                <h2 class='modal-header-h2-edit'>Change Url</h2>
                                <input class='header-item-input-edit' id='url-input-".$subcat_id_copy."' type='text' placeholder='ex: butts' required>
                                <div class='enter-button' id='editSubcat-".$subcat_name_copy."-".$subcat_id_copy."'>ENTER</div>
                            </div>"
                            ;
                        }
                    }
                }
                $counter++;
            }
            if ($_SESSION['isAdmin'] === true)
            {
                echo "<div class='edit-button' id='menu-bar-edit'>EDIT</div>";
                if ($_SESSION['editMenuBar'] === true)
                {
                    for ($a = 0; $a < count($cat_id_array[0]); $a++)
                    {
                        $catId_copy = $cat_id_array[0][$a];
                        $catName_copy = $cat_id_array[1][$a];
                        echo "
                            <div class='header-modal-remove-item' id='remove-item-modal-".$catId_copy."'>
                                <h1 class='modal-header-h1'>Are you sure?</h1>
                                <div class='left-modal-button-cats' id='remove-".$catName_copy."-".$catId_copy."'>Yes</div>
                                <div class='right-modal-button'>No</div>
                            </div>
                            <div class='header-modal-rename-item' id='rename-item-modal-".$catId_copy."'>
                                <h1 class='modal-header-h1'>Rename Menu Item</h1>
                                <input class='header-item-input' id='new-cat-name-".$catId_copy."' type='text' placeholder='ex: butts' required>
                                <div class='enter-button' id='renameCat-".$catId_copy."'>ENTER</div>
                            </div>
                            <div class='header-modal-add-subcat' id='modal-add-subcat-".$catId_copy."'>
                                <h1 class='modal-header-h1'>Add Sub-category</h1>
                                <input class='header-item-input' id='subcat-name-input-".$catId_copy."' type='text' placeholder='ex: butts' required>
                                <div class='enter-button' id='addsubcat-".$catName_copy."-".$catId_copy."'>ENTER</div>
                            </div>
                        ";
                    }
                    echo "
                    <div class='add-cat' id='add-cat-button'></div>
                    <div class='menubar-modal'></div>
                    <span class='close-modal-button'>&times</span>
                    <div class='header-modal' id='add-item-modal'>
                        <h1 class='modal-header-h1'>Add Menu Item</h1>
                        <input class='header-item-input' id='new-cat-input' type='text' placeholder='ex: butts' required>
                        <h2 class='modal-header-h2'>Add to Shop All menu?</h2>
                        <input type='checkbox' class='check-box-shopall' id='add-to-shopall'>
                        <br>
                        <br>
                        <br>
                        <br>
                        <div class='enter-button' id='addnewcat-enter'>ENTER</div>
                    </div>";
                }
            }
            echo"
        </ul>
        <div class='alt-header'>
            <div id='search'></div>
            <div id='cart'></div>
            ";
            $userIp = $_SERVER['REMOTE_ADDR'];
            // IPV4 (127.0.0.1) or (10.0.0.144) is optional, but 
            // IPV6 (::1) is required.
            $allowedIps = ['::1', '127.0.0.1', '10.0.0.144'];
            if (in_array($userIp, $allowedIps))
            {
                echo "
                <div class='meta-control'></div>
                <div class='header-meta'>
                    <form>
                        ";
                        if ($_SESSION['isAdmin'] === false)
                        {
                            echo "
                            <input id='username' type='text' placeholder='Username' required>
                            <input id='password' type='password' placeholder='Password' required>
                            <div class='submit-login'>Login</div>
                            ";
                        }
                        else if ($_SESSION['isAdmin'] === true)
                        {
                            echo "
                            <div class='submit-logout'>Logout</div>
                            ";
                        }
                        echo"
                    </form>
                </div>";
            }echo"
        </div>
        <style>

        .header-meta
        {
            z-index: 100;
            position: absolute;
            top: 10rem;
            left: 2rem;
            height: 6rem;
            width: 12rem;
            background-color: white;
            border: solid 1px;
            ";
            if ($_SESSION['show_login_container'] === true)
            {
                echo "display: block";
            }
            else if ($_SESSION['show_login_container'] === false)
            {
                echo "display: none";
            }
            echo"
        }

        #username, 
        #password
        {
            position: relative;
            width: 98%;
            left: 1%;
            margin-top: 1%;
            margin-bottom: 1%;
            font-family: 'haveltica', 'monospace';
        }

        .submit-login
        {
            position: relative;
            left: 35%;
            width: 30%;
            display: flex;
            justify-content: center;
            border: 1px dotted;
            border-radius: 5px;
            bottom: .05rem;
            font-family: 'haveltica', 'monospace';
        }

        .submit-logout
        {
            position: relative;
            left: 35%;
            width: 30%;
            top: 4rem;
            display: flex;
            justify-content: center;
            border: 1px dotted;
            border-radius: 5px;
            font-family: 'haveltica', 'monospace';
        }

        .submit-login:hover,
        .submit-login:focus
        {
            cursor: pointer;
            border: 1px solid;
        }

        .submit-logout:hover,
        .submit-logout:focus
        {
            cursor: pointer;
            border: 1px solid;
        }
            
        .meta-control
        {
            z-index: 150;
            position: relative;
            height: 2rem;
            width: 2rem;
            border: 1px solid;
            border-radius: 50%;
            background-color: white;
        }

        .meta-control:hover,
        .meta-control:focus
        {
            color: yellow;
        }

        </style>
        <br>
        ";?>
        </div>
        <?php
        if($_SESSION['isAdmin'] === true) : ?>
            <div id="isAdmin-container">
                <p id="isAdmin">ADMIN</p>
            </div>
        <?php endif; 
        //var_dump($_SESSION);?>
</div>