<?php
require_once 'db.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$id = intval($data['id']);
$contenu = trim($data['contenu'] ?? '');

if ($id > 0 && $contenu) {
    $stmt = $pdo->prepare("UPDATE taches SET contenu = ? WHERE id = ?");
    $stmt->execute([$contenu, $id]);
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Modification invalide']);
}
?>
