const Tender = require('../models/tenders.model');
const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');


const createTender = async (req, res) => {
  try {
    
    const {
      title,
      description,
      technologies,
      budget,
      deadline,
      requirements,
      criteria,
      contactEmail,
      contactPhone
    } = req.body;

    console.log('=== DÉBOGAGE CRÉATION TENDER ===');
    console.log('Headers:', req.headers);
    console.log('Content-Type:', req.headers['content-type']);
    console.log('Données reçues (req.body):', req.body);
    console.log('Fichier reçu (req.file):', req.file);
    console.log('Méthode HTTP:', req.method);
    console.log('URL:', req.url);
    console.log('================================');

    
    if (!title || !description || !deadline) {
      return res.status(400).json({
        success: false,
        message: 'Le titre, la description et la date limite sont obligatoires'
      });
    }

    
    let cahierChargesPath = null;
    let cahierChargesName = null;

    if (req.file) {
      const uploadDir = path.join(__dirname, '../uploads/tenders');
      
      
      try {
        await fs.mkdir(uploadDir, { recursive: true });
      } catch (error) {
        console.error('Erreur lors de la création du dossier uploads:', error);
      }

      
      const timestamp = Date.now();
      const originalName = req.file.originalname;
      const extension = path.extname(originalName);
      const fileName = `cahier_charges_${timestamp}${extension}`;
      
      cahierChargesPath = path.join(uploadDir, fileName);
      cahierChargesName = originalName;

      
      await fs.writeFile(cahierChargesPath, req.file.buffer);
    }

    
    const requirementsString = requirements || '';
    const criteriaString = criteria || '';

    const tenderData = {
      title,
      description,
      reference: `TDR-${Date.now()}`, 
      budget: budget ? parseFloat(budget) : null, 
      deadline,
      status: 'open'
    };

    const tenderId = await Tender.create(tenderData);

    res.status(201).json({
      success: true,
      message: 'Appel d\'offre créé avec succès',
      data: { id: tenderId }
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'appel d\'offre:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};


const getAllTenders = async (req, res) => {
  try {
    const tenders = await Tender.getAll();
    
    res.json({
      success: true,
      data: tenders
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des appels d\'offre:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};


const getTenderById = async (req, res) => {
  try {
    const { id } = req.params;
    const tender = await Tender.getById(id);
    
    if (!tender) {
      return res.status(404).json({
        success: false,
        message: 'Appel d\'offre non trouvé'
      });
    }
    
    res.json({
      success: true,
      data: tender
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'appel d\'offre:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};


const updateTender = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    
    if (updateData.requirements) {
      updateData.requirements = updateData.requirements.split('\n').filter(req => req.trim());
    }
    if (updateData.criteria) {
      updateData.criteria = updateData.criteria.split('\n').filter(crit => crit.trim());
    }

    
    if (req.file) {
      const uploadDir = path.join(__dirname, '../uploads/tenders');
      
      
      try {
        await fs.mkdir(uploadDir, { recursive: true });
      } catch (error) {
        console.error('Erreur lors de la création du dossier uploads:', error);
      }

      
      const timestamp = Date.now();
      const originalName = req.file.originalname;
      const extension = path.extname(originalName);
      const fileName = `cahier_charges_${timestamp}${extension}`;
      
      const filePath = path.join(uploadDir, fileName);
      
      
      await fs.writeFile(filePath, req.file.buffer);
      
      
      updateData.cahier_charges_path = filePath;
      updateData.cahier_charges_name = originalName;
    }

    const success = await Tender.update(id, updateData);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Appel d\'offre non trouvé'
      });
    }
    
    res.json({
      success: true,
      message: 'Appel d\'offre mis à jour avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'appel d\'offre:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};


const deleteTender = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await Tender.delete(id);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Appel d\'offre non trouvé'
      });
    }
    
    res.json({
      success: true,
      message: 'Appel d\'offre supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'appel d\'offre:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};


const downloadCahierCharges = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('=== DÉBOGAGE TÉLÉCHARGEMENT ===');
    console.log('ID tender demandé:', id);
    
    const tender = await Tender.getById(id);
    console.log('Tender trouvé:', tender ? 'OUI' : 'NON');
    
    if (!tender) {
      console.log('❌ Tender non trouvé');
      return res.status(404).json({
        success: false,
        message: 'Appel d\'offre non trouvé'
      });
    }
    
    console.log('Cahier charges path:', tender.cahier_charges_path);
    console.log('Cahier charges name:', tender.cahier_charges_name);
    
    if (!tender.cahier_charges_path) {
      console.log('❌ Aucun cahier de charges disponible en base de données');
      return res.status(404).json({
        success: false,
        message: 'Aucun cahier de charges disponible pour cet appel d\'offre'
      });
    }
    
    console.log('✅ Fichier trouvé en base de données, vérification sur le serveur...');
    
    
    try {
      await fs.access(tender.cahier_charges_path);
      console.log('✅ Fichier trouvé sur le serveur, téléchargement...');
    } catch (error) {
      console.error('❌ Fichier non trouvé sur le serveur:', tender.cahier_charges_path);
      console.error('Erreur:', error.message);
      
      
      const uploadDir = path.join(__dirname, '../uploads/tenders');
      try {
        const files = await fs.readdir(uploadDir);
        console.log('📁 Fichiers dans uploads/tenders:', files);
      } catch (innerError) {
        console.error('❌ Erreur lors de la lecture du répertoire uploads/tenders:', innerError.message);
      }
      
      return res.status(404).json({
        success: false,
        message: 'Fichier non trouvé sur le serveur'
      });
    }
    
    
    console.log('📤 Envoi du fichier:', tender.cahier_charges_name);
    res.download(tender.cahier_charges_path, tender.cahier_charges_name);
  } catch (error) {
    console.error('❌ Erreur lors du téléchargement du cahier de charges:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};

module.exports = {
  createTender,
  getAllTenders,
  getTenderById,
  updateTender,
  deleteTender,
  downloadCahierCharges
}; 