<!DOCTYPE HTML>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <!-- Bootstrap CSS -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css">

        <!-- Bootstrap JS (with Popper.js for tooltips, modals, etc.) -->
        <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.min.js"></script>

        <!--  JQuery -->
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
        <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
        <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
        <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js"></script>

        <!-- PayPal -->

        <script src="https://www.paypal.com/sdk/js?client-id=Acj3BplD7LjMhQ2Oik8RcEgg7rw5OEL5ul2FHSokUQmyAW-lTlrmrFM_zIycl9hH5n_WbS2g3u-A_N02&currency=USD" defer></script>

        <!-- CSS File -->
        <link rel="stylesheet" type="text/css" href="project_2-main.css?v=<?php echo time();?>">

        <link rel="stylesheet" href="https://unpkg.com/flickity@2/dist/flickity.min.css">
        <script src="https://unpkg.com/flickity@2/dist/flickity.pkgd.min.js"></script>
        <?php
        require_once 'init.php';
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
        if (!isset($_SESSION['order_email']))
        {
            $_SESSION['order_email'] = '';
        }
        ?>
        <script nonce="<?= $nonce ?>">
            const csrf_token = <?= json_encode($_SESSION['csrf_token']); ?>;
            var edit_mode = <?= json_encode($_SESSION['editing']); ?>;
            var edit_pos_x = <?= json_encode($_SESSION['edit_pos_x']); ?>;
            var edit_pos_y = <?= json_encode($_SESSION['edit_pos_y']); ?>;
            var edit_div_type = <?= json_encode($_SESSION['edit_div_type']); ?>;
            var edit_div_id = <?= json_encode($_SESSION['edit_div_id']); ?>;
            var page_search_id = <?= json_encode($_SESSION['page_search_id']); ?>;
            const CSP_NONCE = <?= json_encode($nonce); ?>;
        </script>

        <script src="paypal.js" defer></script>
        <script src="main.js" defer></script>
        <script src="search.js" defer></script>

        <?php session_start(); if($_SESSION['isAdmin'] === true) : ?>
        <script src="dreamboard.js" defer></script>
        <script src="admin_edit.js" defer></script>
        <?php endif;?>
    </head>
    <body>