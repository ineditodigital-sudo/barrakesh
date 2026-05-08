<?php
require_once 'db.php';

// Add username and password columns to barbers if missing
$cols = $pdo->query("DESCRIBE barbers")->fetchAll(PDO::FETCH_COLUMN);
echo "Current columns: " . implode(', ', $cols) . "\n\n";

if (!in_array('username', $cols)) {
    $pdo->exec("ALTER TABLE barbers ADD COLUMN username VARCHAR(100) DEFAULT NULL");
    echo "✅ Added username column\n";
} else {
    echo "ℹ️ username already exists\n";
}

if (!in_array('password', $cols)) {
    $pdo->exec("ALTER TABLE barbers ADD COLUMN password VARCHAR(255) DEFAULT 'barrakesh'");
    echo "✅ Added password column with default 'barrakesh'\n";
} else {
    echo "ℹ️ password already exists\n";
}

// Set username = lowercase name (no spaces) and default password for existing barbers
$pdo->exec("UPDATE barbers SET username = LOWER(REPLACE(name, ' ', '')) WHERE username IS NULL OR username = ''");
$pdo->exec("UPDATE barbers SET password = 'barrakesh' WHERE password IS NULL OR password = ''");

// Show result
$barbers = $pdo->query("SELECT id, name, username, password FROM barbers")->fetchAll(PDO::FETCH_ASSOC);
echo "\n=== Updated barbers ===\n";
foreach ($barbers as $b) {
    echo "ID: {$b['id']} | Name: {$b['name']} | Username: {$b['username']} | Pass: {$b['password']}\n";
}
echo "\nDone!\n";
?>
