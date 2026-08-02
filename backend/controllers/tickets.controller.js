const Ticket = require('../models/tickets.model');


const createTicket = async (req, res) => {
  try {
    const { subject, description, category, priority, contactEmail, contactPhone } = req.body;
    
    
    if (!subject || !description || !contactEmail) {
      return res.status(400).json({
        success: false,
        message: 'Les champs sujet, description et email sont obligatoires'
      });
    }

    
    const userId = req.user ? req.user.id : null;

    const ticketData = {
      subject,
      description,
      category: category || 'technique',
      priority: priority || 'moyenne',
      contactEmail,
      contactPhone: contactPhone || null,
      userId
    };

    const ticket = await Ticket.create(ticketData);

    res.status(201).json({
      success: true,
      message: 'Ticket créé avec succès',
      data: {
        id: ticket.id,
        reference: ticket.reference,
        subject: ticket.subject,
        status: 'ouvert',
        createdAt: new Date()
      }
    });

  } catch (error) {
    console.error('Erreur lors de la création du ticket:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du ticket',
      error: error.message
    });
  }
};


const getAllTickets = async (req, res) => {
  try {
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé. Rôle admin requis.'
      });
    }

    console.log('🔍 Récupération de tous les tickets pour admin:', req.user.email);
    const tickets = await Ticket.getAll();
    console.log('📊 Tickets récupérés:', tickets.length);
    
    res.status(200).json({
      success: true,
      data: tickets
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des tickets:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des tickets',
      error: error.message
    });
  }
};


const getUserTickets = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('getUserTickets appelé pour l\'utilisateur ID:', userId);
    
    const tickets = await Ticket.getByUserId(userId);
    console.log('Tickets récupérés:', tickets.length, 'tickets');
    
    res.status(200).json({
      success: true,
      data: tickets
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des tickets utilisateur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des tickets',
      error: error.message
    });
  }
};


const getTicketById = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.getById(id);
    
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: ticket
    });

  } catch (error) {
    console.error('Erreur lors de la récupération du ticket:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du ticket',
      error: error.message
    });
  }
};


const updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const success = await Ticket.update(id, updateData);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Ticket non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Ticket mis à jour avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du ticket:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du ticket',
      error: error.message
    });
  }
};


const updateTicketStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Le statut est obligatoire'
      });
    }

    const success = await Ticket.updateStatus(id, status);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Ticket non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Statut du ticket mis à jour avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du statut',
      error: error.message
    });
  }
};


const deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;
    
    const success = await Ticket.delete(id);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Ticket non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Ticket supprimé avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression du ticket:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du ticket',
      error: error.message
    });
  }
};


const getTicketStats = async (req, res) => {
  try {
    const stats = await Ticket.getStats();
    
    res.status(200).json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message
    });
  }
};

module.exports = {
  createTicket,
  getAllTickets,
  getUserTickets,
  getTicketById,
  updateTicket,
  updateTicketStatus,
  deleteTicket,
  getTicketStats
}; 