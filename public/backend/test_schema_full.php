<?php
require_once 'db.php';

$stmt = $pdo->query("SHOW COLUMNS FROM appointments");
$columns = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo "<pre>";
print_r($columns);
echo "</pre>";
?>
