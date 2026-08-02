const { pool } = require('../config/database-unified');


async function getAllBlogs() {
  try {
    const [rows] = await pool.execute(`
      SELECT b.*, 
             COALESCE(b.views_count, 0) as total_views
      FROM blogs b 
      ORDER BY b.created_at DESC
    `);
    return Array.isArray(rows) ? rows : [];
  } catch (error) {
    console.error('Erreur dans getAllBlogs:', error);
    return [];
  }
}


async function getBlogById(id) {
  try {
    const [rows] = await pool.execute(`
      SELECT b.*, 
             COALESCE(b.views_count, 0) as total_views
      FROM blogs b 
      WHERE b.id = ?
    `, [id]);
    return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('Erreur dans getBlogById:', error);
    return null;
  }
}


async function getBlogsByStatus(status) {
  try {
    const [rows] = await pool.execute(`
      SELECT b.*, 
             COALESCE(b.views_count, 0) as total_views
      FROM blogs b 
      WHERE b.status = ?
      ORDER BY b.created_at DESC
    `, [status]);
    return Array.isArray(rows) ? rows : [];
  } catch (error) {
    console.error('Erreur dans getBlogsByStatus:', error);
    return [];
  }
}


async function getBlogStatuses() {
  try {
    const [rows] = await pool.execute(`
      SELECT DISTINCT status 
      FROM blogs 
      WHERE status IS NOT NULL 
      ORDER BY status
    `);
    return Array.isArray(rows) ? rows.map(row => row.status) : ['draft', 'published', 'archived'];
  } catch (error) {
    console.error('Erreur dans getBlogStatuses:', error);
    return ['draft', 'published', 'archived'];
  }
}


async function searchBlogs(keyword) {
  try {
    const [rows] = await pool.execute(`
      SELECT b.*, 
             COALESCE(b.views_count, 0) as total_views
      FROM blogs b 
      WHERE b.title LIKE ? OR b.content LIKE ?
      ORDER BY b.created_at DESC
    `, [`%${keyword}%`, `%${keyword}%`]);
    return Array.isArray(rows) ? rows : [];
  } catch (error) {
    console.error('Erreur dans searchBlogs:', error);
    return [];
  }
}


async function getBlogsCount() {
  try {
    const [rows] = await pool.execute('SELECT COUNT(*) as count FROM blogs');
    return Array.isArray(rows) && rows.length > 0 ? rows[0].count : 0;
  } catch (error) {
    console.error('Erreur dans getBlogsCount:', error);
    return 0;
  }
}


async function createBlog(blogData) {
  try {
    const { title, content, excerpt, category, slug, image_url, status, author_id } = blogData;
    
    const [result] = await pool.execute(`
      INSERT INTO blogs (title, content, excerpt, category, slug, image_url, status, author_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      title || null, 
      content || null, 
      excerpt || null, 
      category || null, 
      slug || null, 
      image_url || null, 
      status || null, 
      author_id || null
    ]);
    
    
    const createdBlog = await getBlogById(result.insertId);
    return createdBlog;
  } catch (error) {
    console.error('Erreur dans createBlog:', error);
    throw error;
  }
}


async function updateBlog(id, blogData) {
  try {
    const { title, content, excerpt, category, slug, image_url, status, author_id } = blogData;
    
    await pool.execute(`
      UPDATE blogs 
      SET title = ?, content = ?, excerpt = ?, category = ?, slug = ?, image_url = ?, status = ?, author_id = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      title || null, 
      content || null, 
      excerpt || null, 
      category || null, 
      slug || null, 
      image_url || null, 
      status || null, 
      author_id || null, 
      id
    ]);
    
    
    const updatedBlog = await getBlogById(id);
    return updatedBlog;
  } catch (error) {
    console.error('Erreur dans updateBlog:', error);
    throw error;
  }
}


async function deleteBlog(id) {
  try {
    
    try {
      await pool.execute('DELETE FROM blog_article_views WHERE article_id = ?', [id]);
    } catch (error) {
      console.log('⚠️  Table blog_article_views non accessible, suppression ignorée');
    }
    
    
    const [result] = await pool.execute('DELETE FROM blogs WHERE id = ?', [id]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Erreur dans deleteBlog:', error);
    throw error;
  }
}


async function getRecentBlogs(limit = 5) {
  try {
    const [rows] = await pool.execute(`
      SELECT b.*, 
             COALESCE(b.views_count, 0) as total_views
      FROM blogs b 
      ORDER BY b.created_at DESC 
      LIMIT ?
    `, [limit]);
    return Array.isArray(rows) ? rows : [];
  } catch (error) {
    console.error('Erreur dans getRecentBlogs:', error);
    return [];
  }
}


async function getPopularBlogs(limit = 5) {
  try {
    const [rows] = await pool.execute(`
      SELECT b.*, 
             COALESCE(b.views_count, 0) as total_views
      FROM blogs b 
      ORDER BY COALESCE(b.views_count, 0) DESC, b.created_at DESC 
      LIMIT ?
    `, [limit]);
    return Array.isArray(rows) ? rows : [];
  } catch (error) {
    console.error('Erreur dans getPopularBlogs:', error);
    return [];
  }
}


async function incrementBlogViews(articleId, userId = null, ipAddress = null, sessionId = null) {
  try {
    
    await pool.execute(`
      UPDATE blogs 
      SET views_count = COALESCE(views_count, 0) + 1 
      WHERE id = ?
    `, [articleId]);
    
    console.log(`✅ Vue incrémentée pour le blog ${articleId}`);
  } catch (error) {
    console.error('Erreur dans incrementBlogViews:', error);
    
    console.log('⚠️  Erreur de comptage des vues ignorée pour éviter le crash');
  }
}


async function getBlogStats() {
  try {
    const [totalBlogs] = await pool.execute('SELECT COUNT(*) as count FROM blogs');
    const [publishedBlogs] = await pool.execute('SELECT COUNT(*) as count FROM blogs WHERE status = "published"');
    
    
    const totalViews = 0;
    const uniqueViews = 0;
    
    return {
      totalBlogs: totalBlogs[0].count,
      publishedBlogs: publishedBlogs[0].count,
      totalViews: totalViews,
      uniqueViews: uniqueViews
    };
  } catch (error) {
    console.error('Erreur dans getBlogStats:', error);
    throw error;
  }
}


async function getStats() {
  try {
    const [totalRows] = await pool.execute('SELECT COUNT(*) as total FROM blogs');
    const [publishedRows] = await pool.execute("SELECT COUNT(*) as published FROM blogs WHERE status = 'published'");
    const [draftRows] = await pool.execute("SELECT COUNT(*) as draft FROM blogs WHERE status = 'draft'");
    const [viewsRows] = await pool.execute('SELECT SUM(views_count) as total_views FROM blogs');
    
    return {
      total: totalRows[0].total || 0,
      published: publishedRows[0].published || 0,
      draft: draftRows[0].draft || 0,
      total_views: viewsRows[0].total_views || 0
    };
  } catch (error) {
    console.error('Erreur dans getStats:', error);
    return {
      total: 0,
      published: 0,
      draft: 0,
      total_views: 0
    };
  }
}

module.exports = {
  getAllBlogs,
  getBlogById,
  getBlogsByStatus,
  getBlogStatuses,
  searchBlogs,
  getBlogsCount,
  createBlog,
  updateBlog,
  deleteBlog,
  getRecentBlogs,
  getPopularBlogs,
  incrementBlogViews,
  getBlogStats,
  getStats
};
