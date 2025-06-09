


CREATE TABLE taches(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    contenu TEXT,
    statut ENUM('urgent','important','apres') DEFAULT 'apres'
);