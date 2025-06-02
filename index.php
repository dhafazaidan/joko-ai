<?php
require_once __DIR__ . '/vendor/autoload.php';
use config\Dapabase;

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
} else {
    header("Access-Control-Allow-Origin: http://localhost:5173");
}
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

// Untuk request OPTIONS (preflight), langsung direspons tanpa lanjut ke bawah
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/config/dapabase.php';

$basePath = '/jokoai_backend';
$request = str_replace($basePath, '', parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
$method = $_SERVER['REQUEST_METHOD'];

// Routing
switch (true) {
    case $request === '/api/signup' && $method === 'POST':
        require_once './controllers/auth/signup.php';
        break;

    case $request === '/api/signin' && $method === 'POST':
        require_once './controllers/auth/signin.php';
        break;

    case $request === '/api/logout' && $method === 'POST':
        require_once './controllers/auth/logout.php';
        break;

    case $request === '/api/chat' && $method === 'POST':
        require_once './controllers/ai/chat.php';
        break;

    case $request === '/api/erase' && $method === 'POST':
        require_once './controllers/ai/eraseMemory.php';
        break;

    // case $request === '/api/knowledge' && $method === 'POST':
    //     require_once './controllers/ai/knowledge.php';
    //     break;
    

    default:
        echo json_encode(['success' => false, 'message' => 'Endpoint tidak ditemukan.']);
        break;
}
?>