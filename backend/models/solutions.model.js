const { pool } = require('../config/database-unified');


async function getAllSolutions() {
  try {
    const [rows] = await pool.execute('SELECT * FROM solutions ORDER BY created_at DESC');
    
    return Array.isArray(rows) ? rows : [];
  } catch (error) {
    console.error('Erreur lors de la récupération des solutions:', error);
    
    return [];
  }
}


async function getSolutionById(id) {
  try {
    const [rows] = await pool.execute('SELECT * FROM solutions WHERE id = ?', [id]);
    return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('Erreur lors de la récupération de la solution:', error);
    return null;
  }
}


async function getSolutionsByCategory(category) {
  try {
    const [rows] = await pool.execute('SELECT * FROM solutions WHERE category = ? AND status = "active" ORDER BY created_at DESC', [category]);
    return Array.isArray(rows) ? rows : [];
  } catch (error) {
    console.error('Erreur lors de la récupération des solutions par catégorie:', error);
    return [];
  }
}


async function getSolutionCategories() {
  
  
  return ['Cybersécurité', 'Infrastructure', 'Cloud', 'Formation'];
}


async function getSolutionsByStatus(status) {
  try {
    const [rows] = await pool.execute('SELECT * FROM solutions WHERE status = ? ORDER BY created_at DESC', [status]);
    return Array.isArray(rows) ? rows : [];
  } catch (error) {
    console.error('Erreur lors de la récupération des solutions par statut:', error);
    return [];
  }
}


async function getSolutionStatuses() {
  try {
    const [rows] = await pool.execute('SELECT DISTINCT status FROM solutions ORDER BY status');
    return Array.isArray(rows) ? rows.map(row => row.status) : ['active', 'inactive', 'coming_soon'];
  } catch (error) {
    console.error('Erreur lors de la récupération des statuts:', error);
    return ['active', 'inactive', 'coming_soon'];
  }
}


async function createSolution({ title, description, category, image_url, features, benefits, use_cases, pricing_info, status = 'active' }) {
  try {
    
    const [columns] = await pool.execute('DESCRIBE solutions');
    const columnNames = columns.map(col => col.Field);
    console.log('Colonnes disponibles dans solutions:', columnNames);
    
    
    const fields = [];
    const values = [];
    const placeholders = [];
    
    if (columnNames.includes('title')) {
      fields.push('title');
      values.push(title);
      placeholders.push('?');
    }
    if (columnNames.includes('description')) {
      fields.push('description');
      values.push(description);
      placeholders.push('?');
    }
    if (columnNames.includes('category')) {
      fields.push('category');
      values.push(category);
      placeholders.push('?');
    }
    if (columnNames.includes('image_url')) {
      fields.push('image_url');
      values.push(image_url || null);
      placeholders.push('?');
    }
    if (columnNames.includes('features')) {
      fields.push('features');
      values.push(features ? JSON.stringify(features) : null);
      placeholders.push('?');
    }
    if (columnNames.includes('benefits')) {
      fields.push('benefits');
      values.push(benefits || null);
      placeholders.push('?');
    }
    if (columnNames.includes('use_cases')) {
      fields.push('use_cases');
      values.push(use_cases || null);
      placeholders.push('?');
    }
    if (columnNames.includes('pricing_info')) {
      fields.push('pricing_info');
      values.push(pricing_info || null);
      placeholders.push('?');
    }
    if (columnNames.includes('status')) {
      fields.push('status');
      values.push(status);
      placeholders.push('?');
    }
    
    const query = `INSERT INTO solutions (${fields.join(', ')}) VALUES (${placeholders.join(', ')})`;
    console.log('Requête SQL:', query);
    console.log('Valeurs:', values);
    
    const [result] = await pool.execute(query, values);
    
    return { 
      id: result.insertId, 
      title, 
      description, 
      category, 
      image_url,
      features,
      benefits,
      use_cases,
      pricing_info,
      status,
      created_at: new Date()
    };
  } catch (error) {
    console.error('Erreur lors de la création de la solution:', error);
    throw error;
  }
}


