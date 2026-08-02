const CommentaireModel = require('../models/commentaires.model');
const { pool } = require('../config/database-unified');

class CommentaireController {
  
  static async getCommentairesByBlog(req, res) {
    try {
      const { blogId } = req.params;
      
      if (!blogId) {
        return res.status(400).json({
          success: false,
          message: 'ID du blog requis'
        });
      }

      const commentaires = await CommentaireModel.getCommentairesByBlog(blogId);
      
      res.json({
        success: true,
        data: commentaires,
        message: 'Commentaires récupérés avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des commentaires:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des commentaires',
        error: error.message
      });
    }
  }

  
  static async createCommentaire(req, res) {
    try {
      console.log('🔍 createCommentaire - req.body:', req.body);
      console.log('🔍 createCommentaire - req.user:', req.user);
      
      const { blog_id, content, author_name, author_email, user_id } = req.body;
      let userId = user_id || (req.user ? req.user.id : null);
      
      console.log('🔍 createCommentaire - userId:', userId);
      
      
      if (userId) {
        const [userExists] = await pool.execute('SELECT id FROM users WHERE id = ?', [userId]);
        if (userExists.length === 0) {
          console.log('❌ User ID invalide:', userId, '- Utilisation de user_id: null');
          
          userId = null;
        }
      }

      
      if (!blog_id || !content || !author_name || !author_email) {
        return res.status(400).json({
          success: false,
          message: 'Tous les champs sont requis (blog_id, content, author_name, author_email)'
        });
      }

      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(author_email)) {
        return res.status(400).json({
          success: false,
          message: 'Format d\'email invalide'
        });
      }

      
      if (content.length < 1 || content.length > 1000) {
        return res.status(400).json({
          success: false,
          message: 'Le commentaire doit contenir entre 1 et 1000 caractères'
        });
      }

      const commentaireData = {
        blog_id,
        user_id: userId || null, 
        content: content.trim(),
        author_name: author_name.trim(),
        author_email: author_email.trim(),
        status: 'pending' 
      };

      const commentaireId = await CommentaireModel.createCommentaire(commentaireData);
      
      res.status(201).json({
        success: true,
        data: { id: commentaireId },
        message: 'Commentaire créé avec succès et en attente d\'approbation'
      });
    } catch (error) {
      console.error('Erreur lors de la création du commentaire:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la création du commentaire',
        error: error.message
      });
    }
  }

  
  static async updateCommentaire(req, res) {
    try {
      const { id } = req.params;
      const { content, status } = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'ID du commentaire requis'
        });
      }

      if (!content && !status) {
        return res.status(400).json({
          success: false,
          message: 'Au moins un champ à mettre à jour est requis'
        });
      }

      const updateData = {};
      if (content) updateData.content = content.trim();
      if (status) updateData.status = status;

      const success = await CommentaireModel.updateCommentaire(id, updateData);
      
      if (!success) {
        return res.status(404).json({
          success: false,
          message: 'Commentaire non trouvé'
        });
      }

      res.json({
        success: true,
        message: 'Commentaire mis à jour avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du commentaire:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour du commentaire',
        error: error.message
      });
    }
  }

  
  static async deleteCommentaire(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'ID du commentaire requis'
        });
      }

      const success = await CommentaireModel.deleteCommentaire(id);
      
      if (!success) {
        return res.status(404).json({
          success: false,
          message: 'Commentaire non trouvé'
        });
      }

      res.json({
        success: true,
        message: 'Commentaire supprimé avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la suppression du commentaire:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression du commentaire',
        error: error.message
      });
    }
  }

  
  static async approveCommentaire(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'ID du commentaire requis'
        });
      }

      const success = await CommentaireModel.approveCommentaire(id);
      
      if (!success) {
        return res.status(404).json({
          success: false,
          message: 'Commentaire non trouvé'
        });
      }

      res.json({
        success: true,
        message: 'Commentaire approuvé avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de l\'approbation du commentaire:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'approbation du commentaire',
        error: error.message
      });
    }
  }

  
  static async rejectCommentaire(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'ID du commentaire requis'
        });
      }

      const success = await CommentaireModel.rejectCommentaire(id);
      
      if (!success) {
        return res.status(404).json({
          success: false,
          message: 'Commentaire non trouvé'
        });
      }

      res.json({
        success: true,
        message: 'Commentaire rejeté avec succès'
      });
    } catch (error) {
      console.error('Erreur lors du rejet du commentaire:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors du rejet du commentaire',
        error: error.message
      });
    }
  }

  
  static async getAllCommentaires(req, res) {
    try {
      const commentaires = await CommentaireModel.getAllCommentaires();
      
      res.json({
        success: true,
        data: commentaires,
        message: 'Tous les commentaires récupérés avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la récupération de tous les commentaires:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération de tous les commentaires',
        error: error.message
      });
    }
  }

  
  static async getPendingCommentaires(req, res) {
    try {
      const commentaires = await CommentaireModel.getPendingCommentaires();
      
      res.json({
        success: true,
        data: commentaires,
        message: 'Commentaires en attente récupérés avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des commentaires en attente:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des commentaires en attente',
        error: error.message
      });
    }
  }

  
  static async countCommentairesByBlog(req, res) {
    try {
      const { blogId } = req.params;
      
      if (!blogId) {
        return res.status(400).json({
          success: false,
          message: 'ID du blog requis'
        });
      }

      const count = await CommentaireModel.countCommentairesByBlog(blogId);
      
      res.json({
        success: true,
        data: { count },
        message: 'Nombre de commentaires récupéré avec succès'
      });
    } catch (error) {
      console.error('Erreur lors du comptage des commentaires:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors du comptage des commentaires',
        error: error.message
      });
    }
  }

  
  static async getRecentCommentaires(req, res) {
    try {
      const { limit = 5 } = req.query;
      const commentaires = await CommentaireModel.getRecentCommentaires(parseInt(limit));
      
      res.json({
        success: true,
        data: commentaires,
        message: 'Commentaires récents récupérés avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des commentaires récents:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des commentaires récents',
        error: error.message
      });
    }
  }
}

module.exports = CommentaireController;
