<?php
session_start();
session_regenerate_id(true);
include "dbconnect.php";
$csrf_token = filter_input(INPUT_POST, 'csrf_token', FILTER_SANITIZE_SPECIAL_CHARS);
$editMenuBar = filter_input(INPUT_POST, 'editMenuBar', FILTER_VALIDATE_BOOLEAN);
$catName = filter_input(INPUT_POST, 'catName', FILTER_SANITIZE_SPECIAL_CHARS);
$add_to_shopall = filter_input(INPUT_POST, 'add_to_shopall', FILTER_VALIDATE_BOOLEAN);
$func = filter_input(INPUT_POST, 'func', FILTER_SANITIZE_SPECIAL_CHARS);
$id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
$subcat_name = filter_input(INPUT_POST, 'subcatName', FILTER_SANITIZE_SPECIAL_CHARS);
$newName = filter_input(INPUT_POST, 'newName', FILTER_SANITIZE_SPECIAL_CHARS);
$newUrl = filter_input(INPUT_POST, 'newUrl', FILTER_SANITIZE_SPECIAL_CHARS);
if ($csrf_token && $csrf_token === $_SESSION['csrf_token'])
{
    if ($editMenuBar === true)
    {
        if ($_SESSION['editMenuBar'] === false)
        {
            $_SESSION['editMenuBar'] = true;
        }
        else if ($_SESSION['editMenuBar'] === true)
        {
            $_SESSION['editMenuBar'] = false;
        }
        echo $_SESSION['editMenuBar'];
    }
    if ($catName) 
    {
        switch ($func)
        {
            case "add-to-cats" :
                $query = "INSERT INTO cats (cat_name) VALUES (:cat_name)";
                $stm = $DB->prepare($query);
                $stm->bindParam(':cat_name', $catName, PDO::PARAM_STR);
                $stm->execute();
                if ($add_to_shopall === true) 
                {
                    $query = "INSERT INTO subcats (subcat_name, cat_name, subcat_url) VALUES (:subcat_name, 'Shop All', 'shopping_page.php')";
                    $stm = $DB->prepare($query);
                    $stm->bindParam(':subcat_name', $catName, PDO::PARAM_STR);
                    $stm->execute();
                }
                break;
            case "remove-cat" :
                $query = "SELECT * FROM subcats WHERE cat_name = :cat_name";
                $stm = $DB->prepare($query);
                $stm->bindParam(':cat_name', $catName, PDO::PARAM_STR);
                $stm->execute();
                $safety_check = $stm->fetchAll();
                if (count($safety_check) === 0)
                {
                    $query = "DELETE FROM cats WHERE id = :id";
                    $stm = $DB->prepare($query);
                    $stm->bindParam(':id', $id, PDO::PARAM_INT);
                    $stm->execute();
                    $query ="DELETE FROM subcats WHERE subcat_name = :subcat_name";
                    $stm = $DB->prepare($query);
                    $stm->bindParam(':subcat_name', $catName, PDO::PARAM_STR);
                    $stm->execute();
                }
                break;
            case 'rename-cat' :
                $query = "UPDATE cats SET cat_name = :cat_name WHERE id = :id";
                $stm = $DB->prepare($query);
                $stm->bindParam(':cat_name', $catName, PDO::PARAM_STR);
                $stm->bindParam(':id', $id, PDO::PARAM_INT);
                $stm->execute();
                break;
            case 'add-subcat' :
                $query = "INSERT INTO subcats (subcat_name, cat_name, subcat_url) VALUES (:subcat_name, :cat_name, 'index.php')";
                $stm = $DB->prepare($query);
                $stm->bindParam(':subcat_name', $subcat_name, PDO::PARAM_STR);
                $stm->bindParam(':cat_name', $catName, PDO::PARAM_STR);
                $stm->execute();
                break;
            case 'remove-subcat' :
                $query = "DELETE FROM subcats WHERE subcat_id = :subcat_id";
                $stm = $DB->prepare($query);
                $stm->bindParam(':subcat_id', $id, PDO::PARAM_INT);
                $stm->execute();
                break;
            case 'edit-subcat' :
                if ($newName)
                {
                    $query = "UPDATE subcats SET subcat_name = :subcat_name WHERE subcat_id = :subcat_id";
                    $stm = $DB->prepare($query);
                    $stm->bindParam(':subcat_name', $newName, PDO::PARAM_STR);
                    $stm->bindParam(':subcat_id', $id, PDO::PARAM_INT);
                    $stm->execute();
                }
                if ($newUrl)
                {
                    $query = "UPDATE subcats SET subcat_url = :subcat_url WHERE subcat_id = :subcat_id";
                    $stm = $DB->prepare($query);
                    $stm->bindParam(':subcat_url', $newUrl, PDO::PARAM_STR);
                    $stm->bindParam(':subcat_id', $id, PDO::PARAM_INT);
                    $stm->execute();
                }
                break;
        }
    }
}