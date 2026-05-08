<?php
require_once 'db.php';

$stmt = $pdo->query("SHOW COLUMNS FROM services");
$columns = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo "--- SERVICES SCHEMA ---\n";
print_r($columns);

$stmt = $pdo->query("SHOW COLUMNS FROM branches");
$columns = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo "\n--- BRANCHES SCHEMA ---\n";
print_r($columns);
?>
