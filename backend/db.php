<?php
// backend/db.php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Configuración de la Base de Datos REAL BARRAKESH
$host = 'localhost';
$db   = 'barrakesh_db';
$user = 'barrakesh_db';
$pass = 'Barrakesh%1314';
$charset = 'utf8mb4';


// CONFIGURACIÓN DE SEGURIDAD (CORS)
$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
header("Access-Control-Allow-Origin: $origin");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, X-Barrakesh-Auth, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

define('API_SECRET', 'BK_SECURE_9921_X');

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    die("Error de conexión: " . $e->getMessage());
}

// Función de verificación de seguridad nivel 2
function verifyAuth($requireAdmin = true) {
    $headers = getallheaders();
    $auth = $headers['X-Barrakesh-Auth'] ?? $headers['x-barrakesh-auth'] ?? $_GET['auth'] ?? '';
    
    // 1. Verificar la Llave API
    if ($auth !== API_SECRET) {
        http_response_code(403);
        echo json_encode(["error" => "Llave API inválida"]);
        exit;
    }

    // 2. Verificar Sesión Activa para rutas de Admin
    if ($requireAdmin && !isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(["error" => "Sesión expirada. Inicia sesión de nuevo."]);
        exit;
    }
}
?>
