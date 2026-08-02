import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaMagic, FaSpinner, FaExclamationTriangle, FaEye, 
  FaArrowRight, FaStar, FaClock, FaTag
} from 'react-icons/fa';
import { useRecommendations } from '../hooks/useRecommendations';

const RecommendationsSection = ({ 
  userId, 
  title = "🔮 Vous pourriez aimer...", 
  limit = 5,
  algorithm = 'mixed',
  showTitle = true,
  className = ""
}) => {
  const {
    recommendations,
    loading,
    error,
    trackAction
  } = useRecommendations(userId, {
    algorithm,
    limit,
    autoFetch: true
  });

  const handleItemClick = (itemId, itemType) => {
    console.log('🔍 Clic sur recommandation:', { itemId, itemType });
    
    trackAction('click', itemId, itemType, {
      source: 'recommendations_section',
      action: 'click'
    });
    
    // Rediriger vers la page appropriée
    switch (itemType) {
      case 'service':
        console.log('🛠️ Redirection vers services');
        window.location.href = `/services`;
        break;
      case 'blog':
        console.log('📝 Redirection vers blog:', itemId);
        window.location.href = `/blog/${itemId}`;
        break;
      case 'solution':
        console.log('💡 Redirection vers solutions');
        window.location.href = `/solutions`;
        break;
      default:
        console.log('🔄 Redirection par défaut vers services');
        window.location.href = `/services`;
    }
  };

  const handleItemView = (itemId, itemType) => {
    trackAction('view', itemId, itemType, {
      source: 'recommendations_section',
      action: 'view'
    });
  };

  const getItemLink = (item) => {
    switch (item.item_type) {
      case 'service':
        return `/services`;
      case 'blog':
        return `/blog/${item.id}`;
      case 'solution':
        return `/solutions`;
      default:
        return `/services`;
    }
  };

  const getItemIcon = (itemType) => {
    switch (itemType) {
      case 'service':
        return '🛠️';
      case 'blog':
        return '📝';
      case 'solution':
        return '💡';
      default:
        return '🛠️';
    }
  };

  const getItemTypeLabel = (itemType) => {
    switch (itemType) {
      case 'service':
        return 'Service';
      case 'blog':
        return 'Article';
      case 'solution':
        return 'Solution';
      default:
        return 'Service';
    }
  };

  if (loading) {
    return (
      <div className={`recommendations-section ${className}`}>
        {showTitle && (
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <FaMagic className="mr-2 text-purple-600" />
            {title}
          </h2>
        )}
        <div className="flex items-center justify-center py-8">
          <FaSpinner className="animate-spin text-2xl text-purple-600 mr-2" />
          <span className="text-gray-600 dark:text-gray-400">Chargement des recommandations...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`recommendations-section ${className}`}>
        {showTitle && (
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <FaMagic className="mr-2 text-purple-600" />
            {title}
          </h2>
        )}
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center">
            <FaExclamationTriangle className="text-red-500 mr-2" />
            <span className="text-red-700 dark:text-red-400">
              Erreur: {error}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className={`recommendations-section ${className}`}>
        {showTitle && (
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <FaMagic className="mr-2 text-purple-600" />
            {title}
          </h2>
        )}
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <FaMagic className="text-4xl mx-auto mb-4 text-gray-300" />
          <p>Aucune recommandation disponible pour le moment.</p>
          <p className="text-sm mt-2">Consultez quelques services pour recevoir des recommandations personnalisées.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`recommendations-section ${className}`}>
      {showTitle && (
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          <FaMagic className="mr-2 text-purple-600" />
          {title}
        </h2>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((item, index) => {
          console.log('📋 Recommandation:', { index, item, itemType: item.item_type });
          return (
          <div
            key={`${item.item_type || 'service'}-${item.id}`}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group"
            onMouseEnter={() => handleItemView(item.id, item.item_type || 'service')}
          >
            {/* Image de l'item */}
            <div className="relative h-48 bg-gradient-to-br from-purple-500 to-blue-600 overflow-hidden">
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-4xl opacity-80">{getItemIcon(item.item_type || 'service')}</span>
                </div>
              )}
              
              {/* Badge type */}
              <div className="absolute top-3 left-3">
                <span className="bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                  {getItemIcon(item.item_type || 'service')} {getItemTypeLabel(item.item_type || 'service')}
                </span>
              </div>
              
              {/* Badge catégorie */}
              {item.category && (
                <div className="absolute top-3 right-3">
                  <span className="bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                    <FaTag className="mr-1" />
                    {item.category}
                  </span>
                </div>
              )}
              
              {/* Badge vues */}
              {item.view_count > 0 && (
                <div className="absolute bottom-3 right-3">
                  <span className="bg-black/50 text-white px-2 py-1 rounded-full text-xs flex items-center">
                    <FaEye className="mr-1" />
                    {item.view_count}
                  </span>
                </div>
              )}
            </div>
            
            {/* Contenu de l'item */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                {item.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                {item.description || item.content || item.excerpt || 'Aucune description disponible'}
              </p>
              
              {/* Actions */}
              <div className="flex items-center justify-between">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('🖱️ Bouton cliqué!', { itemId: item.id, itemType: item.item_type });
                    handleItemClick(item.id, item.item_type || 'service');
                  }}
                  className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium text-sm transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                  style={{ cursor: 'pointer' }}
                >
                  Voir {getItemTypeLabel(item.item_type || 'service').toLowerCase()}
                  <FaArrowRight className="ml-2 text-xs" />
                </button>
                
                <div className="flex items-center text-gray-400 text-xs">
                  <FaClock className="mr-1" />
                  Recommandé
                </div>
              </div>
            </div>
          </div>
          );
        })}
      </div>
      
      {/* Lien vers tous les services */}
      <div className="mt-8 text-center">
        <Link
          to="/services"
          className="inline-flex items-center bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          <FaStar className="mr-2" />
          Découvrir tous nos services
          <FaArrowRight className="ml-2" />
        </Link>
      </div>
    </div>
  );
};

export default RecommendationsSection;
