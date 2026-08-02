const { pool } = require('../config/database-unified');


async function getAllServices() {
  try {
    const [rows] = await pool.execute('SELECT * FROM services ORDER BY created_at DESC');
    return Array.isArray(rows) ? rows : [];
  } catch (error) {
    console.error('Erreur lors de la récupération des services:', error);
    return [];
  }
}


async function getServiceById(id) {
  try {
    const [rows] = await pool.execute('SELECT * FROM services WHERE id = ?', [id]);
    return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('Erreur lors de la récupération du service:', error);
    return null;
  }
}


async function getServicesByCategory(category) {
  try {
    const [rows] = await pool.execute('SELECT * FROM services WHERE category = ? ORDER BY created_at DESC', [category]);
    return Array.isArray(rows) ? rows : [];
  } catch (error) {
    console.error('Erreur lors de la récupération des services par catégorie:', error);
    return [];
  }
}


async function getServiceCategories() {
  try {
    const [rows] = await pool.execute('SELECT DISTINCT category FROM services ORDER BY category');
    return Array.isArray(rows) ? rows.map(row => row.category) : ['Cybersécurité', 'Infrastructure', 'Cloud', 'Formation'];
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    return ['Cybersécurité', 'Infrastructure', 'Cloud', 'Formation'];
  }
}


async function createService({ title, description, category, image_url }) {
  try {
    const [result] = await pool.execute(
      'INSERT INTO services (title, description, category, image_url) VALUES (?, ?, ?, ?)',
      [title, description, category, image_url]
    );
    return { 
      id: result.insertId, 
      title, 
      description, 
      category, 
      image_url,
      created_at: new Date()
    };
  } catch (error) {
    console.error('Erreur lors de la création du service:', error);
    throw error;
  }
}


async function updateService(id, { title, description, category, image_url }) {
  try {
    await pool.execute(
      'UPDATE services SET title = ?, description = ?, category = ?, image_url = ? WHERE id = ?',
      [title, description, category, image_url, id]
    );
    return { id, title, description, category, image_url };
  } catch (error) {
    console.error('Erreur lors de la mise à jour du service:', error);
    throw error;
  }
}


async function deleteService(id) {
  try {
    await pool.execute('DELETE FROM services WHERE id = ?', [id]);
    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression du service:', error);
    throw error;
  }
}


async function searchServices(keyword) {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM services WHERE title LIKE ? OR description LIKE ? OR category LIKE ? ORDER BY created_at DESC',
      [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`]
    );
    return rows;
  } catch (error) {
    console.error('Erreur lors de la recherche de services:', error);
    throw error;
  }
}


async function getServicesCount() {
  try {
    const [rows] = await pool.execute('SELECT COUNT(*) as count FROM services');
    return rows[0].count;
  } catch (error) {
    console.error('Erreur lors du comptage des services:', error);
    throw error;
  }
}

module.exports = {
  getAllServices,
  getServiceById,
  getServicesByCategory,
  getServiceCategories,
  createService,
  updateService,
  deleteService,
  searchServices,
  getServicesCount
}; 