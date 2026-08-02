-- Table des solutions FASTCUBE
CREATE TABLE IF NOT EXISTS solutions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  image_url VARCHAR(500),
  features JSON,
  benefits TEXT,
  use_cases TEXT,
  pricing_info TEXT,
  status ENUM('active', 'inactive', 'coming_soon') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Index pour améliorer les performances
CREATE INDEX idx_solutions_category ON solutions(category);
CREATE INDEX idx_solutions_status ON solutions(status);

-- Insertion de solutions de base
INSERT INTO solutions (
  title, description, category, image_url, features, benefits, use_cases, pricing_info, status
) VALUES 
(
  'Solution de Cybersécurité Avancée',
  'Protection complète contre les menaces cybernétiques avec surveillance 24/7',
  'Sécurité',
  'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80',
  '["Surveillance 24/7", "Détection d'intrusion", "Réponse automatisée", "Audit de sécurité", "Formation des équipes"]',
  'Protection maximale de vos données sensibles et conformité RGPD',
  'Entreprises de toutes tailles, institutions financières, administrations',
  'À partir de 5000 MAD/mois',
  'active'
),
(
  'Infrastructure Cloud Hybride',
  'Migration et optimisation de votre infrastructure vers le cloud',
  'Cloud',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
  '["Migration sécurisée", "Optimisation des coûts", "Haute disponibilité", "Sauvegarde automatique", "Monitoring avancé"]',
  'Réduction des coûts de 40% et amélioration de la performance',
  'PME, startups, entreprises en croissance',
  'Sur devis selon la complexité',
  'active'
),
(
  'Plateforme IA pour l\'Analyse Prédictive',
  'Intelligence artificielle pour l\'analyse de données et prédictions',
  'IA',
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=600&q=80',
  '["Machine Learning", "Analyse prédictive", "Tableaux de bord", "API REST", "Intégration facile"]',
  'Amélioration de la prise de décision et optimisation des processus',
  'E-commerce, finance, santé, logistique',
  'À partir de 3000 MAD/mois',
  'coming_soon'
);












