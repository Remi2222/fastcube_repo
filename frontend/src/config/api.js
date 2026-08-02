const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const checkApiHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    return response.ok;
  } catch (error) {
    console.warn('API non disponible:', error.message);
    return false;
  }
};

export const API_ENDPOINTS = {
  // Recommandations
  RECOMMENDATIONS: (userId, params = {}) => {
    const searchParams = new URLSearchParams(params);
    return `${API_BASE_URL}/api/recommendations/${userId}?${searchParams}`;
  },
  ACTIONS: `${API_BASE_URL}/api/recommendations/actions`,
  USER_ACTIONS: (userId, params = {}) => {
    const searchParams = new URLSearchParams(params);
    return `${API_BASE_URL}/api/recommendations/actions/${userId}?${searchParams}`;
  },
  RECOMMENDATION_STATS: (userId) => `${API_BASE_URL}/api/recommendations/stats/${userId}`,
  
  // Autres endpoints existants
  SERVICES: `${API_BASE_URL}/api/services`,
  BLOGS: `${API_BASE_URL}/api/blogs`,
  CONTACTS: `${API_BASE_URL}/api/contacts`,
  AUTH: `${API_BASE_URL}/api/auth`,
};

export default API_BASE_URL;
