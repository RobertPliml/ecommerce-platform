<?php
session_start();

$nonce = base64_encode(random_bytes(16));

header("Content-Security-Policy: default-src 'self'; 
    script-src 'self' 'nonce-$nonce' https://www.paypal.com https://ajax.googleapis.com https://cdn.jsdelivr.net https://code.jquery.com https://unpkg.com; 
    style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://unpkg.com https://fonts.googleapis.com; 
    font-src 'self' https://cdn.jsdelivr.net https://fonts.gstatic.com; 
    img-src 'self' data:;");
