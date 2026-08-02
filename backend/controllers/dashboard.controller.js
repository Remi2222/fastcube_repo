const User = require('../models/users.model');
const Ticket = require('../models/tickets.model');
const Testimonial = require('../models/testimonials.model');
const Tender = require('../models/tenders.model');
const Partenaire = require('../models/partenaires.model');
const Proposition = require('../models/propositions.model');
const Blog = require('../models/blogs.model');


const getDashboardStats = async (req, res) => {
  try {
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé. Rôle admin requis.'
      });
    }

    console.log('📊 Récupération des statistiques du dashboard...');

    
    const userStats = await User.getStats();
    
    
    const ticketStats = await Ticket.getStats();
    
    
    const testimonialStats = await Testimonial.getStats();
    
    
    let tenderStats = { total: 0, active: 0, closed: 0, awarded: 0 };
    try {
      tenderStats = await Tender.getStats();
    } catch (error) {
      console.log('⚠️ Erreur lors de la récupération des stats tenders:', error.message);
      
    }

    
    let partenaireStats = { total: 0, actifs: 0, inactifs: 0 };
    try {
      const partenaireResult = await Partenaire.getPartenairesStats();
      if (partenaireResult.success) {
        partenaireStats = partenaireResult.data;
      }
    } catch (error) {
      console.log('⚠️ Erreur lors de la récupération des stats partenaires:', error.message);
    }

    
    let propositionStats = { total: 0, en_attente: 0, acceptee: 0, refusee: 0, en_cours_evaluation: 0 };
    try {
      propositionStats = await Proposition.getStats();
    } catch (error) {
      console.log('⚠️ Erreur lors de la récupération des stats propositions:', error.message);
    }

    
    let blogStats = { total: 0, published: 0, draft: 0, total_views: 0 };
    try {
      blogStats = await Blog.getStats();
    } catch (error) {
      console.log('⚠️ Erreur lors de la récupération des stats blogs:', error.message);
    }

    
    
    const totalRevenue = ticketStats.resolved * 1500; 

    
    
    const calculateGrowth = (current, previous = Math.floor(current * 0.85)) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    const stats = {
      users: {
        total: userStats.total,
        admins: userStats.admins,
        clients: userStats.clients,
        recent: userStats.recent,
        growth: calculateGrowth(userStats.total)
      },
      tickets: {
        total: ticketStats.total,
        active: ticketStats.active,
        resolved: ticketStats.resolved,
        pending: ticketStats.pending,
        growth: calculateGrowth(ticketStats.active)
      },
      testimonials: {
        total: testimonialStats.total,
        approved: testimonialStats.approved,
        pending: testimonialStats.pending,
        growth: calculateGrowth(testimonialStats.total)
      },
      tenders: {
        total: tenderStats.total,
        active: tenderStats.active,
        closed: tenderStats.closed,
        awarded: tenderStats.awarded,
        growth: calculateGrowth(tenderStats.total)
      },
      partenaires: {
        total: partenaireStats.total,
        actifs: partenaireStats.actifs,
        inactifs: partenaireStats.inactifs,
        growth: calculateGrowth(partenaireStats.total)
      },
      propositions: {
        total: propositionStats.total,
        en_attente: propositionStats.en_attente,
        acceptee: propositionStats.acceptee,
        refusee: propositionStats.refusee,
        en_cours_evaluation: propositionStats.en_cours_evaluation,
        growth: calculateGrowth(propositionStats.total)
      },
      blogs: {
        total: blogStats.total,
        published: blogStats.published,
        draft: blogStats.draft,
        total_views: blogStats.total_views,
        growth: calculateGrowth(blogStats.total)
      },
      services: {
        total: 0, 
        active: 0,
        growth: 0
      },
      solutions: {
        total: 0, 
        active: 0,
        growth: 0
      },
      revenue: {
        total: totalRevenue,
        formatted: totalRevenue.toLocaleString('fr-FR')
      }
    };

    console.log('✅ Statistiques récupérées:', stats);

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('❌ Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message
    });
  }
};


const getRecentTickets = async (req, res) => {
  try {
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé. Rôle admin requis.'
      });
    }

    const limit = parseInt(req.query.limit) || 5;
    const tickets = await Ticket.getRecent(limit);

    res.json({
      success: true,
      data: tickets
    });

  } catch (error) {
    console.error('❌ Erreur lors de la récupération des tickets récents:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des tickets récents',
      error: error.message
    });
  }
};

module.exports = {
  getDashboardStats,
  getRecentTickets
}; 