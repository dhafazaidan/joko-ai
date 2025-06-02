<?php
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$newKnowledge = $data['knowledge'] ?? '';

if (!$newKnowledge) {
    echo json_encode(['success' => false, 'message' => 'Tidak ada pengetahuan diberikan.']);
    exit;
}

$file = __DIR__ . '/../storage/memory.json';
$existing = file_exists($file) ? json_decode(file_get_contents($file), true) : [];

$existing[] = $newKnowledge;
file_put_contents($file, json_encode($existing, JSON_PRETTY_PRINT));

echo json_encode(['success' => true, 'message' => 'Pengetahuan ditambahkan.']);
?>