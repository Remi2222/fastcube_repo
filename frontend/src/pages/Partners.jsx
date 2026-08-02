import React, { useState, useEffect } from 'react';
import { 
  FaHandshake, FaBuilding, FaGlobe, FaRocket, FaStar, 
  FaChevronLeft, FaChevronRight, FaExternalLinkAlt,
  FaUsers, FaChartLine, FaShieldAlt, FaLightbulb, FaServer, FaMobile
} from 'react-icons/fa';

const Partners = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  const normalizePartner = (partner) => ({
    id: partner.id,
    name: partner.nom || partner.name,
    logo: partner.logo_url || partner.logo,
    category: partner.secteur_activite || partner.category,
    description: partner.description,
    website: partner.website || partner.website
  });

  
  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/partenaires/actifs');
        
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            
            const normalizedPartners = result.data.map(normalizePartner);
            setPartners(normalizedPartners);
          } else {
            setError(result.error);
          }
        } else {
          setError('Erreur lors de la récupération des partenaires');
        }
      } catch (error) {
        setError('Erreur de connexion');
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  
  const defaultPartners = [
    {
      id: 1,
      name: "TechCorp Solutions",
      logo: "https://picsum.photos/400/300?random=1",
      category: "Technologie",
      description: "Leader en solutions cloud innovantes",
      website: "https://techcorp.com"
    },
    {
      id: 2,
      name: "InnovateSoft",
      logo: "https://picsum.photos/400/300?random=2",
      category: "Développement",
      description: "Expert en développement d'applications",
      website: "https://innovatesoft.com"
    },
    {
      id: 3,
      name: "SecureNet Systems",
      logo: "https://picsum.photos/400/300?random=3",
      category: "Sécurité",
      description: "Protection avancée des données",
      website: "https://securenet.com"
    },
    {
      id: 4,
      name: "CloudFlow",
      logo: "https://picsum.photos/400/300?random=4",
      category: "Infrastructure",
      description: "Solutions cloud haute performance",
      website: "https://cloudflow.com"
    },
    {
      id: 5,
      name: "DataViz Pro",
      logo: "https://picsum.photos/400/300?random=5",
      category: "Analytics",
      description: "Visualisation de données intelligente",
      website: "https://datavizpro.com"
    },
    {
      id: 6,
      name: "MobileFirst",
      logo: "https://picsum.photos/400/300?random=6",
      category: "Mobile",
      description: "Applications mobiles sur-mesure",
      website: "https://mobilefirst.com"
    },
    {
      id: 7,
      name: "AI Solutions",
      logo: "https://picsum.photos/400/300?random=7",
      category: "Intelligence Artificielle",
      description: "Solutions IA révolutionnaires",
      website: "https://aisolutions.com"
    },
    {
      id: 8,
      name: "DigitalBridge",
      logo: "https://picsum.photos/400/300?random=8",
      category: "Transformation Digitale",
      description: "Accompagnement vers le digital",
      website: "https://digitalbridge.com"
    }
  ];

  
  const displayPartners = partners.length > 0 ? partners : defaultPartners;
  
  
  console.log('🤖 Partenaires API:', partners);
  console.log('📋 Partenaires par défaut:', defaultPartners);
  console.log('🎯 Partenaires à afficher:', displayPartners);

  
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.ceil(displayPartners.length / 4));
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, displayPartners.length]);

  
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(displayPartners.length / 4));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => 
      prev === 0 ? Math.ceil(displayPartners.length / 4) - 1 : prev - 1
    );
  };

  
  const getCurrentPartners = () => {
    const startIndex = currentSlide * 4;
    return displayPartners.slice(startIndex, startIndex + 4);
  };

  
  const getCategoryIcon = (category) => {
    const iconMap = {
      'Technologie': <FaRocket className="w-4 h-4" />,
      'Développement': <FaBuilding className="w-4 h-4" />,
      'Sécurité': <FaShieldAlt className="w-4 h-4" />,
      'Infrastructure': <FaServer className="w-4 h-4" />,
      'Analytics': <FaChartLine className="w-4 h-4" />,
      'Mobile': <FaMobile className="w-4 h-4" />,
      'Intelligence Artificielle': <FaLightbulb className="w-4 h-4" />,
      'Transformation Digitale': <FaGlobe className="w-4 h-4" />
    };
    return iconMap[category] || <FaBuilding className="w-4 h-4" />;
  };

  
  const isValidImage = (url) => {
    
    console.log('🔍 Vérification image:', url);
    
    const isValid = url && (url.startsWith('http://') || url.startsWith('https://')) && !url.includes('undefined');
    console.log('✅ Image valide:', isValid);
    
    return isValid;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-20">
      
      {}
      <section className="relative py-32 lg:py-40 overflow-hidden">
        {}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            {}
            <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 dark:from-blue-900/40 dark:via-indigo-900/40 dark:to-purple-900/40 text-blue-700 dark:text-blue-300 rounded-2xl text-sm font-bold shadow-2xl border border-blue-200/50 dark:border-blue-700/50 backdrop-blur-sm mb-10">
              <FaHandshake className="w-5 h-5 mr-3 animate-bounce-gentle" />
              Partenariats Stratégiques
            </div>
            
            {}
            <h1 className="text-6xl lg:text-7xl font-black text-gray-900 dark:text-white mb-10 leading-tight">
              Ils nous font{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                confiance
              </span>
            </h1>
            
            {}
            <p className="text-2xl lg:text-3xl text-gray-600 dark:text-gray-300 leading-relaxed mb-12 max-w-4xl mx-auto font-medium">
              Découvrez nos partenaires de confiance qui nous accompagnent dans l'innovation et l'excellence technologique
            </p>

            {}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl rounded-3xl p-8 text-center shadow-2xl border border-gray-100/50 dark:border-gray-600/50 hover:shadow-3xl transition-all duration-500 hover:scale-105 group">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                  <FaHandshake className="w-10 h-10 text-white" />
                </div>
                <div className="text-5xl font-black text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform duration-500">
                  {displayPartners.length}+
                </div>
                <div className="text-xl text-gray-600 dark:text-gray-300 font-bold">Partenaires</div>
              </div>
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl rounded-3xl p-8 text-center shadow-2xl border border-gray-100/50 dark:border-gray-600/50 hover:shadow-3xl transition-all duration-500 hover:scale-105 group">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                  <FaUsers className="w-10 h-10 text-white" />
                </div>
                <div className="text-5xl font-black text-green-600 dark:text-green-400 mb-4 group-hover:scale-110 transition-transform duration-500">
                  8
                </div>
                <div className="text-xl text-gray-600 dark:text-gray-300 font-bold">Secteurs d'activité</div>
              </div>
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl rounded-3xl p-8 text-center shadow-2xl border border-gray-100/50 dark:border-gray-600/50 hover:shadow-3xl transition-all duration-500 hover:scale-105 group">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                  <FaStar className="w-10 h-10 text-white" />
                </div>
                <div className="text-5xl font-black text-purple-600 dark:text-purple-400 mb-4 group-hover:scale-110 transition-transform duration-500">
                  100%
                </div>
                <div className="text-xl text-gray-600 dark:text-gray-300 font-bold">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section des Partenaires */}
      <section className="py-20 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-400/8 to-indigo-400/8 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tr from-purple-400/8 to-pink-400/8 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          {/* Grille des Partenaires - Version Desktop */}
          <div className="hidden lg:block">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Chargement des partenaires...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-500 text-lg mb-4">⚠️ Erreur de chargement</div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
                <p className="text-sm text-gray-500">Affichage des partenaires par défaut</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {displayPartners.map((partner, index) => (
                  <div
                    key={partner.id}
                    className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden transition-all duration-700 hover:shadow-3xl hover:-translate-y-4 hover:scale-105 border border-gray-100/50 dark:border-gray-600/50 animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Logo du partenaire */}
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
                      {isValidImage(partner.logo) ? (
                        <img
                          src={partner.logo}
                          alt={partner.name}
                          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 filter grayscale group-hover:grayscale-0"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      {/* Fallback si l'image ne charge pas ou n'existe pas */}
                      <div 
                        className={`w-full h-full items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 ${isValidImage(partner.logo) ? 'hidden' : 'flex'}`}
                      >
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3">
                            <FaBuilding className="w-8 h-8 text-white" />
                          </div>
                          <p className="text-blue-600 dark:text-blue-400 font-semibold text-sm">{partner.name}</p>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      {/* Badge de catégorie */}
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2 shadow-lg">
                          {getCategoryIcon(partner.category)}
                          {partner.category}
                        </span>
                      </div>
                    </div>

                    {/* Informations du partenaire */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3 group-hover:text-blue-600 transition-colors">
                        {partner.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                        {partner.description}
                      </p>
                      
                      {/* Lien vers le site */}
                      <a
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm transition-colors group/link"
                      >
                        Visiter le site
                        <FaExternalLinkAlt className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Carrousel des Partenaires - Version Mobile/Tablet */}
          <div className="lg:hidden">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Chargement des partenaires...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-500 text-lg mb-4">⚠️ Erreur de chargement</div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
                <p className="text-sm text-gray-500">Affichage des partenaires par défaut</p>
              </div>
            ) : (
              <div 
                className="relative overflow-hidden"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {/* Conteneur du carrousel */}
                <div className="flex transition-transform duration-500 ease-in-out">
                  {getCurrentPartners().map((partner, index) => (
                    <div key={partner.id} className="w-full flex-shrink-0 px-2">
                      <div className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 hover:shadow-3xl hover:-translate-y-2 border border-gray-100/50 dark:border-gray-600/50">
                        {/* Logo du partenaire */}
                        <div className="relative h-40 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
                          {isValidImage(partner.logo) ? (
                            <img
                              src={partner.logo}
                              alt={partner.name}
                              className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 filter grayscale group-hover:grayscale-0"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          {/* Fallback si l'image ne charge pas ou n'existe pas */}
                          <div 
                            className={`w-full h-full items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 ${isValidImage(partner.logo) ? 'hidden' : 'flex'}`}
                          >
                            <div className="text-center">
                              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-2">
                                <FaBuilding className="w-6 h-6 text-white" />
                              </div>
                              <p className="text-blue-600 dark:text-blue-400 font-semibold text-xs">{partner.name}</p>
                            </div>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          
                          {/* Badge de catégorie */}
                          <div className="absolute top-3 right-3">
                            <span className="px-2 py-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1 shadow-lg">
                              {getCategoryIcon(partner.category)}
                              {partner.category}
                            </span>
                          </div>
                        </div>

                        {/* Informations du partenaire */}
                        <div className="p-4">
                          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
                            {partner.name}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-3">
                            {partner.description}
                          </p>
                          
                          {/* Lien vers le site */}
                          <a
                            href={partner.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm transition-colors group/link"
                          >
                            Visiter le site
                            <FaExternalLinkAlt className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Navigation du carrousel */}
                <div className="flex justify-center mt-8 space-x-4">
                  <button
                    onClick={prevSlide}
                    className="w-12 h-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <FaChevronLeft className="w-5 h-5" />
                  </button>
                  
                  {/* Indicateurs de slide */}
                  <div className="flex space-x-2">
                    {Array.from({ length: Math.ceil(displayPartners.length / 4) }).map((_, index) => (
                      <button
                        key={`_-item-${index}`}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentSlide
                            ? 'bg-blue-600 dark:bg-blue-400 scale-125'
                            : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={nextSlide}
                    className="w-12 h-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <FaChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-white/20 opacity-50"></div>
          <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-white/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-8">
            Devenez notre partenaire
          </h2>
          <p className="text-xl lg:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            Rejoignez notre réseau de partenaires et participez à l'innovation technologique de demain
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 hover:bg-gray-100 font-bold text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl">
              <FaHandshake className="w-6 h-6 mr-3" />
              Devenir partenaire
            </button>
            <button className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-white border-2 border-white/30 hover:border-white/50 font-bold text-lg rounded-2xl transition-all duration-300 transform hover:scale-105">
              En savoir plus
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Partners; 