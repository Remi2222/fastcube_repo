const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const { auth } = require('../middlewares/auth');


router.get('/test', (req, res) => {
  res.json({ message: 'Route utilisateurs accessible' });
});


router.get('/stats/overview', auth, usersController.getUserStats);


router.get('/', auth, usersController.getAllUsers);


router.get('/me', auth, usersController.getCurrentUser);


router.put('/update', auth, usersController.updateCurrentUser);


router.put('/change-password', auth, usersController.changePassword);


router.get('/:id', auth, usersController.getUserById);


router.put('/:id', auth, usersController.updateUser);


router.delete('/:id', auth, usersController.deleteUser);

module.exports = router; 