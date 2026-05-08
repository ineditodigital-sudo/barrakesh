<?php
require_once 'db.php';
$stmt = $pdo->query("SHOW VARIABLES LIKE 'max_allowed_packet'");
$row = $stmt->fetch(PDO::FETCH_ASSOC);
echo "max_allowed_packet: " . $row['Value'];
?>
