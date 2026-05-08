<?php
require_once 'db.php';
$stmt = $pdo->query("SELECT id, name, addr, city, status, active_days, open_time, close_time, note FROM branches");
echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
?>
