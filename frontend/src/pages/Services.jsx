import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaShieldAlt, FaNetworkWired, FaCloud, FaUsers, FaCog, FaSearch, 
  FaFilter, FaArrowRight, FaCheckCircle, FaStar, FaClock, FaHeadset,
  FaServer, FaDatabase, FaLock, FaGlobe, FaMobile, FaDesktop,
  FaChartLine, FaTools, FaEye, FaDownload, FaPlay, FaInfoCircle,
  FaSpinner, FaExclamationTriangle, FaTag, FaPlus, FaEdit, FaTrash
} from 'react-icons/fa';
import { useLanguage } from '../contexts/LanguageContext';
import RecommendationsSection from '../components/RecommendationsSection';
import { API_BASE_URL } from "../config/api";


const Services = () => {
  const { lang, getTranslation } = useLanguage();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredServices, setFilteredServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [showModal, setShowModal] = useState(false);

  
  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, []);

  
  useEffect(() => {
    filterServices();
  }, [services, selectedCategory, searchTerm]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/services`);
      
      if (!response.ok) {
        if (response.status === 0 || response.status >= 500) {
          throw new Error('Serveur non disponible. Vérifiez que le backend est démarré sur le port 5000.');
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setServices(result.data);
        setError(null);
      } else {
        throw new Error(result.error || 'Erreur lors de la récupération des services');
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des services:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/services/categories`);
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setCategories(result.data);
        }
      } else {
        console.warn('Impossible de récupérer les catégories, utilisation des catégories par défaut');
        setCategories(['Sécurité', 'Infrastructure', 'Cloud', 'Développement', 'IA']);
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des catégories:', err);
      
      setCategories(['Sécurité', 'Infrastructure', 'Cloud', 'Développement', 'IA']);
    }
  };

  const filterServices = () => {
    let filtered = services;

    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }

    
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(service => 
        service.title.toLowerCase().includes(term) ||
        service.description.toLowerCase().includes(term) ||
        service.category.toLowerCase().includes(term)
      );
    }

    setFilteredServices(filtered);
  };

  const getCategoryIcon = (category) => {
    const iconMap = {
      'Sécurité': <FaShieldAlt className="w-8 h-8" />,
      'Infrastructure': <FaNetworkWired className="w-8 h-8" />,
      'Cloud': <FaCloud className="w-8 h-8" />,
      'Développement': <FaDesktop className="w-8 h-8" />,
      'IA': <FaChartLine className="w-8 h-8" />,
      'default': <FaCog className="w-8 h-8" />
    };
    return iconMap[category] || iconMap.default;
  };

  const getCategoryColor = (category) => {
    const colorMap = {
      'Sécurité': 'from-red-500 to-red-600',
      'Infrastructure': 'from-blue-500 to-blue-600',
      'Cloud': 'from-green-500 to-green-600',
      'Développement': 'from-purple-500 to-purple-600',
      'IA': 'from-indigo-500 to-indigo-600',
      'default': 'from-gray-500 to-gray-600'
    };
    return colorMap[category] || colorMap.default;
  };

  const getCategoryBgColor = (category) => {
    const bgColorMap = {
      'Sécurité': 'bg-red-50',
      'Infrastructure': 'bg-blue-50',
      'Cloud': 'bg-green-50',
      'Développement': 'bg-purple-50',
      'IA': 'bg-indigo-50',
      'default': 'bg-gray-50'
    };
    return bgColorMap[category] || bgColorMap.default;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const openServiceModal = (service) => {
    setSelectedService(service);
    setShowModal(true);
    
    document.body.style.overflow = 'hidden';
  };

  const closeServiceModal = () => {
    setShowModal(false);
    setSelectedService(null);
    
    document.body.style.overflow = 'unset';
  };


  
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeServiceModal();
      }
    };

    if (showModal) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showModal]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <FaSpinner className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Chargement des services...
            </h2>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <FaExclamationTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-800 dark:text-red-200 mb-4">
              Erreur lors du chargement
            </h2>
            <p className="text-red-600 dark:text-red-300 mb-6">{error}</p>
            <button 
              onClick={fetchServices}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800 pt-20 relative overflow-hidden">
      {}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        {}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200/20 dark:border-blue-800/20 mb-6 animate-fade-in-up">
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">✨ Services Premium</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 dark:from-white dark:via-blue-100 dark:to-indigo-100 mb-8 animate-fade-in-up">
            {getTranslation('services.title') || 'Nos Services'}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed animate-fade-in-up delay-200">
            {getTranslation('services.subtitle') || 'Découvrez nos solutions sur-mesure pour votre transformation digitale'}
          </p>
          <div className="mt-8 flex justify-center">
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-fade-in-up delay-300"></div>
          </div>
        </div>


        {}
        <div className="mb-16">
          <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">
            {}
            <div className="relative flex-1 max-w-lg group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-sm group-hover:blur-md transition-all duration-300"></div>
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder="Rechercher un service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 border-2 border-gray-200/50 dark:border-gray-700/50 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-600"
              />
              </div>
            </div>

            {}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === 'all'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm'
                }`}
              >
                Tous
              </button>
              {categories.map((category, index) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 animate-fade-in-up ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                      : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {}
        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-3xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
              <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 text-center border border-white/20 dark:border-gray-700/20 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <FaServer className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 mb-2">
                {services.length}
                </div>
                <div className="text-gray-600 dark:text-gray-300 font-semibold">Services disponibles</div>
              </div>
            </div>
            
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-3xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
              <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 text-center border border-white/20 dark:border-gray-700/20 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <FaTag className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 mb-2">
                {categories.length}
                </div>
                <div className="text-gray-600 dark:text-gray-300 font-semibold">Catégories</div>
              </div>
            </div>
            
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
              <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 text-center border border-white/20 dark:border-gray-700/20 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <FaFilter className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 mb-2">
                {filteredServices.length}
                </div>
                <div className="text-gray-600 dark:text-gray-300 font-semibold">Services filtrés</div>
              </div>
            </div>
          </div>
        </div>

        {}
        {filteredServices.length === 0 ? (
          <div className="text-center py-20">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-400/20 to-gray-600/20 rounded-full blur-2xl"></div>
              <div className="relative w-32 h-32 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center mx-auto mb-8">
                <FaSearch className="w-16 h-16 text-gray-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-4">
              {services.length === 0 ? 'Aucun service disponible' : 'Aucun service trouvé'}
            </h3>
            <p className="text-gray-500 dark:text-gray-500 text-lg max-w-md mx-auto">
              {services.length === 0 
                ? 'Aucun service n\'est disponible pour le moment.' 
                : 'Essayez de modifier vos critères de recherche ou de sélectionner une autre catégorie.'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredServices.map((service, index) => (
              <div
                key={service.id}
                className={`group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 border border-white/20 dark:border-gray-700/20 animate-fade-in-up ${getCategoryBgColor(service.category)}`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {}
                <div className="relative h-56 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
                  <img
                    src={service.image_url || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80'}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                  <div className="absolute top-4 right-4">
                    <span className={`px-4 py-2 rounded-full text-sm font-bold text-white bg-gradient-to-r ${getCategoryColor(service.category)} shadow-lg backdrop-blur-sm border border-white/20`}>
                      {service.category}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                      {getCategoryIcon(service.category)}
                    </div>
                  </div>
                </div>

                {}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {service.title}
                    </h3>

                  <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3 leading-relaxed">
                    {service.description}
                  </p>

                  {}
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-8">
                    <span className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                      <FaClock className="w-4 h-4" />
                      {formatDate(service.created_at)}
                    </span>
                    <span className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                      <FaEye className="w-4 h-4" />
                      ID: {service.id}
                    </span>
                  </div>

                  {}
                  <div className="flex gap-4">
                    <button 
                      onClick={() => openServiceModal(service)}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-4 rounded-2xl font-bold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-3 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      <FaInfoCircle className="w-5 h-5" />
                      Détails
                    </button>
                    <Link
                      to="/services"
                      className="w-14 h-14 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 rounded-2xl hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition-all duration-300 flex items-center justify-center transform hover:scale-105 border border-gray-200 dark:border-gray-600"
                    >
                      <FaArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {}
        <div className="text-center mt-20">
          <div className="relative inline-block group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
          <Link
            to="/contact"
              className="relative inline-flex items-center gap-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-6 rounded-3xl text-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl border border-white/20"
          >
              <FaHeadset className="w-6 h-6" />
            Demander un devis personnalisé
              <FaArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
          </div>
        </div>
      </div>

      {}
      {showModal && selectedService && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-3xl w-full max-h-full overflow-y-auto border border-white/20 dark:border-gray-700/20">
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-4xl font-bold text-gray-800 dark:text-white">
              {selectedService.title}
            </h2>
              <button
                onClick={closeServiceModal}
                className="w-10 h-10 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-2xl flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <FaArrowRight className="w-5 h-5 rotate-45" />
              </button>
            </div>
            
            <div className="mb-8">
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold text-white bg-gradient-to-r ${getCategoryColor(selectedService.category)} mb-4`}>
                {selectedService.category}
              </span>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                {selectedService.description}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                <FaClock className="w-6 h-6 text-blue-500" />
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Créé le</div>
                  <div className="font-semibold text-gray-800 dark:text-white">
                    {formatDate(selectedService.created_at)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                <FaEye className="w-6 h-6 text-purple-500" />
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">ID du service</div>
                  <div className="font-semibold text-gray-800 dark:text-white">
                    #{selectedService.id}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={closeServiceModal}
                className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-4 rounded-2xl font-bold hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-105"
              >
                Fermer
              </button>
              <Link
                to="/contact"
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-4 rounded-2xl font-bold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 text-center"
                onClick={closeServiceModal}
              >
                Demander un devis
              </Link>
            </div>
          </div>
        </div>
      )}

      {}
      <div className="mt-20">
        <RecommendationsSection 
          userId="user_1" 
          title="🔮 Vous pourriez aimer..."
          limit={3}
          algorithm="mixed"
          className="py-12"
        />
      </div>
    </div>
  );
};

export default Services; 