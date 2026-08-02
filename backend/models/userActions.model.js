const { pool } = require('../config/database-unified');











async function createUserAction({ user_id, action_type, item_id, item_type = 'service', metadata = null }) {
  try {
    const [result] = await pool.execute(
      'INSERT INTO user_actions (user_id, action_type, item_id, item_type, metadata) VALUES (?, ?, ?, ?, ?)',
      [user_id, action_type, item_id, item_type, metadata ? JSON.stringify(metadata) : null]
    );
    
    return {
      id: result.insertId,
      user_id,
      action_type,
      item_id,
      item_type,
      metadata,
      timestamp: new Date()
    };
  } catch (error) {
    console.error('Erreur lors de la création de l\'action utilisateur:', error);
    throw error;
  }
}







async function getUserActions(userId, limit = 50) {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM user_actions WHERE user_id = ? ORDER BY timestamp DESC LIMIT ?',
      [userId, limit]
    );
    return rows;
  } catch (error) {
    console.error('Erreur lors de la récupération des actions utilisateur:', error);
    throw error;
  }
}







async function getLastUserAction(userId, itemType = 'service') {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM user_actions WHERE user_id = ? AND item_type = ? ORDER BY timestamp DESC LIMIT 1',
      [userId, itemType]
    );
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('Erreur lors de la récupération de la dernière action:', error);
    throw error;
  }
}








async function getUserActionsByType(userId, actionType, limit = 20) {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM user_actions WHERE user_id = ? AND action_type = ? ORDER BY timestamp DESC LIMIT ?',
      [userId, actionType, limit]
    );
    return rows;
  } catch (error) {
    console.error('Erreur lors de la récupération des actions par type:', error);
    throw error;
  }
}








async function getMostViewedItems(userId, itemType = 'service', limit = 10) {
  try {
    const [rows] = await pool.execute(
      `SELECT item_id, COUNT(*) as view_count, MAX(timestamp) as last_viewed
       FROM user_actions 
       WHERE user_id = ? AND item_type = ? AND action_type = 'view'
       GROUP BY item_id 
       ORDER BY view_count DESC, last_viewed DESC 
       LIMIT ?`,
      [userId, itemType, limit]
    );
    return rows;
  } catch (error) {
    console.error('Erreur lors de la récupération des éléments les plus consultés:', error);
    throw error;
  }
}






async function getUserActionStats(userId) {
  try {
    const [rows] = await pool.execute(
      `SELECT 
        action_type,
        item_type,
        COUNT(*) as count,
        MAX(timestamp) as last_action
       FROM user_actions 
       WHERE user_id = ? 
       GROUP BY action_type, item_type
       ORDER BY count DESC`,
      [userId]
    );
    return rows;
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    throw error;
  }
}






async function cleanupOldActions(daysOld = 90) {
  try {
    const [result] = await pool.execute(
      'DELETE FROM user_actions WHERE timestamp < DATE_SUB(NOW(), INTERVAL ? DAY)',
      [daysOld]
    );
    return result.affectedRows;
  } catch (error) {
    console.error('Erreur lors du nettoyage des anciennes actions:', error);
    throw error;
  }
}

module.exports = {
  createUserAction,
  getUserActions,
  getLastUserAction,
  getUserActionsByType,
  getMostViewedItems,
  getUserActionStats,
  cleanupOldActions
};
