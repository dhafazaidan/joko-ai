<?php
function requireAuth() {
    session_start();
    if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
        http_response_code(401);
        echo json_encode(array("message" => "Authentication required"));
        exit();
    }
    return $_SESSION['user_id'];
}

function getCurrentUserId() {
    session_start();
    return isset($_SESSION['user_id']) ? $_SESSION['user_id'] : null;
}
?>