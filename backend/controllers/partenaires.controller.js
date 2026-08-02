const PartenaireModel = require('../models/partenaires.model');

class PartenairesController {
  
  static async getAllPartenaires(req, res) {
    try {
      const result = await PartenaireModel.getAllPartenaires();
      
      if (result.success) {
        res.json(result);
      } else {
        res.status(500).json(result);
      }
    } catch (error) {
      console.error('Erreur dans getAllPartenaires:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erreur interne du serveur' 
      });
    }
  }

  
  static async getPartenaireById(req, res) {
    try {
      const { id } = req.params;
      const result = await PartenaireModel.getPartenaireById(id);
      
      if (result.success) {
        res.json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error) {
      console.error('Erreur dans getPartenaireById:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erreur interne du serveur' 
      });
    }
  }

  
  static async getPartenairesActifs(req, res) {
    try {
      const result = await PartenaireModel.getPartenairesActifs();
      
      if (result.success) {
        res.json(result);
      } else {
        res.status(500).json(result);
      }
    } catch (error) {
      console.error('Erreur dans getPartenairesActifs:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erreur interne du serveur' 
      });
    }
  }

  
  static async createPartenaire(req, res) {
    try {
      const partenaireData = req.body;
      
      
      if (!partenaireData.name) {
        return res.status(400).json({
          success: false,
          error: 'Le nom du partenaire est requis'
        });
      }

      
      const defaultData = {
        status: 'active',
        ...partenaireData
      };

      const result = await PartenaireModel.createPartenaire(defaultData);
      
      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(500).json(result);
      }
    } catch (error) {
      console.error('Erreur dans createPartenaire:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erreur interne du serveur' 
      });
    }
  }

  
  static async updatePartenaire(req, res) {
    try {
      const { id } = req.params;
      const partenaireData = req.body;
      
      
      if (!partenaireData.name) {
        return res.status(400).json({
          success: false,
          error: 'Le nom du partenaire est requis'
        });
      }

      const result = await PartenaireModel.updatePartenaire(id, partenaireData);
      
      if (result.success) {
        res.json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error) {
      console.error('Erreur dans updatePartenaire:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erreur interne du serveur' 
      });
    }
  }

  
  static async deletePartenaire(req, res) {
    try {
      const { id } = req.params;
      const result = await PartenaireModel.deletePartenaire(id);
      
      if (result.success) {
        res.json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error) {
      console.error('Erreur dans deletePartenaire:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erreur interne du serveur' 
      });
    }
  }

  
  static async searchPartenaires(req, res) {
    try {
      const { q } = req.query;
      
      if (!q) {
        return res.status(400).json({
          success: false,
          error: 'Le terme de recherche est requis'
        });
      }

      const result = await PartenaireModel.searchPartenaires(q);
      
      if (result.success) {
        res.json(result);
      } else {
        res.status(500).json(result);
      }
    } catch (error) {
      console.error('Erreur dans searchPartenaires:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erreur interne du serveur' 
      });
    }
  }

  
  static async getPartenairesStats(req, res) {
    try {
      const result = await PartenaireModel.getPartenairesStats();
      
      if (result.success) {
        res.json(result);
      } else {
        res.status(500).json(result);
      }
    } catch (error) {
      console.error('Erreur dans getPartenairesStats:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erreur interne du serveur' 
      });
    }
  }
}

module.exports = PartenairesController;
