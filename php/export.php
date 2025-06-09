<?php
require_once 'db.php';

header('Content-Type: application/xml');
header('Content-Disposition: attachment; filename="export.xml"');

$xml = new SimpleXMLElement('<?xml version="1.0" encoding="UTF-8"?><taches></taches>');

$stmt = $pdo->query("SELECT contenu FROM taches");
$taches = $stmt->fetchAll(PDO::FETCH_ASSOC);

foreach ($taches as $tache) {
    $xml->addChild('tache', htmlspecialchars($tache['contenu']));
}

echo $xml->asXML();
exit;
?>