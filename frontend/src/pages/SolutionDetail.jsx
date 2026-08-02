import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, FaRocket, FaLightbulb, FaCheckCircle, 
  FaStar, FaClock, FaDownload, FaPlay, FaInfoCircle,
  FaSpinner, FaExclamationTriangle, FaChartLine, FaCog, FaShieldAlt,
  FaCloud, FaUsers, FaServer, FaDatabase, FaLock, FaGlobe, FaMobile,
  FaDesktop, FaTools, FaEye, FaCalendarAlt, FaTag, FaCheck,
  FaHeadset, FaEnvelope, FaPhone, FaMapMarkerAlt, FaExternalLinkAlt
} from 'react-icons/fa';

const SolutionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [solution, setSolution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedSolutions, setRelatedSolutions] = useState([]);

  
  const fetchSolution = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/solutions/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSolution(data.data || null);
      
      
      if (data.data?.category) {
        fetchRelatedSolutions(data.data.category, data.data.id);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de la solution:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  
  const fetchRelatedSolutions = async (category, currentId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/solutions?category=${category}`);
      if (response.ok) {
        const data = await response.json();
        const related = (data.data || []).filter(s => s.id !== currentId).slice(0, 3);
        setRelatedSolutions(related);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des solutions connexes:', error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchSolution();
    }
  }, [id]);

  
  const formatFeatures = (features) => {
    if (!features) return [];
    try {
      return typeof features === 'string' ? JSON.parse(features) : features;
    } catch {
      return [];
    }
  };

  
  const formatStatus = (status) => {
    const statusMap = {
      'active': { text: 'Active', color: 'from-green-500 to-emerald-500', bgColor: 'bg-green-50 dark:bg-green-900/20' },
      'inactive': { text: 'Inactive', color: 'from-red-500 to-pink-500', bgColor: 'bg-red-50 dark:bg-red-900/20' },
      'coming_soon': { text: 'Bientôt disponible', color: 'from-yellow-500 to-orange-500', bgColor: 'bg-yellow-50 dark:bg-yellow-900/20' }
    };
    return statusMap[status] || { text: status, color: 'from-gray-500 to-gray-600', bgColor: 'bg-gray-50 dark:bg-gray-900/20' };
  };

  
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
      'default': <FaCog className="w-6 h-6" />
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
      'Mobile': 'from-pink-500 to-pink-600',
      'Web': 'from-cyan-500 to-cyan-600',
      'Database': 'from-orange-500 to-orange-600',
      'default': 'from-gray-500 to-gray-600'
    };
    return colorMap[category] || colorMap.default;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/20 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-20">
        <div className="max-w-7xl mx-auto px-6 py-32">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
              <FaSpinner className="w-12 h-12 text-white animate-spin" />
            </div>
            <h2 className="text-4xl font-black text-gray-800 dark:text-white mb-4">
              Chargement de la solution...
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Veuillez patienter pendant que nous récupérons les détails
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !solution) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/20 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-20">
        <div className="max-w-7xl mx-auto px-6 py-32">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
              <FaExclamationTriangle className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-4xl font-black text-red-800 dark:text-red-200 mb-6">
              Solution non trouvée
            </h2>
            <p className="text-xl text-red-600 dark:text-red-300 mb-10 max-w-2xl mx-auto">
              {error || 'La solution demandée n\'existe pas ou a été supprimée.'}
            </p>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => navigate(-1)}
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl"
              >
                <FaArrowLeft className="w-5 h-5 mr-3" />
                Retour
              </button>
              <Link
                to="/solutions"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl"
              >
                <FaRocket className="w-5 h-5 mr-3" />
                Voir toutes les solutions
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/20 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-20">
      
      {}
      <section className="relative py-32 lg:py-40 overflow-hidden">
        {}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-green-400/10 to-emerald-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {}
          <div className="mb-12">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-3 px-6 py-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <FaArrowLeft className="w-5 h-5" />
              Retour
            </button>
          </div>

          {}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {}
            <div>
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-100 via-teal-100 to-cyan-100 dark:from-emerald-900/40 dark:via-teal-900/40 dark:to-cyan-900/40 text-emerald-700 dark:text-emerald-300 rounded-2xl text-sm font-bold shadow-2xl border border-emerald-200/50 dark:border-emerald-700/50 backdrop-blur-sm mb-8">
                <div className={`w-5 h-5 bg-gradient-to-r ${getCategoryColor(solution.category)} rounded-full mr-3`}></div>
                {solution.category}
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-8 leading-tight">
                {solution.title}
              </h1>
              
              <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8 font-medium">
                {solution.description}
              </p>

              {}
              <div className="flex flex-wrap gap-4 mb-8">
                <span className={`px-4 py-2 rounded-2xl text-sm font-bold text-white bg-gradient-to-r ${formatStatus(solution.status).color} shadow-lg`}>
                  {formatStatus(solution.status).text}
                </span>
                <span className="px-4 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl text-sm font-medium text-gray-700 dark:text-gray-300 shadow-lg">
                  ID: {solution.id}
                </span>
              </div>

              {}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl"
                >
                  <FaHeadset className="w-5 h-5 mr-3" />
                  Demander un devis
                </Link>
                <button className="inline-flex items-center justify-center px-8 py-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl text-gray-700 dark:text-gray-300 font-bold text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border border-gray-200/50 dark:border-gray-600/50">
                  <FaDownload className="w-5 h-5 mr-3" />
                  Télécharger la brochure
                </button>
              </div>
            </div>

            {}
            <div className="relative">
              <div className="relative h-96 rounded-3xl overflow-hidden shadow-3xl">
                {solution.image_url ? (
                  <img 
                    src={solution.image_url} 
                    alt={solution.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                    <div className="text-white text-9xl">🚀</div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              </div>
              
              {}
              <div className={`absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r ${getCategoryColor(solution.category)} rounded-2xl flex items-center justify-center shadow-2xl z-10`}>
                <div className="text-white text-lg">
                  {getCategoryIcon(solution.category)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {}
      <section className="py-20 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl relative overflow-hidden">
        {}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-emerald-400/8 to-teal-400/8 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tr from-cyan-400/8 to-blue-400/8 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {}
            <div className="lg:col-span-2 space-y-12">
              
              {}
              {solution.features && (
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-gray-100/50 dark:border-gray-600/50">
                  <h2 className="text-3xl font-black text-gray-800 dark:text-white mb-8 flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <FaCheck className="w-6 h-6 text-white" />
                    </div>
                    Fonctionnalités clés
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formatFeatures(solution.features).map((feature, index) => (
                      <div key={`feature-item-${index}`} className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl">
                        <FaCheck className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300 font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {}
              {solution.benefits && (
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-gray-100/50 dark:border-gray-600/50">
                  <h2 className="text-3xl font-black text-gray-800 dark:text-white mb-8 flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <FaStar className="w-6 h-6 text-white" />
                    </div>
                    Bénéfices
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                    {solution.benefits}
                  </p>
                </div>
              )}

              {}
              {solution.pricing_info && (
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-gray-100/50 dark:border-gray-600/50">
                  <h2 className="text-3xl font-black text-gray-800 dark:text-white mb-8 flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <FaTag className="w-6 h-6 text-white" />
                    </div>
                    Tarification
                  </h2>
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6">
                    <p className="text-xl text-gray-700 dark:text-gray-300 font-bold">
                      {solution.pricing_info}
                    </p>
                  </div>
                </div>
              )}

              {}
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-gray-100/50 dark:border-gray-600/50">
                <h2 className="text-3xl font-black text-gray-800 dark:text-white mb-8 flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <FaInfoCircle className="w-6 h-6 text-white" />
                  </div>
                  Informations techniques
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
                    <FaTag className="w-5 h-5 text-blue-500" />
                    <div>
                      <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">Catégorie</div>
                      <div className="text-gray-700 dark:text-gray-300 font-bold">{solution.category}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-2xl">
                    <FaCheckCircle className="w-5 h-5 text-green-500" />
                    <div>
                      <div className="text-sm text-green-600 dark:text-green-400 font-medium">Statut</div>
                      <div className="text-gray-700 dark:text-gray-300 font-bold">{formatStatus(solution.status).text}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {}
            <div className="space-y-8">
              
              {}
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 text-white shadow-2xl">
                <h3 className="text-2xl font-black mb-4">Prêt à commencer ?</h3>
                <p className="text-emerald-100 mb-6">
                  Contactez-nous pour discuter de vos besoins et obtenir un devis personnalisé.
                </p>
                <div className="space-y-3">
                  <Link
                    to="/contact"
                    className="w-full bg-white text-emerald-600 hover:bg-gray-100 px-6 py-3 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    <FaHeadset className="w-5 h-5" />
                    Demander un devis
                  </Link>
                  <button className="w-full bg-emerald-600/20 hover:bg-emerald-600/30 text-white px-6 py-3 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-3">
                    <FaDownload className="w-5 h-5" />
                    Télécharger la brochure
                  </button>
                </div>
              </div>

              {}
              {relatedSolutions.length > 0 && (
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl border border-gray-100/50 dark:border-gray-600/50">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Solutions connexes</h3>
                  <div className="space-y-3">
                    {relatedSolutions.map((related) => (
                      <Link
                        key={related.id}
                        to={`/solutions/${related.id}`}
                        className="block p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300"
                      >
                        <div className="font-medium text-gray-800 dark:text-white mb-1">{related.title}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{related.category}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {}
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl border border-gray-100/50 dark:border-gray-600/50">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Contact rapide</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                    <FaPhone className="w-4 h-4 text-emerald-500" />
                    <span>+212 6 43 77 66 35</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                    <FaEnvelope className="w-4 h-4 text-emerald-500" />
                    <span>contact@fastcube.ma</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                    <FaMapMarkerAlt className="w-4 h-4 text-emerald-500" />
                    <span>Casablanca, Maroc</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {}
      {relatedSolutions.length > 0 && (
        <section className="py-20 bg-gradient-to-br from-gray-50 via-emerald-50/40 to-teal-50/40 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-gray-800 dark:text-white mb-4">
                Découvrez aussi
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                D'autres solutions qui pourraient vous intéresser
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedSolutions.map((related) => (
                <Link
                  key={related.id}
                  to={`/solutions/${related.id}`}
                  className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 hover:shadow-3xl hover:-translate-y-2 border border-gray-100/50 dark:border-gray-600/50"
                >
                  <div className="h-48 bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                    <div className="text-white text-6xl">🚀</div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 group-hover:text-emerald-600 transition-colors">
                      {related.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      {related.description?.substring(0, 100)}...
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                        {related.category}
                      </span>
                      <FaExternalLinkAlt className="w-4 h-4 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default SolutionDetail;
