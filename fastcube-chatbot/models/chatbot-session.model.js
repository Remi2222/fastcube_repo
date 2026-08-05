const { pool } = require('../config/database');

class ChatbotSessionsModel {

    // Crée une nouvelle session en base. Si la session existe déjà
    // (même session_id), on ne la duplique pas : on la renvoie telle quelle.
    static async createSession({ user_id = null, session_id, metadata = {} }) {
        try {
            const existing = await this.getSessionById(session_id);
            if (existing) {
                return existing;
            }

            const [result] = await pool.execute(
                `INSERT INTO chatbot_sessions
                    (session_id, user_id, session_metadata, is_active, created_at, last_activity)
                 VALUES (?, ?, ?, TRUE, NOW(), NOW())`,
                [session_id, user_id, JSON.stringify(metadata || {})]
            );

            return {
                id: result.insertId,
                session_id,
                user_id,
                session_metadata: metadata,
                is_active: true
            };
        } catch (error) {
            console.error('Erreur lors de la création de session:', error);
            throw error;
        }
    }

    // Récupère une session par son session_id.
    // Renvoie null si elle n'existe pas.
    static async getSessionById(session_id) {
        try {
            const [rows] = await pool.execute(
                'SELECT * FROM chatbot_sessions WHERE session_id = ? LIMIT 1',
                [session_id]
            );
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error('Erreur lors de la récupération de la session:', error);
            throw error;
        }
    }
}

module.exports = ChatbotSessionsModel;