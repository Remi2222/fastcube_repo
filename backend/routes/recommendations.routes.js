const express = require('express');
const router = express.Router();
const {
  getUserRecommendations,
  createUserAction,
  getUserActions,
  getRecommendationStats
} = require('../controllers/recommendations.controller');












router.get('/:userId', getUserRecommendations);







router.post('/actions', createUserAction);










router.get('/actions/:userId', getUserActions);







router.get('/stats/:userId', getRecommendationStats);

module.exports = router;
