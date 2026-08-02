const Solution = require('../models/solutions.model');


const getAll = async (req, res) => {
  try {
    const solutions = await Solution.getAllSolutions();
    res.json({
      success: true,
      data: solutions,
      message: 'Solutions récupérées avec succès'
    });
  } catch (error) {
    console.error('Erreur contrôleur getAll:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des solutions',
      error: error.message
    });
  }
};


const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const solution = await Solution.getSolutionById(id);
    
    if (!solution) {
      return res.status(404).json({
        success: false,
        message: 'Solution non trouvée'
      });
    }
    
    res.json({
      success: true,
      data: solution,
      message: 'Solution récupérée avec succès'
    });
  } catch (error) {
    console.error('Erreur contrôleur getById:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la solution',
      error: error.message
    });
  }
};


const getByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const solutions = await Solution.getSolutionsByCategory(category);
    
    res.json({
      success: true,
      data: solutions,
      message: `Solutions de la catégorie ${category} récupérées avec succès`
    });
  } catch (error) {
    console.error('Erreur contrôleur getByCategory:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des solutions par catégorie',
      error: error.message
    });
  }
};


const getCategories = async (req, res) => {
  try {
    const categories = await Solution.getSolutionCategories();
    
    res.json({
      success: true,
      data: categories,
      message: 'Catégories récupérées avec succès'
    });
  } catch (error) {
    console.error('Erreur contrôleur getCategories:', error);
    
    res.json({
      success: true,
      data: ['Cybersécurité', 'Infrastructure', 'Cloud', 'Formation'],
      message: 'Catégories par défaut retournées'
    });
  }
};


const getByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const solutions = await Solution.getSolutionsByStatus(status);
    
    res.json({
      success: true,
      data: solutions,
      message: `Solutions avec le statut ${status} récupérées avec succès`
    });
  } catch (error) {
    console.error('Erreur contrôleur getByStatus:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des solutions par statut',
      error: error.message
    });
  }
};


const getStatuses = async (req, res) => {
  try {
    const statuses = await Solution.getSolutionStatuses();
    
    res.json({
      success: true,
      data: statuses,
      message: 'Statuts récupérés avec succès'
    });
  } catch (error) {
    console.error('Erreur contrôleur getStatuses:', error);
    
    res.json({
      success: true,
      data: ['active', 'inactive', 'pending'],
      message: 'Statuts par défaut retournés'
    });
  }
};


const create = async (req, res) => {
  try {
    const solutionData = req.body;
    const solution = await Solution.createSolution(solutionData);
    
    res.status(201).json({
      success: true,
      data: solution,
      message: 'Solution créée avec succès'
    });
  } catch (error) {
    console.error('Erreur contrôleur create:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la solution',
      error: error.message
    });
  }
};


const update = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const solution = await Solution.updateSolution(id, updateData);
    
    if (!solution) {
      return res.status(404).json({
        success: false,
        message: 'Solution non trouvée'
      });
    }
    
    res.json({
      success: true,
      data: solution,
      message: 'Solution mise à jour avec succès'
    });
  } catch (error) {
    console.error('Erreur contrôleur update:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la solution',
      error: error.message
    });
  }
};


const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Solution.deleteSolution(id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Solution non trouvée'
      });
    }
    
    res.json({
      success: true,
      message: 'Solution supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur contrôleur remove:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la solution',
      error: error.message
    });
  }
};


const search = async (req, res) => {
  try {
    const { q } = req.query;
    const solutions = await Solution.searchSolutions(q);
    
    res.json({
      success: true,
      data: solutions,
      message: 'Recherche effectuée avec succès'
    });
  } catch (error) {
    console.error('Erreur contrôleur search:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la recherche',
      error: error.message
    });
  }
};


const getRecent = async (req, res) => {
  try {
    const solutions = await Solution.getRecentSolutions();
    
    res.json({
      success: true,
      data: solutions,
      message: 'Solutions récentes récupérées avec succès'
    });
  } catch (error) {
    console.error('Erreur contrôleur getRecent:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des solutions récentes',
      error: error.message
    });
  }
};


const getPopular = async (req, res) => {
  try {
    const solutions = await Solution.getPopularSolutions();
    
    res.json({
      success: true,
      data: solutions,
      message: 'Solutions populaires récupérées avec succès'
    });
  } catch (error) {
    console.error('Erreur contrôleur getPopular:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des solutions populaires',
      error: error.message
    });
  }
};


const getCount = async (req, res) => {
  try {
    const count = await Solution.getSolutionsCount();
    
    res.json({
      success: true,
      data: { count },
      message: 'Nombre de solutions récupéré avec succès'
    });
  } catch (error) {
    console.error('Erreur contrôleur getCount:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du nombre de solutions',
      error: error.message
    });
  }
};


const getStats = async (req, res) => {
  try {
    const stats = await Solution.getSolutionsStats();
    
    res.json({
      success: true,
      data: stats,
      message: 'Statistiques récupérées avec succès'
    });
  } catch (error) {
    console.error('Erreur contrôleur getStats:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message
    });
  }
};

module.exports = {
  getAll,
  getById,
  getByCategory,
  getCategories,
  getByStatus,
  getStatuses,
  create,
  update,
  remove,
  search,
  getRecent,
  getPopular,
  getCount,
  getStats
};