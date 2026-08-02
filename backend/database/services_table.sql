-- Table des services FASTCUBE
CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  description TEXT NOT NULL,
  long_description LONGTEXT,
  category VARCHAR(100) NOT NULL,
  subcategory VARCHAR(100),
  features JSON,
  benefits JSON,
  price VARCHAR(100),
  duration VARCHAR(100),
  level ENUM('Débutant', 'Intermédiaire', 'Avancé') DEFAULT 'Intermédiaire',
  popular BOOLEAN DEFAULT FALSE,
  image_url VARCHAR(500),
  color VARCHAR(100),
  bg_color VARCHAR(100),
  status ENUM('actif', 'inactif', 'brouillon') DEFAULT 'actif',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Index pour améliorer les performances
CREATE INDEX idx_services_category ON services(category);
CREATE INDEX idx_services_status ON services(status);
CREATE INDEX idx_services_popular ON services(popular);

-- Insertion des services de base
INSERT INTO services (
  title, subtitle, description, long_description, 
  category, subcategory, features, benefits, 
  price, duration, level, popular, 
  image_url, color, bg_color
) VALUES 
(
  'Cybersécurité Avancée',
  'Protection complète de vos infrastructures',
  'Solutions de sécurité intégrées pour protéger vos données et systèmes contre les menaces cybernétiques.',
  'Notre expertise en cybersécurité couvre tous les aspects de la protection numérique : pare-feu nouvelle génération, détection d''intrusion, gestion des identités, cryptage des données et conformité réglementaire.',
  'Sécurité',
  'Protection',
  '["Pare-feu nouvelle génération (NGFW)", "Détection et réponse aux menaces (EDR)", "Gestion des identités et accès (IAM)", "Chiffrement des données sensibles", "Conformité RGPD et ISO 27001", "Audit de sécurité régulier"]',
  '["Protection contre 99.9% des menaces", "Réduction de 80% des incidents", "Conformité réglementaire garantie", "Support 24/7 spécialisé"]',
  'Sur devis',
  'Déploiement en 2-4 semaines',
  'Avancé',
  TRUE,
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80',
  'from-red-500 to-red-600',
  'bg-red-50'
),
(
  'Infrastructure Réseau',
  'Réseaux haute performance et fiables',
  'Conception et déploiement d''infrastructures réseau robustes et évolutives.',
  'Nous concevons des architectures réseau modernes qui garantissent performance, fiabilité et évolutivité. De la planification initiale à la maintenance continue.',
  'Infrastructure',
  'Réseau',
  '["Architecture réseau sur-mesure", "VLAN et segmentation avancée", "Load balancing et haute disponibilité", "Monitoring et supervision 24/7", "Optimisation des performances", "Documentation complète"]',
  '["99.9% de disponibilité garantie", "Réduction de 60% des temps de réponse", "Évolutivité sans interruption", "Support technique dédié"]',
  'À partir de 5000 MAD',
  'Déploiement en 3-6 semaines',
  'Intermédiaire',
  FALSE,
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
  'from-blue-500 to-blue-600',
  'bg-blue-50'
),
(
  'Solutions Cloud',
  'Migration et gestion cloud moderne',
  'Migration vers le cloud et gestion de solutions cloud modernes pour optimiser vos performances.',
  'Accompagnement complet dans votre transformation cloud : audit, migration, optimisation et gestion continue de vos environnements cloud.',
  'Cloud',
  'Migration',
  '["Audit et stratégie cloud", "Migration sécurisée des données", "Optimisation des coûts cloud", "Gestion multi-cloud", "Sauvegarde et reprise d''activité", "Monitoring et alertes"]',
  '["Réduction de 40% des coûts IT", "Amélioration de 70% des performances", "Flexibilité et évolutivité", "Sécurité renforcée"]',
  'À partir de 8000 MAD',
  'Migration en 4-8 semaines',
  'Avancé',
  TRUE,
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
  'from-green-500 to-green-600',
  'bg-green-50'
),
(
  'Développement Web',
  'Sites et applications web modernes',
  'Création de sites web et applications web performants et responsives.',
  'Développement de solutions web sur-mesure utilisant les technologies les plus récentes : React, Node.js, Python, et plus encore.',
  'Développement',
  'Web',
  '["Sites web responsives", "Applications web progressives (PWA)", "E-commerce et CMS", "APIs RESTful", "Optimisation SEO", "Maintenance et support"]',
  '["Sites ultra-rapides", "Design moderne et professionnel", "Optimisation pour mobile", "Support technique continu"]',
  'À partir de 3000 MAD',
  'Développement en 2-6 semaines',
  'Débutant',
  FALSE,
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
  'from-purple-500 to-purple-600',
  'bg-purple-50'
),
(
  'Intelligence Artificielle',
  'Solutions IA et machine learning',
  'Intégration de l''intelligence artificielle dans vos processus métier.',
  'Développement de solutions IA personnalisées : chatbots intelligents, analyse prédictive, automatisation des processus et plus encore.',
  'IA',
  'Machine Learning',
  '["Chatbots intelligents", "Analyse prédictive", "Automatisation des processus", "Traitement du langage naturel", "Vision par ordinateur", "Recommandations personnalisées"]',
  '["Automatisation de 70% des tâches", "Amélioration de la prise de décision", "Expérience client personnalisée", "Innovation technologique"]',
  'Sur devis',
  'Développement en 8-12 semaines',
  'Avancé',
  TRUE,
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=600&q=80',
  'from-indigo-500 to-indigo-600',
  'bg-indigo-50'
);

-- Table des catégories de services
CREATE TABLE IF NOT EXISTS service_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(100),
  color VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertion des catégories
INSERT INTO service_categories (name, description, icon, color) VALUES
('Sécurité', 'Solutions de cybersécurité et protection des données', 'FaShieldAlt', 'red'),
('Infrastructure', 'Services d''infrastructure réseau et serveurs', 'FaNetworkWired', 'blue'),
('Cloud', 'Solutions cloud et migration', 'FaCloud', 'green'),
('Développement', 'Développement web et applications', 'FaCode', 'purple'),
('IA', 'Intelligence artificielle et machine learning', 'FaBrain', 'indigo');

-- Table des témoignages de services
CREATE TABLE IF NOT EXISTS service_testimonials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  service_id INT,
  client_name VARCHAR(255) NOT NULL,
  client_company VARCHAR(255),
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  status ENUM('en_attente', 'approuvé', 'rejeté') DEFAULT 'en_attente',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);

-- Table des demandes de services
CREATE TABLE IF NOT EXISTS service_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  service_id INT,
  client_name VARCHAR(255) NOT NULL,
  client_email VARCHAR(255) NOT NULL,
  client_phone VARCHAR(50),
  company_name VARCHAR(255),
  project_description TEXT NOT NULL,
  budget_range VARCHAR(100),
  timeline VARCHAR(100),
  status ENUM('nouvelle', 'en_cours', 'devis_envoyé', 'accepté', 'rejeté') DEFAULT 'nouvelle',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL
);
































