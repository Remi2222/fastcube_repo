const { pool } = require('../config/database-unified');

class NewsletterModel {
  
  static async createSubscriber(subscriberData) {
    try {
      const { email, first_name, last_name, company, interests, frequency, password_hash, unsubscribe_token } = subscriberData;
      
      const query = `
        INSERT INTO subscribers (email, first_name, last_name, company, interests, frequency, password_hash, unsubscribe_token, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `;
      
      const [result] = await pool.execute(query, [
        email, first_name, last_name, company, 
        JSON.stringify(interests), frequency, password_hash, unsubscribe_token
      ]);
      
      return { id: result.insertId, ...subscriberData };
    } catch (error) {
      throw error;
    }
  }

  
  static async checkEmailExists(email) {
    try {
      const [rows] = await pool.execute(
        'SELECT id FROM subscribers WHERE email = ?',
        [email]
      );
      return rows.length > 0;
    } catch (error) {
      throw error;
    }
  }

  
  static async getSubscriberByEmail(email) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM subscribers WHERE email = ? AND is_active = TRUE',
        [email]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  
  static async getSubscriberByToken(token) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM subscribers WHERE unsubscribe_token = ? AND is_active = TRUE',
        [token]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  
  static async unsubscribe(token) {
    try {
      const [result] = await pool.execute(
        'UPDATE subscribers SET is_active = FALSE WHERE unsubscribe_token = ?',
        [token]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  
  static async getAllActiveSubscribers(frequency = null) {
    try {
      let query = 'SELECT * FROM subscribers WHERE is_active = TRUE';
      let params = [];
      
      if (frequency) {
        query += ' AND frequency = ?';
        params.push(frequency);
      }
      
      query += ' ORDER BY created_at DESC';
      
      const [rows] = await pool.execute(query, params);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  
  static async getStats() {
    try {
      
      const [totalResult] = await pool.execute(
        'SELECT COUNT(*) as total FROM subscribers WHERE is_active = TRUE'
      );
      
      
      const [frequencyResult] = await pool.execute(`
        SELECT frequency, COUNT(*) as count 
        FROM subscribers 
        WHERE is_active = TRUE 
        GROUP BY frequency
      `);
      
      
      const [todayResult] = await pool.execute(`
        SELECT COUNT(*) as count 
        FROM email_sends 
        WHERE DATE(sent_at) = CURDATE()
      `);
      
      return {
        total_subscribers: totalResult[0].total,
        frequency_distribution: frequencyResult.reduce((acc, row) => {
          acc[row.frequency] = row.count;
          return acc;
        }, {}),
        emails_sent_today: todayResult[0].count
      };
    } catch (error) {
      throw error;
    }
  }

  
  static async createEmailTemplate(templateData) {
    try {
      const { name, subject, html_content, text_content, category } = templateData;
      
      const query = `
        INSERT INTO email_templates (name, subject, html_content, text_content, category, created_at)
        VALUES (?, ?, ?, ?, ?, NOW())
      `;
      
      const [result] = await pool.execute(query, [
        name, subject, html_content, text_content, category
      ]);
      
      return { id: result.insertId, ...templateData };
    } catch (error) {
      throw error;
    }
  }

  
  static async recordEmailSend(subscriber_id, template_id, status = 'sent', error_message = null) {
    try {
      const query = `
        INSERT INTO email_sends (subscriber_id, template_id, status, error_message, sent_at)
        VALUES (?, ?, ?, ?, NOW())
      `;
      
      const [result] = await pool.execute(query, [
        subscriber_id, template_id, status, error_message
      ]);
      
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  
  static async getSubscriberByEmail(email) {
    try {
      const query = `
        SELECT * FROM subscribers 
        WHERE email = ? AND is_active = TRUE
      `;
      
      const [rows] = await pool.execute(query, [email]);
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = NewsletterModel; 