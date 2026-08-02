const Contact = require('../models/contacts.model');


const createContact = async (req, res) => {
  try {
    console.log('📝 Création d\'un nouveau contact...');
    console.log('📋 Données reçues:', req.body);

    const {
      firstName,
      lastName,
      email,
      phone,
      company,
      city,
      country,
      category,
      subject,
      message,
      priority,
      preferredContact,
      attachments
    } = req.body;

    
    if (!firstName || !lastName || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs obligatoires doivent être remplis'
      });
    }

    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Format d\'email invalide'
      });
    }

    
    const aiResponse = generateAIResponse(category || 'autre', firstName);

    const contactData = {
      firstName,
      lastName,
      email,
      phone: phone || null,
      company: company || null,
      city: city || null,
      country: country || null,
      category,
      subject,
      message,
      priority: priority || 'normal',
      preferredContact: preferredContact || 'email',
      attachments: attachments || [],
      aiResponse
    };

    console.log('💾 Sauvegarde en base de données...');
    const contactId = await Contact.create(contactData);
    console.log('✅ Contact créé avec ID:', contactId);

    res.status(201).json({
      success: true,
      message: 'Message envoyé avec succès',
      data: {
        id: contactId,
        aiResponse,
        reference: `CONT-${new Date().getFullYear()}-${String(contactId).padStart(3, '0')}`
      }
    });
  } catch (error) {
    console.error('❌ Erreur lors de la création du contact:', error);
    console.error('📋 Détails de l\'erreur:', error.message);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};


const getAllContacts = async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    const contacts = await Contact.getAll(parseInt(limit), parseInt(offset));
    
    res.json({
      success: true,
      data: contacts
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};


const getContactById = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.getById(id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact non trouvé'
      });
    }
    
    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du contact:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};


const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    
    const validStatuses = ['new', 'in_progress', 'responded', 'closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Statut invalide'
      });
    }

    const success = await Contact.updateStatus(id, status);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Contact non trouvé'
      });
    }
    
    res.json({
      success: true,
      message: 'Statut du contact mis à jour avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};


const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await Contact.delete(id);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Contact non trouvé'
      });
    }
    
    res.json({
      success: true,
      message: 'Contact supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du contact:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};


const getContactsStats = async (req, res) => {
  try {
    const stats = await Contact.getStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};


const searchContacts = async (req, res) => {
  try {
    const { q, limit = 20 } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Terme de recherche requis'
      });
    }

    const contacts = await Contact.search(q, parseInt(limit));
    
    res.json({
      success: true,
      data: contacts
    });
  } catch (error) {
    console.error('Erreur lors de la recherche:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};


const generateAIResponse = (category, firstName) => {
  const responses = {
    devis: `Bonjour ${firstName},

Merci pour votre demande de devis ! Notre équipe commerciale va analyser vos besoins et vous contacter sous 24h avec une proposition personnalisée.

En attendant, vous pouvez consulter nos tarifs indicatifs sur notre site web.

Cordialement,
L'équipe FastCube`,
    
    support: `Bonjour ${firstName},

Nous avons bien reçu votre demande de support technique. Un ticket a été créé et notre équipe technique va vous répondre dans les plus brefs délais.

Numéro de ticket : #${Math.random().toString(36).substr(2, 9).toUpperCase()}

Cordialement,
L'équipe support FastCube`,
    
    securite: `Bonjour ${firstName},

Votre demande concernant la cybersécurité a été transmise à nos experts. Nous vous proposons un audit de sécurité gratuit pour évaluer vos besoins.

Un consultant spécialisé vous contactera sous 48h.

Cordialement,
L'équipe cybersécurité FastCube`,
    
    cloud: `Bonjour ${firstName},

Merci pour votre intérêt pour nos solutions cloud ! Notre architecte cloud va analyser votre infrastructure actuelle et vous proposer un plan de migration optimisé.

Nous vous recontacterons sous 24h.

Cordialement,
L'équipe cloud FastCube`,
    
    reseau: `Bonjour ${firstName},

Votre demande d'infrastructure réseau a été reçue. Nous vous proposons une consultation gratuite pour évaluer vos besoins et vous présenter nos solutions.

Un expert réseau vous contactera sous 48h.

Cordialement,
L'équipe réseau FastCube`,
    
    audit: `Bonjour ${firstName},

Nous avons bien reçu votre demande d'audit. Notre équipe de consultants va préparer une proposition détaillée incluant méthodologie, planning et tarifs.

Nous vous recontacterons sous 24h.

Cordialement,
L'équipe audit FastCube`,
    
    partenariat: `Bonjour ${firstName},

Merci pour votre intérêt pour un partenariat ! Notre équipe business va analyser votre proposition et vous recontacter rapidement.

Nous étudions chaque opportunité de partenariat avec attention.

Cordialement,
L'équipe business FastCube`,
    
    autre: `Bonjour ${firstName},

Nous avons bien reçu votre message. Notre équipe va l'analyser et vous répondre dans les plus brefs délais.

Merci pour votre confiance.

Cordialement,
L'équipe FastCube`
  };

  return responses[category] || responses.autre;
};

module.exports = {
  createContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
  getContactsStats,
  searchContacts
}; 