
<?php
require_once 'db.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$contenu = trim($data['contenu'] ?? '');
$statut = strtolower(trim($data['statut'] ?? ''));
$date_echeance = $data['date_echeance'] ?? null;

$validStatuts = ['urgent', 'important', 'apres'];

if ($contenu && in_array($statut, $validStatuts)) {
    // Préparer la requête selon qu'on a une date d'échéance ou non
    if ($date_echeance && $date_echeance !== '') {
        $stmt = $pdo->prepare("INSERT INTO taches (contenu, statut, date_echeance) VALUES (?, ?, ?)");
        $stmt->execute([$contenu, $statut, $date_echeance]);
    } else {
        $stmt = $pdo->prepare("INSERT INTO taches (contenu, statut) VALUES (?, ?)");
        $stmt->execute([$contenu, $statut]);
    }
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Entrée invalide']);
}
?>

