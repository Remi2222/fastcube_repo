const { pool } = require('../config/database-unified');

class CommentaireModel {
  
  static async getCommentairesByBlog(blogId) {
    try {
      const [rows] = await pool.execute(`
        SELECT 
          c.id,
          c.content,
          c.created_at,
          c.updated_at,
          c.status,
          c.author_name,
          c.author_email,
          u.id as user_id,
          u.first_name,
          u.last_name,
          u.email
        FROM commentaires c
        LEFT JOIN users u ON c.user_id = u.id
        WHERE c.blog_id = ? AND c.status = 'approved'
        ORDER BY c.created_at DESC
      `, [blogId]);
      
      return rows;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des commentaires: ${error.message}`);
    }
  }

  
  static async getCommentaireById(id) {
    try {
      const [rows] = await pool.execute(`
        SELECT 
          c.*,
          u.first_name,
          u.last_name,
          u.email
        FROM commentaires c
        LEFT JOIN users u ON c.user_id = u.id
        WHERE c.id = ?
      `, [id]);
      
      return rows[0];
    } catch (error) {
      throw new Error(`Erreur lors de la récupération du commentaire: ${error.message}`);
    }
  }

  
  static async createCommentaire(commentaireData) {
    try {
      const { blog_id, user_id, content, author_name, author_email, status = 'pending' } = commentaireData;
      
      const [result] = await pool.execute(`
        INSERT INTO commentaires (blog_id, user_id, content, author_name, author_email, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, NOW())
      `, [
        blog_id || null,
        user_id || null, 
        content || null,
        author_name || null,
        author_email || null,
        status || 'pending'
      ]);
      
      return result.insertId;
    } catch (error) {
      throw new Error(`Erreur lors de la création du commentaire: ${error.message}`);
    }
  }

  
  static async updateCommentaire(id, updateData) {
    try {
      const { content, status } = updateData;
      const [result] = await pool.execute(`
        UPDATE commentaires 
        SET content = ?, status = ?, updated_at = NOW()
        WHERE id = ?
      `, [content, status, id]);
      
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour du commentaire: ${error.message}`);
    }
  }

  
  static async deleteCommentaire(id) {
    try {
      const [result] = await pool.execute('DELETE FROM commentaires WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Erreur lors de la suppression du commentaire: ${error.message}`);
    }
  }

  
  static async approveCommentaire(id) {
    try {
      const [result] = await pool.execute(`
        UPDATE commentaires 
        SET status = 'approved', updated_at = NOW()
        WHERE id = ?
      `, [id]);
      
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Erreur lors de l'approbation du commentaire: ${error.message}`);
    }
  }

  
  static async rejectCommentaire(id) {
    try {
      const [result] = await pool.execute(`
        UPDATE commentaires 
        SET status = 'rejected', updated_at = NOW()
        WHERE id = ?
      `, [id]);
      
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Erreur lors du rejet du commentaire: ${error.message}`);
    }
  }

  
  static async getAllCommentaires() {
    try {
      const [rows] = await pool.execute(`
        SELECT 
          c.*,
          u.first_name,
          u.last_name,
          u.email,
          b.title as blog_title
        FROM commentaires c
        LEFT JOIN users u ON c.user_id = u.id
        LEFT JOIN blogs b ON c.article_id = b.id
        ORDER BY c.created_at DESC
      `);
      
      return rows;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des commentaires: ${error.message}`);
    }
  }

  
  static async getPendingCommentaires() {
    try {
      const [rows] = await pool.execute(`
        SELECT 
          c.*,
          u.first_name,
          u.last_name,
          u.email,
          b.title as blog_title
        FROM commentaires c
        LEFT JOIN users u ON c.user_id = u.id
        LEFT JOIN blogs b ON c.article_id = b.id
        WHERE c.status = 'pending'
        ORDER BY c.created_at DESC
      `);
      
      return rows;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des commentaires en attente: ${error.message}`);
    }
  }

  
  static async countCommentairesByBlog(blogId) {
    try {
      const [rows] = await pool.execute(`
        SELECT COUNT(*) as count
        FROM commentaires 
        WHERE blog_id = ? AND status = 'approved'
      `, [blogId]);
      
      return rows[0].count;
    } catch (error) {
      throw new Error(`Erreur lors du comptage des commentaires: ${error.message}`);
    }
  }

  
  static async getRecentCommentaires(limit = 5) {
    try {
      const [rows] = await pool.execute(`
        SELECT 
          c.*,
          u.first_name,
          u.last_name,
          b.title as blog_title
        FROM commentaires c
        LEFT JOIN users u ON c.user_id = u.id
        LEFT JOIN blogs b ON c.article_id = b.id
        WHERE c.status = 'approved'
        ORDER BY c.created_at DESC
        LIMIT ?
      `, [limit]);
      
      return rows;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des commentaires récents: ${error.message}`);
    }
  }
}

module.exports = CommentaireModel;