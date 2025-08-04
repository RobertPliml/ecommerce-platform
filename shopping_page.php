<?php
session_start();
include "header.php";
include "navigation.php";
include "dbconnect.php";
include "shopping_cart.php";
?>
<div id='shopping-page-main'>
<?php
$id = $_SESSION['page_search_id'];
$grand_cat = $_SESSION['grand_cat'];
if ($grand_cat === false)
{
    $stm = $DB->prepare("SELECT * FROM subcats WHERE subcat_id = :subcat_id LIMIT 1");
    $stm->execute([':subcat_id' => $id]);
    $subcat = $stm->fetch();
    $header_name = $subcat['subcat_name'];
}
else if ($grand_cat === true)
{
    $stm = $DB->prepare("SELECT * FROM cats WHERE id = :subcat_id");
    $stm->execute([':subcat_id' => $id]);
    $subcat = $stm->fetch();
    $header_name = $subcat['cat_name'];
}
echo "
    <style>
    #subcat-name
    {
        position: relative;
        text-align: center;
        font-family: 'font_3';
        width: 100%;
    }
    #sidebar-list-container
    {
        position: relative;
        height: 75%;
        width: 18%;
        border: solid 1px;
        overflow-y: auto;
        background-color: white;
        left: 2%;
    }
    
    .sidebar-cats
    {
        position: relative;
        font-family: 'font_3';
        font-size: 2rem;
        padding-top: 1rem;
        padding-bottom: 1rem;
        padding-left: .25rem;
        border: solid .5px;
    }

    .sidebar-subcats
    {
        position: relative;
        font-family: 'font_3';
        font-size: 1rem;
        padding-top: 1rem;
        padding-bottom: 1rem;
        padding-left: 2.25rem;
        border: solid .5px;
    }

    .sidebar-cats:hover,
    .sidebar-cats:focus,
    .sidebar-subcats:hover,
    .sidebar-subcats:focus
    {
        cursor: pointer;
        background-color: rgb(225, 225, 225);
    }

    </style>
    <h1 id='subcat-name'>".$header_name."</h1>
<div id='sidebar-list-container'>
";
$query = "SELECT * FROM cats";
$stm = $DB->prepare($query);
$stm->execute();
$cats = $stm->fetchAll();
foreach ($cats as $cat)
{
    $cat_name = htmlspecialchars($cat['cat_name'], ENT_QUOTES, 'UTF-8');
    $grand_cat_id = $cat['id'];
    echo "<div class='sidebar-cats' id='".$grand_cat_id."'>".$cat_name."</div>";
    $query = "SELECT * FROM subcats WHERE cat_name = :cat_name";
    $stm = $DB->prepare($query);
    $stm->bindParam(':cat_name', $cat_name, PDO::PARAM_STR);
    $stm->execute();
    $subcats = $stm->fetchAll();
    foreach ($subcats as $subcat)
    {
        $subcat_name = htmlspecialchars($subcat['subcat_name'], ENT_QUOTES, 'UTF-8');
        $cat_id = htmlspecialchars($subcat['subcat_id'], ENT_QUOTES, 'UTF-8');
        echo "<div class='sidebar-subcats' id='".$cat_id."'>".$subcat_name."</div>";
    }
}
echo"    
</div>
<style>
    #shopping-items-container
    {
        position: relative;
        height: 75%;
        width: 78%;
        border: solid 1px;
        overflow-y: auto;
        display: flex;
        flex-wrap: wrap;
        padding: 1.25rem;
        gap: 1.25rem;
        left: 2%;
    }

    @media(max-width: 600px)
    {
        #sidebar-list-container
        {
            display: none;
        }
        #shopping-items-container
        {
            width: 95%;
            height: 90%;
        }
    }

    #blank-item
    {
        position: relative;
        border: dotted 4px;
        height: 19rem;
        width: 19rem;
    }

    #add-item-button
    {
        position: absolute;
        height: 10%;
        width: 10%;
        left: 45%;
        top: 45%;
        background-image: url('images/add.jpeg');
        background-size: cover;
        border-radius: 50%;
    }

    #add-item-button:hover,
    #add-item-button:focus
    {
        cursor: pointer;
        border: solid 1px;
    }   
</style>
<div id='shopping-items-container'>
    ";
    if ($grand_cat === false)
    {
        $stm = $DB->prepare("SELECT * FROM items WHERE text_box_cat = :header_name");
    }
    else if ($grand_cat === true)
    {
        $stm = $DB->prepare("SELECT * FROM items WHERE text_box_grandCat = :header_name");
    }
    $stm->execute([':header_name' => $header_name]);
    $items = $stm->fetchAll();
    foreach ($items as $item) 
    {
        $item_id = htmlspecialchars($item['item_id'], ENT_QUOTES, 'UTF-8');
        $item_img_url = htmlspecialchars($item['item_image_url'], ENT_QUOTES, 'UTF-8');
        $text_box_height = $item['text_box_height'];
        $text_box_width = $item['text_box_width'];
        $text_box_content = $item['text_box_content'];
        $text_color = $item['text_color'];
        $background_color = $item['background_color'];
        $text_font = $item['text_font'];
        $text_size = $item['text_size'];
        $height_in_rem = $text_box_height !== null ? $text_box_height / 16 : null;
        $width_in_rem = $text_box_width !== null ? $text_box_width / 16 : null;
        $text_size_in_rem = $text_size !== null ? $text_size / 16 : null;
        $background_size_x = $item['background_size_x'];
        $background_size_y = $item['background_size_y'];
        $background_pos = $item['background_pos'];
        echo "
        <style>
        #item-".$item_id."
        {
            position: relative;
            height: 19rem;
            width: 19rem;
            background-image: url('".$item_img_url."');
            background-size: ".$background_size_x."% ".$background_size_y."%;
            background-position: ".$background_pos.";
            box-shadow: 8px 2px 10px gray;
        }
        ";
        if ($text_box_content !== null)
        {
            echo"
            #textbox-".$item_id."
            {
                position: absolute;
                bottom: 0;
                resize: none;
                text-align: center;
                ";
                if ($text_box_height !== null)
                {
                    echo" height: ".$height_in_rem."rem;";
                }
                if ($text_box_width !== null)
                {
                    echo "width: ".$width_in_rem."rem;";
                }
                echo"
                border: none;
                ";
                if ($text_color !== null)
                {
                    echo "color: ".$text_color.";";
                }
                if ($background_color !== null)
                {
                    echo "background-color: ".$background_color.";";
                }
                if ($text_size !== null)
                {
                    echo "font-size: ".$text_size_in_rem."rem;";
                }
                if ($text_font !== null)
                {
                    echo "font-family: '".$text_font."';";
                }
                echo"
            }";
        }
        echo"
        </style>
        <div class='item-div' id='item-".$item_id."'>
        ";
        if ($text_box_content !== null)
        {
            echo"<textarea id='textbox-".$item_id."' readonly>".$text_box_content."</textarea>";
        }
        echo"
        </div>
        ";
    }
    if ($_SESSION['isAdmin'] == true)
    {
    echo"
    <div id='blank-item'>
        <div class='new-item-button' id='add-item-button'></div>
    </div>
    "; 
    }
    echo"
</div>
";
?>
<!--<div id="debug-log" style="position:fixed;bottom:0;left:0;right:0;background:#111;color:#0f0;padding:8px;font-size:12px;z-index:9999;font-family:monospace;white-space:pre;"></div>-->
</div>
<?php include "footer.php"; ?>