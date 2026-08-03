const mysql = require('mysql2/promise');
const { pool } = require('../config/database-unified');

class Proposition {
  
  static async create(propositionData) {
    let connection;
    try {
      connection = await pool.getConnection();

      const {
        tender_id,
        user_id,
        full_name,
        address,
        phone,
        email,
        comment,
        files_path,
        files_names
      } = propositionData;

      const query = `
        INSERT INTO propositions (
          tender_id, user_id, full_name, address, phone, email, 
          comment, files_path, files_names, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `;

      const values = [
        tender_id || null,
        user_id || null,
        full_name || null,
        address || null,
        phone || null,
        email || null,
        comment || null,
        files_path ? JSON.stringify(files_path) : null,
        files_names ? JSON.stringify(files_names) : null
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

  
  static async getAll() {
    let connection;
    try {
      connection = await pool.getConnection();

      const query = `
        SELECT 
          p.*,
          t.title as tender_title,
          t.id as tender_reference,
          u.email as user_email,
          u.first_name as user_first_name,
          u.last_name as user_last_name
        FROM propositions p
        LEFT JOIN appels_offres t ON p.tender_id = t.id
        LEFT JOIN users u ON p.user_id = u.id
        ORDER BY p.updated_at DESC
      `;

      const [rows] = await connection.execute(query);

      return rows.map(row => ({
        ...row,
        files_path: row.files_path ? JSON.parse(row.files_path) : [],
        files_names: row.files_names ? JSON.parse(row.files_names) : [],
        created_at: row.updated_at 
      }));
    } catch (error) {
      throw error;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  
  static async getByUserId(userId) {
    let connection;
    try {
      connection = await pool.getConnection();

      const query = `
        SELECT 
          p.*,
          t.title as tender_title,
          t.id as tender_reference
        FROM propositions p
        LEFT JOIN appels_offres t ON p.tender_id = t.id
        WHERE p.user_id = ?
        ORDER BY p.updated_at DESC
      `;

      const [rows] = await connection.execute(query, [userId]);

      return rows.map(row => ({
        ...row,
        files_path: row.files_path ? JSON.parse(row.files_path) : [],
        files_names: row.files_names ? JSON.parse(row.files_names) : [],
        created_at: row.updated_at
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

      const query = `
        SELECT 
          p.*,
          t.title as tender_title,
          t.id as tender_reference,
          u.email as user_email,
          u.first_name as user_first_name,
          u.last_name as user_last_name,
          u.name as user_prenom
        FROM propositions p
        LEFT JOIN appels_offres t ON p.tender_id = t.id
        LEFT JOIN users u ON p.user_id = u.id
        WHERE p.id = ?
      `;

      const [rows] = await connection.execute(query, [id]);

      if (rows.length === 0) {
        return null;
      }

      const row = rows[0];
      return {
        ...row,
        files_path: row.files_path ? JSON.parse(row.files_path) : [],
        files_names: row.files_names ? JSON.parse(row.files_names) : []
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
        UPDATE propositions 
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

      const query = 'DELETE FROM propositions WHERE id = ?';
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

      const [totalResult] = await connection.execute('SELECT COUNT(*) as total FROM propositions');
      const [pendingResult] = await connection.execute("SELECT COUNT(*) as count FROM propositions WHERE status = 'en_attente'");
      const [acceptedResult] = await connection.execute("SELECT COUNT(*) as count FROM propositions WHERE status = 'acceptee'");
      const [rejectedResult] = await connection.execute("SELECT COUNT(*) as count FROM propositions WHERE status = 'refusee'");
      const [evaluationResult] = await connection.execute("SELECT COUNT(*) as count FROM propositions WHERE status = 'en_cours_evaluation'");

      return {
        total: totalResult[0].total,
        en_attente: pendingResult[0].count,
        acceptee: acceptedResult[0].count,
        refusee: rejectedResult[0].count,
        en_cours_evaluation: evaluationResult[0].count
      };
    } catch (error) {
      throw error;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  
  static async search(searchTerm, filters = {}) {
    let connection;
    try {
      connection = await pool.getConnection();

      let query = `
        SELECT 
          p.*,
          t.title as tender_title,
          t.id as tender_reference,
          u.email as user_email,
          u.first_name as user_first_name,
          u.last_name as user_last_name
        FROM propositions p
        LEFT JOIN appels_offres t ON p.tender_id = t.id
        LEFT JOIN users u ON p.user_id = u.id
        WHERE 1=1
      `;
      
      let params = [];

      if (searchTerm) {
        query += ` AND (p.company_name LIKE ? OR p.contact_email LIKE ? OR t.title LIKE ?)`;
        params.push(`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`);
      }

      if (filters.status) {
        query += ` AND p.status = ?`;
        params.push(filters.status);
      }

      if (filters.tender_id) {
        query += ` AND p.tender_id = ?`;
        params.push(filters.tender_id);
      }

      query += ` ORDER BY p.updated_at DESC`;

      const [rows] = await connection.execute(query, params);

      return rows.map(row => ({
        ...row,
        files_path: row.files_path ? JSON.parse(row.files_path) : [],
        files_names: row.files_names ? JSON.parse(row.files_names) : [],
        created_at: row.updated_at
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

module.exports = Proposition;