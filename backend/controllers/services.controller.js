const Service = require('../models/services.model');


exports.getAll = async (req, res) => {
  try {
    const services = await Service.getAllServices();
    res.json({
      success: true,
      data: services,
      count: services.length,
      message: `${services.length} services récupérés avec succès`
    });
  } catch (err) {
    console.error('Erreur dans getAll services:', err);
    res.status(500).json({ 
      success: false,
      error: 'Erreur serveur lors de la récupération des services',
      message: err.message 
    });
  }
};


exports.getCategories = async (req, res) => {
  try {
    const categories = await Service.getServiceCategories();
    res.json({
      success: true,
      data: categories,
      count: categories.length,
      message: `${categories.length} catégories récupérées avec succès`
    });
  } catch (err) {
    console.error('Erreur dans getCategories:', err);
    res.status(500).json({ 
      success: false,
      error: 'Erreur serveur lors de la récupération des catégories',
      message: err.message 
    });
  }
};


exports.getByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const services = await Service.getServicesByCategory(category);
    
    if (services.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Aucun service trouvé pour cette catégorie',
        category: category
      });
    }
    
    res.json({
      success: true,
      data: services,
      count: services.length,
      category: category,
      message: `${services.length} services trouvés pour la catégorie "${category}"`
    });
  } catch (err) {
    console.error('Erreur dans getByCategory:', err);
    res.status(500).json({ 
      success: false,
      error: 'Erreur serveur lors de la récupération des services par catégorie',
      message: err.message 
    });
  }
};


exports.search = async (req, res) => {
  try {
    const { q: keyword } = req.query;
    
    if (!keyword || keyword.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Le terme de recherche doit contenir au moins 2 caractères'
      });
    }
    
    const services = await Service.searchServices(keyword.trim());
    
    res.json({
      success: true,
      data: services,
      count: services.length,
      keyword: keyword.trim(),
      message: `${services.length} services trouvés pour "${keyword.trim()}"`
    });
  } catch (err) {
    console.error('Erreur dans search services:', err);
    res.status(500).json({ 
      success: false,
      error: 'Erreur serveur lors de la recherche de services',
      message: err.message 
    });
  }
};


exports.getById = async (req, res) => {
  try {
    const service = await Service.getServiceById(req.params.id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        error: 'Service non trouvé',
        id: req.params.id
      });
    }
    
    res.json({
      success: true,
      data: service,
      message: 'Service récupéré avec succès'
    });
  } catch (err) {
    console.error('Erreur dans getById service:', err);
    res.status(500).json({ 
      success: false,
      error: 'Erreur serveur lors de la récupération du service',
      message: err.message 
    });
  }
};


exports.create = async (req, res) => {
  try {
    const { title, description, category, image_url } = req.body;
    
    
    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        error: 'Champs requis manquants',
        required: ['title', 'description', 'category'],
        received: { title, description, category, image_url }
      });
    }
    
    const newService = await Service.createService({ 
      title: title.trim(), 
      description: description.trim(), 
      category: category.trim(), 
      image_url: image_url || null 
    });
    
    res.status(201).json({
      success: true,
      data: newService,
      message: 'Service créé avec succès'
    });
  } catch (err) {
    console.error('Erreur dans create service:', err);
    res.status(500).json({ 
      success: false,
      error: 'Erreur serveur lors de la création du service',
      message: err.message 
    });
  }
};


exports.update = async (req, res) => {
  try {
    const { title, description, category, image_url } = req.body;
    const serviceId = req.params.id;
    
    
    const existingService = await Service.getServiceById(serviceId);
    if (!existingService) {
      return res.status(404).json({
        success: false,
        error: 'Service non trouvé',
        id: serviceId
      });
    }
    
    
    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        error: 'Champs requis manquants',
        required: ['title', 'description', 'category']
      });
    }
    
    const updatedService = await Service.updateService(serviceId, {
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      image_url: image_url || null
    });
    
    res.json({
      success: true,
      data: updatedService,
      message: 'Service mis à jour avec succès'
    });
  } catch (err) {
    console.error('Erreur dans update service:', err);
    res.status(500).json({ 
      success: false,
      error: 'Erreur serveur lors de la mise à jour du service',
      message: err.message 
    });
  }
};


exports.remove = async (req, res) => {
  try {
    const serviceId = req.params.id;
    
    
    const existingService = await Service.getServiceById(serviceId);
    if (!existingService) {
      return res.status(404).json({
        success: false,
        error: 'Service non trouvé',
        id: serviceId
      });
    }
    
    await Service.deleteService(serviceId);
    
    res.json({
      success: true,
      message: 'Service supprimé avec succès',
      deletedService: existingService
    });
  } catch (err) {
    console.error('Erreur dans remove service:', err);
    res.status(500).json({ 
      success: false,
      error: 'Erreur serveur lors de la suppression du service',
      message: err.message 
    });
  }
};


exports.getCount = async (req, res) => {
  try {
    const count = await Service.getServicesCount();
    res.json({
      success: true,
      data: { count },
      message: `Total de ${count} services`
    });
  } catch (err) {
    console.error('Erreur dans getCount services:', err);
    res.status(500).json({ 
      success: false,
      error: 'Erreur serveur lors du comptage des services',
      message: err.message 
    });
  }
}; 