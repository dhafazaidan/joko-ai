<?php
session_start();
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

session_destroy(); // Destroy session

http_response_code(200);
echo json_encode(array("message" => "Logout successful"));
?>