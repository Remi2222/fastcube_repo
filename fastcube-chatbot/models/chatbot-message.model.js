const { pool } = require('../config/database');


class ChatbotMessagesModel {
  
  static async createMessage({ session_id, user_id, message_type, content, confidence = 1.0, context_type = 'user_input' }) {
    try {
      
      const [result] = await pool.execute(
        `INSERT INTO chatbot_messages
        (user_id, session_id, message_type, content, confidence, context_type)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
            user_id,
            session_id,
            message_type,
            content,
            confidence,
            context_type
        ]);
      return {
        id: result.insertId,
        session_id,
        user_id,
        message_type,
        content,
        confidence,
        context_type,
        created_at: new Date()
      };
    } catch (error) {
      console.error('Erreur lors de la création du message:', error);
      throw error;
    }
  }

  
  static async getMessagesBySession(sessionId) {

    const [rows] = await pool.execute(
        `SELECT *
         FROM chatbot_messages
         WHERE session_id = ?
         ORDER BY created_at ASC`,
        [sessionId]
    );

    return rows;
  }

  
  static async getMessagesByUser(userId, limit = 100) {

    const [rows] = await pool.execute(
        `SELECT *
         FROM chatbot_messages
         WHERE user_id = ?
         ORDER BY created_at DESC
         LIMIT ?`,
        [userId, limit]
    );

    return rows;
}
  
  static async getMessagesByUserId(userId, limit = 100) {
    return this.getMessagesByUser(userId, limit);
  }

  
  static async getUserSessions(userId, limit = 20) {
    try {
     const [rows] = await pool.execute(
    `SELECT session_id,
            MAX(created_at) AS last_activity
      FROM chatbot_messages
      WHERE user_id = ?
      GROUP BY session_id
      ORDER BY last_activity DESC
      LIMIT ?`,
      [userId, limit]
    );

return rows;
    } catch (error) {
      console.error('Erreur lors de la récupération des sessions:', error);
      return [];
    }
  }

  
  static async deleteSessionMessages(sessionId) {
    try {
    await pool.execute(
        `DELETE FROM chatbot_messages
        WHERE session_id = ?`,
        [sessionId]
);      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression des messages:', error);
      throw error;
    }
  }

  
  static async getMessageStats() {
    try {
      const [totalMessages] = await pool.execute('SELECT COUNT(*) as count FROM chatbot_messages WHERE email LIKE "%@chatbot.local"');
      const [todayMessages] = await pool.execute('SELECT COUNT(*) as count FROM chatbot_messages WHERE email LIKE "%@chatbot.local" AND DATE(created_at) = CURDATE()');
      const [uniqueSessions] = await pool.execute('SELECT COUNT(DISTINCT email) as count FROM chatbot_messages WHERE email LIKE "%@chatbot.local"');
      const [uniqueUsers] = await pool.execute('SELECT COUNT(DISTINCT SUBSTRING_INDEX(SUBSTRING_INDEX(email, "_", 2), "_", -1)) as count FROM chatbot_messages WHERE email LIKE "%@chatbot.local"');
      
      return {
        total: Array.isArray(totalMessages) && totalMessages.length > 0 ? totalMessages[0].count : 0,
        today: Array.isArray(todayMessages) && todayMessages.length > 0 ? todayMessages[0].count : 0,
        sessions: Array.isArray(uniqueSessions) && uniqueSessions.length > 0 ? uniqueSessions[0].count : 0,
        users: Array.isArray(uniqueUsers) && uniqueUsers.length > 0 ? uniqueUsers[0].count : 0
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      return { total: 0, today: 0, sessions: 0, users: 0 };
    }
  }

  
  static async createSession(userId, userIp, userAgent) {
    try {
      const sessionId = `session-user-${userId}-${Date.now()}`;
      
      return sessionId;
    } catch (error) {
      console.error('Erreur lors de la création de session:', error);
      throw error;
    }
  }

  static async deactivateSession(sessionId) {
    try {
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la désactivation de session:', error);
      throw error;
    }
  }

  static async getActiveSessions(userId) {
    try {
      
      const [rows] = await pool.execute(
        'SELECT DISTINCT email as session_id, MAX(created_at) as last_activity FROM contacts WHERE email LIKE ? GROUP BY email ORDER BY last_activity DESC',
        [`%user_${userId}@chatbot.local`]
      );
      
      return Array.isArray(rows) ? rows.map(row => ({
        session_id: row.session_id.replace('session_', '').replace('@chatbot.local', ''),
        last_activity: row.last_activity,
        message_count: 0 
      })) : [];
    } catch (error) {
      console.error('Erreur lors de la récupération des sessions actives:', error);
      return [];
    }
  }

  static async getUserPreferences(userId) {
    try {
      
      return {
        user_id: userId,
        preferences: {
          language: 'fr',
          response_style: 'casual',
          notifications: true
        }
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des préférences:', error);
      return null;
    }
  }

  static async updateUserPreferences(userId, preferences) {
    try {
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour des préférences:', error);
      throw error;
    }
  }

  static async getUsageStats(userId) {
    try {
      const [rows] = await pool.execute(
        'SELECT COUNT(*) as total_messages, MAX(created_at) as last_message_date FROM contacts WHERE email LIKE ?',
        [`%user_${userId}@chatbot.local`]
      );
      
      return Array.isArray(rows) && rows.length > 0 ? {
        total_messages: rows[0].total_messages || 0,
        avg_confidence: 0.8,
        avg_processing_time: 0,
        total_sessions: 1,
        last_message_date: rows[0].last_message_date
      } : {
        total_messages: 0,
        avg_confidence: 0,
        avg_processing_time: 0,
        total_sessions: 0,
        last_message_date: null
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      return {
        total_messages: 0,
        avg_confidence: 0,
        avg_processing_time: 0,
        total_sessions: 0,
        last_message_date: null
      };
    }
  }

  static async cleanupOldMessages(daysOld = 30) {
    try {
      const [result] = await pool.execute(
      'DELETE FROM chatbot_messages WHERE created_at < DATE_SUB(NOW(), INTERVAL ? DAY)    ' ,
         [daysOld]
      );
      return result.affectedRows;
    } catch (error) {
      console.error('Erreur lors du nettoyage des messages:', error);
      throw error;
    }
  }

  static async deleteMessagesBySession(sessionId) {
    try {
       const [result] = await pool.execute(
        `DELETE FROM chatbot_messages
        WHERE session_id = ?`,
        [sessionId]
    );
      return result.affectedRows;
    } catch (error) {
      console.error('Erreur lors de la suppression des messages:', error);
      throw error;
    }
  }
}

module.exports = ChatbotMessagesModel;