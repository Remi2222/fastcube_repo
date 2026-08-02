-- Script pour modifier les tables de base de données pour correspondre aux formulaires
-- Les formulaires sont corrects, c'est la DB qui doit s'adapter

-- 1. Modifier la table propositions pour correspondre au formulaire
ALTER TABLE propositions 
ADD COLUMN IF NOT EXISTS full_name VARCHAR(255) AFTER user_id,
ADD COLUMN IF NOT EXISTS address TEXT AFTER full_name,
ADD COLUMN IF NOT EXISTS phone VARCHAR(50) AFTER address,
ADD COLUMN IF NOT EXISTS email VARCHAR(255) AFTER phone,
ADD COLUMN IF NOT EXISTS comment TEXT AFTER email,
ADD COLUMN IF NOT EXISTS files_path JSON AFTER comment,
ADD COLUMN IF NOT EXISTS files_names JSON AFTER files_path;

-- 2. Modifier la table tenders pour correspondre au formulaire
ALTER TABLE tenders 
ADD COLUMN IF NOT EXISTS requirements TEXT AFTER budget,
ADD COLUMN IF NOT EXISTS criteria TEXT AFTER requirements;

-- 3. Vérifier la structure des tables
DESCRIBE propositions;
DESCRIBE tenders;


