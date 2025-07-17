<!DOCTYPE HTML>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <!-- Bootstrap CSS -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">

        <!-- Bootstrap JS (with Popper.js for tooltips, modals, etc.) -->
        <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.min.js"></script>

        <!--  JQuery -->
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
        <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
        <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
        <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js"></script>

        <!-- CSS File -->
        <link rel="stylesheet" type="text/css" href="project_2-main.css">

        <!-- Swiper CSS File -->

        <link rel="stylesheet" href="https://unpkg.com/swiper@9.0.0/swiper-bundle.min.css"/>

        <!-- Swiper JS File -->

        <script src="https://unpkg.com/swiper@9.0.0/swiper-bundle.min.js"></script>

        <script src="main.js" defer></script>

        <?php session_start(); if($_SESSION['isAdmin'] === true) : ?>
        <script src="dreamboard.js" defer></script>
        <script src="admin_edit.js" defer></script>
        <?php endif;?>
    </head>
    <body>