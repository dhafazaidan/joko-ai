<?php
require_once __DIR__ . '/../../config/dapabase.php';

header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));
file_put_contents("debug.txt", print_r($data, true));

if (!empty($data->username) && !empty($data->password)) {
    // Check if username already exists
    $check_query = "SELECT id FROM users WHERE username = ? LIMIT 1";
    $check_stmt = $db->prepare($check_query);
    $check_stmt->bindParam(1, $data->username);
    $check_stmt->execute();
    
    if ($check_stmt->rowCount() > 0) {
        http_response_code(400);
        echo json_encode(array("message" => "Username already exists"));
    } else {
        // Insert new user
        $query = "INSERT INTO users (username, password_hash) VALUES (?, ?)";
        $stmt = $db->prepare($query);
        
        $password_hash = password_hash($data->password, PASSWORD_DEFAULT);
        $stmt->bindParam(1, $data->username);
        $stmt->bindParam(2, $password_hash);
        
        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(array("message" => "User registered successfully"));
        } else {
            http_response_code(500);
            echo json_encode(array("message" => "Registration failed"));
        }
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Username and password required"));
}
?>