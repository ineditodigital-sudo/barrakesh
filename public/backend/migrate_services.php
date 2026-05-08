<?php
require_once 'db.php';

// Add available_branches to services if it doesn't exist
try {
    $pdo->exec("ALTER TABLE services ADD COLUMN available_branches TEXT");
    echo "✅ Added available_branches to services\n";
} catch (Exception $e) {
    echo "ℹ️ available_branches already exists or error: " . $e->getMessage() . "\n";
}

// Ensure branch_prices exists
try {
    $pdo->exec("ALTER TABLE services ADD COLUMN branch_prices TEXT");
    echo "✅ Added branch_prices to services\n";
} catch (Exception $e) {
    echo "ℹ️ branch_prices already exists or error: " . $e->getMessage() . "\n";
}

echo "Schema update done.\n";
?>
