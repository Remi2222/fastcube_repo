import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaSearch, FaFilter, FaRocket, FaLightbulb, FaCheckCircle, 
  FaStar, FaClock, FaArrowRight, FaDownload, FaPlay, FaInfoCircle,
  FaSpinner, FaExclamationTriangle, FaChartLine, FaCog, FaShieldAlt,
  FaCloud, FaUsers, FaServer, FaDatabase, FaLock, FaGlobe, FaMobile,
  FaDesktop, FaTools, FaEye, FaCalendarAlt, FaTag, FaCheck
} from 'react-icons/fa';

const SolutionsDisplay = () => {
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [filteredSolutions, setFilteredSolutions] = useState([]);

  // Récupérer toutes les solutions
  const fetchSolutions = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/solutions');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSolutions(data.data || []);
      setFilteredSolutions(data.data || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des solutions:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Récupérer les catégories
  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/solutions/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.data || []);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
    }
  };

  useEffect(() => {
    fetchSolutions();
    fetchCategories();
  }, []);

  // Filtrer les solutions
  useEffect(() => {
    let filtered = solutions;

    // Filtre par catégorie
    if (selectedCategory) {
      filtered = filtered.filter(solution => solution.category === selectedCategory);
    }

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(solution =>
        solution.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        solution.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        solution.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredSolutions(filtered);
  }, [solutions, selectedCategory, searchTerm]);

  // Formater les features JSON
  const formatFeatures = (features) => {
    if (!features) return [];
    try {
      return typeof features === 'string' ? JSON.parse(features) : features;
    } catch {
      return [];
    }
  };

  // Formater le statut
  const formatStatus = (status) => {
    const statusMap = {
      'active': { text: 'Active', color: 'from-green-500 to-emerald-500', bgColor: 'bg-green-50 dark:bg-green-900/20' },
      'inactive': { text: 'Inactive', color: 'from-red-500 to-pink-500', bgColor: 'bg-red-50 dark:bg-red-900/20' },
      'coming_soon': { text: 'Bientôt disponible', color: 'from-yellow-500 to-orange-500', bgColor: 'bg-yellow-50 dark:bg-yellow-900/20' }
    };
    return statusMap[status] || { text: status, color: 'from-gray-500 to-gray-600', bgColor: 'bg-gray-50 dark:bg-gray-900/20' };
  };

  // Obtenir l'icône de catégorie
  const getCategoryIcon = (category) => {
    const iconMap = {
      'Sécurité': <FaShieldAlt className="w-6 h-6" />,
      'Infrastructure': <FaServer className="w-6 h-6" />,
      'Cloud': <FaCloud className="w-6 h-6" />,
      'Développement': <FaDesktop className="w-6 h-6" />,
      'IA': <FaChartLine className="w-6 h-6" />,
      'Mobile': <FaMobile className="w-6 h-6" />,
      'Web': <FaGlobe className="w-6 h-6" />,
      'Database': <FaDatabase className="w-6 h-6" />,
      'Data & Analytics': <FaDatabase className="w-6 h-6" />,
      'Finance & Performance': <FaChartLine className="w-6 h-6" />,
      'Intelligence Artificielle': <FaChartLine className="w-6 h-6" />,
      'Transformation Digitale': <FaDesktop className="w-6 h-6" />,
      'IoT': <FaServer className="w-6 h-6" />,
      'default': <FaCog className="w-6 h-6" />
    };
    return iconMap[category] || iconMap.default;
  };

  // Obtenir la couleur de catégorie
  const getCategoryColor = (category) => {
    const colorMap = {
      'Sécurité': 'from-red-500 to-red-600',
      'Infrastructure': 'from-blue-500 to-blue-600',
      'Cloud': 'from-green-500 to-green-600',
      'Développement': 'from-purple-500 to-purple-600',
      'IA': 'from-indigo-500 to-indigo-600',
      'Mobile': 'from-pink-500 to-pink-600',
      'Web': 'from-cyan-500 to-cyan-600',
      'Database': 'from-orange-500 to-orange-600',
      'Data & Analytics': 'from-blue-500 to-blue-600',
      'Finance & Performance': 'from-green-500 to-green-600',
      'Intelligence Artificielle': 'from-indigo-500 to-indigo-600',
      'Transformation Digitale': 'from-purple-500 to-purple-600',
      'IoT': 'from-orange-500 to-orange-600',
      'default': 'from-gray-500 to-gray-600'
    };
    return colorMap[category] || colorMap.default;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-32">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <FaSpinner className="w-12 h-12 text-white animate-spin" />
          </div>
          <h2 className="text-4xl font-black text-gray-800 dark:text-white mb-4">
            Chargement des solutions...
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Veuillez patienter pendant que nous récupérons nos solutions
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-32">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <FaExclamationTriangle className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-4xl font-black text-red-800 dark:text-red-200 mb-6">
            Erreur de chargement
          </h2>
          <p className="text-xl text-red-600 dark:text-red-300 mb-10 max-w-2xl mx-auto">{error}</p>
          <button 
            onClick={fetchSolutions}
            className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl"
          >
            <FaRocket className="w-5 h-5 mr-3" />
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      
      {/* Filtres et recherche - Modern Design */}
      <div className="mb-16">
        <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">
          {/* Recherche - Enhanced */}
          <div className="relative flex-1 max-w-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-2xl blur-xl"></div>
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-500 w-6 h-6" />
              <input
                type="text"
                placeholder="Rechercher une solution..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-4 border-2 border-emerald-200 dark:border-emerald-700 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white text-lg font-medium backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300"
              />
            </div>
          </div>

          {/* Filtres par catégorie - Enhanced */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-6 py-3 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                selectedCategory === ''
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-2xl'
                  : 'bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border-2 border-gray-200/50 dark:border-gray-600/50 backdrop-blur-xl shadow-lg hover:shadow-xl'
              }`}
            >
              Toutes
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-2xl'
                    : 'bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border-2 border-gray-200/50 dark:border-gray-600/50 backdrop-blur-xl shadow-lg hover:shadow-xl'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Statistiques - Enhanced Cards */}
      <div className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl rounded-3xl p-8 text-center shadow-2xl border border-gray-100/50 dark:border-gray-600/50 hover:shadow-3xl transition-all duration-500 hover:scale-105 group">
            <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 shadow-2xl">
              <FaRocket className="w-10 h-10 text-white" />
            </div>
            <div className="text-5xl font-black text-emerald-600 dark:text-emerald-400 mb-4 group-hover:scale-110 transition-transform duration-500">
              {solutions.length}
            </div>
            <div className="text-xl text-gray-600 dark:text-gray-300 font-bold">Solutions totales</div>
          </div>
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl rounded-3xl p-8 text-center shadow-2xl border border-gray-100/50 dark:border-gray-600/50 hover:shadow-3xl transition-all duration-500 hover:scale-105 group">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 shadow-2xl">
              <FaCheckCircle className="w-10 h-10 text-white" />
            </div>
            <div className="text-5xl font-black text-green-600 dark:text-green-400 mb-4 group-hover:scale-110 transition-transform duration-500">
              {solutions.filter(s => s.status === 'active').length}
            </div>
            <div className="text-xl text-gray-600 dark:text-gray-300 font-bold">Solutions actives</div>
          </div>
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl rounded-3xl p-8 text-center shadow-2xl border border-gray-100/50 dark:border-gray-600/50 hover:shadow-3xl transition-all duration-500 hover:scale-105 group">
            <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 shadow-2xl">
              <FaClock className="w-10 h-10 text-white" />
            </div>
            <div className="text-5xl font-black text-yellow-600 dark:text-yellow-400 mb-4 group-hover:scale-110 transition-transform duration-500">
              {solutions.filter(s => s.status === 'coming_soon').length}
            </div>
            <div className="text-xl text-gray-600 dark:text-gray-300 font-bold">Bientôt disponibles</div>
          </div>
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl rounded-3xl p-8 text-center shadow-2xl border border-gray-100/50 dark:border-gray-600/50 hover:shadow-3xl transition-all duration-500 hover:scale-105 group">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 shadow-2xl">
              <FaLightbulb className="w-10 h-10 text-white" />
            </div>
            <div className="text-5xl font-black text-purple-600 dark:text-purple-400 mb-4 group-hover:scale-110 transition-transform duration-500">
              {categories.length}
            </div>
            <div className="text-xl text-gray-600 dark:text-gray-300 font-bold">Catégories</div>
          </div>
        </div>
      </div>

      {/* Grille des solutions - Enhanced */}
      {filteredSolutions.length === 0 ? (
        <div className="text-center py-32">
          <div className="w-32 h-32 bg-gradient-to-r from-gray-400 to-gray-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <FaSearch className="w-16 h-16 text-white" />
          </div>
          <h3 className="text-3xl font-black text-gray-600 dark:text-gray-400 mb-4">
            Aucune solution trouvée
          </h3>
          <p className="text-xl text-gray-500 dark:text-gray-500 max-w-2xl mx-auto">
            Essayez de modifier vos critères de recherche
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10">
          {filteredSolutions.map((solution, index) => (
            <div 
              key={solution.id || `solution-${index}`} 
              className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden transition-all duration-700 hover:shadow-3xl hover:-translate-y-4 hover:scale-105 border border-gray-100/50 dark:border-gray-600/50 hover:border-emerald-300/50 dark:hover:border-emerald-600/50"
            >
              {/* Image du service - Enhanced */}
              <div className="relative h-56 overflow-hidden">
                {solution.image_url ? (
                  <img 
                    src={solution.image_url} 
                    alt={solution.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                    <div className="text-white text-8xl">🚀</div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Badge de statut */}
                <div className="absolute top-4 right-4">
                  <span className={`px-4 py-2 rounded-2xl text-sm font-bold text-white bg-gradient-to-r ${formatStatus(solution.status).color} shadow-lg`}>
                    {formatStatus(solution.status).text}
                  </span>
                </div>

                {/* Badge de catégorie */}
                <div className="absolute top-4 left-4">
                  <span className={`px-4 py-2 rounded-2xl text-sm font-bold text-white bg-gradient-to-r ${getCategoryColor(solution.category)} shadow-lg`}>
                    {solution.category}
                  </span>
                </div>
              </div>

              {/* Contenu du service - Enhanced */}
              <div className="p-8">
                {/* En-tête avec icône */}
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 bg-gradient-to-r ${getCategoryColor(solution.category)} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                    <div className="text-white">
                      {getCategoryIcon(solution.category)}
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-gray-800 dark:text-white leading-tight">
                    {solution.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg leading-relaxed font-medium">
                  {solution.description}
                </p>

                {/* Features */}
                {solution.features && (
                  <div className="mb-6">
                    <h4 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                      <FaCheck className="w-5 h-5 text-emerald-500" />
                      Fonctionnalités clés
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {formatFeatures(solution.features).slice(0, 3).map((feature, index) => (
                        <span key={`${solution.id || 'solution-' + index}-feature-${index}`} className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 text-sm px-3 py-1 rounded-xl font-medium">
                          {feature}
                        </span>
                      ))}
                      {formatFeatures(solution.features).length > 3 && (
                        <span key={`${solution.id || 'solution-' + index}-more-features`} className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm px-3 py-1 rounded-xl font-medium">
                          +{formatFeatures(solution.features).length - 3} autres
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Bénéfices */}
                {solution.benefits && (
                  <div className="mb-6">
                    <h4 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                      <FaStar className="w-5 h-5 text-yellow-500" />
                      Bénéfices
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {formatFeatures(solution.benefits).slice(0, 3).map((benefit, index) => (
                        <span key={`${solution.id || 'solution-' + index}-benefit-${index}`} className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 text-sm px-3 py-1 rounded-xl font-medium">
                          {benefit}
                        </span>
                      ))}
                      {formatFeatures(solution.benefits).length > 3 && (
                        <span key={`${solution.id || 'solution-' + index}-more-benefits`} className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm px-3 py-1 rounded-xl font-medium">
                          +{formatFeatures(solution.benefits).length - 3} autres
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Prix */}
                {solution.pricing_info && (
                  <div className="mb-8">
                    <h4 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                      <FaTag className="w-5 h-5 text-purple-500" />
                      Tarification
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 text-base font-medium">
                      {solution.pricing_info}
                    </p>
                  </div>
                )}

                {/* Actions - Enhanced avec Navigation */}
                <div className="flex gap-4">
                  <Link
                    to={`/solutions/${solution.id}`}
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <FaInfoCircle className="w-5 h-5" />
                    En savoir plus
                  </Link>
                  <button className="w-16 h-16 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 hover:from-emerald-100 hover:to-emerald-200 dark:hover:from-emerald-800 dark:hover:to-emerald-700 text-gray-700 dark:text-gray-300 rounded-2xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 group-hover:rotate-12">
                    <FaArrowRight className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination et statistiques - Enhanced */}
      {filteredSolutions.length > 0 && (
        <div className="mt-20 text-center">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-gray-100/50 dark:border-gray-600/50">
            <div className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Affichage de {filteredSolutions.length} solution{filteredSolutions.length > 1 ? 's' : ''} sur {solutions.length}
            </div>
            <div className="text-gray-600 dark:text-gray-300 text-lg">
              Découvrez toutes nos solutions pour transformer votre entreprise
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SolutionsDisplay;
