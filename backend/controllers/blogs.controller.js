const Blog = require('../models/blogs.model');


exports.getAll = async (req, res) => {
  try {
    const blogs = await Blog.getAllBlogs();
    
    res.json({
      success: true,
      data: blogs,
      message: `${blogs.length} blogs récupérés avec succès`
    });
  } catch (error) {
    console.error('Erreur dans getAll blogs:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des blogs',
      details: error.message
    });
  }
};


exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.getBlogById(id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        error: 'Blog non trouvé'
      });
    }
    
    
    const ipAddress = req.ip || req.connection.remoteAddress;
    const sessionId = req.sessionID;
    const userId = req.user ? req.user.id : null;
    
    await Blog.incrementBlogViews(id, userId, ipAddress, sessionId);
    
    res.json({
      success: true,
      data: blog,
      message: 'Blog récupéré avec succès'
    });
  } catch (error) {
    console.error('Erreur dans getById blog:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération du blog',
      details: error.message
    });
  }
};


exports.getByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const blogs = await Blog.getBlogsByStatus(status);
    
    res.json({
      success: true,
      data: blogs,
      message: `${blogs.length} blogs trouvés avec le statut "${status}"`
    });
  } catch (error) {
    console.error('Erreur dans getByStatus blogs:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des blogs par statut',
      details: error.message
    });
  }
};


exports.getStatuses = async (req, res) => {
  try {
    const statuses = await Blog.getBlogStatuses();
    
    res.json({
      success: true,
      data: statuses,
      message: `${statuses.length} statuts récupérés`
    });
  } catch (error) {
    console.error('Erreur dans getStatuses blogs:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des statuts',
      details: error.message
    });
  }
};


exports.search = async (req, res) => {
  try {
    const { q: keyword } = req.query;
    
    if (!keyword) {
      return res.status(400).json({
        success: false,
        error: 'Le paramètre de recherche "q" est requis'
      });
    }
    
    const blogs = await Blog.searchBlogs(keyword);
    
    res.json({
      success: true,
      data: blogs,
      message: `${blogs.length} blogs trouvés pour "${keyword}"`
    });
  } catch (error) {
    console.error('Erreur dans search blogs:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la recherche des blogs',
      details: error.message
    });
  }
};


exports.getCount = async (req, res) => {
  try {
    const count = await Blog.getBlogsCount();
    
    res.json({
      success: true,
      data: { count },
      message: `Nombre total de blogs: ${count}`
    });
  } catch (error) {
    console.error('Erreur dans getCount blogs:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors du comptage des blogs',
      details: error.message
    });
  }
};


exports.getStats = async (req, res) => {
  try {
    const stats = await Blog.getBlogStats();
    
    res.json({
      success: true,
      data: stats,
      message: 'Statistiques des blogs récupérées avec succès'
    });
  } catch (error) {
    console.error('Erreur dans getStats blogs:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des statistiques',
      details: error.message
    });
  }
};


exports.getRecent = async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    const blogs = await Blog.getRecentBlogs(parseInt(limit));
    
    res.json({
      success: true,
      data: blogs,
      message: `${blogs.length} blogs récents récupérés`
    });
  } catch (error) {
    console.error('Erreur dans getRecent blogs:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des blogs récents',
      details: error.message
    });
  }
};


exports.getPopular = async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    const blogs = await Blog.getPopularBlogs(parseInt(limit));
    
    res.json({
      success: true,
      data: blogs,
      message: `${blogs.length} blogs populaires récupérés`
    });
  } catch (error) {
    console.error('Erreur dans getPopular blogs:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des blogs populaires',
      details: error.message
    });
  }
};


exports.create = async (req, res) => {
  try {
    const { title, content, image_url, status, author_id } = req.body;
    
    
    if (!title || !content || !status || !author_id) {
      return res.status(400).json({
        success: false,
        error: 'Les champs title, content, status et author_id sont requis'
      });
    }
    
    const blogData = {
      title: title.trim(),
      content: content.trim(),
      image_url: image_url || null,
      status: status.trim(),
      author_id: parseInt(author_id)
    };
    
    const newBlog = await Blog.createBlog(blogData);
    
    res.status(201).json({
      success: true,
      data: newBlog,
      message: 'Blog créé avec succès'
    });
  } catch (error) {
    console.error('Erreur dans create blog:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la création du blog',
      details: error.message
    });
  }
};


exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, image_url, status, author_id } = req.body;
    
    
    if (!title || !content || !status || !author_id) {
      return res.status(400).json({
        success: false,
        error: 'Les champs title, content, status et author_id sont requis'
      });
    }
    
    
    const existingBlog = await Blog.getBlogById(id);
    if (!existingBlog) {
      return res.status(404).json({
        success: false,
        error: 'Blog non trouvé'
      });
    }
    
    const blogData = {
      title: title.trim(),
      content: content.trim(),
      image_url: image_url || null,
      status: status.trim(),
      author_id: parseInt(author_id)
    };
    
    const updatedBlog = await Blog.updateBlog(id, blogData);
    
    res.json({
      success: true,
      data: updatedBlog,
      message: 'Blog mis à jour avec succès'
    });
  } catch (error) {
    console.error('Erreur dans update blog:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la mise à jour du blog',
      details: error.message
    });
  }
};


exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    
    
    const existingBlog = await Blog.getBlogById(id);
    if (!existingBlog) {
      return res.status(404).json({
        success: false,
        error: 'Blog non trouvé'
      });
    }
    
    const deleted = await Blog.deleteBlog(id);
    
    if (deleted) {
      res.json({
        success: true,
        message: 'Blog supprimé avec succès'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la suppression du blog'
      });
    }
  } catch (error) {
    console.error('Erreur dans remove blog:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la suppression du blog',
      details: error.message
    });
  }
};


exports.incrementViews = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user ? req.user.id : null;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const sessionId = req.sessionID || null;
    
    
    await Blog.incrementBlogViews(id, userId, ipAddress, sessionId);
    
    
    const blog = await Blog.getBlogById(id);
    
    res.json({
      success: true,
      data: { views_count: blog.views_count },
      message: 'Vues incrémentées avec succès'
    });
  } catch (error) {
    console.error('Erreur dans incrementViews:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de l\'incrémentation des vues',
      details: error.message
    });
  }
};
