const express = require('express');
const router = express.Router();
const servicesController = require('../controllers/services.controller');
const { auth } = require('../middlewares/auth');


router.get('/', servicesController.getAll);                    
router.get('/categories', servicesController.getCategories);   
router.get('/category/:category', servicesController.getByCategory); 
router.get('/search', servicesController.search);              
router.get('/stats/count', servicesController.getCount);       
router.get('/:id', servicesController.getById);                


router.post('/', auth, servicesController.create);                   
router.put('/:id', auth, servicesController.update);                 
router.delete('/:id', auth, servicesController.remove);              

module.exports = router; 