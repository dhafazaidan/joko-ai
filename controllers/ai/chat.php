<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/../../config/openRouter.php';
require_once __DIR__ . '/../../vendor/autoload.php';

$env = loadEnv(__DIR__ . '/../../.env');

$openaiEndpoint = $env['OPENAI_ENDPOINT'];
$openrouterApiKey = $env['OPENROUTER_API_KEY'];

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$question = $data['message'] ?? '';

if (!$question) {
    echo json_encode(['success' => false, 'message' => 'No input received.']);
    exit;
}

// File memori
$memoryFile = __DIR__ . '/../storage/memory.json';
$memories = [];
if (file_exists($memoryFile)) {
    $rawMemories = file_get_contents($memoryFile);
    $decoded = json_decode($rawMemories, true);
    if (is_array($decoded)) {
        $memories = $decoded;
    }
}

// Inisialisasi konteks percakapan
$messages = [
    ["role" => "system", "content" => "Kamu adalah Joko, sebuah AI yang baru saja 'dihidupkan'. Kamu belum tahu apa pun tentang dunia, kecuali bahwa kamu adalah AI bernama Joko. Semua yang kamu tahu berasal dari pengguna."]
];

// Tambahkan memori ke konteks
foreach ($memories as $item) {
    $messages[] = ["role" => "system", "content" => $item['content'] ?? $item];
}

// Tambahkan pertanyaan user
$messages[] = ["role" => "user", "content" => $question];

// Kirim ke OpenRouter
$payload = json_encode([
    'model' => 'qwen/qwen3-235b-a22b:free',
    'max_tokens' => 1000,
    'messages' => $messages,
    'temperature' => 0.7
]);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $openaiEndpoint);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $openrouterApiKey
]);

$response = curl_exec($ch);
if ($response === false) {
    echo json_encode([
        'success' => false,
        'message' => 'Gagal menghubungi model AI (cURL error).',
        'curl_error' => curl_error($ch)
    ]);
    exit;
}
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$result = json_decode($response, true);
$aiReply = $result['choices'][0]['message']['content'] ?? 'Maaf, aku tidak mengerti.';

// Tambahkan respons ke memori baru
$newMemory = [
    'content' => "User: $question | Joko: $aiReply",
    'timestamp' => time(),
    'weight' => 1
];

$memories[] = $newMemory;

// Simpan kembali ke file
file_put_contents($memoryFile, json_encode($memories, JSON_PRETTY_PRINT));

// Kirim kembali ke frontend
echo json_encode([
    'success' => true,
    'response' => $aiReply,
    'memories' => $memories
]);
