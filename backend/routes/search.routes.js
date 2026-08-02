const express = require('express');
const router = express.Router();
const SearchController = require('../controllers/search.controller');


router.get('/global', SearchController.globalSearch);


router.get('/suggestions', SearchController.getSuggestions);


router.get('/stats', SearchController.getSearchStats);

module.exports = router; 