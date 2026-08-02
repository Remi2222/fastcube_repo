const { pool } = require('../config/database-unified');

class Tender {
  
  static async create(tenderData) {
    let connection;
    try {
      connection = await pool.getConnection();
      
      const {
        title,
        description,
        reference,
        deadline,
        budget,
        status = 'open'
      } = tenderData;

      const query = `
        INSERT INTO tenders (
          title, description, reference, deadline, budget, status
        ) VALUES (?, ?, ?, ?, ?, ?)
      `;
      
      const values = [
        title || null,
        description || null,
        reference || null,
        deadline || null,
        budget || null,
        status || 'open'
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

  
  static async getAll(status = null) {
    let connection;
    try {
      connection = await pool.getConnection();
      
      let query = `
        SELECT 
          id,
          title,
          description,
          reference,
          deadline,
          budget,
          status,
          technologies,
          contact_email,
          contact_phone,
          cahier_charges_path,
          cahier_charges_name,
          created_at,
          updated_at
        FROM tenders
      `;
      
      let params = [];
      
      if (status) {
        query += ' WHERE status = ?';
        params.push(status);
      }
      
      query += ' ORDER BY created_at DESC';

      const [rows] = await connection.execute(query, params);
      return rows;
    } catch (error) {
      console.error('Erreur dans getAll tenders:', error);
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
          id,
          title,
          description,
          reference,
          deadline,
          budget,
          status,
          created_at,
          updated_at
        FROM tenders
        WHERE id = ?
      `;
      
      const [rows] = await connection.execute(query, [id]);
      return rows[0] || null;
    } catch (error) {
      throw error;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  
  static async update(id, updateData) {
    let connection;
    try {
      connection = await pool.getConnection();
      
      const allowedFields = [
        'title', 'description', 'reference', 'deadline', 'budget', 'technologies', 
        'requirements', 'criteria', 'contact_email', 'contact_phone', 
        'cahier_charges_path', 'cahier_charges_name', 'status'
      ];
      
      const fieldsToUpdate = [];
      const values = [];
      
      allowedFields.forEach(field => {
        if (updateData[field] !== undefined) {
          fieldsToUpdate.push(`${field} = ?`);
          values.push(updateData[field] || null);
        }
      });
      
      if (fieldsToUpdate.length === 0) {
        return false;
      }
      
      values.push(id);
      
      const query = `
        UPDATE tenders 
        SET ${fieldsToUpdate.join(', ')}
        WHERE id = ?
      `;
      
      const [result] = await connection.execute(query, values);
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
      
      const query = 'DELETE FROM tenders WHERE id = ?';
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
          SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) as open,
          SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) as closed,
          SUM(CASE WHEN status = 'awarded' THEN 1 ELSE 0 END) as awarded,
          SUM(CASE WHEN deadline < CURRENT_TIMESTAMP THEN 1 ELSE 0 END) as expired
        FROM tenders
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

  
  static async getRecent(limit = 5) {
    let connection;
    try {
      connection = await pool.getConnection();
      
      const query = `
        SELECT 
          id,
          title,
          description,
          reference,
          budget,
          deadline,
          status,
          created_at
        FROM tenders
        ORDER BY created_at DESC
        LIMIT ?
      `;
      
      const [rows] = await connection.execute(query, [limit]);
      return rows;
    } catch (error) {
      throw error;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
}

module.exports = Tender; 