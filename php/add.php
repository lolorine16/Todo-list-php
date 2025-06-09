
<?php
require_once 'db.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$contenu = trim($data['contenu'] ?? '');
$statut = strtolower(trim($data['statut'] ?? ''));

$validStatuts = ['urgent', 'important', 'apres'];

if ($contenu && in_array($statut, $validStatuts)) {
    $stmt = $pdo->prepare("INSERT INTO taches (contenu, statut) VALUES (?, ?)");
    $stmt->execute([$contenu, $statut]);
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Entrée invalide']);
}
?>

