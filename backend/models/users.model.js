const { pool } = require('../config/database-unified');

class User {
  
  static async create(userData) {
    const connection = await pool.getConnection();
    try {
      const {
        first_name,
        last_name,
        email,
        password_hash,
        phone,
        role = 'user'
      } = userData;

      const [result] = await connection.execute(
        `INSERT INTO users (first_name, last_name, email, password_hash, phone, role)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [first_name, last_name, email, password_hash, phone, role]
      );
      return result.insertId;
    } finally {
      connection.release();
    }
  }

  
  static async findByEmail(email) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      return rows[0] || null;
    } finally {
      connection.release();
    }
  }

  
  static async findById(id) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM users WHERE id = ?',
        [id]
      );
      return rows[0] || null;
    } finally {
      connection.release();
    }
  }

  
  static async getById(id) {
    return this.findById(id);
  }

  
  static async update(id, userData) {
    const connection = await pool.getConnection();
    try {
      const {
        name, 
        first_name,
        last_name,
        email,
        phone,
        role,
        address,
        city,
        country
      } = userData;

      
      let firstName = first_name;
      let lastName = last_name;
      
      if (name && !first_name && !last_name) {
        const nameParts = name.trim().split(' ');
        firstName = nameParts[0] || '';
        lastName = nameParts.slice(1).join(' ') || '';
      }

      const [result] = await connection.execute(
        `UPDATE users SET 
         first_name = ?, last_name = ?, email = ?, phone = ?, role = ?, address = ?, city = ?, country = ?
         WHERE id = ?`,
        [firstName, lastName, email, phone, role, address, city, country, id]
      );
      
      if (result.affectedRows > 0) {
        
        return await this.getById(id);
      }
      return null;
    } finally {
      connection.release();
    }
  }

  
  static async delete(id) {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.execute(
        'DELETE FROM users WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } finally {
      connection.release();
    }
  }

  
  static async findAll(limit = 50, offset = 0) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT id, first_name, last_name, email, phone, role, created_at FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?',
        [limit, offset]
      );
      return rows;
    } finally {
      connection.release();
    }
  }

  
  static async findByRole(role) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT id, first_name, last_name, email, phone, role, created_at FROM users WHERE role = ? ORDER BY created_at DESC',
        [role]
      );
      return rows;
    } finally {
      connection.release();
    }
  }

  
  static async emailExists(email, excludeId = null) {
    const connection = await pool.getConnection();
    try {
      let query = 'SELECT COUNT(*) as count FROM users WHERE email = ?';
      let params = [email];
      
      if (excludeId) {
        query += ' AND id != ?';
        params.push(excludeId);
      }
      
      const [rows] = await connection.execute(query, params);
      return rows[0].count > 0;
    } finally {
      connection.release();
    }
  }

  
  static async updatePassword(id, password_hash) {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.execute(
        'UPDATE users SET password_hash = ? WHERE id = ?',
        [password_hash, id]
      );
      return result.affectedRows > 0;
    } finally {
      connection.release();
    }
  }

  
  static async getStats() {
    const connection = await pool.getConnection();
    try {
      const [totalResult] = await connection.execute('SELECT COUNT(*) as total FROM users');
      const [adminResult] = await connection.execute("SELECT COUNT(*) as count FROM users WHERE role = 'admin'");
      const [clientResult] = await connection.execute("SELECT COUNT(*) as count FROM users WHERE role = 'client'");
      const [recentResult] = await connection.execute('SELECT COUNT(*) as recent FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)');
      
      return {
        total: totalResult[0].total,
        admins: adminResult[0].count,
        clients: clientResult[0].count,
        recent: recentResult[0].recent
      };
    } finally {
      connection.release();
    }
  }
}

module.exports = User;