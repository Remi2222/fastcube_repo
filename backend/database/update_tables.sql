-- Script de mise à jour des tables pour ajouter les champs manquants
-- Exécuter ces commandes pour synchroniser la base de données avec les formulaires

-- 1. Ajouter les champs manquants à la table blogs
ALTER TABLE blogs 
ADD COLUMN IF NOT EXISTS excerpt TEXT AFTER content,
ADD COLUMN IF NOT EXISTS category VARCHAR(100) AFTER author_id,
ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE AFTER category;

-- 2. Ajouter les champs manquants à la table tenders
ALTER TABLE tenders 
ADD COLUMN IF NOT EXISTS requirements TEXT AFTER budget,
ADD COLUMN IF NOT EXISTS criteria TEXT AFTER requirements;

-- 3. Vérifier et corriger les types de données pour les champs JSON
-- Pour la table services, s'assurer que features et benefits sont bien JSON
-- Pour la table solutions, s'assurer que features est bien JSON

-- 4. Ajouter des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_blogs_category ON blogs(category);
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_tenders_requirements ON tenders(requirements(255));

-- 5. Vérifier la structure des tables
DESCRIBE blogs;
DESCRIBE tenders;
DESCRIBE services;
DESCRIBE solutions;
DESCRIBE partenaires;
DESCRIBE testimonials;


