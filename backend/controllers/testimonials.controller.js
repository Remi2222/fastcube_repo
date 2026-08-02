const Testimonial = require('../models/testimonials.model');


const createTestimonial = async (req, res) => {
  try {
    const { rating, message, user_name } = req.body;
    const user_id = req.user ? req.user.id : null; 

    
    if (!rating || !message || !user_name) {
      return res.status(400).json({
        success: false,
        message: 'Les champs note, message et nom sont obligatoires'
      });
    }

    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'La note doit être comprise entre 1 et 5'
      });
    }

    
    if (message.length > 300) {
      return res.status(400).json({
        success: false,
        message: 'Le témoignage ne peut pas dépasser 300 caractères'
      });
    }

    const testimonialId = await Testimonial.create({
    user_id,
    user_name,
    message,
    rating
    });

    res.status(201).json({
      success: true,
      message: 'Témoignage soumis avec succès ! Il sera examiné par notre équipe avant publication.',
      data: { id: testimonialId }
    });
  } catch (error) {
    console.error('Erreur lors de la création du témoignage:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la création du témoignage'
    });
  }
};


const getApprovedTestimonials = async (req, res) => {
  try {
    console.log('🔍 Récupération des témoignages approuvés...');
    const limit = parseInt(req.query.limit) || 10;
     console.log('📊 Limite demandée:', limit);
     console.log('Type:', typeof limit);

    
    const testimonials = await Testimonial.getApproved(limit);
    console.log('✅ Témoignages récupérés:', testimonials.length);

    res.json({
      success: true,
      data: testimonials
    });
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des témoignages approuvés:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des témoignages'
    });
  }
};


const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.getAll();

    res.json({
      success: true,
      data: testimonials
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des témoignages:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des témoignages'
    });
  }
};


const getTestimonialById = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.getById(id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Témoignage non trouvé'
      });
    }

    res.json({
      success: true,
      data: testimonial
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du témoignage:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du témoignage'
    });
  }
};


const getMyTestimonial = async (req, res) => {
  try {
    const user_id = req.user.id;
    const testimonials = await Testimonial.getByUserId(user_id);

    const testimonial =
    testimonials.length > 0 ? testimonials[0] : null;

    res.json({
      success: true,
      data: testimonial
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du témoignage:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de votre témoignage'
    });
  }
};


const updateMyTestimonial = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { rating, message, user_name } = req.body;

    
    if (!rating || !message || !user_name) {
      return res.status(400).json({
        success: false,
        message: 'Les champs note, message et nom sont obligatoires'
      });
    }

    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'La note doit être comprise entre 1 et 5'
      });
    }

    
    if (message.length > 300) {
      return res.status(400).json({
        success: false,
        message: 'Le témoignage ne peut pas dépasser 300 caractères'
      });
    }

    
    const testimonials = await Testimonial.getByUserId(user_id);

    const existingTestimonial =
    testimonials.length > 0 ? testimonials[0] : null; 
    if (!existingTestimonial) {
      return res.status(404).json({
        success: false,
        message: 'Vous n\'avez pas encore soumis de témoignage'
      });
    }

    const updated = await Testimonial.update(existingTestimonial.id, user_id, {
      user_name,
      message,
      rating
    });

    if (updated) {
      res.json({
        success: true,
        message: 'Témoignage mis à jour avec succès ! Il sera re-examiné par notre équipe.'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Erreur lors de la mise à jour du témoignage'
      });
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour du témoignage:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du témoignage'
    });
  }
};


const updateTestimonialStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { approved } = req.body;

    const approvedValue = Number(approved);

    if (![0, 1].includes(approvedValue)) {
      return res.status(400).json({
        success: false,
        message: "approved doit être 0 ou 1"
      });
    }

    const updated = await Testimonial.updateStatus(id, approvedValue);

    if (updated) {
      return res.json({
        success: true,
        message: approvedValue === 1
          ? "Témoignage approuvé avec succès"
          : "Témoignage rejeté avec succès"
      });
    }

    return res.status(404).json({
      success: false,
      message: "Témoignage non trouvé"
    });

  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour du statut"
    });
  }
};


const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.role === 'admin' ? null : req.user.id;

    const deleted = await Testimonial.delete(id);

    if (deleted) {
      res.json({
        success: true,
        message: 'Témoignage supprimé avec succès'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Témoignage non trouvé ou vous n\'avez pas les permissions'
      });
    }
  } catch (error) {
    console.error('Erreur lors de la suppression du témoignage:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du témoignage'
    });
  }
};


const getTestimonialsStats = async (req, res) => {
  try {
    const stats = await Testimonial.getStats();

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques'
    });
  }
};


const searchTestimonials = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Terme de recherche requis'
      });
    }

    const testimonials = await Testimonial.search(q);

    res.json({
      success: true,
      data: testimonials
    });
  } catch (error) {
    console.error('Erreur lors de la recherche:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la recherche'
    });
  }
};

module.exports = {
  createTestimonial,
  getApprovedTestimonials,
  getAllTestimonials,
  getTestimonialById,
  getMyTestimonial,
  updateMyTestimonial,
  updateTestimonialStatus,
  deleteTestimonial,
  getTestimonialsStats,
  searchTestimonials
}; 