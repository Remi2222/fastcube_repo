const express = require('express');
const router = express.Router();
const solutionsController = require('../controllers/solutions.controller');
const { auth } = require('../middlewares/auth');


router.get('/categories', solutionsController.getCategories);   
router.get('/statuses', solutionsController.getStatuses);       
router.get('/search', solutionsController.search);              
router.get('/recent', solutionsController.getRecent);           
router.get('/popular', solutionsController.getPopular);         
router.get('/stats/count', solutionsController.getCount);       
router.get('/stats', solutionsController.getStats);             
router.get('/category/:category', solutionsController.getByCategory);  
router.get('/status/:status', solutionsController.getByStatus);        
router.get('/:id', solutionsController.getById);                
router.get('/', solutionsController.getAll);                    


router.post('/', auth, solutionsController.create);                   
router.put('/:id', auth, solutionsController.update);                
router.delete('/:id', auth, solutionsController.remove);             

module.exports = router;




