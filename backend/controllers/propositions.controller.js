const Proposition = require('../models/propositions.model');
const path = require('path');
const fs = require('fs').promises;


const createProposal = async (req, res) => {
  try {
    console.log('📝 Création d\'une nouvelle proposition...');
    console.log('📋 Données reçues:', req.body);
    console.log('📁 Fichiers reçus:', req.files ? req.files.length : 0);
    
    const {
      tender_id,
      full_name,
      address,
      phone,
      email,
      comment
    } = req.body;

    
    if (!tender_id || !full_name || !address || !phone || !email) {
      console.log('❌ Validation échouée - champs manquants');
      return res.status(400).json({
        success: false,
        message: 'Tous les champs obligatoires doivent être remplis'
      });
    }

    
    const user_id = req.user ? req.user.id : null;

    
    let files_path = [];
    let files_names = [];

    if (req.files && req.files.length > 0) {
      const uploadDir = path.join(__dirname, '../uploads/propositions');
      
      
      try {
        await fs.mkdir(uploadDir, { recursive: true });
      } catch (error) {
        console.error('Erreur lors de la création du dossier uploads:', error);
      }

      for (const file of req.files) {
        
        const timestamp = Date.now();
        const originalName = file.originalname;
        const extension = path.extname(originalName);
        const fileName = `proposition_${timestamp}_${Math.random().toString(36).substring(7)}${extension}`;
        
        const filePath = path.join(uploadDir, fileName);
        
        
        await fs.writeFile(filePath, file.buffer);
        
        files_path.push(filePath);
        files_names.push(originalName);
      }
    }

    const propositionData = {
      tender_id: parseInt(tender_id),
      user_id,
      full_name,
      address,
      phone,
      email,
      comment: comment || null,
      files_path: files_path.length > 0 ? files_path : null,
      files_names: files_names.length > 0 ? files_names : null
    };

    console.log('💾 Sauvegarde en base de données...');
    const propositionId = await Proposition.create(propositionData);
    console.log('✅ Proposition créée avec ID:', propositionId);

    res.status(201).json({
      success: true,
      message: 'Proposition soumise avec succès',
      data: { 
        id: propositionId,
        reference: `PROP-${new Date().getFullYear()}-${String(propositionId).padStart(3, '0')}`
      }
    });
  } catch (error) {
    console.error('❌ Erreur lors de la création de la proposition:', error);
    console.error('📋 Détails de l\'erreur:', error.message);
    console.error('🔍 Stack trace:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};


const getAllProposals = async (req, res) => {
  try {
    const proposals = await Proposition.getAll();
    
    res.json({
      success: true,
      data: proposals
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des propositions:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};


const getUserProposals = async (req, res) => {
  try {
    const userId = req.user.id;
    const proposals = await Proposition.getByUserId(userId);
    
    res.json({
      success: true,
      data: proposals
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des propositions utilisateur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};


const getProposalsByTender = async (req, res) => {
  try {
    const { tenderId } = req.params;
    const proposals = await Proposition.getByTenderId(tenderId);
    
    res.json({
      success: true,
      data: proposals
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des propositions par tender:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};


const getProposalById = async (req, res) => {
  try {
    const { id } = req.params;
    const proposal = await Proposition.getById(id);
    
    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: 'Proposition non trouvée'
      });
    }
    
    res.json({
      success: true,
      data: proposal
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la proposition:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};


const updateProposalStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    
    const validStatuses = ['en_attente', 'acceptee', 'refusee', 'en_cours_evaluation'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Statut invalide'
      });
    }

    const success = await Proposition.updateStatus(id, status);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Proposition non trouvée'
      });
    }
    
    res.json({
      success: true,
      message: 'Statut de la proposition mis à jour avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};


const deleteProposal = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await Proposition.delete(id);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Proposition non trouvée'
      });
    }
    
    res.json({
      success: true,
      message: 'Proposition supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la proposition:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};


const getProposalsStats = async (req, res) => {
  try {
    const stats = await Proposition.getStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};


const downloadFile = async (req, res) => {
  try {
    const { id, fileIndex } = req.params;
    
    
    const proposition = await Proposition.getById(id);
    
    if (!proposition) {
      return res.status(404).json({
        success: false,
        message: 'Proposition non trouvée'
      });
    }
    
    
    if (!proposition.files_path || !proposition.files_names) {
      return res.status(404).json({
        success: false,
        message: 'Aucun fichier trouvé pour cette proposition'
      });
    }
    
    const fileIndexNum = parseInt(fileIndex);
    const filesPath = Array.isArray(proposition.files_path) ? proposition.files_path : JSON.parse(proposition.files_path);
    const filesNames = Array.isArray(proposition.files_names) ? proposition.files_names : JSON.parse(proposition.files_names);
    
    if (fileIndexNum < 0 || fileIndexNum >= filesPath.length) {
      return res.status(404).json({
        success: false,
        message: 'Index de fichier invalide'
      });
    }
    
    const filePath = filesPath[fileIndexNum];
    const fileName = filesNames[fileIndexNum];
    
    
    const fs = require('fs');
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Fichier non trouvé sur le serveur'
      });
    }
    
    
    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error('Erreur lors du téléchargement:', err);
        res.status(500).json({
          success: false,
          message: 'Erreur lors du téléchargement du fichier'
        });
      }
    });
    
  } catch (error) {
    console.error('Erreur lors du téléchargement du fichier:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};

module.exports = {
  createProposal,
  getAllProposals,
  getUserProposals,
  getProposalsByTender,
  getProposalById,
  updateProposalStatus,
  deleteProposal,
  getProposalsStats,
  downloadFile
}; 