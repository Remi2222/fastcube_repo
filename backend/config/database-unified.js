const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'fastcube',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
});


pool.getConnection()
  .then(connection => {
    console.log('✅ Connexion à la base de données fastcube réussie (database-unified)');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Erreur de connexion à la base de données (database-unified):', err.message);
  });


const executeQuery = async (query, params = []) => {
  try {
    const [rows] = await pool.execute(query, params);
    return rows;
  } catch (error) {
    console.error('Erreur executeQuery:', error);
    throw error;
  }
};

module.exports = { pool, executeQuery };