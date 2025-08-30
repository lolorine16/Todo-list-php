<?php
require_once 'db.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$id = intval($data['id']);
$contenu = trim($data['contenu'] ?? '');
$date_echeance = $data['date_echeance'] ?? null;

if ($id > 0 && $contenu) {
    if (isset($data['date_echeance'])) {
        // Modifier le contenu et la date d'échéance
        $stmt = $pdo->prepare("UPDATE taches SET contenu = ?, date_echeance = ? WHERE id = ?");
        $stmt->execute([$contenu, $date_echeance ?: null, $id]);
    } else {
        // Modifier seulement le contenu
        $stmt = $pdo->prepare("UPDATE taches SET contenu = ? WHERE id = ?");
        $stmt->execute([$contenu, $id]);
    }
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Modification invalide']);
}
?>
