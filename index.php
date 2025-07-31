<?php 
include "header.php"; 
include "navigation.php";
?>
<div id="main">
    <div id="main-button-wrapper">
        <!--<h3 id="main-header-h3">Catch the Moment</h3>
        <h1 id="main-header-h1">Live the Journey</h1>
        <div id="get-started-button">Get Started</div>-->
    </div>
    <div class="carousel" data-flickity='{ "wrapAround": true, "autoPlay": true }'>
        <div id="cell-1" class="carousel-cell"></div>
        <div id="cell-2" class="carousel-cell"></div>
        <div id="cell-3" class="carousel-cell"></div>
    </div>
</div>
<!--<div id="board">
    <div id="board-container">
        <?php /* 
        $query = "SELECT * FROM dreamboard_items";
        $stm = $DB->prepare($query);
        $stm->execute();
        $items = $stm->fetchAll();
        foreach($items as $item)
        {
            $pos_x = htmlspecialchars($item['pos_x'], ENT_QUOTES, 'UTF-8');
            $pos_y = htmlspecialchars($item['pos_y'], ENT_QUOTES, 'UTF-8');
            $width = htmlspecialchars($item['width'], ENT_QUOTES, 'UTF-8');
            $height = htmlspecialchars($item['height'], ENT_QUOTES, 'UTF-8');
            $div_type = $item['div_type'];
            $item_id = $item['item_id'];
            echo"
            <style>

            ";
            if ($_SESSION['editing'] === true && $_SESSION['edit_id'] === $item_id)
            {
                echo"
                #test-div-".$item_id."
                {
                    opacity: 0;
                    position: absolute;
                    height: 10rem;
                    width: 10rem;
                    background-color: white;
                    left: ".$pos_x."px;
                    top: ".$pos_y."px;
                }
                ";
            }
            else if ($_SESSION['editing'] === false)
            {
            echo"
            #test-div-".$item_id."
            {
                opacity: 1;
                position: absolute;
                height: ".$height."rem;
                width: ".$width."rem;
                background-color: white;
                left: ".$pos_x."px;
                top: ".$pos_y."px;
            }
            ";
            }
            echo"

            #edit_".intval($pos_x)."_".intval($pos_y)."_".$item_id."_".$div_type.",
            #edit-finish-".$item_id."
            {
                position: absolute;
                height: 2rem;
                width: 50%;
                left: 25%;
                bottom: -2rem;
                border: solid 1px;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            #edit_".intval($pos_x)."_".intval($pos_y)."_".$item_id."_".$div_type.":hover,
            #edit_".intval($pos_x)."_".intval($pos_y)."_".$item_id."_".$div_type.":focus,
            #edit-finish-".$item_id.":hover,
            #edit-finish-".$item_id.":focus
            {
                cursor: pointer;
            }

            </style>

            <div class='drmbd-div' id='test-div-".$item_id."'>
            ";
            if($_SESSION['isAdmin'] === true && $_SESSION['editing'] === false)
            {
                echo"<div class='edit-create' id='edit_".intval($pos_x)."_".intval($pos_y)."_".$item_id."_".$div_type."'>EDIT</div>";
            }
            echo"
            </div>
            ";
        }
        ?>
    </div>
    <?php
    echo"
    <style>

    #select-wheel
    {
        display: none;
        position: absolute;
        border: solid 2px;
        border-radius: 50%;
        height: 8rem;
        width: 8rem;
    }

    .select-option
    {
        position: absolute;
        border: solid 1px;
        height: 2rem;
        width: 2rem;
    }

    #select-one
    {
        top: -2rem;
        left: 3rem;
    }
    #select-two
    {
        top: 0.5rem;
        left: 8rem;
    }
    #select-three
    {
        top: 5.5rem;
        left: 8rem;
    }
    #select-four
    {
        top: 8rem;
        left: 3rem;
    }
    #select-five
    {
        top: 5.5rem;
        left: -2rem;
    }
    #select-six
    {
        top: 0.5rem;
        left: -2rem;
    }

    #wheel-dot
    {
        position: absolute;
        left: 46%;
        top: 46%;
        height: 4%;
        width: 4%;
        background-color: black;
        border-radius: 50%;
    }

    </style>
    <div id='select-wheel'>
        <div class='select-option' id='select-one'>1</div>
        <div class='select-option' id='select-two'>2</div>
        <div class='select-option' id='select-three'>3</div>
        <div class='select-option' id='select-four'>4</div>
        <div class='select-option' id='select-five'>5</div>
        <div class='select-option' id='select-six'>6</div>
        <div id='wheel-dot'></div>
    </div>
    ";
    */?>
</div>-->
<div id="main-reviews">
    <h1 id="main-reviews-header">Hear from our happy customers...</h1>
    <div id="main-reviews-container-outer">
        <div id="main-reviews-container-inner"></div>
    </div>
    <div id="ribbon">
        <svg id="ribbon-border" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox= "0 0 100 100">
            <polygon points="2 -10, 47 7, 91.5 -10, 91.5 150, 2 150" fill="transparent" stroke="#333" stroke-width="1"/>
        </svg>
        <h1 id="ribbon-header">5 / 5 stars!</h1>
        <p id="ribbon-text">"I recently had a great experience shopping on [company name]'s website. The site is user-friendly, with a wide variety of high-quality fly fishing gear that caters to both beginners and seasoned anglers. Overall, I highly recommend [company name] for anyone looking to gear up for their next fishing adventure."</p>
    </div>
</div>
<div id="socialMedia">
    <h1 id="socialMedia-header">Follow us on instagram<br>@instagramhandle</h1>
    <p id="socialMedia-text">to find out what we've been up to lately,<br> and stay updated on products!</p>
    <div id="socialMedia-imgs-container"></div>
</div>
<?php include "footer.php";?>