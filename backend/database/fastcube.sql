SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";
DELIMITER $$
CREATE DEFINER=`root`@`localhost` FUNCTION `get_average_response_time` () RETURNS INT(11) DETERMINISTIC READS SQL DATA BEGIN
    DECLARE avg_time INT;
    SELECT AVG(TIMESTAMPDIFF(HOUR, created_at, responded_at)) INTO avg_time
    FROM contacts 
    WHERE responded_at IS NOT NULL;
    RETURN COALESCE(avg_time, 0);
END$$
CREATE DEFINER=`root`@`localhost` FUNCTION `search_contacts` (`search_term` VARCHAR(255)) RETURNS INT(11) DETERMINISTIC READS SQL DATA BEGIN
    DECLARE result_count INT;
    SELECT COUNT(*) INTO result_count
    FROM contacts
    WHERE 
        first_name LIKE CONCAT('%', search_term, '%') OR
        last_name LIKE CONCAT('%', search_term, '%') OR
        email LIKE CONCAT('%', search_term, '%') OR
        subject LIKE CONCAT('%', search_term, '%') OR
        message LIKE CONCAT('%', search_term, '%');
    RETURN result_count;
END$$
DELIMITER ;
CREATE TABLE `appels_offres` (
  `id` int(11) NOT NULL,
  `titre` varchar(150) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `technologies` text DEFAULT NULL,
  `deadline` date DEFAULT NULL,
  `budget` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `criteria` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`criteria`)),
  `contact_email` varchar(255) DEFAULT 'tenders@fastcube.com',
  `contact_phone` varchar(50) DEFAULT '+33 1 23 45 67 89',
  `cahier_charges_path` varchar(500) DEFAULT NULL,
  `cahier_charges_name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
INSERT INTO `appels_offres` (`id`, `titre`, `description`, `technologies`, `deadline`, `budget`, `created_at`, `criteria`, `contact_email`, `contact_phone`, `cahier_charges_path`, `cahier_charges_name`) VALUES
(2, 'Fourniture d\'équipements réseau', 'Acquisition de switches, routeurs et équipements de sécurité réseau', 'Réseaux, Sécurité', '2025-02-15', '25,000 - 40,000 MAD', '2025-01-09 23:00:00', NULL, 'tenders@fastcube.com', '+33 1 23 45 67 89', NULL, NULL),
(3, 'Formation en cybersécurité', 'Programme de formation pour 50 collaborateurs sur les bonnes pratiques cybersécurité', 'Formation, Cybersécurité', '2025-01-25', '15,000 - 25,000 MAD', '2025-01-04 23:00:00', NULL, 'tenders@fastcube.com', '+33 1 23 45 67 89', NULL, NULL),
(4, 'Audit de sécurité informatique', 'Évaluation complète de la sécurité des systèmes d\'information', 'Audit, Sécurité', '2025-01-15', '20,000 - 35,000 MAD', '2024-12-19 23:00:00', NULL, 'tenders@fastcube.com', '+33 1 23 45 67 89', NULL, NULL),
(5, 'Développement d\'une plateforme de cybersécurité', 'Création d\'une solution complète de monitoring et protection contre les cybermenaces', 'Cybersécurité', '2025-02-28', '50,000 - 80,000 MAD', '2025-01-14 23:00:00', NULL, 'tenders@fastcube.com', '+33 1 23 45 67 89', NULL, NULL),
(12, 'ffffff', 'jnjhn', 'jbjb', '2025-08-21', '4532', '2025-07-31 20:00:41', NULL, 'tenders@fastcube.com', '+33 1 23 45 67 89', NULL, NULL),
(13, 'nnnn', 'nnn', 'nnn', '2025-09-19', '22555', '2025-07-31 20:12:29', NULL, 'tenders@fastcube.com', '+33 1 23 45 67 89', 'C:\\Users\\HP\\Desktop\\frontend\\backend\\uploads\\tenders\\cahier_charges_1753992749332.pdf', 'CV_2025-07-12_Maryam_Fajri.pdf');
CREATE TABLE `articles` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` longtext NOT NULL,
  `excerpt` text DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `author_id` int(11) NOT NULL,
  `status` enum('draft','published','archived') DEFAULT 'published',
  `published_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
CREATE TABLE `article_tags` (
  `id` int(11) NOT NULL,
  `article_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
CREATE TABLE `blogs` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `image_url` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `author_id` int(11) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'published',
  `views_count` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
