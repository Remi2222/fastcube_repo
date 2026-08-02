const express = require('express');
const router = express.Router();
const CommentaireController = require('../controllers/commentaires.controller');
const { auth } = require('../middlewares/auth');


router.get('/blog/:blogId', CommentaireController.getCommentairesByBlog);
router.get('/count/:blogId', CommentaireController.countCommentairesByBlog);
router.get('/recent', CommentaireController.getRecentCommentaires);
router.post('/', CommentaireController.createCommentaire);


router.use(auth);


router.put('/:id', CommentaireController.updateCommentaire);
router.delete('/:id', CommentaireController.deleteCommentaire);


router.get('/admin/all', CommentaireController.getAllCommentaires);
router.get('/admin/pending', CommentaireController.getPendingCommentaires);
router.put('/admin/:id/approve', CommentaireController.approveCommentaire);
router.put('/admin/:id/reject', CommentaireController.rejectCommentaire);

module.exports = router;
