const User = require('../models/users.model');
const bcrypt = require('bcrypt');


const getAllUsers = async (req, res) => {
  try {
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé. Rôle admin requis.'
      });
    }

    console.log('🔍 Récupération de tous les utilisateurs pour admin:', req.user.email);
    const users = await User.findAll();
    console.log('📊 Utilisateurs récupérés:', users.length);
    
    res.status(200).json({
      success: true,
      data: users
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des utilisateurs',
      error: error.message
    });
  }
};


const getCurrentUser = async (req, res) => {
  try {
    const user = await User.getById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    
    delete user.password_hash;

    res.status(200).json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur connecté:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des données utilisateur',
      error: error.message
    });
  }
};


const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    
    if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé'
      });
    }

    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'utilisateur',
      error: error.message
    });
  }
};


const updateCurrentUser = async (req, res) => {
  try {
    const updateData = req.body;
    
    
    if (updateData.role) {
      delete updateData.role;
    }

    const updatedUser = await User.update(req.user.id, updateData);
    
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    
    delete updatedUser.password_hash;

    res.status(200).json({
      success: true,
      message: 'Profil mis à jour avec succès',
      data: updatedUser
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du profil',
      error: error.message
    });
  }
};


const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    
    if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé'
      });
    }

    
    if (req.user.role !== 'admin' && updateData.role) {
      delete updateData.role;
    }

    const updatedUser = await User.update(id, updateData);
    
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Utilisateur mis à jour avec succès',
      data: updatedUser
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de l\'utilisateur',
      error: error.message
    });
  }
};


const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé. Rôle admin requis.'
      });
    }

    
    if (req.user.id === parseInt(id)) {
      return res.status(400).json({
        success: false,
        message: 'Vous ne pouvez pas supprimer votre propre compte'
      });
    }

    const deletedUser = await User.deleteUser(id);
    
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Utilisateur supprimé avec succès',
      data: deletedUser
    });

  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'utilisateur',
      error: error.message
    });
  }
};


const getUserStats = async (req, res) => {
  try {
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé. Rôle admin requis.'
      });
    }

    const stats = await User.getStats();
    
    res.status(200).json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message
    });
  }
};


const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Mot de passe actuel et nouveau mot de passe requis'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Le nouveau mot de passe doit contenir au moins 6 caractères'
      });
    }

    
    const user = await User.getById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Mot de passe actuel incorrect'
      });
    }

    
    const saltRounds = 10;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    
    await User.updatePassword(userId, newPasswordHash);

    res.status(200).json({
      success: true,
      message: 'Mot de passe modifié avec succès'
    });

  } catch (error) {
    console.error('Erreur lors du changement de mot de passe:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du changement de mot de passe',
      error: error.message
    });
  }
};

module.exports = {
  getAllUsers,
  getCurrentUser,
  getUserById,
  updateCurrentUser,
  updateUser,
  deleteUser,
  getUserStats,
  changePassword
}; 