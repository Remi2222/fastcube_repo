-- Table pour enregistrer les actions des utilisateurs
CREATE TABLE IF NOT EXISTS user_actions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    item_id INT NOT NULL,
    item_type VARCHAR(50) DEFAULT 'service', -- 'service', 'blog', 'solution'
    metadata JSON NULL, -- Pour stocker des données supplémentaires
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_action_type (action_type),
    INDEX idx_item_id (item_id),
    INDEX idx_timestamp (timestamp)
);

-- Insertion de données de test
INSERT INTO user_actions (user_id, action_type, item_id, item_type, metadata) VALUES
('user_1', 'view', 1, 'service', '{"page": "services", "duration": 30}'),
('user_1', 'click', 2, 'service', '{"page": "services", "element": "card"}'),
('user_2', 'view', 3, 'service', '{"page": "services", "duration": 45}'),
('user_1', 'search', 1, 'service', '{"query": "cybersécurité", "results_count": 5}'),
('user_2', 'view', 1, 'service', '{"page": "services", "duration": 20}'),
('user_1', 'view', 4, 'blog', '{"page": "blog", "duration": 60}'),
('user_2', 'click', 2, 'service', '{"page": "services", "element": "button"}');
