<?php
// backend/api.php
require_once 'db.php';

header('Content-Type: application/json');

$action = $_GET['action'] ?? '';

try {
    switch($action) {
        case 'get_initial_data':
            
            // 1. SETTINGS
            $settings = [];
            try {
                $settings = $pdo->query("SELECT * FROM settings WHERE id = 1")->fetch(PDO::FETCH_ASSOC);
            } catch (Exception $e) { /* Ignore if table doesn't exist */ }
            
            $defaults = [
                'siteName' => 'Barrakesh', 
                'siteTitle' => 'Barrakesh | Barbería', 
                'siteDesc' => 'Cargando...',
                'maintenance_mode' => 0,
                'ogImage' => '',
                'favicon' => ''
            ];
            $settings = array_merge($defaults, $settings ?: []);

            // 2. BARBERS
            $barbers = [];
            $errors = [];
            try {
                $barbers = $pdo->query("SELECT * FROM barbers ORDER BY id ASC")->fetchAll(PDO::FETCH_ASSOC);
                foreach($barbers as &$barber) {
                    $barber['workedBranches'] = ($barber['worked_branches'] ?? '') ? array_map('intval', explode(',', $barber['worked_branches'])) : [1];
                }
            } catch (Exception $e) { $errors['barbers'] = $e->getMessage(); }

            // 3. BRANCHES
            $branches = [];
            try {
                $branchesRaw = $pdo->query("SELECT * FROM branches ORDER BY id ASC")->fetchAll(PDO::FETCH_ASSOC);
                foreach($branchesRaw as $br) {
                    $branches[] = [
                        'id' => $br['id'],
                        'name' => $br['name'],
                        'addr' => $br['addr'],
                        'city' => $br['city'],
                        'status' => $br['status'],
                        'image' => $br['image'],
                        'capacity' => $br['note'] ?? '', // Mapping note to capacity for frontend
                        'activeDays' => ($br['active_days'] ?? '') !== '' ? array_map('intval', explode(',', $br['active_days'])) : [1,2,3,4,5,6],
                        'openTime' => substr($br['open_time'] ?? '11:00:00', 0, 5),
                        'closeTime' => substr($br['close_time'] ?? '20:00:00', 0, 5),
                        'note' => $br['note'] ?? ''
                    ];
                }
            } catch (Exception $e) { $errors['branches'] = $e->getMessage(); }
            
            if (empty($branches)) {
                $branches = [[
                    'id' => 1, 'name' => 'BK MATRIZ', 'addr' => 'Av. Principal 123', 'city' => 'Aguascalientes',
                    'status' => 'Operativo', 'activeDays' => [1,2,3,4,5,6], 'openTime' => '11:00', 'closeTime' => '20:00',
                    'capacity' => '2 sillas'
                ]];
            }

            // 4. SERVICES
            $services = [];
            try {
                $servicesRaw = $pdo->query("SELECT * FROM services ORDER BY category ASC")->fetchAll(PDO::FETCH_ASSOC);
                foreach($servicesRaw as $srv) {
                    $services[] = [
                        'id' => $srv['id'],
                        'name' => $srv['name'],
                        'price' => floatval($srv['price']),
                        'duration' => intval($srv['duration']),
                        'category' => $srv['category'],
                        'desc' => $srv['description'],
                        'branchPrices' => json_decode($srv['branch_prices'] ?? '{}', true),
                        'availableBranches' => ($srv['available_branches'] ?? '') !== '' ? array_map('intval', explode(',', $srv['available_branches'])) : []
                    ];
                }
            } catch (Exception $e) { $errors['services'] = $e->getMessage(); }

            // 5. APPOINTMENTS
            $appointments = [];
            try {
                // Fetch with barber name join
                $stmtA = $pdo->query("SELECT a.*, b.name as barber_name FROM appointments a LEFT JOIN barbers b ON a.barber_id = b.id ORDER BY a.appointment_date DESC LIMIT 200");
                $aptsRaw = $stmtA->fetchAll(PDO::FETCH_ASSOC);
                foreach($aptsRaw as $a) {
                    $appointments[] = [
                        'id' => $a['id'],
                        'date' => $a['appointment_date'],
                        'time' => substr($a['appointment_time'], 0, 5),
                        'customer' => [
                            'name' => $a['customer_name'],
                            'phone' => $a['customer_phone']
                        ],
                        'barber' => $a['barber_name'], // For filtering in GeneralAgenda
                        'barberId' => $a['barber_id'], // For filtering in BarberAgenda
                        'services' => json_decode($a['services_json'] ?? '[]', true),
                        'studioInfo' => json_decode($a['studio_info_json'] ?? '[]', true),
                        'total' => $a['total'],
                        'status' => $a['status']
                    ];
                }
            } catch (Exception $e) { $errors['appointments'] = $e->getMessage(); }

            echo json_encode([
                "settings" => $settings,
                "barbers" => $barbers,
                "branches" => $branches,
                "services" => $services,
                "appointments" => $appointments,
                "debug_errors" => $errors
            ]);
            break;

        default:
            echo json_encode(["error" => "Invalid action"]);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>
