<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = file_get_contents('php://input');
    $json = json_decode($data, true);
    
    if (isset($json['content']) && isset($json['filename'])) {
        $dir = 'backups';
        if (!is_dir($dir)) {
            mkdir($dir, 0777, true);
        }
        
        $filePath = $dir . '/' . preg_replace('/[^a-zA-Z0-9._-]/', '_', $json['filename']) . '.csv';
        file_put_contents($filePath, $json['content']);
        
        echo json_encode(['success' => true, 'path' => $filePath]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Datos inválidos']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Método no permitido']);
}
?>
