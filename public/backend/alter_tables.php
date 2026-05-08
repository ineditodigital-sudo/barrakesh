<?php
require_once 'db.php';

try {
    $pdo->exec("ALTER TABLE barbers MODIFY image LONGTEXT");
    $pdo->exec("ALTER TABLE branches MODIFY image LONGTEXT");
    echo "Columns altered successfully.";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
