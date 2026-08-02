const express = require('express');
const router = express.Router();
const PartenairesController = require('../controllers/partenaires.controller');
const { auth } = require('../middlewares/auth');


router.get('/actifs', PartenairesController.getPartenairesActifs);


router.get('/', auth, PartenairesController.getAllPartenaires);
router.get('/stats', auth, PartenairesController.getPartenairesStats);
router.get('/search', auth, PartenairesController.searchPartenaires);
router.get('/:id', auth, PartenairesController.getPartenaireById);
router.post('/', auth, PartenairesController.createPartenaire);
router.put('/:id', auth, PartenairesController.updatePartenaire);
router.delete('/:id', auth, PartenairesController.deletePartenaire);

module.exports = router;
