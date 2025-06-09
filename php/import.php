<?php
require_once 'db.php';
header('Content-Type: application/json');

if (isset($_FILES['xmlFile']) && $_FILES['xmlFile']['error'] === UPLOAD_ERR_OK) {
    $file = $_FILES['xmlFile']['tmp_name'];
    $xml = simplexml_load_file($file);

    foreach ($xml->tache as $tache) {
        $contenu = trim((string)$tache);
        if ($contenu !== '') {
            $stmt = $pdo->prepare("INSERT INTO taches (contenu, statut) VALUES (?, 'apres')");
            $stmt->execute([$contenu]);
        }
    }

    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Erreur lors de l\'importation du fichier.']);
}
exit;
?>
