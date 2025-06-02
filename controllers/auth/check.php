<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true) {
    http_response_code(200);
    echo json_encode(array(
        "authenticated" => true,
        "user" => array(
            "id" => $_SESSION['user_id'],
            "username" => $_SESSION['username']
        )
    ));
} else {
    http_response_code(401);
    echo json_encode(array("authenticated" => false));
}
?>