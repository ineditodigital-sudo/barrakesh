<?php
require_once 'db.php';

// Check barbers table schema for username/password columns
$cols = $pdo->query("DESCRIBE barbers")->fetchAll(PDO::FETCH_ASSOC);
echo "=== BARBERS SCHEMA ===\n";
foreach ($cols as $c) echo $c['Field'] . " (" . $c['Type'] . ")\n";

echo "\n=== BARBERS DATA (no password shown) ===\n";
$rows = $pdo->query("SELECT id, name, status, worked_branches FROM barbers")->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($rows, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

// Check if username/password columns exist
$hasUsername = false; $hasPassword = false;
foreach ($cols as $c) {
    if ($c['Field'] === 'username') $hasUsername = true;
    if ($c['Field'] === 'password') $hasPassword = true;
}
echo "\n\nHas username col: " . ($hasUsername ? 'YES' : 'NO') . "\n";
echo "Has password col: " . ($hasPassword ? 'YES' : 'NO') . "\n";
?>
