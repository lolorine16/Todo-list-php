<?php
require_once 'db.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$id = intval($data['id']);
$statut = trim($data['statut'] ?? '');

// Vérifier que le statut est valide
$statutsValides = ['urgent', 'important', 'apres'];

if ($id > 0 && in_array($statut, $statutsValides)) {
    $stmt = $pdo->prepare("UPDATE taches SET statut = ? WHERE id = ?");
    $stmt->execute([$statut, $id]);
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Modification du statut invalide']);
}
?>
