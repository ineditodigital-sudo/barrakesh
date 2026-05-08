<?php
// backend/db.php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Configuración de la Base de Datos REAL BARRAKESH
$host = 'localhost';
$db = 'barrakesh_db';
$user = 'barrakesh_db';
$pass = 'Barrakesh%1314';
$charset = 'utf8mb4';

// CONFIGURACIÓN DE SEGURIDAD SIMPLIFICADA
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: " . ($_SERVER['HTTP_ORIGIN'] ?? '*'));
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, X-Barrakesh-Auth, Authorization");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

define('API_SECRET', 'BK_SECURE_9921_X');

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    // EN LUGAR DE MORIR, ENVIAMOS JSON
    http_response_code(500);
    echo json_encode(["error" => "FALLO_CONEXION_BD", "detalles" => $e->getMessage()]);
    exit;
}

// Función de verificación de seguridad
function verifyAuth($requireAdmin = true)
{
    $headers = getallheaders();
    $auth = $headers['X-Barrakesh-Auth'] ?? $headers['x-barrakesh-auth'] ?? $_GET['auth'] ?? '';

    if ($auth !== API_SECRET) {
        http_response_code(403);
        echo json_encode(["error" => "Llave API inválida"]);
        exit;
    }
}
?>