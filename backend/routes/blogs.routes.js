const express = require('express');
const router = express.Router();
const blogsController = require('../controllers/blogs.controller');


router.get('/', blogsController.getAll);
router.get('/statuses', blogsController.getStatuses);
router.get('/status/:status', blogsController.getByStatus);
router.get('/search', blogsController.search);
router.get('/stats/count', blogsController.getCount);
router.get('/stats', blogsController.getStats);
router.get('/recent', blogsController.getRecent);
router.get('/popular', blogsController.getPopular);


router.get('/:id', blogsController.getById);
router.post('/:id/view', blogsController.incrementViews);
router.post('/', blogsController.create);
router.put('/:id', blogsController.update);
router.delete('/:id', blogsController.remove);

module.exports = router;
