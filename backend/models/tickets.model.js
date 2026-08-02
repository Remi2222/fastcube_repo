const mysql = require('mysql2/promise');
const { pool } = require('../config/database-unified');

class Ticket {
  static async create(ticketData) {
    try {
      const connection = await pool.getConnection();
      
      
      const reference = await this.generateReference();
      
      const query = `
        INSERT INTO tickets (
          subject, description, status, priority, user_email, reference,
          category, user_id, contact_email, contact_phone, assigned_to,
          tags, attachments, internal_notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const values = [
        ticketData.subject,
        ticketData.description || '',
        ticketData.status || 'open',
        ticketData.priority || 'medium',
        ticketData.user_email || ticketData.userEmail || null,
        reference,
        ticketData.category || 'technique',
        ticketData.user_id || null,
        ticketData.contact_email || null,
        ticketData.contact_phone || null,
        ticketData.assigned_to || null,
        ticketData.tags || null,
        ticketData.attachments ? JSON.stringify(ticketData.attachments) : null,
        ticketData.internal_notes || null
      ];
      
      const [result] = await connection.execute(query, values);
      connection.release();
      
      return {
        id: result.insertId,
        reference,
        ...ticketData
      };
    } catch (error) {
      console.error('Erreur lors de la création du ticket:', error);
      if (error.code === 'ER_NO_SUCH_TABLE') {
        throw new Error('La table tickets n\'existe pas. Veuillez exécuter le script de création de la base de données.');
      }
      throw error;
    }
  }

  static async generateReference() {
    try {
      const connection = await pool.getConnection();
      
      
      const year = new Date().getFullYear();
      const query = `
        SELECT COUNT(*) as count 
        FROM tickets 
        WHERE YEAR(created_at) = ? 
        AND reference LIKE ?
      `;
      
      const [rows] = await connection.execute(query, [year, `TKT-${year}-%`]);
      const count = rows[0].count + 1;
      const reference = `TKT-${year}-${count.toString().padStart(3, '0')}`;
      
      
      const [existing] = await connection.execute('SELECT id FROM tickets WHERE reference = ?', [reference]);
      connection.release();
      
      if (existing.length > 0) {
        
        return `TKT-${year}-${count.toString().padStart(3, '0')}-${Date.now().toString().slice(-4)}`;
      }
      
      return reference;
    } catch (error) {
      console.error('Erreur lors de la génération de la référence:', error);
      
      if (error.code === 'ER_NO_SUCH_TABLE') {
        return `TKT-${new Date().getFullYear()}-001`;
      }
      
      return `TKT-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
    }
  }

  static async getAll() {
    try {
      const connection = await pool.getConnection();
      
      const query = `
        SELECT t.*, 
               CONCAT(u.first_name, ' ', u.last_name) as user_name, 
               u.email as user_email_full,
               CONCAT(a.first_name, ' ', a.last_name) as assigned_to_name
        FROM tickets t
        LEFT JOIN users u ON t.user_id = u.id
        LEFT JOIN users a ON t.assigned_to = a.id
        ORDER BY t.created_at DESC
      `;
      
      const [rows] = await connection.execute(query);
      connection.release();
      
      return rows;
    } catch (error) {
      console.error('Erreur lors de la récupération des tickets:', error);
      if (error.code === 'ER_NO_SUCH_TABLE') {
        return [];
      }
      throw error;
    }
  }

  static async getById(id) {
    try {
      const connection = await pool.getConnection();
      
      const query = `
        SELECT t.*, 
               CONCAT(u.first_name, ' ', u.last_name) as user_name, 
               u.email as user_email_full,
               CONCAT(a.first_name, ' ', a.last_name) as assigned_to_name
        FROM tickets t
        LEFT JOIN users u ON t.user_id = u.id
        LEFT JOIN users a ON t.assigned_to = a.id
        WHERE t.id = ?
      `;
      
      const [rows] = await connection.execute(query, [id]);
      connection.release();
      
      return rows[0];
    } catch (error) {
      console.error('Erreur lors de la récupération du ticket:', error);
      if (error.code === 'ER_NO_SUCH_TABLE') {
        return null;
      }
      throw error;
    }
  }

