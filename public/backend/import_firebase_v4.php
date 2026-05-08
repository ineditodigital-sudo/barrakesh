<?php
require_once 'db.php';

error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');

$jsonFile = __DIR__ . '/firebase.json';
if (!file_exists($jsonFile)) {
    die(json_encode(["error" => "firebase.json not found"]));
}

$jsonStr = file_get_contents($jsonFile);
$data = json_decode($jsonStr, true);

if (!$data) {
    die(json_encode(["error" => "Invalid JSON format"]));
}

try {
    // 1. Barbers
    if (isset($data['barbers'])) {
        $pdo->exec("TRUNCATE TABLE barbers");
        $stmt = $pdo->prepare("INSERT INTO barbers (id, name, spec, status, phone, initials, worked_branches, image) VALUES (:id, :name, :spec, :status, :phone, :initials, :worked_branches, :image)");
        // id in Firebase might be 'b1', 'b2', we'll map to INT by stripping non-numeric chars if needed, or just let auto_increment work if we don't care about ID matching.
        // Wait, appointments reference barber by JSON. Let's try to parse ID to integer.
        foreach ($data['barbers'] as $b) {
            if (!$b) continue;
            $intId = null;
            if (isset($b['id'])) {
                $intId = intval(preg_replace('/[^0-9]/', '', $b['id']));
                if ($intId == 0) $intId = null;
            }
            
            $imageUrl = '';
            if (!empty($b['image']) && preg_match('/^data:image\/(\w+);base64,/', $b['image'], $type)) {
                $ext = strtolower($type[1]);
                if (!in_array($ext, ['jpg', 'jpeg', 'png', 'gif', 'webp'])) { $ext = 'jpg'; }
                $base64data = substr($b['image'], strpos($b['image'], ',') + 1);
                $base64data = base64_decode($base64data);
                if ($base64data !== false) {
                    $fileName = 'migrated_barber_' . uniqid() . '.' . $ext;
                    $filePath = __DIR__ . '/../uploads/barbers/' . $fileName;
                    if (!is_dir(__DIR__ . '/../uploads/barbers')) {
                        mkdir(__DIR__ . '/../uploads/barbers', 0755, true);
                    }
                    file_put_contents($filePath, $base64data);
                    $imageUrl = '/uploads/barbers/' . $fileName;
                }
            } else if (!empty($b['image']) && strpos($b['image'], 'http') === 0) {
                $imageUrl = $b['image'];
            }

            $stmt->execute([
                ':id' => $intId,
                ':name' => $b['name'] ?? '',
                ':spec' => $b['spec'] ?? '',
                ':status' => $b['status'] ?? 'Activo',
                ':phone' => $b['phone'] ?? '',
                ':initials' => $b['initials'] ?? substr($b['name'] ?? 'XX', 0, 2),
                ':worked_branches' => is_array($b['workedBranches'] ?? '') ? implode(',', $b['workedBranches']) : ($b['workedBranches'] ?? '1'),
                ':image' => $imageUrl
            ]);
        }
    }

    // 2. Branches
    if (isset($data['branches'])) {
        $pdo->exec("TRUNCATE TABLE branches");
        $stmt = $pdo->prepare("INSERT INTO branches (id, name, addr, city, status, image, active_days, open_time, close_time) VALUES (:id, :name, :addr, :city, :status, :image, :active_days, :open_time, :close_time)");
        foreach ($data['branches'] as $br) {
            if (!$br) continue;
            
            $imageUrl = '';
            if (!empty($br['image']) && preg_match('/^data:image\/(\w+);base64,/', $br['image'], $type)) {
                $ext = strtolower($type[1]);
                if (!in_array($ext, ['jpg', 'jpeg', 'png', 'gif', 'webp'])) { $ext = 'jpg'; }
                $base64data = substr($br['image'], strpos($br['image'], ',') + 1);
                $base64data = base64_decode($base64data);
                if ($base64data !== false) {
                    $fileName = 'migrated_branch_' . uniqid() . '.' . $ext;
                    $filePath = __DIR__ . '/../uploads/branches/' . $fileName;
                    if (!is_dir(__DIR__ . '/../uploads/branches')) {
                        mkdir(__DIR__ . '/../uploads/branches', 0755, true);
                    }
                    file_put_contents($filePath, $base64data);
                    $imageUrl = '/uploads/branches/' . $fileName;
                }
            } else if (!empty($br['image']) && strpos($br['image'], 'http') === 0) {
                $imageUrl = $br['image'];
            }
            $stmt->execute([
                ':id' => $br['id'] ?? null,
                ':name' => $br['name'] ?? '',
                ':addr' => $br['addr'] ?? '',
                ':city' => $br['city'] ?? '',
                ':status' => $br['status'] ?? 'Operativo',
                ':image' => $imageUrl,
                ':active_days' => is_array($br['activeDays'] ?? '') ? implode(',', $br['activeDays']) : ($br['activeDays'] ?? ''),
                ':open_time' => $br['openTime'] ?? '11:00:00',
                ':close_time' => $br['closeTime'] ?? '20:00:00'
            ]);
        }
    }

    // 3. Services
    if (isset($data['services'])) {
        $pdo->exec("TRUNCATE TABLE services");
        $stmt = $pdo->prepare("INSERT INTO services (id, name, price, duration, category, description) VALUES (:id, :name, :price, :duration, :category, :description)");
        foreach ($data['services'] as $srv) {
            if (!$srv) continue;
            $intId = null;
            if (isset($srv['id'])) {
                $intId = intval(preg_replace('/[^0-9]/', '', $srv['id']));
                if ($intId == 0) $intId = null;
            }
            $stmt->execute([
                ':id' => $intId,
                ':name' => $srv['name'] ?? '',
                ':price' => floatval($srv['price'] ?? 0),
                ':duration' => intval($srv['duration'] ?? 30),
                ':category' => $srv['category'] ?? 'Barbería',
                ':description' => $srv['desc'] ?? ''
            ]);
        }
    }

    // 4. Appointments - map to real schema
    if (isset($data['appointments'])) {
        $pdo->exec("TRUNCATE TABLE appointments");

        // Build a lookup: barber Firebase key -> barber DB id (by name match)
        $barberMap = [];
        if (isset($data['barbers'])) {
            foreach ($data['barbers'] as $fbKey => $b) {
                if (!$b) continue;
                $row = $pdo->query("SELECT id FROM barbers WHERE name = " . $pdo->quote($b['name'] ?? ''))->fetch(PDO::FETCH_ASSOC);
                if ($row) $barberMap[$fbKey] = $row['id'];
            }
        }

        // Build a lookup: branch name -> branch DB id
        $branchMap = [];
        if (isset($data['branches'])) {
            foreach ($data['branches'] as $br) {
                if (!$br) continue;
                $row = $pdo->query("SELECT id FROM branches WHERE name = " . $pdo->quote($br['name'] ?? ''))->fetch(PDO::FETCH_ASSOC);
                if ($row) $branchMap[$br['name']] = $row['id'];
            }
        }

        $stmt = $pdo->prepare(
            "INSERT INTO appointments
                (branch_id, barber_id, customer_name, customer_phone, appointment_date, appointment_time,
                 services_json, studio_info_json, total, status, created_at)
             VALUES
                (:branch_id, :barber_id, :customer_name, :customer_phone, :appointment_date, :appointment_time,
                 :services_json, :studio_info_json, :total, :status, :created_at)"
        );

        foreach ($data['appointments'] as $app) {
            if (!$app) continue;

            $dt = new DateTime();
            if (isset($app['createdAt'])) {
                $dt->setTimestamp(intval($app['createdAt'] / 1000));
            }

            // Resolve barber_id
            $barberId = null;
            if (isset($app['barber'])) {
                $barberName = $app['barber']['name'] ?? '';
                $row = $pdo->query("SELECT id FROM barbers WHERE name = " . $pdo->quote($barberName))->fetch(PDO::FETCH_ASSOC);
                if ($row) $barberId = $row['id'];
            }

            // Resolve branch_id from location string
            $branchId = null;
            $locationStr = $app['location'] ?? ($app['studioInfo']['name'] ?? '');
            if ($locationStr) {
                foreach ($branchMap as $brName => $brId) {
                    if (stripos($locationStr, $brName) !== false) {
                        $branchId = $brId;
                        break;
                    }
                }
            }

            $customerName = '';
            $customerPhone = '';
            if (isset($app['customer'])) {
                $customerName  = $app['customer']['name']  ?? '';
                $customerPhone = $app['customer']['phone'] ?? '';
            }

            // Parse date - Firebase stores 'YYYY-MM-DD'
            $appDate = $app['date'] ?? null;
            if ($appDate) {
                try {
                    $d = new DateTime($appDate);
                    $appDate = $d->format('Y-m-d');
                } catch (Exception $ex) { $appDate = null; }
            }

            // Parse time
            $appTime = $app['time'] ?? null;
            if ($appTime) {
                try {
                    $t = new DateTime($appTime);
                    $appTime = $t->format('H:i:s');
                } catch (Exception $ex) {
                    // keep as-is (already "HH:MM" format)
                    $appTime = $appTime . ':00';
                }
            }

            $stmt->execute([
                ':branch_id'       => $branchId,
                ':barber_id'       => $barberId,
                ':customer_name'   => $customerName,
                ':customer_phone'  => $customerPhone,
                ':appointment_date'=> $appDate,
                ':appointment_time'=> $appTime,
                ':services_json'   => json_encode($app['services'] ?? []),
                ':studio_info_json'=> json_encode($app['studioInfo'] ?? []),
                ':total'           => floatval($app['total'] ?? 0),
                ':status'          => $app['status'] ?? 'Confirmado',
                ':created_at'      => $dt->format('Y-m-d H:i:s'),
            ]);
        }
    }
    echo json_encode(["success" => true, "message" => "Database imported successfully!"]);

} catch (Exception $e) {
    echo json_encode(["error" => "Import failed: " . $e->getMessage(), "line" => $e->getLine()]);
}
?>
