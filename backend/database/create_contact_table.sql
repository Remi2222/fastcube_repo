-- =====================================================
-- CRÉATION DE LA TABLE CONTACT POUR FASTCUBE
-- Base de données MySQL
-- =====================================================

-- Créer la base de données si elle n'existe pas
CREATE DATABASE IF NOT EXISTS fastcube CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Utiliser la base de données
USE fastcube;

-- Supprimer la table si elle existe déjà
DROP TABLE IF EXISTS contacts;

-- Créer la table contacts avec la structure complète
CREATE TABLE contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  
  -- Informations personnelles
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20) NULL,
  company VARCHAR(255) NULL,
  city VARCHAR(100) NULL,
  country VARCHAR(100) NULL,
  
  -- Détails du projet
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  services JSON NULL COMMENT 'Services sélectionnés (tableau JSON)',
  budget ENUM('5k-15k', '15k-50k', '50k-100k', '100k+') NULL,
  timeline ENUM('1-2-weeks', '1-month', '2-3-months', '3+months') NULL,
  
  -- Gestion du contact
  category VARCHAR(100) NULL COMMENT 'Catégorie principale basée sur les services',
  priority ENUM('low', 'normal', 'high', 'urgent') DEFAULT 'normal',
  preferred_contact ENUM('email', 'phone', 'whatsapp') DEFAULT 'email',
  status ENUM('new', 'in_progress', 'responded', 'closed') DEFAULT 'new',
  
  -- Métadonnées
  source VARCHAR(50) DEFAULT 'website' COMMENT 'Source du contact (website, mobile, api)',
  ip_address VARCHAR(45) NULL COMMENT 'Adresse IP du visiteur',
  user_agent TEXT NULL COMMENT 'User-Agent du navigateur',
  
  -- Fichiers et réponses
  attachments TEXT NULL COMMENT 'Liste des fichiers joints (JSON)',
  ai_response TEXT NULL COMMENT 'Réponse automatique IA',
  
  -- Horodatage
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  responded_at TIMESTAMP NULL COMMENT 'Date de première réponse',
  
  -- Index pour optimiser les performances
  INDEX idx_email (email),
  INDEX idx_status (status),
  INDEX idx_priority (priority),
  INDEX idx_created_at (created_at),
  INDEX idx_source (source),
  INDEX idx_company (company),
  INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insérer des données de test (optionnel)
INSERT INTO contacts (
  first_name, last_name, email, phone, company, subject, message, 
  services, budget, timeline, priority, source
) VALUES 
(
  'Ahmed', 'Benali', 'ahmed.benali@example.com', '+212 666 123 456', 
  'TechStart Maroc', 'Développement d\'application mobile',
  'Bonjour, nous cherchons à développer une application mobile pour notre startup. Nous avons besoin d\'une solution moderne et évolutive.',
  '["Applications Mobiles", "Développement Web"]', '15k-50k', '2-3-months', 'high', 'website'
),
(
  'Fatima', 'El Amrani', 'fatima.elamrani@entreprise.ma', '+212 522 789 123',
  'Entreprise Plus', 'Site web e-commerce',
  'Nous souhaitons créer un site web e-commerce pour vendre nos produits artisanaux marocains.',
  '["Développement Web", "E-commerce"]', '5k-15k', '1-month', 'normal', 'website'
);

-- Afficher la structure de la table
DESCRIBE contacts;

-- Afficher les données de test
SELECT * FROM contacts;

-- Afficher les statistiques
SELECT 
  COUNT(*) as total_contacts,
  COUNT(CASE WHEN status = 'new' THEN 1 END) as new_contacts,
  COUNT(CASE WHEN status = 'responded' THEN 1 END) as responded_contacts,
  COUNT(CASE WHEN priority = 'high' THEN 1 END) as high_priority_contacts
FROM contacts;
