const { pool } = require('../config/database-unified');

class Contact {
  
  static async create(contactData) {
    let connection;
    try {
      connection = await pool.getConnection();

      const {
        firstName,
        lastName,
        email,
        phone,
        company,
        city,
        country,
        category,
        subject,
        message,
        priority,
        preferredContact,
        attachments,
        aiResponse
      } = contactData;

      const query = `
        INSERT INTO contacts (
          first_name, last_name, email, phone, company, city, country,
          category, subject, message, priority, preferred_contact,
          attachments, ai_response, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `;

      const values = [
        firstName,
        lastName,
        email,
        phone || null,
        company || null,
        city || null,
        country || null,
        category,
        subject,
        message,
        priority || 'normal',
        preferredContact || 'email',
        attachments ? JSON.stringify(attachments) : null,
        aiResponse || null
      ];

      const [result] = await connection.execute(query, values);
      return result.insertId;
    } catch (error) {
      throw error;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  
  static async getAll(limit = 50, offset = 0) {
    let connection;
    try {
      connection = await pool.getConnection();

      const query = `
        SELECT * FROM contacts 
        ORDER BY created_at DESC 
        LIMIT ? OFFSET ?
      `;

      const [rows] = await connection.execute(query, [limit, offset]);

      return rows.map(row => ({
        ...row,
        attachments: row.attachments ? JSON.parse(row.attachments) : []
      }));
    } catch (error) {
      throw error;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  
  static async getById(id) {
    let connection;
    try {
      connection = await pool.getConnection();

      const query = `SELECT * FROM contacts WHERE id = ?`;
      const [rows] = await connection.execute(query, [id]);

      if (rows.length === 0) {
        return null;
      }

      const row = rows[0];
      return {
        ...row,
        attachments: row.attachments ? JSON.parse(row.attachments) : []
      };
    } catch (error) {
      throw error;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  
  static async updateStatus(id, status) {
    let connection;
    try {
      connection = await pool.getConnection();

      const query = `
        UPDATE contacts 
        SET status = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;

      const [result] = await connection.execute(query, [status, id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  
  static async delete(id) {
    let connection;
    try {
      connection = await pool.getConnection();

      const query = `DELETE FROM contacts WHERE id = ?`;
      const [result] = await connection.execute(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  
  static async getStats() {
    let connection;
    try {
      connection = await pool.getConnection();

      const query = `
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) as new,
          SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
          SUM(CASE WHEN status = 'responded' THEN 1 ELSE 0 END) as responded,
          SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) as closed,
          SUM(CASE WHEN priority = 'urgent' THEN 1 ELSE 0 END) as urgent,
          SUM(CASE WHEN priority = 'high' THEN 1 ELSE 0 END) as high
        FROM contacts
      `;

      const [rows] = await connection.execute(query);
      return rows[0];
    } catch (error) {
      throw error;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  
  static async search(searchTerm, limit = 20) {
    let connection;
    try {
      connection = await pool.getConnection();

      const query = `
        SELECT * FROM contacts 
        WHERE 
          first_name LIKE ? OR 
          last_name LIKE ? OR 
          email LIKE ? OR 
          subject LIKE ? OR 
          message LIKE ?
        ORDER BY created_at DESC 
        LIMIT ?
      `;

      const searchPattern = `%${searchTerm}%`;
      const [rows] = await connection.execute(query, [
        searchPattern, searchPattern, searchPattern, 
        searchPattern, searchPattern, limit
      ]);

      return rows.map(row => ({
        ...row,
        attachments: row.attachments ? JSON.parse(row.attachments) : []
      }));
    } catch (error) {
      throw error;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
}

module.exports = Contact; 