async function updateSolution(id, { title, description, category, image_url, features, benefits, use_cases, pricing_info, status }) {
  try {
    
    const [columns] = await pool.execute('DESCRIBE solutions');
    const columnNames = columns.map(col => col.Field);
    console.log('Colonnes disponibles pour UPDATE:', columnNames);
    
    
    const fields = [];
    const values = [];
    
    if (columnNames.includes('title') && title !== undefined) {
      fields.push('title = ?');
      values.push(title);
    }
    if (columnNames.includes('description') && description !== undefined) {
      fields.push('description = ?');
      values.push(description);
    }
    if (columnNames.includes('category') && category !== undefined) {
      fields.push('category = ?');
      values.push(category);
    }
    if (columnNames.includes('image_url') && image_url !== undefined) {
      fields.push('image_url = ?');
      values.push(image_url || null);
    }
    if (columnNames.includes('features') && features !== undefined) {
      fields.push('features = ?');
      values.push(features ? JSON.stringify(features) : null);
    }
    if (columnNames.includes('benefits') && benefits !== undefined) {
      fields.push('benefits = ?');
      values.push(benefits || null);
    }
    if (columnNames.includes('use_cases') && use_cases !== undefined) {
      fields.push('use_cases = ?');
      values.push(use_cases || null);
    }
    if (columnNames.includes('pricing_info') && pricing_info !== undefined) {
      fields.push('pricing_info = ?');
      values.push(pricing_info || null);
    }
    if (columnNames.includes('status') && status !== undefined) {
      fields.push('status = ?');
      values.push(status);
    }
    
    if (fields.length === 0) {
      throw new Error('Aucun champ à mettre à jour');
    }
    
    values.push(id); 
    
    const query = `UPDATE solutions SET ${fields.join(', ')} WHERE id = ?`;
    console.log('Requête UPDATE SQL:', query);
    console.log('Valeurs:', values);
    
    await pool.execute(query, values);
    
    
    const updatedSolution = await getSolutionById(id);
    return updatedSolution;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la solution:', error);
    throw error;
  }
}


async function deleteSolution(id) {
  try {
    await pool.execute('DELETE FROM solutions WHERE id = ?', [id]);
    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression de la solution:', error);
    throw error;
  }
}


async function searchSolutions(keyword) {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM solutions WHERE (title LIKE ? OR description LIKE ? OR category LIKE ? OR benefits LIKE ? OR use_cases LIKE ?) AND status = "active" ORDER BY created_at DESC',
      [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`]
    );
    return Array.isArray(rows) ? rows : [];
  } catch (error) {
    console.error('Erreur lors de la recherche de solutions:', error);
    return [];
  }
}


async function getRecentSolutions(limit = 5) {
  try {
    const [rows] = await pool.execute('SELECT * FROM solutions WHERE status = "active" ORDER BY created_at DESC LIMIT ?', [limit]);
    return Array.isArray(rows) ? rows : [];
  } catch (error) {
    console.error('Erreur lors de la récupération des solutions récentes:', error);
    return [];
  }
}


async function getPopularSolutions(limit = 5) {
  try {
    const [rows] = await pool.execute(`
      SELECT category, COUNT(*) as count 
      FROM solutions 
      WHERE status = "active" 
      GROUP BY category 
      ORDER BY count DESC 
      LIMIT ?
    `, [limit]);
    return Array.isArray(rows) ? rows : [];
  } catch (error) {
    console.error('Erreur lors de la récupération des solutions populaires:', error);
    return [];
  }
}


async function getSolutionsCount() {
  try {
    const [rows] = await pool.execute('SELECT COUNT(*) as count FROM solutions');
    return Array.isArray(rows) && rows.length > 0 ? rows[0].count : 0;
  } catch (error) {
    console.error('Erreur lors du comptage des solutions:', error);
    return 0;
  }
}


async function getSolutionsStats() {
  try {
    const [totalCount] = await pool.execute('SELECT COUNT(*) as count FROM solutions');
    const [activeCount] = await pool.execute('SELECT COUNT(*) as count FROM solutions WHERE status = "active"');
    const [categoryStats] = await pool.execute(`
      SELECT category, COUNT(*) as count 
      FROM solutions 
      WHERE status = "active" 
      GROUP BY category
    `);
    const [statusStats] = await pool.execute(`
      SELECT status, COUNT(*) as count 
      FROM solutions 
      GROUP BY status
    `);
    
    return {
      total: Array.isArray(totalCount) && totalCount.length > 0 ? totalCount[0].count : 0,
      active: Array.isArray(activeCount) && activeCount.length > 0 ? activeCount[0].count : 0,
      byCategory: Array.isArray(categoryStats) ? categoryStats : [],
      byStatus: Array.isArray(statusStats) ? statusStats : []
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    return {
      total: 0,
      active: 0,
      byCategory: [],
      byStatus: []
    };
  }
}

module.exports = {
  getAllSolutions,
  getSolutionById,
  getSolutionsByCategory,
  getSolutionCategories,
  getSolutionsByStatus,
  getSolutionStatuses,
  createSolution,
  updateSolution,
  deleteSolution,
  searchSolutions,
  getRecentSolutions,
  getPopularSolutions,
  getSolutionsCount,
  getSolutionsStats
};




