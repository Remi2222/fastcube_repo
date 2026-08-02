const express = require('express');
const router = express.Router();
const ticketsController = require('../controllers/tickets.controller');
const { auth } = require('../middlewares/auth');


router.post('/create', auth, ticketsController.createTicket);


router.get('/all', auth, ticketsController.getAllTickets);


router.get('/mine', auth, ticketsController.getUserTickets);


router.get('/stats/overview', auth, ticketsController.getTicketStats);


router.get('/:id', auth, ticketsController.getTicketById);


router.put('/:id', auth, ticketsController.updateTicket);


router.patch('/:id/status', auth, ticketsController.updateTicketStatus);


router.delete('/:id', auth, ticketsController.deleteTicket);

module.exports = router; 