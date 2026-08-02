import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';







export const useRecommendations = (userId, options = {}) => {
  const {
    algorithm = 'hybrid',
    limit = 5,
    autoFetch = true,
    refreshInterval = null
  } = options;

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchRecommendations = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        API_ENDPOINTS.RECOMMENDATIONS(userId, { algorithm, limit })
      );

      if (!response.ok) {
        if (response.status === 0 || response.status >= 500) {
          throw new Error('Serveur non disponible. Vérifiez que le backend est démarré.');
        }
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        setRecommendations(data.data.recommendations || []);
        setLastUpdated(new Date());
      } else {
        throw new Error(data.message || 'Erreur lors de la récupération des recommandations');
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des recommandations:', err);
      setError(err.message);
      
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  const trackAction = async (actionType, itemId, itemType = 'service', metadata = {}) => {
    try {
      await fetch(API_ENDPOINTS.ACTIONS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          action_type: actionType,
          item_id: itemId,
          item_type: itemType,
          metadata: {
            ...metadata,
            timestamp: new Date().toISOString()
          }
        })
      });
    } catch (error) {
      console.error('Erreur lors du tracking:', error);
    }
  };

  const refreshRecommendations = () => {
    fetchRecommendations();
  };

  
  useEffect(() => {
    if (autoFetch && userId) {
      fetchRecommendations();
    }
  }, [userId, algorithm, limit, autoFetch]);

  
  useEffect(() => {
    if (refreshInterval && userId) {
      const interval = setInterval(fetchRecommendations, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [refreshInterval, userId]);

  return {
    recommendations,
    loading,
    error,
    lastUpdated,
    fetchRecommendations,
    trackAction,
    refreshRecommendations,
    hasRecommendations: recommendations.length > 0
  };
};

export default useRecommendations;
