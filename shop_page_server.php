<?php
session_start();
include "dbconnect.php";
$cat_id = filter_input(INPUT_POST, 'cat_id', FILTER_VALIDATE_INT);
$grand_cat = filter_input(INPUT_POST, 'grand_cat', FILTER_VALIDATE_BOOLEAN);
$action = filter_input(INPUT_POST, 'action', FILTER_SANITIZE_SPECIAL_CHARS);
if ($cat_id && $grand_cat === false)
{
    $_SESSION['page_search_id'] = $cat_id;
    $_SESSION['grand_cat'] = false;
}
else if ($cat_id && $grand_cat === true)
{
    $_SESSION['page_search_id'] = $cat_id;
    $_SESSION['grand_cat'] = true;
}

if ($action && $action === 'findpage')
{
    $stm = $DB->prepare('SELECT text_box_cat FROM items WHERE item_id = ? LIMIT 1');
    $stm->execute([$cat_id]);
    $res = $stm->fetch(PDO::FETCH_ASSOC);
    $cat_name = $res['text_box_cat'];
    $stm = $DB->prepare('SELECT id FROM cats WHERE cat_name = ? LIMIT 1');
    $stm->execute([$cat_name]);
    $data = $stm->fetch(PDO::FETCH_ASSOC);
    if ($data)
    {
        $_SESSION['page_search_id'] = $data['id'];
        $_SESSION['grand_cat'] = true;
    }
    else
    {
        $stm = $DB->prepare('SELECT subcat_id FROM subcats WHERE subcat_name = ? LIMIT 1');
        $stm->execute([$cat_name]);
        $data = $stm->fetch(PDO::FETCH_ASSOC);
        if ($data)
        {
            $_SESSION['page_search_id'] = $data['subcat_id'];
            $_SESSION['grand_cat'] = false;
        }
    }
}
$input = json_decode(file_get_contents('php://input'), true);
$sub_cat = $input['sub_cat'] ?? '';
$stm = $DB->prepare('SELECT * FROM cats');
$stm->execute();
$cat_name = $stm->fetchAll(PDO::FETCH_ASSOC);
foreach ($cat_name as $cat)
{
    $cat_names[] = $cat['cat_name'];
}
if ($sub_cat !== '' && !in_array($sub_cat, $cat_names))
{
    $stm = $DB->prepare('SELECT cat_name FROM subcats WHERE subcat_name = :subcat_name');
    $stm->execute([':subcat_name' => $sub_cat]);
    $result = $stm->fetch(PDO::FETCH_ASSOC);
    echo $result['cat_name'];
    exit();
}
else if ($sub_cat !== '' && in_array($sub_cat, $cat_names))
{
    echo $sub_cat;
    exit();
}