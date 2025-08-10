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

        <script src="paypal.js" defer></script>

        <?php session_start(); if($_SESSION['isAdmin'] === true) : ?>
        <script src="dreamboard.js" defer></script>
        <script src="admin_edit.js" defer></script>
        <?php endif;?>
    </head>
    <body>