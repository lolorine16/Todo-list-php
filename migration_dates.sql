-- Migration pour ajouter les dates d'échéance
-- Exécuter cette commande dans MySQL pour ajouter la fonctionnalité

ALTER TABLE taches 
ADD COLUMN date_echeance DATE DEFAULT NULL,
ADD COLUMN date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Ajouter un index pour optimiser les requêtes par date
CREATE INDEX idx_date_echeance ON taches(date_echeance);