  static async getByUserEmail(userEmail) {
    try {
      const connection = await pool.getConnection();
      
      const query = `
        SELECT * FROM tickets 
        WHERE user_email = ? 
        ORDER BY created_at DESC
      `;
      
      const [rows] = await connection.execute(query, [userEmail]);
      connection.release();
      
      return rows;
    } catch (error) {
      console.error('Erreur lors de la récupération des tickets utilisateur:', error);
      if (error.code === 'ER_NO_SUCH_TABLE') {
        return [];
      }
      throw error;
    }
  }

  static async update(id, updateData) {
    try {
      const connection = await pool.getConnection();
      
      const allowedFields = [
        'subject', 'description', 'status', 'priority', 'user_email',
        'category', 'user_id', 'contact_email', 'contact_phone', 'assigned_to',
        'tags', 'attachments', 'internal_notes'
      ];
      
      const fieldsToUpdate = [];
      const values = [];
      
      allowedFields.forEach(field => {
        if (updateData[field] !== undefined) {
          fieldsToUpdate.push(`${field} = ?`);
          if (field === 'attachments' && Array.isArray(updateData[field])) {
            values.push(JSON.stringify(updateData[field]));
          } else {
            values.push(updateData[field]);
          }
        }
      });
      
      if (fieldsToUpdate.length === 0) {
        return false;
      }
      
      values.push(id);
      
      const query = `
        UPDATE tickets 
        SET ${fieldsToUpdate.join(', ')}
        WHERE id = ?
      `;
      
      const [result] = await connection.execute(query, values);
      connection.release();
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du ticket:', error);
      throw error;
    }
  }

  static async updateStatus(id, status) {
    try {
      const connection = await pool.getConnection();
      
      const query = `
        UPDATE tickets 
        SET status = ?
        WHERE id = ?
      `;
      
      const [result] = await connection.execute(query, [status, id]);
      connection.release();
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const connection = await pool.getConnection();
      
      const query = 'DELETE FROM tickets WHERE id = ?';
      const [result] = await connection.execute(query, [id]);
      connection.release();
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Erreur lors de la suppression du ticket:', error);
      throw error;
    }
  }

  static async getStats() {
    try {
      const connection = await pool.getConnection();
      
      const query = `
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) as open,
          SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
          SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) as closed
        FROM tickets
      `;
      
      const [rows] = await connection.execute(query);
      connection.release();
      
      const stats = rows[0];
      return {
        total: stats.total || 0,
        open: stats.open || 0,
        in_progress: stats.in_progress || 0,
        closed: stats.closed || 0,
        active: (stats.open || 0) + (stats.in_progress || 0)
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      if (error.code === 'ER_NO_SUCH_TABLE') {
        return { total: 0, open: 0, in_progress: 0, closed: 0, active: 0 };
      }
      throw error;
    }
  }

  static async getByUserId(userId) {
    try {
      const connection = await pool.getConnection();
      
      const query = `
        SELECT t.*, 
               CONCAT(u.first_name, ' ', u.last_name) as user_name, 
               u.email as user_email_full,
               CONCAT(a.first_name, ' ', a.last_name) as assigned_to_name
        FROM tickets t
        LEFT JOIN users u ON t.user_id = u.id
        LEFT JOIN users a ON t.assigned_to = a.id
        WHERE t.user_id = ?
        ORDER BY t.created_at DESC
      `;
      
      const [rows] = await connection.execute(query, [userId]);
      connection.release();
      
      return rows;
    } catch (error) {
      console.error('Erreur lors de la récupération des tickets utilisateur:', error);
      if (error.code === 'ER_NO_SUCH_TABLE') {
        return [];
      }
      throw error;
    }
  }

  static async getRecent(limit = 5) {
    try {
      const connection = await pool.getConnection();
      
      const query = `
        SELECT id, subject, status, priority, user_email, created_at
        FROM tickets
        ORDER BY created_at DESC
        LIMIT ?
      `;
      
      const [rows] = await connection.execute(query, [limit]);
      connection.release();
      
      return rows;
    } catch (error) {
      console.error('Erreur lors de la récupération des tickets récents:', error);
      return [];
    }
  }
}

module.exports = Ticket; 