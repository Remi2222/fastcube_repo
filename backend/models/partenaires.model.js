const { pool } = require('../config/database-unified');

class PartenaireModel {
  
  static async getAllPartenaires() {
    try {
      const [rows] = await pool.execute(`
        SELECT * FROM partenaires 
        ORDER BY nom ASC
      `);
      return { success: true, data: Array.isArray(rows) ? rows : [] };
    } catch (error) {
      console.error('Erreur lors de la récupération des partenaires:', error);
      return { success: false, error: 'Erreur lors de la récupération des partenaires' };
    }
  }

  
  static async getPartenaireById(id) {
    try {
      const [rows] = await pool.execute(`
        SELECT * FROM partenaires WHERE id = ?
      `, [id]);
      
      if (!Array.isArray(rows) || rows.length === 0) {
        return { success: false, error: 'Partenaire non trouvé' };
      }
      
      return { success: true, data: rows[0] };
    } catch (error) {
      console.error('Erreur lors de la récupération du partenaire:', error);
      return { success: false, error: 'Erreur lors de la récupération du partenaire' };
    }
  }

  
  static async getPartenairesActifs() {
    try {
      const [rows] = await pool.execute(`
        SELECT * FROM partenaires 
        WHERE statut = 'actif' 
        ORDER BY nom ASC
      `);
      return { success: true, data: Array.isArray(rows) ? rows : [] };
    } catch (error) {
      console.error('Erreur lors de la récupération des partenaires actifs:', error);
      return { success: false, error: 'Erreur lors de la récupération des partenaires actifs' };
    }
  }

  
  static async createPartenaire(partenaireData) {
    try {
      const { name, logo, website, description, status } = partenaireData;
      
      const [result] = await pool.execute(`
        INSERT INTO partenaires (name, logo, website, description, status)
        VALUES (?, ?, ?, ?, ?)
      `, [
        name || null, 
        logo || null, 
        website || null, 
        description || null, 
        status || 'active'
      ]);
      
      return { success: true, data: { id: result.insertId, ...partenaireData } };
    } catch (error) {
      console.error('Erreur lors de la création du partenaire:', error);
      return { success: false, error: 'Erreur lors de la création du partenaire' };
    }
  }

  
  static async updatePartenaire(id, partenaireData) {
    try {
      const { name, logo, website, description, status } = partenaireData;
      
      const [result] = await pool.execute(`
        UPDATE partenaires 
        SET name = ?, logo = ?, website = ?, description = ?, status = ?
        WHERE id = ?
      `, [
        name || null, 
        logo || null, 
        website || null, 
        description || null, 
        status || 'active', 
        id
      ]);
      
      if (result.affectedRows === 0) {
        return { success: false, error: 'Partenaire non trouvé' };
      }
      
      return { success: true, data: { id, ...partenaireData } };
    } catch (error) {
      console.error('Erreur lors de la mise à jour du partenaire:', error);
      return { success: false, error: 'Erreur lors de la mise à jour du partenaire' };
    }
  }

  
  static async deletePartenaire(id) {
    try {
      const [result] = await pool.execute(`
        DELETE FROM partenaires WHERE id = ?
      `, [id]);
      
      if (result.affectedRows === 0) {
        return { success: false, error: 'Partenaire non trouvé' };
      }
      
      return { success: true, message: 'Partenaire supprimé avec succès' };
    } catch (error) {
      console.error('Erreur lors de la suppression du partenaire:', error);
      return { success: false, error: 'Erreur lors de la suppression du partenaire' };
    }
  }

  
  static async searchPartenaires(searchTerm) {
    try {
      const [rows] = await pool.execute(`
        SELECT * FROM partenaires 
        WHERE name LIKE ? OR description LIKE ?
        ORDER BY nom  ASC
      `, [`%${searchTerm}%`, `%${searchTerm}%`]);
      
      return { success: true, data: Array.isArray(rows) ? rows : [] };
    } catch (error) {
      console.error('Erreur lors de la recherche des partenaires:', error);
      return { success: false, error: 'Erreur lors de la recherche des partenaires' };
    }
  }

  
  static async getPartenairesStats() {
    try {
      const [totalRows] = await pool.execute('SELECT COUNT(*) as total FROM partenaires');
      const [actifsRows] = await pool.execute("SELECT COUNT(*) as actifs FROM partenaires WHERE status = 'active'");
      const [inactifsRows] = await pool.execute("SELECT COUNT(*) as inactifs FROM partenaires WHERE status = 'inactive'");
      
      return {
        success: true,
        data: {
          total: totalRows[0].total,
          actifs: actifsRows[0].actifs,
          inactifs: inactifsRows[0].inactifs
        }
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      return { success: false, error: 'Erreur lors de la récupération des statistiques' };
    }
  }
}

module.exports = PartenaireModel;
