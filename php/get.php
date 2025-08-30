<?php
require_once 'db.php';
header('Content-Type: application/json');

$stmt = $pdo->query("SELECT id, contenu, statut, date_echeance, date_creation FROM taches ORDER BY 
    CASE 
        WHEN date_echeance IS NULL THEN 1 
        ELSE 0 
    END, 
    date_echeance ASC, 
    id DESC");
$taches = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($taches);
?>
