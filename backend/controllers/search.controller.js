const mysql = require('mysql2/promise');

class SearchController {
  static async globalSearch(req, res) {
    try {
      const { q: searchTerm = '', type, category, limit = 20, page = 1, offset = 0 } = req.query;
      const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'fastcube'
      });

      const keyword = `%${searchTerm}%`;
      let results = [];
      let totalCount = 0;

      if (!type || type === 'service') {
        const [services] = await connection.execute(
          `SELECT 'service' as type, id, title, description, category, url, tags, created_at as date, author, 100 as relevance
           FROM services
           WHERE title LIKE ? OR description LIKE ? OR tags LIKE ?
           ORDER BY created_at DESC
           LIMIT ?`,
          [keyword, keyword, keyword, parseInt(limit)]
        );
        results.push(...services);
      }

      if (!type || type === 'blog') {
        const [articles] = await connection.execute(
          `SELECT 'blog' as type, id, title, excerpt as description, category, CONCAT('', id) as url, tags, created_at as date, author, 95 as relevance
           FROM articles
           WHERE (title LIKE ? OR excerpt LIKE ? OR tags LIKE ?) AND status = 'published'
           ORDER BY created_at DESC
           LIMIT ?`,
          [keyword, keyword, keyword, parseInt(limit)]
        );
        results.push(...articles);
      }

      if (!type || type === 'testimonial') {
        const [testimonials] = await connection.execute(
          `SELECT 'testimonial' as type, id, CONCAT(user_name, ' - ', SUBSTRING(message, 1, 100)) as title,
                  message as description, 'Témoignages' as category, CONCAT('appel-offre?tenderId=', id) as url,
                  JSON_ARRAY('appel d\'offre', category) as tags, created_at as date, 'FASTCUBE' as author, 90 as relevance
           FROM tenders
           WHERE title LIKE ? OR description LIKE ? OR category LIKE ?
           ORDER BY created_at DESC
           LIMIT ?`,
          [keyword, keyword, keyword, parseInt(limit)]
        );
        results.push(...testimonials);
      }

      if (category && category !== 'all') {
        results = results.filter(item => item.category === category);
      }

      results.sort((a, b) => b.relevance - a.relevance);
      totalCount = results.length;
      const paginatedResults = results.slice(offset, offset + parseInt(limit));

      await connection.end();

      res.json({
        success: true,
        data: paginatedResults,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalCount,
          pages: Math.ceil(totalCount / parseInt(limit))
        }
      });
    } catch (error) {
      console.error('Erreur lors de la recherche globale:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la recherche globale'
      });
    }
  }

  static async getSuggestions(req, res) {
    try {
      const { q: searchTerm = '', limit = 8 } = req.query;
      const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'fastcube'
      });

      const keyword = `%${searchTerm}%`;
      const suggestions = [];

      const [services] = await connection.execute(
        `SELECT 'service' as type, id, title, description, category, url, tags
         FROM services
         WHERE title LIKE ? OR description LIKE ? OR tags LIKE ?
         ORDER BY created_at DESC
         LIMIT ?`,
        [keyword, keyword, keyword, parseInt(limit)]
      );
      suggestions.push(...services);

      const [articles] = await connection.execute(
        `SELECT 'blog' as type, id, title, excerpt as description, category, CONCAT('', id) as url, tags
         FROM articles
         WHERE (title LIKE ? OR excerpt LIKE ? OR tags LIKE ?) AND status = 'published'
         ORDER BY created_at DESC
         LIMIT ?`,
        [keyword, keyword, keyword, parseInt(limit)]
      );
      suggestions.push(...articles);

      await connection.end();

      const formattedSuggestions = suggestions.slice(0, parseInt(limit));
      res.json({
        success: true,
        data: formattedSuggestions
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des suggestions:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des suggestions'
      });
    }
  }

  static async getSearchStats(req, res) {
    try {
      const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'fastcube'
      });

      const [servicesCount] = await connection.execute('SELECT COUNT(*) as count FROM services');
      const [articlesCount] = await connection.execute('SELECT COUNT(*) as count FROM articles WHERE status = "published"');
      const [testimonialsCount] = await connection.execute('SELECT COUNT(*) as count FROM testimonials WHERE approved = 1');
      const [tendersCount] = await connection.execute('SELECT COUNT(*) as count FROM tenders');

      await connection.end();

      res.json({
        success: true,
        data: {
          totalIndexed: servicesCount[0].count + articlesCount[0].count + testimonialsCount[0].count + tendersCount[0].count,
          services: servicesCount[0].count,
          articles: articlesCount[0].count,
          testimonials: testimonialsCount[0].count,
          tenders: tendersCount[0].count,
          lastUpdated: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des statistiques'
      });
    }
  }
}

module.exports = SearchController;
