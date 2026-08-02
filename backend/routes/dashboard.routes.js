const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { auth } = require('../middlewares/auth');


router.get('/test', (req, res) => {
  res.json({ message: 'Route dashboard accessible', timestamp: new Date().toISOString() });
});


router.get('/stats', auth, dashboardController.getDashboardStats);


router.get('/recent-tickets', auth, dashboardController.getRecentTickets);

module.exports = router; 