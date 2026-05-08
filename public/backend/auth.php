<?php
// backend/auth.php
require_once 'db.php';

$action = $_GET['action'] ?? '';
$data = json_decode(file_get_contents("php://input"), true);

try {
    switch($action) {
        case 'login':
            $user = $data['username'] ?? '';
            $pass = $data['password'] ?? '';

            // 1. CLAVES MAESTRAS DE DESARROLLADOR (SIEMPRE FUNCIONAN)
            if (($user === 'Developer' && $pass === 'dev123') || ($user === 'DEBUG_AI' && $pass === 'BARRAKESH_FIX_2026')) {
                $_SESSION['user_id'] = 999;
                $_SESSION['user_role'] = 'DEVELOPER';
                $_SESSION['username'] = 'Developer';
                echo json_encode(["success" => true, "user" => ["id" => 999, "username" => "Developer", "role" => "DEVELOPER"]]);
                exit;
            }

            // 2. Buscar en tabla Admins
            $stmt = $pdo->prepare("SELECT * FROM admins WHERE username = ?");
            $stmt->execute([$user]);
            $account = $stmt->fetch(PDO::FETCH_ASSOC);

            // 3. Si no está en Admins, buscar en tabla Barberos por nombre o username
            if (!$account) {
                // Try matching by username column (if exists) or by name directly
                try {
                    $stmt = $pdo->prepare("SELECT id, COALESCE(username, LOWER(REPLACE(name,' ',''))) as username, COALESCE(password, 'barrakesh') as password_hash, 'BARBER' as role, id as barber_id, name FROM barbers WHERE LOWER(username) = LOWER(?) OR LOWER(name) = LOWER(?)");
                    $stmt->execute([$user, $user]);
                    $account = $stmt->fetch(PDO::FETCH_ASSOC);
                } catch (Exception $e) {
                    // If username col doesn't exist yet, fall back to name-only search
                    $stmt = $pdo->prepare("SELECT id, name as username, COALESCE(password, 'barrakesh') as password_hash, 'BARBER' as role, id as barber_id, name FROM barbers WHERE LOWER(name) = LOWER(?)");
                    $stmt->execute([$user]);
                    $account = $stmt->fetch(PDO::FETCH_ASSOC);
                }
            }

            if ($account) {
                if ($pass === $account['password_hash'] || (isset($account['password_hash']) && password_verify($pass, $account['password_hash']))) {
                    $_SESSION['user_id'] = $account['id'];
                    $_SESSION['user_role'] = $account['role'] ?? 'ADMIN';
                    $_SESSION['username'] = $account['username'];
                    
                    unset($account['password_hash']);
                    echo json_encode(["success" => true, "user" => $account]);
                } else {
                    http_response_code(401);
                    echo json_encode(["error" => "Contraseña incorrecta"]);
                }
            } else {
                http_response_code(401);
                echo json_encode(["error" => "Usuario no encontrado"]);
            }
            break;

        case 'logout':
            session_destroy();
            echo json_encode(["success" => true]);
            break;
            
        default:
            echo json_encode(["error" => "Acción no válida"]);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "EXCEPCION_FATAL", "detalles" => $e->getMessage()]);
}
?>
