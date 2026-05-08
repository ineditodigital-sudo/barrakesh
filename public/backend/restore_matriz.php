<?php
require_once 'db.php';

// First force update the address regardless
$pdo->exec("UPDATE branches SET addr = 'C. Parras 72-local 4, Bosques del Prado Oriente, 20159 Aguascalientes, Ags.' WHERE id = 1");

// Show final state
$check = $pdo->query("SELECT id, name, addr, city, status, active_days, open_time, close_time, note FROM branches WHERE id = 1")->fetch(PDO::FETCH_ASSOC);
echo json_encode($check, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
?>
