-- =====================================================
-- CRÉATION DE LA TABLE CHATBOT_LOGS POUR FASTCUBE
-- Base de données MySQL
-- =====================================================

-- Créer la base de données si elle n'existe pas
CREATE DATABASE IF NOT EXISTS fastcube CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Utiliser la base de données
USE fastcube;

-- Supprimer la table si elle existe déjà
DROP TABLE IF EXISTS chatbot_logs;

-- Créer la table chatbot_logs pour l'analyse des tendances
CREATE TABLE chatbot_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  
  -- Informations utilisateur
  user_id VARCHAR(255) NULL COMMENT 'ID de l\'utilisateur (peut être null pour anonymes)',
  session_id VARCHAR(255) NULL COMMENT 'ID de session du chatbot',
  
  -- Contenu du message
  message TEXT NOT NULL COMMENT 'Message de l\'utilisateur',
  intent VARCHAR(100) NOT NULL COMMENT 'Intention détectée par le chatbot',
  confidence DECIMAL(3,2) DEFAULT 0.00 COMMENT 'Niveau de confiance de l\'intention (0.00-1.00)',
  
  -- Métadonnées
  user_agent TEXT NULL COMMENT 'User-Agent du navigateur',
  ip_address VARCHAR(45) NULL COMMENT 'Adresse IP de l\'utilisateur',
  response_time_ms INT NULL COMMENT 'Temps de réponse en millisecondes',
  
  -- Horodatage
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Index pour optimiser les performances
  INDEX idx_user_id (user_id),
  INDEX idx_session_id (session_id),
  INDEX idx_intent (intent),
  INDEX idx_created_at (created_at),
  INDEX idx_confidence (confidence)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insérer des données de test (optionnel)
INSERT INTO chatbot_logs (user_id, session_id, message, intent, confidence, response_time_ms) VALUES 
('user_1', 'session-1-2024', 'Bonjour, quels sont vos services ?', 'services', 0.95, 1200),
('user_2', 'session-2-2024', 'Combien coûte un site web ?', 'pricing', 0.88, 800),
('user_1', 'session-1-2024', 'Peux-tu résumer ce texte...', 'resume', 0.92, 1500),
('user_3', 'session-3-2024', 'Aide-moi à écrire une lettre de motivation', 'assistant_rh', 0.90, 2000),
('user_2', 'session-2-2024', 'Merci pour votre aide', 'goodbye', 0.85, 600);

-- Afficher la structure de la table
DESCRIBE chatbot_logs;

-- Afficher les données de test
SELECT * FROM chatbot_logs;

-- Afficher les statistiques
SELECT 
  COUNT(*) as total_messages,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(DISTINCT session_id) as unique_sessions,
  AVG(confidence) as avg_confidence,
  AVG(response_time_ms) as avg_response_time
FROM chatbot_logs;
