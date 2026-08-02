const { getRecommendations } = require('../models/recommendations.model');
const { createUserAction } = require('../models/userActions.model');





exports.getUserRecommendations = async (req, res) => {
  try {
    const { userId } = req.params;
    const { algorithm = 'hybrid', limit = 5 } = req.query;

    
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required',
        message: 'L\'ID utilisateur est requis'
      });
    }

    const limitNum = parseInt(limit);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 20) {
      return res.status(400).json({
        success: false,
        error: 'Invalid limit parameter',
        message: 'Le paramètre limit doit être un nombre entre 1 et 20'
      });
    }

    
    const result = await getRecommendations(userId, algorithm, limitNum);

    res.json({
      success: true,
      data: result,
      message: `${result.count} recommandations générées avec succès`
    });

  } catch (error) {
    console.error('Erreur dans getUserRecommendations:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de la récupération des recommandations',
      message: error.message
    });
  }
};





exports.createUserAction = async (req, res) => {
  try {
    const { user_id, action_type, item_id, item_type = 'service', metadata } = req.body;

    
    if (!user_id || !action_type || !item_id) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters',
        message: 'Les paramètres user_id, action_type et item_id sont requis',
        required: ['user_id', 'action_type', 'item_id']
      });
    }

    
    const validActionTypes = ['view', 'click', 'search', 'like', 'share', 'download'];
    if (!validActionTypes.includes(action_type)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid action type',
        message: `Le type d'action doit être l'un des suivants: ${validActionTypes.join(', ')}`
      });
    }

    
    const validItemTypes = ['service', 'blog', 'solution', 'tender'];
    if (!validItemTypes.includes(item_type)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid item type',
        message: `Le type d'élément doit être l'un des suivants: ${validItemTypes.join(', ')}`
      });
    }

    
    const action = await createUserAction({
      user_id,
      action_type,
      item_id: parseInt(item_id),
      item_type,
      metadata
    });

    res.status(201).json({
      success: true,
      data: action,
      message: 'Action utilisateur enregistrée avec succès'
    });

  } catch (error) {
    console.error('Erreur dans createUserAction:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de l\'enregistrement de l\'action',
      message: error.message
    });
  }
};





exports.getUserActions = async (req, res) => {
  try {
    const { userId } = req.params;
    const { action_type, item_type, limit = 50 } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required',
        message: 'L\'ID utilisateur est requis'
      });
    }

    const { getUserActions, getUserActionsByType } = require('../models/userActions.model');
    
    let actions;
    if (action_type) {
      actions = await getUserActionsByType(userId, action_type, parseInt(limit));
    } else {
      actions = await getUserActions(userId, parseInt(limit));
    }

    
    if (item_type) {
      actions = actions.filter(action => action.item_type === item_type);
    }

    res.json({
      success: true,
      data: {
        userId,
        actions,
        count: actions.length,
        filters: {
          action_type: action_type || 'all',
          item_type: item_type || 'all',
          limit: parseInt(limit)
        }
      },
      message: `${actions.length} actions trouvées`
    });

  } catch (error) {
    console.error('Erreur dans getUserActions:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de la récupération des actions',
      message: error.message
    });
  }
};





exports.getRecommendationStats = async (req, res) => {
  try {
    const { userId } = req.params;
    const { getUserActionStats, getMostViewedItems } = require('../models/userActions.model');

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required',
        message: 'L\'ID utilisateur est requis'
      });
    }

    const [actionStats, mostViewed] = await Promise.all([
      getUserActionStats(userId),
      getMostViewedItems(userId, 'service', 5)
    ]);

    res.json({
      success: true,
      data: {
        userId,
        actionStats,
        mostViewedItems: mostViewed,
        totalActions: actionStats.reduce((sum, stat) => sum + stat.count, 0),
        generated_at: new Date().toISOString()
      },
      message: 'Statistiques récupérées avec succès'
    });

  } catch (error) {
    console.error('Erreur dans getRecommendationStats:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de la récupération des statistiques',
      message: error.message
    });
  }
};
