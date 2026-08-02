const { pool } = require('../config/database-unified');
const { getLastUserAction, getMostViewedItems, getUserActionStats } = require('./userActions.model');
const { getServiceById, getServicesByCategory, getAllServices } = require('./services.model');
const { getBlogById, getBlogsByCategory, getAllBlogs } = require('./blogs.model');
const { getSolutionById, getSolutionsByCategory, getAllSolutions } = require('./solutions.model');







async function getContentBasedRecommendations(userId, limit = 5) {
  try {
    
    const lastAction = await getLastUserAction(userId, 'service');
    
    if (!lastAction) {
      
      return await getPopularServices(limit);
    }

    
    const lastService = await getServiceById(lastAction.item_id);
    
    if (!lastService) {
      return await getPopularServices(limit);
    }

    
    const sameCategoryServices = await getServicesByCategory(lastService.category);
    
    
    const recommendations = sameCategoryServices
      .filter(service => service.id !== lastAction.item_id)
      .slice(0, limit);

    
    if (recommendations.length < limit) {
      const allServices = await getAllServices();
      const otherServices = allServices
        .filter(service => 
          service.id !== lastAction.item_id && 
          service.category !== lastService.category &&
          !recommendations.some(rec => rec.id === service.id)
        )
        .slice(0, limit - recommendations.length);
      
      recommendations.push(...otherServices);
    }

    return recommendations.slice(0, limit);
  } catch (error) {
    console.error('Erreur lors de la génération des recommandations:', error);
    
    return await getPopularServices(limit);
  }
}







async function getHistoryBasedRecommendations(userId, limit = 5) {
  try {
    
    const mostViewed = await getMostViewedItems(userId, 'service', 10);
    
    if (mostViewed.length === 0) {
      return await getPopularServices(limit);
    }

    
    const userCategories = new Set();
    for (const item of mostViewed) {
      const service = await getServiceById(item.item_id);
      if (service) {
        userCategories.add(service.category);
      }
    }

    
    const recommendations = [];
    for (const category of userCategories) {
      if (recommendations.length >= limit) break;
      
      const categoryServices = await getServicesByCategory(category);
      const newServices = categoryServices
        .filter(service => !mostViewed.some(viewed => viewed.item_id === service.id))
        .slice(0, limit - recommendations.length);
      
      recommendations.push(...newServices);
    }

    return recommendations.slice(0, limit);
  } catch (error) {
    console.error('Erreur lors de la génération des recommandations basées sur l\'historique:', error);
    return await getPopularServices(limit);
  }
}







async function getHybridRecommendations(userId, limit = 5) {
  try {
    
    const contentBased = await getContentBasedRecommendations(userId, Math.ceil(limit / 2));
    const historyBased = await getHistoryBasedRecommendations(userId, Math.floor(limit / 2));
    
    
    const combined = [...contentBased];
    for (const rec of historyBased) {
      if (!combined.some(item => item.id === rec.id)) {
        combined.push(rec);
      }
    }
    
    return combined.slice(0, limit);
  } catch (error) {
    console.error('Erreur lors de la génération des recommandations hybrides:', error);
    return await getPopularServices(limit);
  }
}






async function getPopularServices(limit = 5) {
  try {
    const [rows] = await pool.execute(
      `SELECT s.*, COUNT(ua.id) as view_count
       FROM services s
       LEFT JOIN user_actions ua ON s.id = ua.item_id AND ua.action_type = 'view'
       GROUP BY s.id
       ORDER BY view_count DESC, s.created_at DESC
       LIMIT ?`,
      [limit]
    );
    return rows;
  } catch (error) {
    console.error('Erreur lors de la récupération des services populaires:', error);
    
    const allServices = await getAllServices();
    return allServices.slice(0, limit);
  }
}







async function getMixedRecommendations(userId, limit = 5) {
  try {
    const recommendations = [];
    
    
    const serviceLimit = Math.ceil(limit * 0.6);
    const services = await getContentBasedRecommendations(userId, serviceLimit);
    services.forEach(service => {
      recommendations.push({
        ...service,
        item_type: 'service',
        item_id: service.id
      });
    });
    
    
    const blogLimit = Math.ceil(limit * 0.2);
    const blogs = await getAllBlogs();
    const randomBlogs = blogs
      .sort(() => 0.5 - Math.random())
      .slice(0, blogLimit);
    randomBlogs.forEach(blog => {
      recommendations.push({
        id: blog.id,
        title: blog.title,
        description: blog.excerpt || blog.content?.substring(0, 150) + '...',
        category: blog.category || 'Blog',
        image_url: blog.image_url,
        item_type: 'blog',
        item_id: blog.id,
        created_at: blog.created_at
      });
    });
    
    
    const solutionLimit = Math.ceil(limit * 0.2);
    const solutions = await getAllSolutions();
    const randomSolutions = solutions
      .sort(() => 0.5 - Math.random())
      .slice(0, solutionLimit);
    randomSolutions.forEach(solution => {
      recommendations.push({
        id: solution.id,
        title: solution.title,
        description: solution.description,
        category: solution.category || 'Solution',
        image_url: solution.image_url,
        item_type: 'solution',
        item_id: solution.id,
        created_at: solution.created_at
      });
    });
    
    
    const uniqueRecommendations = recommendations.filter((item, index, self) => 
      index === self.findIndex(t => t.id === item.id && t.item_type === item.item_type)
    );
    const shuffled = uniqueRecommendations.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, limit);
  } catch (error) {
    console.error('Erreur lors de la génération des recommandations mixtes:', error);
    
    const services = await getContentBasedRecommendations(userId, limit);
    return services.map(service => ({
      ...service,
      item_type: 'service',
      item_id: service.id
    }));
  }
}








async function getRecommendations(userId, algorithm = 'hybrid', limit = 5) {
  try {
    let recommendations = [];
    
    switch (algorithm) {
      case 'content':
        recommendations = await getContentBasedRecommendations(userId, limit);
        
        recommendations = recommendations.map(service => ({
          ...service,
          item_type: 'service',
          item_id: service.id
        }));
        break;
      case 'history':
        recommendations = await getHistoryBasedRecommendations(userId, limit);
        
        recommendations = recommendations.map(service => ({
          ...service,
          item_type: 'service',
          item_id: service.id
        }));
        break;
      case 'mixed':
        recommendations = await getMixedRecommendations(userId, limit);
        break;
      case 'hybrid':
      default:
        recommendations = await getHybridRecommendations(userId, limit);
        
        recommendations = recommendations.map(service => ({
          ...service,
          item_type: 'service',
          item_id: service.id
        }));
        break;
    }

    
    const formattedRecommendations = recommendations.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      category: item.category,
      image_url: item.image_url,
      view_count: item.view_count || 0,
      item_type: item.item_type || 'service',
      item_id: item.item_id || item.id
    }));

    return {
      userId,
      algorithm,
      recommendations: formattedRecommendations,
      count: formattedRecommendations.length,
      generated_at: new Date().toISOString()
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des recommandations:', error);
    throw error;
  }
}

module.exports = {
  getRecommendations,
  getContentBasedRecommendations,
  getHistoryBasedRecommendations,
  getHybridRecommendations,
  getPopularServices
};
