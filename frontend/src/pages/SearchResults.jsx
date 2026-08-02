import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FaSearch, FaFilter, FaSort, FaTimes, FaArrowLeft, FaEye, FaCalendar, FaTag, FaUser } from 'react-icons/fa';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../utils/translations';
import IntelligentSearch from '../components/IntelligentSearch';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const { lang } = useLanguage();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    sortBy: 'relevance'
  });
  const [showSearchModal, setShowSearchModal] = useState(false);

  const query = searchParams.get('q') || '';

  
  const performSearch = async (searchTerm) => {
    setLoading(true);
    setError(null);

    try {
      
      await new Promise(resolve => setTimeout(resolve, 500));

      
      const searchData = [
        
        {
          type: 'service',
          id: 1,
          title: 'Cybersécurité',
          description: 'Services de protection et de sécurisation de vos systèmes informatiques',
          category: 'Sécurité',
          url: '/services',
          tags: ['sécurité', 'protection', 'audit'],
          relevance: 95
        },
        {
          type: 'service',
          id: 2,
          title: 'Cloud Computing',
          description: 'Solutions cloud sur mesure pour optimiser votre infrastructure',
          category: 'Infrastructure',
          url: '/services',
          tags: ['cloud', 'infrastructure', 'migration'],
          relevance: 88
        },
        {
          type: 'service',
          id: 3,
          title: 'Développement Web',
          description: 'Création d\'applications web modernes et performantes',
          category: 'Développement',
          url: '/services',
          tags: ['développement', 'web', 'applications'],
          relevance: 82
        },

        
        {
          type: 'solution',
          id: 4,
          title: 'SOC Externalisé',
          description: 'Security Operations Center managé pour une protection 24/7',
          category: 'Sécurité',
          url: '/solutions',
          tags: ['SOC', 'sécurité', 'surveillance'],
          relevance: 90
        },
        {
          type: 'solution',
          id: 5,
          title: 'Migration Cloud',
          description: 'Accompagnement complet pour votre migration vers le cloud',
          category: 'Infrastructure',
          url: '/solutions',
          tags: ['migration', 'cloud', 'transformation'],
          relevance: 85
        },

        
        {
          type: 'blog',
          id: 6,
          title: 'Tendances Cybersécurité 2024',
          description: 'Découvrez les nouvelles menaces et solutions de protection',
          category: 'Blog',
          url: '/blog/1',
          tags: ['cybersécurité', 'tendances', '2024'],
          relevance: 92,
          author: 'Équipe FASTCUBE',
          date: '2024-01-15'
        },
        {
          type: 'blog',
          id: 7,
          title: 'SOC Externalisé : Avantages',
          description: 'Pourquoi externaliser votre Security Operations Center',
          category: 'Blog',
          url: '/blog/2',
          tags: ['SOC', 'externalisation', 'avantages'],
          relevance: 87,
          author: 'Expert Sécurité',
          date: '2024-01-10'
        },

        
        {
          type: 'page',
          id: 8,
          title: 'À propos',
          description: 'Découvrez l\'histoire et les valeurs de FASTCUBE',
          category: 'Pages',
          url: '/about',
          tags: ['entreprise', 'histoire', 'valeurs'],
          relevance: 75
        },
        {
          type: 'page',
          id: 9,
          title: 'Contact',
          description: 'Contactez notre équipe d\'experts',
          category: 'Pages',
          url: '/contact',
          tags: ['contact', 'support', 'expertise'],
          relevance: 70
        }
      ];

      
      const filteredResults = searchData.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );

      
      filteredResults.sort((a, b) => b.relevance - a.relevance);

      setResults(filteredResults);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      setError('Erreur lors de la recherche');
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

  
  const filteredResults = results.filter(item => {
    const matchesType = filters.type === 'all' || item.type === filters.type;
    const matchesCategory = filters.category === 'all' || item.category === filters.category;
    return matchesType && matchesCategory;
  });

  
  const sortedResults = [...filteredResults].sort((a, b) => {
    switch (filters.sortBy) {
      case 'relevance':
        return b.relevance - a.relevance;
      case 'title':
        return a.title.localeCompare(b.title);
      case 'date':
        return new Date(b.date || 0) - new Date(a.date || 0);
      default:
        return 0;
    }
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case 'service':
        return '🔧';
      case 'solution':
        return '💡';
      case 'blog':
        return '📝';
      case 'page':
        return '📄';
      default:
        return '🔍';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'service':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'solution':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'blog':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'page':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Recherche en cours...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Erreur</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">{error}</p>
            <button 
              onClick={() => performSearch(query)}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="inline-flex items-center px-4 py-2 bg-transparent hover:bg-gray-100 text-gray-700 hover:text-gray-900 font-medium rounded-lg transition-all duration-200">
                <FaArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Résultats de recherche
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  {sortedResults.length} résultat{sortedResults.length > 1 ? 's' : ''} pour "{query}"
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowSearchModal(true)}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <FaSearch className="w-4 h-4 mr-2" />
              Nouvelle recherche
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <FaFilter className="w-4 h-4 mr-2" />
                Filtres
              </h2>

              {}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Type
                </label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="all">Tous les types</option>
                  <option value="service">Services</option>
                  <option value="solution">Solutions</option>
                  <option value="blog">Blog</option>
                  <option value="page">Pages</option>
                </select>
              </div>

              {}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Catégorie
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="all">Toutes les catégories</option>
                  <option value="Sécurité">Sécurité</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Développement">Développement</option>
                  <option value="Blog">Blog</option>
                  <option value="Pages">Pages</option>
                </select>
              </div>

              {}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Trier par
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="relevance">Pertinence</option>
                  <option value="title">Titre</option>
                  <option value="date">Date</option>
                </select>
              </div>

              {}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Statistiques
                </h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div>Total : {results.length}</div>
                  <div>Affichés : {sortedResults.length}</div>
                  <div>Pertinence : {sortedResults.length > 0 ? Math.round(sortedResults[0].relevance) : 0}%</div>
                </div>
              </div>
            </div>
          </div>

          {}
          <div className="lg:col-span-3">
            {sortedResults.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Aucun résultat trouvé
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                  Essayez avec d'autres mots-clés ou utilisez des termes plus généraux
                </p>
                <button
                  onClick={() => setShowSearchModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  <FaSearch className="w-4 h-4 mr-2" />
                  Nouvelle recherche
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {sortedResults.map((result) => (
                  <div
                    key={`${result.type}-${result.id}`}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="text-2xl">{getTypeIcon(result.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                              <Link to={result.url} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                {result.title}
                              </Link>
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(result.type)}`}>
                                {result.type}
                              </span>
                              <span>{result.category}</span>
                              {result.author && (
                                <span className="flex items-center">
                                  <FaUser className="w-3 h-3 mr-1" />
                                  {result.author}
                                </span>
                              )}
                              {result.date && (
                                <span className="flex items-center">
                                  <FaCalendar className="w-3 h-3 mr-1" />
                                  {new Date(result.date).toLocaleDateString('fr-FR')}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Pertinence
                            </div>
                            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                              {result.relevance}%
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                          {result.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-2">
                            {result.tags.map((tag, index) => (
                              <span
                                key={`tag-item-${index}`}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                              >
                                <FaTag className="w-2 h-2 mr-1" />
                                {tag}
                              </span>
                            ))}
                          </div>
                          
                          <Link
                            to={result.url}
                            className="inline-flex items-center px-3 py-2 bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-medium rounded-lg transition-all duration-200 text-sm"
                          >
                            <FaEye className="w-3 h-3 mr-1" />
                            Voir
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de recherche */}
      <IntelligentSearch
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        placeholder="Rechercher sur tout le site..."
      />
    </div>
  );
} 