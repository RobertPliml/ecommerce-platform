<?php
session_start();
session_regenerate_id(true);
include 'dbconnect.php';
// DONT FORGET TO ADD IN CSRF TOKEN TO THIS SERVER FILE
$pos_x = filter_input(INPUT_POST, 'pos_x', FILTER_SANITIZE_SPECIAL_CHARS);
$pos_y = filter_input(INPUT_POST, 'pos_y', FILTER_SANITIZE_SPECIAL_CHARS);
$div_type = filter_input(INPUT_POST, 'div_type', FILTER_SANITIZE_SPECIAL_CHARS);
$editing = filter_input(INPUT_POST, 'editing', FILTER_VALIDATE_BOOLEAN);
$itemId = filter_input(INPUT_POST, 'itemId', FILTER_VALIDATE_INT);
$delete_id = filter_input(INPUT_POST, 'delete_id', FILTER_VALIDATE_INT);
$new_width = filter_input(INPUT_POST, 'new_width', FILTER_SANITIZE_SPECIAL_CHARS);
$new_height = filter_input(INPUT_POST, 'new_height', FILTER_SANITIZE_SPECIAL_CHARS);
if ($editing === true && $pos_x && $pos_y && $div_type && $itemId)
{
    $_SESSION['editing'] = true;
    $_SESSION['edit_id'] = $itemId;
    $_SESSION['edit_pos_x'] = $pos_x;
    $_SESSION['edit_pos_y'] = $pos_y;
    $_SESSION['edit_div_type'] = $div_type;
    $_SESSION['edit_div_id'] = $itemId;
}
if ($editing === false)
{
    $_SESSION['editing'] = false;
    if ($delete_id && $delete_id !== 0)
    {
        $query = "DELETE FROM dreamboard_items WHERE item_id = :item_id";
        $stm = $DB->prepare($query);
        $stm->bindParam(':item_id', $delete_id, PDO::PARAM_INT);
        $stm->execute();
    }
    if ($pos_x || $pos_y || $new_height || $new_width && $itemId )
    {
        $query = "UPDATE dreamboard_items SET pos_x = :pos_x, pos_y = :pos_y, width = :width, height = :height WHERE item_id = :item_id";
        $stm = $DB->prepare($query);
        $stm->bindParam(':pos_x', $pos_x, PDO::PARAM_STR);
        $stm->bindParam(':pos_y', $pos_y, PDO::PARAM_STR);
        $stm->bindParam(':width', $new_width, PDO::PARAM_STR);
        $stm->bindParam(':height', $new_height, PDO::PARAM_STR);
        $stm->bindParam(':item_id', $itemId, PDO::PARAM_INT);
        $stm->execute();
    }
}
if($div_type && $div_type !== '' && $editing === null)
{
    $query = "INSERT INTO dreamboard_items (pos_x, pos_y, div_type) VALUES (:pos_x, :pos_y, :div_type)";
    $stm = $DB->prepare($query);
    $stm->bindParam(':pos_x', $pos_x, PDO::PARAM_STR);
    $stm->bindParam(':pos_y', $pos_y, PDO::PARAM_STR);
    $stm->bindParam(':div_type', $div_type, PDO::PARAM_STR);
    $stm->execute();
}