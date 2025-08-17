<?php
require_once 'init.php';
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
        try
        {
            $DB->beginTransaction();
            switch ($func)
            {
            case "add-to-cats" :
                $stm = $DB->prepare("INSERT INTO cats (cat_name) VALUES (:cat_name)");
                $stm->execute([':cat_name' => $catName]);
                if ($add_to_shopall === true) 
                {
                    $query = "INSERT INTO subcats (subcat_name, cat_name, subcat_url) VALUES (:subcat_name, 'Shop All', 'shopping_page.php')";
                    $stm = $DB->prepare($query);
                    $stm->execute([':subcat_name' => $catName]);
                }
                break;
            case "remove-cat" :
                $stm = $DB->prepare("SELECT * FROM subcats WHERE cat_name = :cat_name");
                $stm->execute([':cat_name' => $catName]);
                $safety_check = $stm->fetchAll(PDO::FETCH_ASSOC);
                $stm = $DB->prepare("SELECT * FROM items WHERE text_box_cat = :text_box_cat");
                $stm->execute([':text_box_cat' => $catName]);
                $res = $stm->fetchAll(PDO::FETCH_ASSOC);
                if (count($safety_check) === 0 && count($res) === 0)
                {
                    $stm = $DB->prepare("DELETE FROM cats WHERE id = :id");
                    $stm->execute([':id' => $id]);
                    $stm = $DB->prepare("DELETE FROM subcats WHERE subcat_name = :subcat_name");
                    $stm->execute([':subcat_name' => $catName]);
                }
                break;
            case 'rename-cat' :
                $stm = $DB->prepare("UPDATE cats SET cat_name = :cat_name WHERE id = :id");
                $stm->execute([
                    ':cat_name' => $catName,
                    ':id' => $id
                ]);
                break;
            case 'add-subcat' :
                $query = "INSERT INTO subcats (subcat_name, cat_name, subcat_url) VALUES (:subcat_name, :cat_name, 'index.php')";
                $stm = $DB->prepare($query);
                $stm->execute([
                    ':subcat_name' => $subcat_name,
                    ':cat_name' => $catName
                ]);
                break;
            case 'remove-subcat' :
                $stm = $DB->prepare("SELECT * FROM items WHERE text_box_cat = :text_box_cat");
                $stm->execute([':text_box_cat' => $catName]);
                $res = $stm->fetchAll(PDO::FETCH_ASSOC);
                if (count($res) === 0)
                {
                    $stm = $DB->prepare("DELETE FROM subcats WHERE subcat_id = :subcat_id");
                    $stm->execute([':subcat_id' => $id]);
                }
                break;
            case 'edit-subcat' :
                if ($newName)
                {
                    $stm = $DB->prepare("SELECT * FROM items WHERE text_box_cat = :catName");
                    $stm->execute([':catName' => $catName]);
                    $res = $stm->fetchAll(PDO::FETCH_ASSOC);
                    foreach($res as $r)
                    {
                        $stm = $DB->prepare("UPDATE items SET text_box_cat = :new_cat WHERE item_id = :item_id");
                        $stm->execute([
                            ':new_cat' => $newName,
                            ':item_id' => $r['item_id']
                        ]);
                    }
                    $query = "UPDATE subcats SET subcat_name = :subcat_name WHERE subcat_id = :subcat_id";
                    $stm = $DB->prepare($query);
                    $stm->execute([
                        ':subcat_name' => $newName,
                        ':subcat_id' => $id
                    ]);
                }
                if ($newUrl)
                {
                    $query = "UPDATE subcats SET subcat_url = :subcat_url WHERE subcat_id = :subcat_id";
                    $stm = $DB->prepare($query);
                    $stm->execute([
                        ':subcat_url' => $newUrl,
                        ':subcat_id' => $id
                    ]);
                }
                break;
            }
            $DB->commit();
            exit();
        }
        catch (PDOException $e)
        {
            $DB->rollBack();
        }
    }
}