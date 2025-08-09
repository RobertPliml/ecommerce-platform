<?php
session_start();
include "dbconnect.php";
if ($_POST['query'])
{
    $query = $_POST['query'];
    try
    {
        $stm = $DB->prepare('SELECT item_name, item_id FROM items WHERE item_name LIKE ? LIMIT 10');
        $stm->execute(["%$query%"]);
        $results = $stm->fetchAll(PDO::FETCH_ASSOC);
        if (count($results) > 0)
        {
            foreach ($results as $row)
            {
                echo "<div class='result-item' id='".htmlspecialchars($row['item_id'])."'><a class='a-text' href='shopping_page.php'>" . htmlspecialchars($row['item_name']) ."</a></div>";
            }
        }
        else
        {
            echo "<div class='result-item'>No results found.</div>";
        }
    }
    catch(PDOException $e)
    {
        echo "<div class='result-item'>Error fetching results.</div>";
    }
}