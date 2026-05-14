<?php
// backend/admin_api.php
require_once 'db.php';

// No bloqueamos errores para poder diagnosticar si algo falla
error_reporting(E_ALL);
ini_set('display_errors', 1);

verifyAuth();

$action = $_GET['action'] ?? '';
$data = json_decode(file_get_contents("php://input"), true);

header('Content-Type: application/json');

try {
    // Helper to save base64 image
    function saveImage($base64, $subfolder = 'general') {
        if (!$base64 || strpos($base64, 'data:image') === false) return $base64;
        
        try {
            $parts = explode(',', $base64);
            $data = base64_decode($parts[1]);
            $extension = strpos($parts[0], 'jpeg') !== false ? 'jpg' : (strpos($parts[0], 'png') !== false ? 'png' : 'jpg');
            
            $filename = 'img_' . uniqid() . '.' . $extension;
            $uploadDir = __DIR__ . '/../uploads/' . $subfolder;
            if (!file_exists($uploadDir)) mkdir($uploadDir, 0777, true);
            
            file_put_contents($uploadDir . '/' . $filename, $data);
            return '/uploads/' . $subfolder . '/' . $filename;
        } catch (Exception $e) {
            return $base64;
        }
    }

    switch($action) {
        case 'get_appointments':
            $stmt = $pdo->query("SELECT * FROM appointments ORDER BY appointment_date DESC LIMIT 500");
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC) ?: []);
            break;

        case 'get_barbers':
            $stmt = $pdo->query("SELECT * FROM barbers ORDER BY id ASC");
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC) ?: []);
            break;

        case 'get_services':
            $stmt = $pdo->query("SELECT * FROM services ORDER BY category ASC");
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC) ?: []);
            break;

        case 'get_branches':
            $stmt = $pdo->query("SELECT * FROM branches ORDER BY id ASC");
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC) ?: []);
            break;

        case 'get_settings':
            $stmt = $pdo->query("SELECT * FROM settings WHERE id = 1");
            $res = $stmt->fetch(PDO::FETCH_ASSOC);
            $defaults = [
                'siteName' => 'Barrakesh', 
                'siteTitle' => 'Barrakesh | Barbería', 
                'siteDesc' => '',
                'maintenance_mode' => 0,
                'ogImage' => '',
                'favicon' => ''
            ];
            echo json_encode(array_merge($defaults, $res ?: []));
            break;

        case 'add_service':
            try {
                $stmt = $pdo->prepare("INSERT INTO services (name, price, duration, category, description, branch_prices, available_branches, tag, disabled, price_is_variable) VALUES (:name, :price, :duration, :category, :description, :branch_prices, :available_branches, :tag, :disabled, :price_is_variable)");
                $stmt->execute([
                    ':name' => $data['name'] ?? '', ':price' => $data['price'] ?? 0, ':duration' => $data['duration'] ?? 30,
                    ':category' => $data['category'] ?? 'Barbería', 
                    ':description' => $data['desc'] ?? ($data['description'] ?? ''),
                    ':branch_prices' => json_encode($data['branchPrices'] ?? (object)[]),
                    ':available_branches' => is_array($data['availableBranches'] ?? []) ? implode(',', $data['availableBranches']) : '',
                    ':tag' => $data['tag'] ?? '',
                    ':disabled' => ($data['disabled'] ?? false) ? 1 : 0,
                    ':price_is_variable' => ($data['priceIsVariable'] ?? false) ? 1 : 0
                ]);
                echo json_encode(["success" => true, "id" => $pdo->lastInsertId()]);
            } catch (Exception $e) {
                if (strpos($e->getMessage(), 'Unknown column') !== false) {
                    $pdo->exec("ALTER TABLE services ADD COLUMN tag VARCHAR(50) DEFAULT ''");
                    $pdo->exec("ALTER TABLE services ADD COLUMN disabled TINYINT(1) DEFAULT 0");
                    $pdo->exec("ALTER TABLE services ADD COLUMN price_is_variable TINYINT(1) DEFAULT 0");
                    
                    $stmt = $pdo->prepare("INSERT INTO services (name, price, duration, category, description, branch_prices, available_branches, tag, disabled, price_is_variable) VALUES (:name, :price, :duration, :category, :description, :branch_prices, :available_branches, :tag, :disabled, :price_is_variable)");
                    $stmt->execute([
                        ':name' => $data['name'] ?? '', ':price' => $data['price'] ?? 0, ':duration' => $data['duration'] ?? 30,
                        ':category' => $data['category'] ?? 'Barbería', 
                        ':description' => $data['desc'] ?? ($data['description'] ?? ''),
                        ':branch_prices' => json_encode($data['branchPrices'] ?? (object)[]),
                        ':available_branches' => is_array($data['availableBranches'] ?? []) ? implode(',', $data['availableBranches']) : '',
                        ':tag' => $data['tag'] ?? '',
                        ':disabled' => ($data['disabled'] ?? false) ? 1 : 0,
                        ':price_is_variable' => ($data['priceIsVariable'] ?? false) ? 1 : 0
                    ]);
                    echo json_encode(["success" => true, "id" => $pdo->lastInsertId(), "migrated" => true]);
                } else { throw $e; }
            }
            break;

        case 'add_appointment': {
            // Map frontend data to the correct DB schema
            $services = $data['services'] ?? [];
            $barber   = $data['barber'] ?? null;
            $branch   = $data['branch'] ?? null;

            // Find barber_id and branch_id from names if IDs not available
            $barberId  = $barber['id'] ?? null;
            $branchId  = $branch['id'] ?? null;

            if (!$branchId && isset($data['location'])) {
                $s = $pdo->prepare("SELECT id FROM branches WHERE name = :name LIMIT 1");
                $s->execute([':name' => $data['location']]);
                $row = $s->fetch(PDO::FETCH_ASSOC);
                $branchId = $row['id'] ?? null;
            }

            // --- FAILSAFE: Check for overlaps (Duration Aware) ---
            $newStartTime = $data['time'] ?? '12:00:00';
            $newDate = $data['date'] ?? date('Y-m-d');
            
            // Calculate new appointment duration
            $isStudio = false;
            foreach ($services as $s) { if (($s['category'] ?? '') === 'Music Studio') { $isStudio = true; break; } }

            $newDuration = 60;
            if ($isStudio && isset($data['studioInfo']['hours'])) {
                $newDuration = intval($data['studioInfo']['hours']) * 60;
            } else if (!empty($services)) {
                $newDuration = 0;
                foreach ($services as $s) { $newDuration += intval($s['duration'] ?? 30); }
                if ($newDuration == 0) $newDuration = 60;
            }

            // Fetch potentially conflicting appointments
            $sql = "SELECT appointment_time, services_json, studio_info_json FROM appointments 
                    WHERE appointment_date = ? AND branch_id = ? AND status NOT IN ('Cancelada', 'Cancelado')";
            if ($barberId) {
                $sql .= " AND barber_id = ?";
                $stmt_check = $pdo->prepare($sql);
                $stmt_check->execute([$newDate, $branchId, $barberId]);
            } else {
                $sql .= " AND barber_id IS NULL";
                $stmt_check = $pdo->prepare($sql);
                $stmt_check->execute([$newDate, $branchId]);
            }
            
            $existing = $stmt_check->fetchAll(PDO::FETCH_ASSOC);
            $newStartMin = (intval(substr($newStartTime, 0, 2)) * 60) + intval(substr($newStartTime, 3, 2));
            $newEndMin = $newStartMin + $newDuration;

            foreach ($existing as $ext) {
                $extStartMin = (intval(substr($ext['appointment_time'], 0, 2)) * 60) + intval(substr($ext['appointment_time'], 3, 2));
                
                // Calculate existing duration
                $extDuration = 60;
                $extStudio = json_decode($ext['studio_info_json'], true);
                $extServices = json_decode($ext['services_json'], true);
                
                $isExtStudio = false;
                if (!empty($extServices)) {
                    foreach ($extServices as $es) { if (($es['category'] ?? '') === 'Music Studio') { $isExtStudio = true; break; } }
                } else if (isset($extStudio['hours'])) {
                    $isExtStudio = true;
                }

                if ($isExtStudio && isset($extStudio['hours'])) {
                    $extDuration = intval($extStudio['hours']) * 60;
                } else if (!empty($extServices)) {
                    $extDuration = 0;
                    foreach ($extServices as $es) { $extDuration += intval($es['duration'] ?? 30); }
                    if ($extDuration == 0) $extDuration = 60;
                }
                
                $extEndMin = $extStartMin + $extDuration;

                // Check for overlap: (StartA < EndB) AND (EndA > StartB)
                if ($newStartMin < $extEndMin && $newEndMin > $extStartMin) {
                    http_response_code(400);
                    echo json_encode(["error" => "Lo sentimos, este horario tiene un conflicto con otra cita. Por favor elige otro."]);
                    exit;
                }
            }
            // ------------------------------------

            $stmt = $pdo->prepare("INSERT INTO appointments (branch_id, barber_id, customer_name, customer_phone, appointment_date, appointment_time, services_json, studio_info_json, total, status) VALUES (:branch_id, :barber_id, :customer_name, :customer_phone, :appointment_date, :appointment_time, :services_json, :studio_info_json, :total, :status)");
            $stmt->execute([
                ':branch_id'        => $branchId,
                ':barber_id'        => $barberId,
                ':customer_name'    => $data['customer']['name'] ?? '',
                ':customer_phone'   => $data['customer']['phone'] ?? '',
                ':appointment_date' => $data['date'] ?? date('Y-m-d'),
                ':appointment_time' => $data['time'] ?? '12:00:00',
                ':services_json'    => json_encode($services),
                ':studio_info_json' => json_encode($data['studioInfo'] ?? null),
                ':total'            => $data['total'] ?? 0,
                ':status'           => $data['status'] ?? 'Confirmed'
            ]);
            echo json_encode(["success" => true, "id" => $pdo->lastInsertId()]);
            break;
        }

        case 'update_appointment': {
            $stmt = $pdo->prepare("UPDATE appointments SET status = :status WHERE id = :id");
            $stmt->execute([
                ':status' => $data['status'] ?? 'Confirmed',
                ':id' => $data['id']
            ]);
            echo json_encode(["success" => true]);
            break;
        }

        case 'add_barber':
            $imagePath = saveImage($data['image'] ?? '', 'barbers');
            $stmt = $pdo->prepare("INSERT INTO barbers (name, spec, status, phone, initials, worked_branches, image, username, password) VALUES (:name, :spec, :status, :phone, :initials, :worked_branches, :image, :username, :password)");
            $stmt->execute([
                ':name'            => $data['name'] ?? '',
                ':spec'            => $data['spec'] ?? '',
                ':status'          => $data['status'] ?? 'Activo',
                ':phone'           => $data['phone'] ?? '',
                ':initials'        => $data['initials'] ?? substr($data['name'] ?? 'XX', 0, 2),
                ':worked_branches' => is_array($data['workedBranches'] ?? '') ? implode(',', $data['workedBranches']) : ($data['workedBranches'] ?? '1'),
                ':image'           => $imagePath,
                ':username'        => strtolower(str_replace(' ', '', $data['name'] ?? 'barber')),
                ':password'        => $data['password'] ?? 'barrakesh'
            ]);
            echo json_encode(["success" => true, "id" => $pdo->lastInsertId()]);
            break;

        case 'update_barber':
            $imagePath = saveImage($data['image'] ?? '', 'barbers');
            $stmt = $pdo->prepare("UPDATE barbers SET name=:name, spec=:spec, status=:status, phone=:phone, worked_branches=:worked_branches, image=:image, username=:username, password=:password WHERE id=:id");
            $stmt->execute([
                ':name'            => $data['name'] ?? '', 
                ':spec'            => $data['spec'] ?? ($data['specialty'] ?? ''), 
                ':status'          => $data['status'] ?? 'Activo',
                ':phone'           => $data['phone'] ?? '',
                ':worked_branches' => is_array($data['workedBranches'] ?? '') ? implode(',', $data['workedBranches']) : ($data['workedBranches'] ?? '1'),
                ':image'           => $imagePath, 
                ':username'        => strtolower(str_replace(' ', '', $data['name'] ?? 'barber')),
                ':password'        => $data['password'] ?? 'barrakesh',
                ':id'              => $data['id']
            ]);
            echo json_encode(["success" => true]);
            break;

        case 'add_branch':
            try {
                $imagePath = saveImage($data['image'] ?? '', 'branches');
                // Ignore capacity if it doesn't exist, we put it in note
                $stmt = $pdo->prepare("INSERT INTO branches (name, addr, city, status, image, active_days, open_time, close_time, note) VALUES (:name, :addr, :city, :status, :image, :active_days, :open_time, :close_time, :note)");
                $stmt->execute([
                    ':name' => $data['name'] ?? '',
                    ':addr' => $data['addr'] ?? '',
                    ':city' => $data['city'] ?? '',
                    ':status' => $data['status'] ?? 'Operativo',
                    ':image' => $imagePath,
                    ':active_days' => is_array($data['activeDays'] ?? '') ? implode(',', $data['activeDays']) : ($data['activeDays'] ?? ''),
                    ':open_time' => $data['openTime'] ?? '11:00:00',
                    ':close_time' => $data['closeTime'] ?? '20:00:00',
                    ':note' => $data['capacity'] ?? ''
                ]);
                echo json_encode(["success" => true, "id" => $pdo->lastInsertId()]);
            } catch (Exception $e) { throw $e; }
            break;

        case 'update_branch':
            try {
                $imagePath = saveImage($data['image'] ?? '', 'branches');
                $stmt = $pdo->prepare("UPDATE branches SET name=:name, addr=:addr, city=:city, status=:status, image=:image, active_days=:active_days, open_time=:open_time, close_time=:close_time, note=:note WHERE id=:id");
                $stmt->execute([
                    ':name' => $data['name'] ?? '',
                    ':addr' => $data['addr'] ?? '',
                    ':city' => $data['city'] ?? '',
                    ':status' => $data['status'] ?? 'Operativo',
                    ':image' => $imagePath,
                    ':active_days' => is_array($data['activeDays'] ?? '') ? implode(',', $data['activeDays']) : ($data['activeDays'] ?? ''),
                    ':open_time' => $data['openTime'] ?? '11:00:00',
                    ':close_time' => $data['closeTime'] ?? '20:00:00',
                    ':note' => $data['capacity'] ?? ($data['note'] ?? ''),
                    ':id' => $data['id']
                ]);
                echo json_encode(["success" => true]);
            } catch (Exception $e) { throw $e; }
            break;

        case 'update_service':
            try {
                $stmt = $pdo->prepare("UPDATE services SET name=:name, price=:price, duration=:duration, category=:category, description=:description, branch_prices=:branch_prices, available_branches=:available_branches, tag=:tag, disabled=:disabled, price_is_variable=:price_is_variable WHERE id=:id");
                $stmt->execute([
                    ':name' => $data['name'] ?? '', ':price' => $data['price'] ?? 0, ':duration' => $data['duration'] ?? 30,
                    ':category' => $data['category'] ?? 'Barbería', 
                    ':description' => $data['desc'] ?? ($data['description'] ?? ''),
                    ':branch_prices' => json_encode($data['branchPrices'] ?? (object)[]),
                    ':available_branches' => is_array($data['availableBranches'] ?? []) ? implode(',', $data['availableBranches']) : '',
                    ':tag' => $data['tag'] ?? '',
                    ':disabled' => ($data['disabled'] ?? false) ? 1 : 0,
                    ':price_is_variable' => ($data['priceIsVariable'] ?? false) ? 1 : 0,
                    ':id' => $data['id']
                ]);
                echo json_encode(["success" => true]);
            } catch (Exception $e) {
                if (strpos($e->getMessage(), 'Unknown column') !== false) {
                    $pdo->exec("ALTER TABLE services ADD COLUMN tag VARCHAR(50) DEFAULT ''");
                    $pdo->exec("ALTER TABLE services ADD COLUMN disabled TINYINT(1) DEFAULT 0");
                    $pdo->exec("ALTER TABLE services ADD COLUMN price_is_variable TINYINT(1) DEFAULT 0");
                    
                    $stmt = $pdo->prepare("UPDATE services SET name=:name, price=:price, duration=:duration, category=:category, description=:description, branch_prices=:branch_prices, available_branches=:available_branches, tag=:tag, disabled=:disabled, price_is_variable=:price_is_variable WHERE id=:id");
                    $stmt->execute([
                        ':name' => $data['name'] ?? '', ':price' => $data['price'] ?? 0, ':duration' => $data['duration'] ?? 30,
                        ':category' => $data['category'] ?? 'Barbería', 
                        ':description' => $data['desc'] ?? ($data['description'] ?? ''),
                        ':branch_prices' => json_encode($data['branchPrices'] ?? (object)[]),
                        ':available_branches' => is_array($data['availableBranches'] ?? []) ? implode(',', $data['availableBranches']) : '',
                        ':tag' => $data['tag'] ?? '',
                        ':disabled' => ($data['disabled'] ?? false) ? 1 : 0,
                        ':price_is_variable' => ($data['priceIsVariable'] ?? false) ? 1 : 0,
                        ':id' => $data['id']
                    ]);
                    echo json_encode(["success" => true, "migrated" => true]);
                } else { throw $e; }
            }
            break;

        case 'update_settings':
            try {
                $stmt = $pdo->prepare("UPDATE settings SET site_name=:siteName, site_title=:siteTitle, site_desc=:siteDesc, og_image=:ogImage, favicon=:favicon, maintenance_mode=:maintenance_mode WHERE id=1");
                $stmt->execute([
                    ':siteName' => $data['siteName'] ?? '',
                    ':siteTitle' => $data['siteTitle'] ?? '',
                    ':siteDesc' => $data['siteDesc'] ?? '',
                    ':ogImage' => $data['ogImage'] ?? '',
                    ':favicon' => $data['favicon'] ?? '',
                    ':maintenance_mode' => ($data['maintenance_mode'] ?? false) ? 1 : 0
                ]);
            } catch (Exception $e) {
                if (strpos($e->getMessage(), 'Unknown column') !== false) {
                    $pdo->exec("ALTER TABLE settings ADD COLUMN maintenance_mode TINYINT(1) DEFAULT 0");
                    $stmt = $pdo->prepare("UPDATE settings SET site_name=:siteName, site_title=:siteTitle, site_desc=:siteDesc, og_image=:ogImage, favicon=:favicon, maintenance_mode=:maintenance_mode WHERE id=1");
                    $stmt->execute([
                        ':siteName' => $data['siteName'] ?? '', ':siteTitle' => $data['siteTitle'] ?? '', ':siteDesc' => $data['siteDesc'] ?? '',
                        ':ogImage' => $data['ogImage'] ?? '', ':favicon' => $data['favicon'] ?? '',
                        ':maintenance_mode' => ($data['maintenance_mode'] ?? false) ? 1 : 0
                    ]);
                } else { throw $e; }
            }
            echo json_encode(["success" => true]);
            break;

        case 'change_password':
            $newPass = $data['newPassword'] ?? null;
            $username = $data['username'] ?? null;
            if (!$newPass || !$username) {
                echo json_encode(["success" => false, "message" => "Faltan datos"]);
                break;
            }
            $stmt = $pdo->prepare("UPDATE admins SET password_hash = ? WHERE username = ?");
            $stmt->execute([$newPass, $username]);
            $rows = $stmt->rowCount();
            if ($rows === 0) {
                $stmt = $pdo->prepare("UPDATE barbers SET password = ? WHERE (username = ? OR name = ?)");
                $stmt->execute([$newPass, $username, $username]);
                $rows = $stmt->rowCount();
            }
            echo json_encode(["success" => $rows > 0]);
            break;

        case 'get_admins':
            $stmt = $pdo->query("SELECT id, username, role FROM admins");
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            break;

        case 'update_admin_account':
            $targetId = $data['id'] ?? null;
            $newPass = $data['newPassword'] ?? null;
            if (!$targetId || !$newPass) {
                echo json_encode(["success" => false, "message" => "Faltan datos"]);
                break;
            }
            $stmt = $pdo->prepare("UPDATE admins SET password_hash = ? WHERE id = ?");
            $stmt->execute([$newPass, $targetId]);
            echo json_encode(["success" => $stmt->rowCount() > 0]);
            break;

        case 'add_customer': {
            $stmt = $pdo->prepare("INSERT INTO customers (name, phone, email, loyalty) VALUES (:name, :phone, :email, :loyalty)");
            $stmt->execute([
                ':name'    => $data['name'] ?? '',
                ':phone'   => $data['phone'] ?? '',
                ':email'   => $data['email'] ?? '',
                ':loyalty' => $data['loyalty'] ?? 'Standard'
            ]);
            echo json_encode(["success" => true, "id" => $pdo->lastInsertId()]);
            break;
        }

        case 'update_customer': {
            $stmt = $pdo->prepare("UPDATE customers SET name=:name, phone=:phone, email=:email, loyalty=:loyalty WHERE id=:id");
            $stmt->execute([
                ':name'    => $data['name'] ?? '',
                ':phone'   => $data['phone'] ?? '',
                ':email'   => $data['email'] ?? '',
                ':loyalty' => $data['loyalty'] ?? 'Standard',
                ':id'      => $data['id']
            ]);
            echo json_encode(["success" => true]);
            break;
        }

        case 'delete_customer': {
            $stmt = $pdo->prepare("DELETE FROM customers WHERE id = ?");
            $stmt->execute([$data['id']]);
            echo json_encode(["success" => true]);
            break;
        }

        case 'delete_service': {
            $stmt = $pdo->prepare("DELETE FROM services WHERE id = ?");
            $stmt->execute([$data['id']]);
            echo json_encode(["success" => true]);
            break;
        }

        case 'delete_barber': {
            $stmt = $pdo->prepare("DELETE FROM barbers WHERE id = ?");
            $stmt->execute([$data['id']]);
            echo json_encode(["success" => true]);
            break;
        }

        case 'delete_branch': {
            $stmt = $pdo->prepare("DELETE FROM branches WHERE id = ?");
            $stmt->execute([$data['id']]);
            echo json_encode(["success" => true]);
            break;
        }

        case 'delete_appointment': {
            $stmt = $pdo->prepare("DELETE FROM appointments WHERE id = ?");
            $stmt->execute([$data['id']]);
            echo json_encode(["success" => true]);
            break;
        }

        default:
            echo json_encode(["error" => "Unknown action: $action"]);
            break;
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>
