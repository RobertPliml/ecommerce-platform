<?php
session_start();
session_regenerate_id(true);
include 'dbconnect.php';
$csrf_token = filter_input(INPUT_POST, 'csrf_token', FILTER_SANITIZE_SPECIAL_CHARS);
$item_name = 'temp';
$item_price = '69';
$item_quantity = '420';
$text_box_height = filter_input(INPUT_POST, 'text_box_height', FILTER_VALIDATE_INT);
$text_box_width = filter_input(INPUT_POST, 'text_box_width', FILTER_VALIDATE_INT);
$text_box_content = filter_input(INPUT_POST, 'text_box_content', FILTER_SANITIZE_SPECIAL_CHARS);
$text_color = filter_input(INPUT_POST, 'text_color', FILTER_SANITIZE_SPECIAL_CHARS);
$background_color = filter_input(INPUT_POST, 'background_color', FILTER_SANITIZE_SPECIAL_CHARS);
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
        $query = "UPDATE items SET item_name = :item_name, item_price = :item_price, item_quantity = :item_quantity, 
        item_image_url = :item_image_url, text_box_height = :text_box_height, text_box_width = :text_box_width, 
        text_box_content = :text_box_content, text_color = :text_color, background_color = :background_color, 
        text_font = :text_font, text_size = :text_size WHERE item_id = :item_id";
        $stm = $DB->prepare($query);
        $stm->bindParam(':item_name', $item_name, PDO::PARAM_STR);
        $stm->bindParam(':item_price', $item_price, PDO::PARAM_STR);
        $stm->bindParam(':item_quantity', $item_quantity, PDO::PARAM_STR);
        $stm->bindParam(':item_image_url', $fileDestination, PDO::PARAM_STR);
        $stm->bindParam(':text_box_height', $text_box_height, PDO::PARAM_INT);
        $stm->bindParam(':text_box_width', $text_box_width, PDO::PARAM_INT);
        $stm->bindParam(':text_box_content', $text_box_content, PDO::PARAM_STR);
        $stm->bindParam(':text_color', $text_color, PDO::PARAM_STR);
        $stm->bindParam(':background_color', $background_color, PDO::PARAM_STR);
        $stm->bindParam(':text_font', $text_font, PDO::PARAM_STR);
        $stm->bindParam(':text_size', $text_size, PDO::PARAM_STR);
        $stm->bindParam(':item_id', $item_id, PDO::PARAM_INT);
        $stm->execute();
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
        $query = "INSERT INTO items (item_name, item_price, item_quantity, item_image_url, text_box_height, text_box_width, text_box_content, text_color, background_color, text_font, text_size, text_box_cat) 
        VALUES (:item_name, :item_price, :item_quantity, :item_image_url, :text_box_height, :text_box_width, :text_box_content, :text_color, :background_color, :text_font, :text_size, :text_box_cat)";
        $stm = $DB->prepare($query);
        $stm->bindParam(':item_name', $item_name, PDO::PARAM_STR);
        $stm->bindParam(':item_price', $item_price, PDO::PARAM_STR);
        $stm->bindParam(':item_quantity', $item_quantity, PDO::PARAM_STR);
        $stm->bindParam(':item_image_url', $fileDestination, PDO::PARAM_STR);
        $stm->bindParam(param: ':text_box_height', $text_box_height, PDO::PARAM_INT);
        $stm->bindParam(':text_box_width', $text_box_width, PDO::PARAM_INT);
        $stm->bindParam(':text_box_content', $text_box_content, PDO::PARAM_STR);
        $stm->bindParam(':text_color', $text_color, PDO::PARAM_STR);
        $stm->bindParam(':background_color', $background_color, PDO::PARAM_STR);
        $stm->bindParam(':text_font', $text_font, PDO::PARAM_STR);
        $stm->bindParam(':text_size', $text_size, PDO::PARAM_STR);
        $stm->bindParam(':text_box_cat', $text_box_cat, PDO::PARAM_STR);
        $stm->execute();
    }
}