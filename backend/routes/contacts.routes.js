const express = require('express');
const router = express.Router();
const contactsController = require('../controllers/contacts.controller');
const { auth } = require('../middlewares/auth');


router.post('/create', contactsController.createContact); 


router.get('/', auth, contactsController.getAllContacts); 
router.get('/stats', auth, contactsController.getContactsStats); 
router.get('/search', auth, contactsController.searchContacts); 
router.get('/:id', auth, contactsController.getContactById); 
router.patch('/:id/status', auth, contactsController.updateContactStatus); 
router.delete('/:id', auth, contactsController.deleteContact); 

module.exports = router; 