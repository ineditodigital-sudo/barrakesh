<?php
require_once 'db.php';
$stmt = $pdo->query("SELECT * FROM admins");
$admins = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($admins);
