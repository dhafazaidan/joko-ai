<?php

header('Content-Type: application/json');

// Ambil data JSON dari body request
$input = json_decode(file_get_contents('php://input'), true);

if (isset($input['action']) && $input['action'] === 'shutdown') {
    // Path ke file memory.json relatif terhadap file ini
    $memoryFile = __DIR__ . '/../storage/memory.json';

    // Hapus isi file dengan menulis array kosong
    if (file_put_contents($memoryFile, json_encode([])) !== false) {
        echo json_encode([
            'success' => true,
            'message' => 'Memori berhasil dihapus.'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Gagal menghapus memori.'
        ]);
    }
    exit;
}

// Jika request tidak valid
echo json_encode([
    'success' => false,
    'message' => 'Aksi tidak dikenali.'
]);
exit;
