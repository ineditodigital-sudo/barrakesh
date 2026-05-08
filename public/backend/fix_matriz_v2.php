<?php
require_once 'db.php';

// Force update the address with correct original data from Firebase
$pdo->exec("UPDATE branches SET 
    name        = 'Matriz - Barber & Estudio de Grabación',
    addr        = 'C. Parras 72-local 4, Bosques del Prado Oriente, 20159 Aguascalientes, Ags.',
    city        = 'Aguascalientes',
    status      = 'Operativo',
    active_days = '1,2,3,4,5,6',
    open_time   = '11:00:00',
    close_time  = '20:00:00',
    note        = '2 sillas'
WHERE id = 1");

echo "Done. Row count: " . $pdo->query("SELECT ROW_COUNT()")->fetchColumn() . "\n";

// Show final state
$check = $pdo->query("SELECT id, name, addr, city, status, active_days, open_time, close_time, note FROM branches WHERE id = 1")->fetch(PDO::FETCH_ASSOC);
echo json_encode($check, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
?>
