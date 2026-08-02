-- =====================================================
-- SCRIPT MYSQL CORRIGÉ POUR LA TABLE CONTACTS
-- FastCube Backend - Version 1.0
-- =====================================================

-- Créer la base de données si elle n'existe pas
CREATE DATABASE IF NOT EXISTS fastcube CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Utiliser la base de données
USE fastcube;

-- Supprimer la table si elle existe déjà (pour recréation)
DROP TABLE IF EXISTS contacts;

-- Créer la table contacts avec la structure compatible avec le contrôleur
CREATE TABLE contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  
  -- Informations personnelles
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NULL,
  company VARCHAR(255) NULL,
  city VARCHAR(100) NULL,
  country VARCHAR(100) NULL,
  
  -- Détails du contact
  category VARCHAR(100) DEFAULT 'general',
  subject VARCHAR(255) NOT NULL DEFAULT 'Contact depuis le site',
  message TEXT NOT NULL,
  priority ENUM('low', 'normal', 'high', 'urgent') DEFAULT 'normal',
  preferred_contact ENUM('email', 'phone', 'whatsapp') DEFAULT 'email',
  
  -- Gestion du statut
  status ENUM('new', 'in_progress', 'responded', 'closed') DEFAULT 'new',
  
  -- Horodatage
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Index pour optimiser les performances
  INDEX idx_email (email),
  INDEX idx_status (status),
  INDEX idx_priority (priority),
  INDEX idx_created_at (created_at),
  INDEX idx_category (category)
  
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insérer des données de test
INSERT INTO contacts (
  first_name, last_name, email, phone, company, city, country,
  category, subject, message, priority, preferred_contact, status
) VALUES 
(
  'Ahmed', 'Benali', 'ahmed.test@example.com', '+212 666 123 456', 
  'TechStart Maroc', 'Casablanca', 'Maroc',
  'développement', 'Développement d\'application mobile',
  'Bonjour, nous cherchons à développer une application mobile pour notre startup.',
  'high', 'email', 'new'
),
(
  'Fatima', 'El Amrani', 'fatima.test@example.com', '+212 522 789 123',
  'Entreprise Plus', 'Rabat', 'Maroc',
  'web', 'Site web e-commerce',
  'Nous souhaitons créer un site web e-commerce pour nos produits artisanaux.',
  'normal', 'phone', 'new'
);

-- Vérifier la création
SELECT 'Table contacts créée avec succès!' as message;
DESCRIBE contacts;
SELECT COUNT(*) as total_contacts FROM contacts;

