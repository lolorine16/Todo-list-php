<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

try {
    $pdo = new PDO("mysql:host=localhost:3306;dbname=todo_db;charset=utf8", "username", "mdp"); # n'oublie pas de modifier cette ligne !!!!
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die(json_encode(['success' => false, 'error' => 'Connexion échouée : ' . $e->getMessage()]));
}
?>
