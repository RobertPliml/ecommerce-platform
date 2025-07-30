<?php
session_start();
session_regenerate_id(true);
include 'dbconnect.php';
$csrf_token = filter_input(INPUT_POST, 'csrf_token', FILTER_SANITIZE_SPECIAL_CHARS);
$item_name = filter_input(INPUT_POST, 'item_name', FILTER_SANITIZE_SPECIAL_CHARS);
$item_price = filter_input(INPUT_POST, 'item_price', FILTER_SANITIZE_SPECIAL_CHARS);
$item_quantity = filter_input(INPUT_POST, 'item_quantity', FILTER_SANITIZE_SPECIAL_CHARS);
$text_box_height = filter_input(INPUT_POST, 'text_box_height', FILTER_VALIDATE_INT);
$text_box_width = filter_input(INPUT_POST, 'text_box_width', FILTER_VALIDATE_INT);
$text_box_content = filter_input(INPUT_POST, 'text_box_content', FILTER_SANITIZE_SPECIAL_CHARS);
$text_color = filter_input(INPUT_POST, 'text_color', FILTER_SANITIZE_SPECIAL_CHARS);
$background_color = filter_input(INPUT_POST, 'background_color', FILTER_SANITIZE_SPECIAL_CHARS);
$background_size_x = filter_input(INPUT_POST, 'background_size_x', FILTER_SANITIZE_SPECIAL_CHARS);
$background_size_y = filter_input(INPUT_POST, 'background_size_y', FILTER_SANITIZE_SPECIAL_CHARS);
$background_pos = filter_input(INPUT_POST, 'background_pos', FILTER_SANITIZE_SPECIAL_CHARS);
$text_font = filter_input(INPUT_POST, 'text_font', FILTER_SANITIZE_SPECIAL_CHARS);
$text_size = filter_input(INPUT_POST, 'text_size', FILTER_SANITIZE_SPECIAL_CHARS);
$edit_sub = filter_input(INPUT_POST, 'edit_sub', FILTER_VALIDATE_BOOLEAN);
$item_id = filter_input(INPUT_POST, 'edit_id', FILTER_VALIDATE_INT);
$file_des = $_POST['file'];
$text_box_cat = filter_input(INPUT_POST, 'text_box_cat', FILTER_SANITIZE_SPECIAL_CHARS);
if ($csrf_token && $csrf_token === $_SESSION['csrf_token'])
{
    if ($edit_sub)
    {
        if (isset($_FILES['file']))
        {
            $file = $_FILES['file'];
            $fileName = $file['name'];
            $fileTmpName = $file['tmp_name'];
            $fileSize = $file['size'];
            $fileError = $file['error'];
            $fileType = $file['type'];

            if ($fileError == 0)
            {
                echo "No errors.";
                $uploadDir = 'uploads/';

                $newFileName = uniqid('', true).'.'.pathinfo($fileName, PATHINFO_EXTENSION);
                $fileDestination = $uploadDir.$newFileName;
                if(move_uploaded_file($fileTmpName, $fileDestination))
                {
                    echo " File uploaded successfully.";
                }
            }
        }
        else
        {
            if ($file_des)
            {
                $fileDestination = $file_des;
            }
            else
            {
                $fileDestination = 'uploads/placeholder.png';
            }
        }
        $fields = [];
        $params = [];
        if (isset($item_name))
        {
            $fields[] = "item_name = :item_name";
            $params['item_name'] = $item_name;
        }
        if (isset($item_price))
        {
            $fields[] = "item_price = :item_price";
            $params['item_price'] = $item_price;
        }
        if (isset($item_quantity))
        {
            $fields[] = "item_quantity = :item_quantity";
            $params['item_quantity'] = $item_quantity;
        }
        if (isset($item_img_url))
        {
            $fields[] = "item_img_url = :item_img_url";
            $params['item_img_url'] = $fileDestination;
        }
        if (isset($text_box_height))
        {
            $fields[] = "text_box_height = :text_box_height";
            $params['text_box_height'] = $text_box_height;
        }
        if (isset($text_box_width))
        {
            $fields[] = "text_box_width = :text_box_width";
            $params['text_box_width'] = $text_box_width;
        }
        if (isset($text_box_content))
        {
            $fields[] = "text_box_content = :text_box_content";
            $params['text_box_content'] = $text_box_content;
        }
        if (isset($text_color))
        {
            $fields[] = "text_color = :text_color";
            $params['text_color'] = $text_color;
        }
        if (isset($background_color))
        {
            $fields[] = "background_color = :background_color";
            $params['background_color'] = $background_color;
        }
        if (isset($text_font))
        {
            $fields[] = "text_font = :text_font";
            $params['text_font'] = $text_font;
        }
        if (isset($text_size))
        {
            $fields[] = "text_size = :text_size";
            $params['text_size'] = $text_size;
        }
        if (isset($background_size_x))
        {
            $fields[] = "background_size_x = :background_size_x";
            $params['background_size_x'] = $background_size_x;
        }
        if (isset($background_size_y))
        {
            $fields[] = "background_size_y = :background_size_y";
            $params['background_size_y'] = $background_size_y;
        }
        if (isset($background_pos))
        {
            $fields[] = "background_pos = :background_pos";
            $params['background_pos'] = $background_pos;
        }
        if(!empty($fields))
        {
            $query = "UPDATE items SET " . implode(',', $fields) . " WHERE item_id = :item_id";
            $params['item_id'] = $item_id;
            $stm = $DB->prepare($query);
            $stm->execute($params);
        }
    }
    else
    {
        if (isset($_FILES['file']))
        {
            $file = $_FILES['file'];
            $fileName = $file['name'];
            $fileTmpName = $file['tmp_name'];
            $fileSize = $file['size'];
            $fileError = $file['error'];
            $fileType = $file['type'];

            if ($fileError == 0)
            {
                echo "No errors.";
                $uploadDir = 'uploads/';

                $newFileName = uniqid('', true).'.'.pathinfo($fileName, PATHINFO_EXTENSION);
                $fileDestination = $uploadDir.$newFileName;
                if(move_uploaded_file($fileTmpName, $fileDestination))
                {
                    echo " File uploaded successfully.";
                }
            }
        }
        else
        {
            $fileDestination = 'uploads/placeholder.png';
        }
        /*$query = "INSERT INTO items (item_name, item_price, item_quantity, item_image_url, text_box_height, text_box_width, text_box_content, text_color, background_color, text_font, text_size, text_box_cat, background_size, background_pos) 
        VALUES (:item_name, :item_price, :item_quantity, :item_image_url, :text_box_height, :text_box_width, :text_box_content, :text_color, :background_color, :text_font, :text_size, :text_box_cat, :background_size, :background_pos)";
        $stm = $DB->prepare($query);
        $stm->bindValue(':item_name', $item_name, PDO::PARAM_STR);
        $stm->bindValue(':item_price', $item_price, PDO::PARAM_STR);
        $stm->bindValue(':item_quantity', $item_quantity, PDO::PARAM_STR);
        $stm->bindValue(':item_image_url', $fileDestination, PDO::PARAM_STR);
        $stm->bindValue(':text_box_height', $text_box_height, PDO::PARAM_INT);
        $stm->bindValue(':text_box_width', $text_box_width, PDO::PARAM_INT);
        $stm->bindValue(':text_box_content', $text_box_content, PDO::PARAM_STR);
        $stm->bindValue(':text_color', $text_color, PDO::PARAM_STR);
        $stm->bindValue(':background_color', $background_color, PDO::PARAM_STR);
        $stm->bindValue(':text_font', $text_font, PDO::PARAM_STR);
        $stm->bindValue(':text_size', $text_size, PDO::PARAM_STR);
        $stm->bindValue(':text_box_cat', $text_box_cat, PDO::PARAM_STR);
        $stm->bindValue(':background_size', $background_size, PDO::PARAM_STR);
        $stm->bindValue(':background_pos', $background_pos, PDO::PARAM_STR);
        try 
        {
            $stm->execute();
        }
        catch (PDOException $e) 
        {
            echo " ERROR: " . $e->getMessage();
        }*/
        $fields = [];
        $placeholders = [];
        $params = [];
        $fields[] = "item_name";
        $placeholders[] = ":item_name";
        $params['item_name'] = $item_name;

        $fields[] = "item_price";
        $placeholders[] = ":item_price";
        $params['item_price'] = $item_price;

        $fields[] = "item_quantity";
        $placeholders[] = ":item_quantity";
        $params['item_quantity'] = $item_quantity;

        $fields[] = "item_image_url";
        $placeholders[] = ":item_image_url";
        $params['item_image_url'] = $fileDestination;

        $fields[] = "text_box_cat";
        $placeholders[] = ":text_box_cat";
        $params['text_box_cat'] = $text_box_cat;
        if (isset($text_box_height))
        {
            $fields[] = "text_box_height";
            $placeholders[] = ":text_box_height";
            $params['text_box_height'] = $text_box_height;
        }
        if (isset($text_box_width))
        {
            $fields[] = "text_box_width";
            $placeholders[] = ":text_box_width";
            $params['text_box_width'] = $text_box_width;
        }
        if (isset($text_box_content))
        {
            $fields[] = "text_box_content";
            $placeholders[] = ":text_box_content";
            $params['text_box_content'] = $text_box_content;
        }
        if (isset($text_color))
        {
            $fields[] = "text_color";
            $placeholders[] = ":text_color";
            $params['text_color'] = $text_color;
        }
        if (isset($background_color))
        {
            $fields[] = "background_color";
            $placeholders[] = ":background_color";
            $params['background_color'] = $background_color;
        }
        if (isset($text_font))
        {
            $fields[] = "text_font";
            $placeholders[] = ":text_font";
            $params['text_font'] = $text_font;
        }
        if (isset($text_size))
        {
            $fields[] = "text_size";
            $placeholders[] = ":text_size";
            $params['text_size'] = $text_size;
        }
        if (isset($background_size_x))
        {
            $fields[] = "background_size_x";
            $placeholders[] = ":background_size_x";
            $params['background_size_x'] = $background_size_x;
        }
        if (isset($background_size_y))
        {
            $fields[] = "background_size_y";
            $placeholders[] = ":background_size_y";
            $params['background_size_y'] = $background_size_y;
        }
        if (isset($background_pos))
        {
            $fields[] = "background_pos";
            $placeholders[] = ":background_pos";
            $params['background_pos'] = $background_pos;
        }
        $query = "INSERT INTO items (" . implode(', ', $fields) . ") VALUES (" . implode(', ', $placeholders) . ")";        
        try
        {
            $DB->beginTransaction();
            $stm = $DB->prepare($query);
            $stm->execute($params);
            $DB->commit();
        }
        catch(PDOEXCEPTION $e)
        {
            $DB->rollBack();
            echo "Error: " . $e->getMessage();
        }
    }
}