INSERT INTO `blogs` (`id`, `title`, `content`, `image_url`, `created_at`, `updated_at`, `author_id`, `status`, `views_count`) VALUES
(1, 'Cybersécurité 2024 : Les tendances majeures pour protéger votre SI', '<h2>Introduction</h2><p>La cybersécurité continue d\'évoluer rapidement en 2024. Les menaces deviennent plus sophistiquées et les entreprises doivent adapter leurs stratégies de protection.</p><h2>Les principales tendances</h2><ul><li>L\'intelligence artificielle dans la détection des menaces</li><li>La sécurité Zero Trust</li><li>La protection des données personnelles</li><li>La cybersécurité des objets connectés</li></ul><h2>Conclusion</h2><p>Il est essentiel de rester à jour avec les dernières tendances en cybersécurité pour protéger efficacement votre infrastructure informatique.</p>', 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80', '2025-08-29 17:19:04', '2025-08-29 22:14:38', NULL, 'published', 2),
(2, 'Pourquoi un SOC externalisé ? Les avantages d\'un Security Operations Center managé', '<h2>Qu\'est-ce qu\'un SOC ?</h2><p>Un Security Operations Center (SOC) est un centre de surveillance et d\'analyse de la sécurité informatique en temps réel.</p><h2>Les avantages de l\'externalisation</h2><ul><li>Expertise spécialisée 24/7</li><li>Réduction des coûts</li><li>Technologies de pointe</li><li>Conformité réglementaire</li></ul><h2>Conclusion</h2><p>L\'externalisation de votre SOC peut être une solution efficace pour renforcer votre sécurité informatique.</p>', 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80', '2025-08-29 17:19:04', '2025-08-29 23:34:21', NULL, 'published', 12),
(3, 'Transformation digitale : Réussir sa transition numérique', '<h2>Définition de la transformation digitale</h2><p>La transformation digitale est le processus d\'intégration des technologies numériques dans tous les aspects d\'une entreprise.</p><h2>Les étapes clés</h2><ol><li>Audit de l\'existant</li><li>Définition de la stratégie</li><li>Formation des équipes</li><li>Mise en œuvre progressive</li><li>Mesure et optimisation</li></ol><h2>Conclusion</h2><p>Une transformation digitale réussie nécessite une approche structurée et un accompagnement expert.</p>', 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80', '2025-08-29 17:19:04', '2025-08-29 22:04:48', NULL, 'published', 4),
(4, 'Cloud hybride : Mode d\'emploi pour réussir l\'intégration', '<h2>Qu\'est-ce que le cloud hybride ?</h2><p>Le cloud hybride combine les avantages du cloud public et privé pour optimiser les performances et les coûts.</p><h2>Avantages du cloud hybride</h2><ul><li>Flexibilité maximale</li><li>Optimisation des coûts</li><li>Sécurité renforcée</li><li>Scalabilité</li></ul><h2>Plan de migration</h2><p>Un plan de migration bien structuré est essentiel pour réussir l\'intégration d\'un cloud hybride.</p>', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80', '2025-08-29 17:19:04', '2025-08-29 17:19:04', NULL, 'published', 0);
CREATE TABLE `blog_article_views` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `article_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `ip_address` int(11) DEFAULT NULL,
  `session_id` varchar(255) DEFAULT NULL,
  `viewed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_unique` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
DELIMITER $$
CREATE TRIGGER `update_views_count` AFTER INSERT ON `blog_article_views` FOR EACH ROW BEGIN
    UPDATE blog_articles
    SET views_count = views_count + 1
    WHERE id = NEW.article_id;
END
$$
DELIMITER ;
CREATE TABLE `chatbot_logs` (
  `id` int(11) NOT NULL,
  `user_input` text DEFAULT NULL,
  `ai_response` text DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
CREATE TABLE `chatbot_messages` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `session_id` varchar(255) NOT NULL,
  `message_type` enum('user','bot') NOT NULL,
  `content` text NOT NULL,
  `intent` varchar(100) DEFAULT NULL,
  `confidence` decimal(3,2) DEFAULT NULL,
  `entities` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`entities`)),
  `suggestions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`suggestions`)),
  `context_type` varchar(50) DEFAULT NULL,
  `should_trigger_quote` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
INSERT INTO `chatbot_messages` (`id`, `user_id`, `session_id`, `message_type`, `content`, `intent`, `confidence`, `entities`, `suggestions`, `context_type`, `should_trigger_quote`, `created_at`, `updated_at`) VALUES
(23, 8, 'test-123', 'user', 'Test message', NULL, NULL, NULL, NULL, NULL, 0, '2025-09-03 13:05:51', '2025-09-03 13:05:51'),
(26, 8, 'test-123', 'user', 'Test message from user', NULL, NULL, NULL, NULL, NULL, 0, '2025-09-03 13:08:42', '2025-09-03 13:08:42'),
(27, 8, 'session-1756902432899', 'user', 'salut', 'user_message', 1.00, NULL, NULL, NULL, 0, '2025-09-03 13:11:48', '2025-09-03 13:11:48'),
(28, 8, 'session-1756902432899', 'bot', ' Salut! Comment puis-je vous aider?\n', 'greeting', 0.95, NULL, '[\"Demander un devis\",\"Support technique\",\"Informations sur les services\"]', 'general', 0, '2025-09-03 13:11:53', '2025-09-03 13:11:53'),
(29, 8, 'session-1756902432899', 'user', 'est ce que tu vois que vous vous fonctionne bien!', 'user_message', 1.00, NULL, NULL, NULL, 0, '2025-09-03 13:12:38', '2025-09-03 13:12:38'),
(30, 8, 'session-1756902432899', 'bot', ' Bonjour! Comment puis-je vous aider?\n', 'greeting', 0.95, NULL, '[\"Demander un devis\",\"Support technique\",\"Informations sur les services\"]', 'general', 0, '2025-09-03 13:12:43', '2025-09-03 13:12:43'),
(31, 8, 'session-1756902432899', 'user', 'tu comprand ce que je dis!', 'user_message', 1.00, NULL, NULL, NULL, 0, '2025-09-03 13:12:57', '2025-09-03 13:12:57'),
(32, 8, 'session-1756902432899', 'bot', ' Je comprends, tu as besoin d\'une vidéo à partir de cet appareil de toutes les caractères pour trouver des précisions. Je nous répondre en français, dans une définitif même si je ne comprends pas.\n', 'general_inquiry', 0.80, NULL, '[\"Demander un devis\",\"Support technique\",\"Informations sur les services\"]', 'general', 0, '2025-09-03 13:13:12', '2025-09-03 13:13:12'),
(33, 8, 'session-1756902432899', 'user', 'non , j\'ai pas dis ca!!', 'user_message', 1.00, NULL, NULL, NULL, 0, '2025-09-03 13:13:32', '2025-09-03 13:13:32'),
(34, 8, 'session-1756902432899', 'bot', ' Non plus !, nous pourrons vous aider !\n\nVous souhaitez découvrir ce qui est dans les \"FASTCUBE\" ?\n\nCliquez sur le droit ou l\'accent vers la bonne direction.\n', 'technical_support', 0.85, NULL, '[\"Demander un devis\",\"Support technique\",\"Informations sur les services\"]', 'general', 0, '2025-09-03 13:13:45', '2025-09-03 13:13:45'),
(35, 8, 'session-1756902432899', 'user', 'tu ne comprand pas le context !! alors dit moi quel années nous somme aujourd\'hu!', 'user_message', 1.00, NULL, NULL, NULL, 0, '2025-09-03 13:15:41', '2025-09-03 13:15:41'),
(36, 8, 'session-1756902432899', 'bot', ' Je parle français, mais je comprends bien. Comment puis-je vous aider?\n', 'technical_support', 0.85, NULL, '[\"Demander un devis\",\"Support technique\",\"Informations sur les services\"]', 'general', 0, '2025-09-03 13:15:52', '2025-09-03 13:15:52'),
(37, 8, 'test-delete-123', 'user', 'Message � supprimer', NULL, NULL, NULL, NULL, NULL, 0, '2025-09-03 13:16:43', '2025-09-03 13:16:43'),
(38, 8, 'session-1756909497563', 'user', 'hello', 'user_message', 1.00, NULL, NULL, NULL, 0, '2025-09-03 14:25:06', '2025-09-03 14:25:06'),
(39, 8, 'session-1756909497563', 'bot', ' Salut, je m\'appelle FASTCUBE. Je vous écrit en français. Je comprends votre message précédent. Et toi? (Hello, my name is FASTCUBE. I am writing in French. And you?)\n', 'greeting', 0.95, NULL, '[\"Demander un devis\",\"Support technique\",\"Informations sur les services\"]', 'general', 0, '2025-09-03 14:25:23', '2025-09-03 14:25:23'),
(40, 8, 'session-1756909497563', 'user', 'ow je vois qu tu est un peu intteligent, dit moi tes fonctionnalitées et quesque tu peut faire pour moi', 'user_message', 1.00, NULL, NULL, NULL, 0, '2025-09-03 14:26:13', '2025-09-03 14:26:13'),
(41, 8, 'session-1756909497563', 'bot', ' Je comprends vraiment que tu as précisé des caractéristiques de jeu entre tu es un chatbot et moi, c\'est quand même que je peux façonnent à ses utilisateurs. Je fais partie dans le contexte du jeu de l\'utilisateur et je comprends que tu peux être précis ou choisis parce que je vous souhaitez même un chat intelgénérable.\n\nJe fais partie dans le contexte du jeu de l\'utilisateur et je comprends que tu peux être précis ou choisis parce que je vous souhaitez même un chat intelgénérable.\n', 'general_inquiry', 0.80, NULL, '[\"Demander un devis\",\"Support technique\",\"Informations sur les services\"]', 'general', 0, '2025-09-03 14:26:55', '2025-09-03 14:26:55'),
(42, 8, 'session-1756909497563', 'user', 'dit moi tes fonctionnalitées et quesque tu peut faire pour moi', 'user_message', 1.00, NULL, NULL, NULL, 0, '2025-09-03 14:29:03', '2025-09-03 14:29:03');
CREATE TABLE `chatbot_recent_messages` (
`id` int(11)
,`user_id` int(11)
,`session_id` varchar(255)
,`message_type` enum('user','bot')
,`content` text
,`intent` varchar(100)
,`confidence` decimal(3,2)
,`entities` longtext
,`suggestions` longtext
,`created_at` timestamp
,`username` varchar(201)
);
CREATE TABLE `chatbot_sessions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `session_id` varchar(255) NOT NULL,
  `started_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_activity` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_active` tinyint(1) DEFAULT 1,
  `total_messages` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
INSERT INTO `chatbot_sessions` (`id`, `user_id`, `session_id`, `started_at`, `last_activity`, `is_active`, `total_messages`, `created_at`, `updated_at`) VALUES
(1, 8, 'test-123', '2025-09-03 13:05:51', '2025-09-03 13:08:42', 1, 2, '2025-09-03 13:05:51', '2025-09-03 13:08:42'),
(2, 8, 'session-1756902432899', '2025-09-03 13:11:48', '2025-09-03 13:15:52', 1, 10, '2025-09-03 13:11:48', '2025-09-03 13:15:52'),
(3, 8, 'test-delete-123', '2025-09-03 13:16:43', '2025-09-03 13:16:43', 1, 1, '2025-09-03 13:16:43', '2025-09-03 13:16:43'),
(4, 8, 'session-1756909497563', '2025-09-03 14:25:06', '2025-09-03 14:29:03', 1, 5, '2025-09-03 14:25:06', '2025-09-03 14:29:03');
CREATE TABLE `chatbot_usage_stats` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `total_messages` int(11) DEFAULT 0,
  `user_messages` int(11) DEFAULT 0,
  `bot_messages` int(11) DEFAULT 0,
  `unique_sessions` int(11) DEFAULT 0,
  `avg_confidence` decimal(3,2) DEFAULT NULL,
  `most_common_intent` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
CREATE TABLE `chatbot_user_preferences` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `preferred_language` varchar(10) DEFAULT 'fr',
  `preferred_context_type` varchar(50) DEFAULT 'general',
  `communication_style` varchar(50) DEFAULT 'professional',
  `interests` text DEFAULT NULL,
  `show_timestamps` tinyint(1) DEFAULT 1,
  `show_confidence` tinyint(1) DEFAULT 1,
  `show_intent` tinyint(1) DEFAULT 1,
  `auto_scroll` tinyint(1) DEFAULT 1,
  `theme` varchar(20) DEFAULT 'blue',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
CREATE TABLE `chatbot_user_stats` (
`user_id` int(11)
,`username` varchar(201)
,`email` varchar(255)
,`total_sessions` bigint(21)
,`total_messages` bigint(21)
,`user_messages` bigint(21)
,`bot_messages` bigint(21)
,`avg_confidence` decimal(7,6)
,`last_message_date` timestamp
,`last_session_activity` timestamp
);
CREATE TABLE `commentaires` (
  `id` int(11) NOT NULL,
  `blog_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `author_name` varchar(255) NOT NULL,
  `author_email` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO `commentaires` (`id`, `blog_id`, `user_id`, `author_name`, `author_email`, `content`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, NULL, 'Jean Dupont', 'jean.dupont@email.com', 'Excellent article ! Très informatif et bien structuré. J\'ai appris beaucoup de choses sur ce sujet.', 'approved', '2025-08-29 19:14:19', '2025-08-29 19:14:19'),
(2, 1, NULL, 'Marie Martin', 'marie.martin@email.com', 'Merci pour ce partage d\'expérience. Les exemples concrets rendent le contenu très accessible.', 'approved', '2025-08-29 19:14:19', '2025-08-29 19:14:19'),
(3, 2, NULL, 'Pierre Durand', 'pierre.durand@email.com', 'Très intéressant ! J\'aimerais en savoir plus sur les aspects techniques mentionnés.', 'pending', '2025-08-29 19:14:19', '2025-08-29 19:14:19'),
(4, 2, NULL, 'Sophie Bernard', 'sophie.bernard@email.com', 'Article très complet et bien documenté. Bravo pour la qualité du contenu !', 'approved', '2025-08-29 19:14:19', '2025-08-29 19:14:19'),
(5, 3, NULL, 'Lucas Moreau', 'lucas.moreau@email.com', 'Je partage complètement votre point de vue. C\'est exactement ce que je pensais aussi.', 'approved', '2025-08-29 19:14:19', '2025-08-29 19:14:19');
CREATE TABLE `contacts` (
  `id` int(11) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `company` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `category` varchar(50) DEFAULT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `priority` enum('low','normal','high','urgent') DEFAULT 'normal',
  `preferred_contact` enum('email','phone','whatsapp') DEFAULT 'email',
  `attachments` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`attachments`)),
  `ai_response` text DEFAULT NULL,
  `status` enum('new','in_progress','responded','closed') DEFAULT 'new',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `services` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Array des services sélectionnés' CHECK (json_valid(`services`)),
  `budget` varchar(50) DEFAULT NULL COMMENT 'Budget estimé (5k-15k, 15k-50k, 50k-100k, 100k+)',
  `timeline` varchar(50) DEFAULT NULL COMMENT 'Délai souhaité (1-2-weeks, 1-month, 2-3-months, 3+months)',
  `source` varchar(50) DEFAULT 'website' COMMENT 'Source du contact (website, mobile, api)',
  `ip_address` varchar(45) DEFAULT NULL COMMENT 'Adresse IP du client',
  `user_agent` text DEFAULT NULL COMMENT 'User-Agent du navigateur',
  `responded_at` timestamp NULL DEFAULT NULL COMMENT 'Date de première réponse',
  `assigned_to` int(11) DEFAULT NULL COMMENT 'ID de l''utilisateur assigné',
  `notes` text DEFAULT NULL COMMENT 'Notes internes de l''équipe',
  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Tags pour catégorisation' CHECK (json_valid(`tags`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
INSERT INTO `contacts` (`id`, `first_name`, `last_name`, `email`, `phone`, `company`, `city`, `country`, `category`, `subject`, `message`, `priority`, `preferred_contact`, `attachments`, `ai_response`, `status`, `created_at`, `updated_at`, `services`, `budget`, `timeline`, `source`, `ip_address`, `user_agent`, `responded_at`, `assigned_to`, `notes`, `tags`) VALUES
(1, 'mery', 'f', 'maryam.fajri@emsi-edu.ma', '000000000', 'gggg', 'bouznika', 'Maroc', '', 'hhhbubuin', 'gyuhunk,', 'low', 'whatsapp', '[{\"name\":\"CV_2025-07-12_Maryam_Fajri (1).pdf\",\"size\":1028988,\"type\":\"application/pdf\"}]', 'Bonjour mery,\n\nNous avons bien reçu votre message. Notre équipe va l\'analyser et vous répondre dans les plus brefs délais.\n\nMerci pour votre confiance.\n\nCordialement,\nL\'équipe FastCube', 'new', '2025-07-31 23:35:30', '2025-08-28 16:14:30', '[\"\"]', NULL, NULL, 'website', NULL, NULL, NULL, NULL, NULL, NULL),
(2, 'mery', 'f', 'maryam.fajri@emsi-edu.ma', '000000000', 'gggg', 'bouznika', 'Maroc', '', 'hhhbubuin', 'gyugui', 'normal', 'email', '[]', 'Bonjour mery,\n\nNous avons bien reçu votre message. Notre équipe va l\'analyser et vous répondre dans les plus brefs délais.\n\nMerci pour votre confiance.\n\nCordialement,\nL\'équipe FastCube', 'new', '2025-07-31 23:36:08', '2025-08-28 16:14:30', '[\"\"]', NULL, NULL, 'website', NULL, NULL, NULL, NULL, NULL, NULL),
(3, 'adineskey', 'f', 'maryam.fajri@emsi-edu.ma', '+212 000000077982040', 'gggg', NULL, NULL, NULL, 'jj', 'kk', 'normal', 'email', '[]', 'Bonjour adineskey,\n\nNous avons bien reçu votre message. Notre équipe va l\'analyser et vous répondre dans les plus brefs délais.\n\nMerci pour votre confiance.\n\nCordialement,\nL\'équipe FastCube', 'new', '2025-08-28 19:19:45', '2025-08-28 19:19:45', NULL, NULL, NULL, 'website', NULL, NULL, NULL, NULL, NULL, NULL),
(4, 'mery', 'f', 'maryam.fajri@emsi-edu.ma', '+212 000000077982040', 'gggg', NULL, NULL, 'general', 'jjj', 'jjjjj', 'normal', 'email', NULL, NULL, 'new', '2025-08-28 22:40:36', '2025-08-28 22:40:36', NULL, NULL, NULL, 'website', NULL, NULL, NULL, NULL, NULL, NULL),
(5, 'Test', 'User', 'test@example.com', NULL, NULL, NULL, NULL, 'general', 'Test', 'Test message', 'normal', 'email', NULL, NULL, 'new', '2025-08-28 23:02:10', '2025-08-28 23:02:10', NULL, NULL, NULL, 'website', NULL, NULL, NULL, NULL, NULL, NULL),
(6, 'Test', 'User', 'test@test.com', NULL, NULL, NULL, NULL, 'general', 'Test API', 'Test message', 'normal', 'email', NULL, NULL, 'new', '2025-08-29 00:19:04', '2025-08-29 00:19:04', NULL, NULL, NULL, 'website', NULL, NULL, NULL, NULL, NULL, NULL),
(7, 'maryam', 'fajri', 'maryam.fajri@emsi-edu.ma', '+212643776635', 'kk', 'bouznika', 'Maroc', '', 'jj', 'jjjjj', 'high', 'email', '[]', 'Bonjour maryam,\n\nNous avons bien reçu votre message. Notre équipe va l\'analyser et vous répondre dans les plus brefs délais.\n\nMerci pour votre confiance.\n\nCordialement,\nL\'équipe FastCube', 'new', '2025-09-02 15:59:32', '2025-09-02 15:59:32', NULL, NULL, NULL, 'website', NULL, NULL, NULL, NULL, NULL, NULL);
DELIMITER $$
CREATE TRIGGER `update_responded_at_trigger` BEFORE UPDATE ON `contacts` FOR EACH ROW BEGIN
    IF NEW.status = 'responded' AND OLD.status != 'responded' THEN
        SET NEW.responded_at = NOW();
    END IF;
END
$$
DELIMITER ;
CREATE TABLE `contact_stats` (
`total_contacts` bigint(21)
,`new_contacts` bigint(21)
,`in_progress_contacts` bigint(21)
,`responded_contacts` bigint(21)
,`closed_contacts` bigint(21)
,`urgent_contacts` bigint(21)
,`high_priority_contacts` bigint(21)
,`normal_priority_contacts` bigint(21)
,`low_priority_contacts` bigint(21)
,`contacts_this_week` bigint(21)
,`contacts_this_month` bigint(21)
,`website_contacts` bigint(21)
,`mobile_contacts` bigint(21)
,`api_contacts` bigint(21)
,`avg_response_time_hours` decimal(24,4)
);
CREATE TABLE `email_sends` (
  `id` int(11) NOT NULL,
  `subscriber_id` int(11) DEFAULT NULL,
  `template_id` int(11) DEFAULT NULL,
  `sent_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` text DEFAULT NULL,
  `error_message` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
INSERT INTO `email_sends` (`id`, `subscriber_id`, `template_id`, `sent_at`, `status`, `error_message`) VALUES
(1, 4, 1, '2025-08-05 21:33:02', 'sent', NULL);
CREATE TABLE `email_templates` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL,
  `subject` text NOT NULL,
  `html_content` text NOT NULL,
  `text_content` text NOT NULL,
  `category` text NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
INSERT INTO `email_templates` (`id`, `name`, `subject`, `html_content`, `text_content`, `category`, `is_active`, `created_at`) VALUES
(1, 'Template par défaut', 'Newsletter FASTCUBE', '<h1>Newsletter FASTCUBE</h1><p>Bienvenue dans notre newsletter !</p>', 'Newsletter FASTCUBE - Bienvenue dans notre newsletter !', 'default', 1, '2025-08-05 21:30:54');
CREATE TABLE `partenaires` (
  `id` int(11) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `logo_url` varchar(500) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `website_url` varchar(500) DEFAULT NULL,
  `secteur_activite` varchar(255) DEFAULT NULL,
  `date_debut_partnership` date DEFAULT NULL,
  `statut` enum('actif','inactif','en_negociation') DEFAULT 'actif',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
INSERT INTO `partenaires` (`id`, `nom`, `logo_url`, `description`, `website_url`, `secteur_activite`, `date_debut_partnership`, `statut`, `created_at`, `updated_at`) VALUES
(1, 'Microsoft', 'https://tse3.mm.bing.net/th/id/OIP.VhknVB80Wi7s22YHKKfsvwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', 'Partenaire technologique principal', 'https://microsoft.com', 'Technologie', '2024-01-11', 'actif', '2025-08-29 20:28:54', '2025-09-02 15:58:06'),
(2, 'Oracle', 'https://th.bing.com/th/id/R.257f73c20bf3c47df60c6a6b8d309e2c?rik=jaEv%2fLW%2fBkaIoA&pid=ImgRaw&r=0', 'Partenaire base de données', 'https://oracle.com', 'Technologie', '2024-02-19', 'actif', '2025-08-29 20:28:54', '2025-09-02 15:48:43');
CREATE TABLE `posts` (
  `id` int(11) NOT NULL,
  `title` varchar(150) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `tags` varchar(255) DEFAULT NULL,
  `author_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
CREATE TABLE `propositions` (
  `id` int(11) NOT NULL,
  `tender_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `full_name` varchar(255) NOT NULL,
  `address` text NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `comment` text DEFAULT NULL,
  `status` enum('en_attente','acceptee','refusee','en_cours_evaluation') DEFAULT 'en_attente',
  `files_path` text DEFAULT NULL,
  `files_names` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
INSERT INTO `propositions` (`id`, `tender_id`, `user_id`, `full_name`, `address`, `phone`, `email`, `comment`, `status`, `files_path`, `files_names`, `created_at`, `updated_at`) VALUES
(11, 5, NULL, 'Tech Solutions SARL', '123 Rue de la Technologie, Casablanca', '+212 5 22 12 34 56', 'contact@techsolutions.ma', 'Proposition technique détaillée incluse dans les fichiers joints.', 'en_attente', NULL, NULL, '2025-07-31 21:02:20', '2025-07-31 21:02:20'),
(12, 13, NULL, 'kk', 'hyth', '+212643776635', 'maryam.fajri02@gmail.com', NULL, 'en_attente', '[\"C:\\\\Users\\\\HP\\\\Desktop\\\\frontend\\\\backend\\\\uploads\\\\propositions\\\\proposition_1753999274558_81k5hl.pdf\"]', '[\"CV_2025-07-12_Maryam_Fajri (1).pdf\"]', '2025-07-31 22:01:14', '2025-07-31 22:01:14'),
(13, 13, NULL, 'kk', 'hyth', '+212643776635', 'maryam.fajri02@gmail.com', NULL, 'en_attente', '[\"C:\\\\Users\\\\HP\\\\Desktop\\\\frontend\\\\backend\\\\uploads\\\\propositions\\\\proposition_1754000089489_ya90v7.pdf\"]', '[\"CV_2025-07-12_Maryam_Fajri (2).pdf\"]', '2025-07-31 22:14:49', '2025-07-31 22:14:49'),
(14, 13, NULL, 'kk', 'hyth', '+212643776635', 'maryam.fajri02@gmail.com', NULL, 'en_attente', '[\"C:\\\\Users\\\\HP\\\\Desktop\\\\frontend\\\\backend\\\\uploads\\\\propositions\\\\proposition_1754005210004_gspigg.pdf\"]', '[\"Cours Complet - MÃ©canique du Point et MÃ©canique du Solide.pdf\"]', '2025-07-31 23:40:10', '2025-07-31 23:40:10');
CREATE TABLE `recent_contacts` (
`id` int(11)
,`first_name` varchar(100)
,`last_name` varchar(100)
,`email` varchar(255)
,`subject` varchar(255)
,`status` enum('new','in_progress','responded','closed')
,`priority` enum('low','normal','high','urgent')
,`created_at` timestamp
,`hours_since_creation` bigint(21)
);
CREATE TABLE `search_history` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `query` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `search_stats` (
  `id` int(11) NOT NULL,
  `query` varchar(255) NOT NULL,
  `count` int(11) DEFAULT 1,
  `last_searched` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO `search_stats` (`id`, `query`, `count`, `last_searched`, `created_at`) VALUES
(1, 'cybersécurité', 15, '2025-08-05 22:50:57', '2025-08-05 22:50:57'),
(2, 'cloud computing', 12, '2025-08-05 22:50:57', '2025-08-05 22:50:57'),
(3, 'développement web', 8, '2025-08-05 22:50:57', '2025-08-05 22:50:57'),
(4, 'audit IT', 6, '2025-08-05 22:50:57', '2025-08-05 22:50:57'),
(5, 'SOC externalisé', 4, '2025-08-05 22:50:57', '2025-08-05 22:50:57'),
(6, 'RGPD', 3, '2025-08-05 22:50:57', '2025-08-05 22:50:57'),
(7, 'transformation digitale', 7, '2025-08-05 22:50:57', '2025-08-05 22:50:57'),
(8, 'migration cloud', 5, '2025-08-05 22:50:57', '2025-08-05 22:50:57');
CREATE TABLE `services` (
  `id` int(11) NOT NULL,
  `title` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
INSERT INTO `services` (`id`, `title`, `description`, `category`, `image_url`, `created_at`) VALUES
(1, 'Cybersécurité Avancée', 'Solutions de sécurité intégrées pour protéger vos données et systèmes contre les menaces cybernétiques. Audit de sécurité, tests d\'intrusion, formation des équipes.', 'Sécurité', 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80', '2025-08-29 15:02:28'),
(3, 'Solutions Cloud', 'Migration vers le cloud et gestion de solutions cloud modernes pour optimiser vos performances. AWS, Azure, Google Cloud.', 'Cloud', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80', '2025-08-29 15:02:28'),
(4, 'Développement Web', 'Création de sites web et applications web performants et responsives. Technologies modernes : React, Node.js, Python.', 'Développement', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80', '2025-08-29 15:02:28'),
(5, 'Intelligence Artificielle', 'Intégration de l\'intelligence artificielle dans vos processus métier. Chatbots, analyse prédictive, automatisation.', 'IA', 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=600&q=80', '2025-08-29 15:02:28'),
(6, 'testsolution', 'd hzd', 'test', NULL, '2025-08-29 16:02:17');
CREATE TABLE `service_analysis` (
`service_name` varchar(50)
,`demand_count` bigint(21)
,`responded_count` bigint(21)
,`closed_count` bigint(21)
,`avg_budget_estimate` decimal(9,4)
);
CREATE TABLE `solutions` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `category` varchar(100) NOT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `features` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`features`)),
  `benefits` text DEFAULT NULL,
  `use_cases` text DEFAULT NULL,
  `pricing_info` text DEFAULT NULL,
  `status` enum('active','inactive','coming_soon') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
INSERT INTO `solutions` (`id`, `title`, `description`, `category`, `image_url`, `features`, `benefits`, `use_cases`, `pricing_info`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Solution de Cybersécurité Avancée', 'Protection complète contre les menaces cybernétiques avec surveillance 24/7, détection d\'intrusion et réponse automatisée aux incidents.', 'Sécurité', '/images/solutions/cybersecurity.jpg', '[\"Surveillance 24/7\",\"Détection d\'intrusion\",\"Réponse automatisée\",\"Analyse comportementale\",\"Conformité RGPD\"]', 'Réduction de 95% des risques de cyberattaque, conformité réglementaire, protection des données sensibles.', 'Entreprises financières, santé, e-commerce, administrations publiques.', 'À partir de 299€/mois selon la taille de l\'entreprise', 'active', '2025-08-29 15:38:18', '2025-08-29 15:38:18'),
(2, 'Plateforme Cloud Hybride', 'Solution cloud flexible combinant infrastructure privée et publique pour optimiser les coûts et la performance.', 'Cloud', '/images/solutions/cloud-hybrid.jpg', '[\"Infrastructure hybride\",\"Migration automatisée\",\"Optimisation des coûts\",\"Haute disponibilité\",\"Sauvegarde automatique\"]', 'Flexibilité maximale, réduction des coûts de 30%, performance optimisée, évolutivité.', 'PME, startups, entreprises en croissance, applications critiques.', 'Modèle pay-per-use avec forfait de base à 199€/mois', 'active', '2025-08-29 15:38:18', '2025-08-29 15:38:18'),
(3, 'Intelligence Artificielle Business', 'Intégration de l\'IA dans vos processus métier pour l\'automatisation, l\'analyse prédictive et l\'optimisation.', 'Intelligence Artificielle', '/images/solutions/ai-business.jpg', '[\"Automatisation des processus\",\"Analyse prédictive\",\"Chatbot intelligent\",\"Recommandations personnalisées\",\"Tableaux de bord intelligents\"]', 'Augmentation de la productivité de 40%, réduction des erreurs, insights business précieux.', 'Service client, marketing, ventes, logistique, RH.', 'Packages personnalisés à partir de 499€/mois', 'active', '2025-08-29 15:38:18', '2025-08-29 15:38:18'),
(4, 'Transformation Digitale Complète', 'Accompagnement complet dans votre transformation numérique : audit, stratégie, implémentation et formation.', 'Transformation Digitale', '/images/solutions/digital-transformation.jpg', '[\"Audit digital complet\",\"Stratégie personnalisée\",\"Implémentation progressive\",\"Formation des équipes\",\"Support continu\"]', 'Modernisation complète des processus, amélioration de l\'expérience client, compétitivité renforcée.', 'Entreprises traditionnelles, PME, organisations publiques.', 'Projets sur mesure, devis personnalisé', 'active', '2025-08-29 15:38:18', '2025-08-29 15:38:18'),
(5, 'Solution IoT Industrielle', 'Connectivité et analyse des données IoT pour optimiser les processus industriels et la maintenance prédictive.', 'IoT', '/images/solutions/iot-industrial.jpg', '[\"Capteurs connectés\",\"Collecte de données temps réel\",\"Analyse prédictive\",\"Maintenance prédictive\",\"Tableaux de bord temps réel\"]', 'Réduction des coûts de maintenance de 25%, optimisation des processus, sécurité renforcée.', 'Industrie manufacturière, logistique, énergie, bâtiments intelligents.', 'Installation + abonnement mensuel à partir de 399€/mois', 'coming_soon', '2025-08-29 15:38:18', '2025-08-29 15:38:18'),
(6, 'solution1', 'ty', 'test', NULL, '[\"yubxb xh\"]', 'hjxbubx', 'hjbhbjk', 'hjbbjnb', 'active', '2025-08-29 16:01:40', '2025-08-29 16:01:40');
CREATE TABLE `subscribers` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `first_name` text NOT NULL,
  `last_name` text NOT NULL,
  `company` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_active` tinyint(1) DEFAULT 1,
  `password_hash` text DEFAULT NULL,
  `unsubscribe_token VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
INSERT INTO `subscribers` (`id`, `email`, `first_name`, `last_name`, `company`, `created_at`, `is_active`, `password_hash`, `unsubscribe_token`) VALUES
(3, 'maryam.fajri02@gmail.com', 'mery', 'f', 'kk', '2025-08-03 16:17:53', 1, '$2b$10$Cz0gFkNS1RGlBKsqWIb69OnPNtXrLPhe982QsuRf2hR2w78YvZrvS', 'cba6be895499ea6d63c0e7559d27b5beef528a2d31fb562c74cc35a1a644737e'),
(4, 'test@example.com', 'John', 'Doe', 'Test Company', '2025-08-05 21:33:01', 1, NULL, '7a6a9846b169ba08f100703346821f4090f205caaccccd58df195ddcc93d2671');
CREATE TABLE `tags` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
CREATE TABLE `testimonials` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `user_name` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `rating` int(11) NOT NULL,
  `approved` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
INSERT INTO `testimonials` (`id`, `user_id`, `user_name`, `message`, `rating`, `approved`, `created_at`) VALUES
(10, 11, 'yazidi', 'tres bien ', 5, 1, '2025-07-31 15:07:58'),
(11, NULL, 'Test User', 'Excellent service ! Je recommande vivement.', 5, 0, '2025-09-02 14:25:24'),
(12, NULL, 'Test User', 'Excellent service ! Je recommande vivement.', 5, -1, '2025-09-02 14:26:50'),
(13, NULL, 'Test User', 'Excellent service ! Je recommande vivement.', 5, -1, '2025-09-02 14:28:40'),
(14, NULL, 'Test User', 'Test message', 5, -1, '2025-09-02 14:29:48'),
(15, NULL, 'Test User', 'Excellent service ! Je recommande vivement FastCube.', 5, 1, '2025-09-02 14:33:47'),
(16, NULL, 'Test User', 'Test message sans token', 5, -1, '2025-09-02 15:02:23'),
(17, NULL, 'Test User', 'Test message sans token', 5, 1, '2025-09-02 15:03:42'),
(18, NULL, 'Test User Token', 'Test message avec token', 4, -1, '2025-09-02 15:03:57'),
(19, 8, 'maryam', ',,,,', 4, 1, '2025-09-02 15:07:02');
CREATE TABLE `tickets` (
  `id` int(11) NOT NULL,
  `reference` varchar(20) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `category` enum('technique','billing','account','feature','other') NOT NULL DEFAULT 'technique',
  `priority` enum('basse','moyenne','haute','critique') NOT NULL DEFAULT 'moyenne',
  `status` enum('ouvert','en_cours','en_attente','resolu','ferme') NOT NULL DEFAULT 'ouvert',
  `contact_email` varchar(255) NOT NULL,
  `contact_phone` varchar(20) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `resolved_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
INSERT INTO `tickets` (`id`, `reference`, `subject`, `description`, `category`, `priority`, `status`, `contact_email`, `contact_phone`, `user_id`, `created_at`, `updated_at`, `resolved_at`) VALUES
(14, 'TKT-2025-001', 'Problème de connexion internet', 'Je n\'arrive pas à me connecter à internet depuis hier. La connexion est très lente et se coupe fréquemment.', 'technique', 'haute', 'ouvert', 'maryam.fajri@emsi-edu.ma', NULL, 8, '2025-07-30 18:19:08', '2025-07-30 18:19:08', NULL),
(16, 'TKT-2025-003', 'Erreur 404 sur le site', 'Certaines pages de mon site affichent une erreur 404. Pouvez-vous vérifier et corriger ?', '', 'critique', 'resolu', 'maryam.fajri@emsi-edu.ma', NULL, 8, '2025-07-30 18:19:08', '2025-07-30 18:19:08', NULL),
(22, 'TKT-1756469146399', 'Test API', 'Test de création', 'technique', 'moyenne', 'ouvert', 'test@test.com', '0123456789', NULL, '2025-08-29 12:05:46', '2025-08-29 12:05:46', NULL),
(23, 'TKT-1756469224655', 'Test API Frontend', 'Test de création de ticket depuis le backend', 'technique', 'moyenne', 'ouvert', 'test@backend.com', '0123456789', NULL, '2025-08-29 12:07:04', '2025-08-29 12:07:04', NULL),
(24, 'TKT-1756469260397', 'Test API Frontend', 'Test de création de ticket depuis le backend', 'technique', 'moyenne', 'ouvert', 'test@backend.com', '0123456789', NULL, '2025-08-29 12:07:40', '2025-08-29 12:07:40', NULL),
(25, 'TKT-2025-003-3623', 'ticket1', 'ttt', 'technique', 'moyenne', 'ouvert', 'yazidi@gmail.com', '0643779966', 5, '2025-08-29 14:07:23', '2025-08-29 14:07:23', NULL);
CREATE TABLE `urgent_contacts` (
`id` int(11)
,`first_name` varchar(100)
,`last_name` varchar(100)
,`email` varchar(255)
,`phone` varchar(20)
,`company` varchar(255)
,`subject` varchar(255)
,`message` text
,`status` enum('new','in_progress','responded','closed')
,`created_at` timestamp
,`hours_since_creation` bigint(21)
);
CREATE TABLE `users` (
  `id` int(11) AUTO_INCREMENT PRIMARY KEY  NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `email_verified` tinyint(1) DEFAULT 0,
  `email_verification_token` varchar(255) DEFAULT NULL,
  `password_reset_token` varchar(255) DEFAULT NULL,
  `password_reset_expires` timestamp NULL DEFAULT NULL,
  `avatar` varchar(500) DEFAULT NULL,
  `company` varchar(255) DEFAULT NULL,
  `job_title` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT 'Maroc',
  `role` enum('user','admin','moderator','support') DEFAULT 'user',
  `status` enum('active','inactive','suspended','pending') DEFAULT 'active',
  `language` varchar(10) DEFAULT 'fr',
  `timezone` varchar(50) DEFAULT 'Africa/Casablanca',
  `notifications_email` tinyint(1) DEFAULT 1,
  `notifications_sms` tinyint(1) DEFAULT 0,
  `last_login` timestamp NULL DEFAULT NULL,
  `login_attempts` int(11) DEFAULT 0,
  `locked_until` timestamp NULL DEFAULT NULL,
  `two_factor_enabled` tinyint(1) DEFAULT 0,
  `two_factor_secret` varchar(32) DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `source` varchar(50) DEFAULT 'website',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `last_activity` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `phone`, `password_hash`, `email_verified`, `email_verification_token`, `password_reset_token`, `password_reset_expires`, `avatar`, `company`, `job_title`, `city`, `country`, `role`, `status`, `language`, `timezone`, `notifications_email`, `notifications_sms`, `last_login`, `login_attempts`, `locked_until`, `two_factor_enabled`, `two_factor_secret`, `ip_address`, `user_agent`, `source`, `created_at`, `updated_at`, `last_activity`) VALUES
(5, 'mery', 'f', 'yazidi@gmail.com', NULL, '$2b$12$RtJYLJ3Vf9G/SUf4gyotmuCaqXNiXHauIqu8UJI9/UstI7u0UZnd.', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Maroc', 'admin', 'active', 'fr', 'Africa/Casablanca', 1, 0, '2025-08-29 12:39:17', 0, NULL, 0, NULL, NULL, NULL, 'website', '2025-08-28 23:35:52', '2025-08-29 16:00:50', '2025-08-29 12:39:17'),
(8, 'maryam', 'fajri', 'maryam.fajri@emsi-edu.ma', NULL, '$2b$10$zMez0Sc3IOdOwLCDHwABpOwDzu1uE4diL24dv4cvKOdP1o3ZbrwOi', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Maroc', 'user', 'active', 'fr', 'Africa/Casablanca', 1, 0, NULL, 0, NULL, 0, NULL, NULL, NULL, 'website', '2025-08-29 20:57:13', '2025-08-29 20:57:13', '2025-08-29 20:57:13'),
(9, 'Test', 'User', 'test@example.com', '+1234567890', '$2b$10$XvVIZ.p6cxFZcvOyhQjYR.0y4f9Jchg93BV8INrPbyuy5mZZ6n5n6', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Maroc', 'user', 'active', 'fr', 'Africa/Casablanca', 1, 0, NULL, 0, NULL, 0, NULL, NULL, NULL, 'website', '2025-09-02 13:47:09', '2025-09-02 13:47:09', '2025-09-02 13:47:09');
DROP TABLE IF EXISTS `chatbot_recent_messages`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `chatbot_recent_messages`  AS SELECT `cm`.`id` AS `id`, `cm`.`user_id` AS `user_id`, `cm`.`session_id` AS `session_id`, `cm`.`message_type` AS `message_type`, `cm`.`content` AS `content`, `cm`.`intent` AS `intent`, `cm`.`confidence` AS `confidence`, `cm`.`entities` AS `entities`, `cm`.`suggestions` AS `suggestions`, `cm`.`created_at` AS `created_at`, concat(coalesce(`u`.`first_name`,''),' ',coalesce(`u`.`last_name`,'')) AS `username` FROM (`chatbot_messages` `cm` join `users` `u` on(`cm`.`user_id` = `u`.`id`)) WHERE `cm`.`created_at` >= current_timestamp() - interval 7 day ORDER BY `cm`.`created_at` DESC ;
DROP TABLE IF EXISTS `chatbot_user_stats`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `chatbot_user_stats`  AS SELECT `u`.`id` AS `user_id`, concat(coalesce(`u`.`first_name`,''),' ',coalesce(`u`.`last_name`,'')) AS `username`, `u`.`email` AS `email`, count(distinct `cs`.`session_id`) AS `total_sessions`, count(`cm`.`id`) AS `total_messages`, count(case when `cm`.`message_type` = 'user' then 1 end) AS `user_messages`, count(case when `cm`.`message_type` = 'bot' then 1 end) AS `bot_messages`, avg(`cm`.`confidence`) AS `avg_confidence`, max(`cm`.`created_at`) AS `last_message_date`, max(`cs`.`last_activity`) AS `last_session_activity` FROM ((`users` `u` left join `chatbot_sessions` `cs` on(`u`.`id` = `cs`.`user_id`)) left join `chatbot_messages` `cm` on(`u`.`id` = `cm`.`user_id`)) GROUP BY `u`.`id`, `u`.`first_name`, `u`.`last_name`, `u`.`email` ;
DROP TABLE IF EXISTS `contact_stats`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `contact_stats`  AS SELECT count(0) AS `total_contacts`, count(case when `contacts`.`status` = 'new' then 1 end) AS `new_contacts`, count(case when `contacts`.`status` = 'in_progress' then 1 end) AS `in_progress_contacts`, count(case when `contacts`.`status` = 'responded' then 1 end) AS `responded_contacts`, count(case when `contacts`.`status` = 'closed' then 1 end) AS `closed_contacts`, count(case when `contacts`.`priority` = 'urgent' then 1 end) AS `urgent_contacts`, count(case when `contacts`.`priority` = 'high' then 1 end) AS `high_priority_contacts`, count(case when `contacts`.`priority` = 'normal' then 1 end) AS `normal_priority_contacts`, count(case when `contacts`.`priority` = 'low' then 1 end) AS `low_priority_contacts`, count(case when `contacts`.`created_at` >= curdate() - interval 7 day then 1 end) AS `contacts_this_week`, count(case when `contacts`.`created_at` >= curdate() - interval 30 day then 1 end) AS `contacts_this_month`, count(case when `contacts`.`source` = 'website' then 1 end) AS `website_contacts`, count(case when `contacts`.`source` = 'mobile' then 1 end) AS `mobile_contacts`, count(case when `contacts`.`source` = 'api' then 1 end) AS `api_contacts`, avg(case when `contacts`.`responded_at` is not null then timestampdiff(HOUR,`contacts`.`created_at`,`contacts`.`responded_at`) end) AS `avg_response_time_hours` FROM `contacts` ;
DROP TABLE IF EXISTS `recent_contacts`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `recent_contacts`  AS SELECT `contacts`.`id` AS `id`, `contacts`.`first_name` AS `first_name`, `contacts`.`last_name` AS `last_name`, `contacts`.`email` AS `email`, `contacts`.`subject` AS `subject`, `contacts`.`status` AS `status`, `contacts`.`priority` AS `priority`, `contacts`.`created_at` AS `created_at`, timestampdiff(HOUR,`contacts`.`created_at`,current_timestamp()) AS `hours_since_creation` FROM `contacts` WHERE `contacts`.`created_at` >= curdate() - interval 7 day ORDER BY `contacts`.`created_at` DESC ;
DROP TABLE IF EXISTS `service_analysis`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `service_analysis`  AS SELECT coalesce(`contacts`.`category`,'Non spécifié') AS `service_name`, count(0) AS `demand_count`, count(case when `contacts`.`status` = 'responded' then 1 end) AS `responded_count`, count(case when `contacts`.`status` = 'closed' then 1 end) AS `closed_count`, avg(case when `contacts`.`budget` = '5k-15k' then 10000 when `contacts`.`budget` = '15k-50k' then 32500 when `contacts`.`budget` = '50k-100k' then 75000 when `contacts`.`budget` = '100k+' then 150000 else NULL end) AS `avg_budget_estimate` FROM `contacts` GROUP BY `contacts`.`category` ORDER BY count(0) DESC ;
DROP TABLE IF EXISTS `urgent_contacts`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `urgent_contacts`  AS SELECT `contacts`.`id` AS `id`, `contacts`.`first_name` AS `first_name`, `contacts`.`last_name` AS `last_name`, `contacts`.`email` AS `email`, `contacts`.`phone` AS `phone`, `contacts`.`company` AS `company`, `contacts`.`subject` AS `subject`, `contacts`.`message` AS `message`, `contacts`.`status` AS `status`, `contacts`.`created_at` AS `created_at`, timestampdiff(HOUR,`contacts`.`created_at`,current_timestamp()) AS `hours_since_creation` FROM `contacts` WHERE `contacts`.`priority` = 'urgent' AND `contacts`.`status` <> 'closed' ORDER BY `contacts`.`created_at` ASC ;
ALTER TABLE `appels_offres`
  ADD PRIMARY KEY (`id`);
ALTER TABLE `articles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_published_at` (`published_at`),
  ADD KEY `idx_author_id` (`author_id`);
ALTER TABLE `article_tags`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_article_tag` (`article_id`,`tag_id`),
  ADD KEY `idx_article_id` (`article_id`),
  ADD KEY `idx_tag_id` (`tag_id`);
ALTER TABLE `blogs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `author_id` (`author_id`);
ALTER TABLE `blog_article_views`
  ADD PRIMARY KEY (`id`);
ALTER TABLE `chatbot_logs`
  ADD PRIMARY KEY (`id`);
ALTER TABLE `chatbot_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_session_id` (`session_id`),
  ADD KEY `idx_created_at` (`created_at`),
  ADD KEY `idx_user_session` (`user_id`,`session_id`);
ALTER TABLE `chatbot_sessions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `session_id` (`session_id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_session_id` (`session_id`),
  ADD KEY `idx_last_activity` (`last_activity`),
  ADD KEY `idx_is_active` (`is_active`);
ALTER TABLE `chatbot_usage_stats`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_date` (`user_id`,`date`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_date` (`date`),
  ADD KEY `idx_user_date` (`user_id`,`date`);
ALTER TABLE `chatbot_user_preferences`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`),
  ADD KEY `idx_user_id` (`user_id`);
ALTER TABLE `commentaires`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_blog_id` (`blog_id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_created_at` (`created_at`),
  ADD KEY `idx_author_email` (`author_email`);
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_priority` (`priority`),
  ADD KEY `idx_category` (`category`),
  ADD KEY `idx_created_at` (`created_at`),
  ADD KEY `idx_contact_services` (`services`(255)),
  ADD KEY `idx_contact_budget` (`budget`),
  ADD KEY `idx_contact_timeline` (`timeline`),
  ADD KEY `idx_contact_source` (`source`),
  ADD KEY `idx_contact_ip_address` (`ip_address`),
  ADD KEY `idx_contact_responded_at` (`responded_at`),
  ADD KEY `idx_contact_assigned_to` (`assigned_to`),
  ADD KEY `idx_contact_status_priority` (`status`,`priority`),
  ADD KEY `idx_contact_category_status` (`category`,`status`),
  ADD KEY `idx_contact_created_at_status` (`created_at`,`status`);
ALTER TABLE `email_sends`
  ADD PRIMARY KEY (`id`),
  ADD KEY `template_id` (`template_id`),
  ADD KEY `idx_email_sends_subscriber` (`subscriber_id`),
  ADD KEY `idx_email_sends_sent_at` (`sent_at`),
  ADD KEY `idx_email_sends_date` (`sent_at`);
ALTER TABLE `email_templates`
  ADD PRIMARY KEY (`id`);
ALTER TABLE `partenaires`
  ADD PRIMARY KEY (`id`);
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `author_id` (`author_id`);
ALTER TABLE `propositions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_tender_id` (`tender_id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_created_at` (`created_at`);
ALTER TABLE `search_history`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_query` (`user_id`,`query`),
  ADD KEY `idx_user_created` (`user_id`,`created_at`),
  ADD KEY `idx_query` (`query`),
  ADD KEY `idx_created_at` (`created_at`),
  ADD KEY `idx_search_history_user_id` (`user_id`),
  ADD KEY `idx_search_history_created_at` (`created_at`);
ALTER TABLE `search_stats`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_query` (`query`),
  ADD KEY `idx_count` (`count`),
  ADD KEY `idx_last_searched` (`last_searched`),
  ADD KEY `idx_search_stats_query` (`query`),
  ADD KEY `idx_search_stats_count` (`count`);
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`);
ALTER TABLE `solutions`
  ADD PRIMARY KEY (`id`);
ALTER TABLE `subscribers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`) USING HASH,
  ADD UNIQUE KEY `unsubscribe_token` (`unsubscribe_token`) USING HASH,
  ADD KEY `idx_subscribers_email` (`email`(768)),
  ADD KEY `idx_subscribers_active` (`is_active`);
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `idx_name` (`name`);
ALTER TABLE `testimonials`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_testimonials_approved` (`approved`),
  ADD KEY `idx_testimonials_user_id` (`user_id`),
  ADD KEY `idx_testimonials_created_at` (`created_at`);
ALTER TABLE `testimonials` ADD FULLTEXT KEY `user_name` (`user_name`,`message`);
ALTER TABLE `tickets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `reference` (`reference`),
  ADD KEY `user_id` (`user_id`);
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_users_email` (`email`),
  ADD KEY `idx_users_role` (`role`),
  ADD KEY `idx_users_status` (`status`),
  ADD KEY `idx_users_created_at` (`created_at`),
  ADD KEY `idx_users_last_login` (`last_login`);
ALTER TABLE `appels_offres`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
ALTER TABLE `articles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `article_tags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `blogs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
ALTER TABLE `blog_article_views`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
ALTER TABLE `chatbot_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `chatbot_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;
ALTER TABLE `chatbot_sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
ALTER TABLE `chatbot_usage_stats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `chatbot_user_preferences`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `commentaires`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
ALTER TABLE `contacts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
ALTER TABLE `email_sends`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
ALTER TABLE `email_templates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
ALTER TABLE `partenaires`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `propositions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
ALTER TABLE `search_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `search_stats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
ALTER TABLE `services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
ALTER TABLE `solutions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
ALTER TABLE `subscribers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
ALTER TABLE `tags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `testimonials`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;
ALTER TABLE `tickets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
ALTER TABLE `articles`
  ADD CONSTRAINT `articles_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
ALTER TABLE `article_tags`
  ADD CONSTRAINT `article_tags_ibfk_1` FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `article_tags_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE;
ALTER TABLE `blogs`
  ADD CONSTRAINT `blogs_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;
ALTER TABLE `chatbot_messages`
  ADD CONSTRAINT `chatbot_messages_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
ALTER TABLE `chatbot_sessions`
  ADD CONSTRAINT `chatbot_sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
ALTER TABLE `chatbot_usage_stats`
  ADD CONSTRAINT `chatbot_usage_stats_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
ALTER TABLE `chatbot_user_preferences`
  ADD CONSTRAINT `chatbot_user_preferences_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
ALTER TABLE `commentaires`
  ADD CONSTRAINT `commentaires_ibfk_1` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `commentaires_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;
ALTER TABLE `email_sends`
  ADD CONSTRAINT `email_sends_ibfk_1` FOREIGN KEY (`subscriber_id`) REFERENCES `subscribers` (`id`),
  ADD CONSTRAINT `email_sends_ibfk_2` FOREIGN KEY (`template_id`) REFERENCES `email_templates` (`id`);
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`);
ALTER TABLE `propositions`
  ADD CONSTRAINT `propositions_ibfk_1` FOREIGN KEY (`tender_id`) REFERENCES `appels_offres` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `propositions_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;
ALTER TABLE `tickets`
  ADD CONSTRAINT `tickets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;
COMMIT;
