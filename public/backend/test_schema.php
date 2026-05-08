<?php
require_once 'db.php';
try {
    $tables = ['barbers', 'branches', 'services'];
    $schema = [];
    foreach($tables as $t) {
        $stmt = $pdo->query("DESCRIBE $t");
        $schema[$t] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    echo json_encode($schema);
} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>
