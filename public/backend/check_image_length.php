<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$jsonStr = file_get_contents(__DIR__ . '/firebase.json');
$data = json_decode($jsonStr, true);

foreach ($data['barbers'] as $b) {
    if (!$b) continue;
    echo "Barber: " . $b['name'] . ", Image length: " . strlen($b['image'] ?? '') . "<br>";
}
?>
