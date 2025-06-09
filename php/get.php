<?php
require_once 'db.php';
header('Content-Type: application/json');

$stmt = $pdo->query("SELECT * FROM taches ORDER BY id DESC");
$taches = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($taches);
?>
