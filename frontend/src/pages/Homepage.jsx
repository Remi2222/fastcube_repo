import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaShieldAlt, FaNetworkWired, FaCloud, FaUsers, FaChartLine, FaAward, FaClock, FaCheckCircle, FaRocket, FaLightbulb, FaCog, FaStar } from 'react-icons/fa';
import HeroSlider from '../components/HeroSlider';
import BlogPostCard from '../components/blog/BlogPostCard';
import TestimonialsSection from '../components/TestimonialsSection';
import LeafletMap from '../components/LeafletMap';
import { useLanguage } from '../contexts/LanguageContext';


export default function Homepage() {
  const { lang, getTranslation } = useLanguage();

  
  const blogPosts = [
    {
      id: 1,
      title: "Les tendances cybersécurité 2024",
      excerpt: "Découvrez les nouvelles menaces et solutions de sécurité pour protéger votre entreprise.",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400&q=80",
      date: "2024-01-15",
      author: "FastCube Team",
      tags: ["Cybersécurité", "Tendances", "2024"]
    },
    {
      id: 2,
      title: "Migration cloud : Guide complet",
      excerpt: "Tout ce que vous devez savoir pour migrer vos infrastructures vers le cloud en toute sécurité.",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80",
      date: "2024-01-10",
      author: "FastCube Team",
      tags: ["Cloud", "Migration", "Guide"]
    },
    {
      id: 3,
      title: "RGPD : Mise à jour 2024",
      excerpt: "Les nouvelles réglementations et bonnes pratiques pour la conformité RGPD.",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=400&q=80",
      date: "2024-01-05",
      author: "FastCube Team",
      tags: ["RGPD", "Conformité", "Légal"]
    }
  ];

  
  const services = [
    {
      icon: <FaShieldAlt className="w-8 h-8" />,
      title: "Cybersécurité",
      description: "Protection avancée contre les menaces cybernétiques avec des solutions sur mesure.",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-500/10",
      iconColor: "text-blue-500"
    },
    {
      icon: <FaNetworkWired className="w-8 h-8" />,
      title: "Infrastructure Réseau",
      description: "Conception et déploiement d'infrastructures réseau robustes et évolutives.",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-500/10",
      iconColor: "text-purple-500"
    },
    {
      icon: <FaCloud className="w-8 h-8" />,
      title: "Solutions Cloud",
      description: "Migration et gestion de solutions cloud modernes pour optimiser vos performances.",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-500/10",
      iconColor: "text-green-500"
    }
  ];

  
  const stats = [
    { number: "500+", label: "Projets Réalisés", icon: <FaCheckCircle className="w-6 h-6" /> },
    { number: "50+", label: "Clients Satisfaits", icon: <FaUsers className="w-6 h-6" /> },
    { number: "12+", label: "Années d'Expérience", icon: <FaAward className="w-6 h-6" /> },
    { number: "24/7", label: "Support Disponible", icon: <FaClock className="w-6 h-6" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {}
      <HeroSlider />

      {}
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-indigo-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-emerald-400/10 to-teal-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10">
              <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 dark:from-blue-900/40 dark:via-indigo-900/40 dark:to-purple-900/40 text-blue-700 dark:text-blue-300 rounded-2xl text-sm font-bold shadow-2xl border border-blue-200/50 dark:border-blue-700/50 backdrop-blur-sm">
                <FaRocket className="w-5 h-5 mr-3 animate-bounce" />
                {getTranslation('aboutUs')}
              </div>
              
              <h2 className="text-6xl lg:text-7xl font-black text-gray-900 dark:text-white leading-tight">
                {getTranslation('aboutTitle') || 'Votre partenaire de confiance en'} 
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
                  {' '}{getTranslation('digitalTransformation') || 'transformation digitale'}
                </span>
              </h2>
              
              <p className="text-2xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl font-medium">
                {getTranslation('aboutDescription') || 'FastCube est votre expert en cybersécurité, réseaux et solutions cloud. Nous accompagnons votre transformation digitale avec des solutions innovantes et sécurisées depuis plus de 12 ans.'}
              </p>

              <div className="grid grid-cols-2 gap-8">
                <div className="flex items-center space-x-5 p-6 bg-white/70 dark:bg-gray-800/70 rounded-3xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-xl hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-500 hover:scale-105 group shadow-xl hover:shadow-2xl">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg">
                    <FaCheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-bold text-lg">Expertise reconnue</span>
                </div>
                <div className="flex items-center space-x-5 p-6 bg-white/70 dark:bg-gray-800/70 rounded-3xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-xl hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-500 hover:scale-105 group shadow-xl hover:shadow-2xl">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg">
                    <FaCheckCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-bold text-lg">Support 24/7</span>
                </div>
                <div className="flex items-center space-x-5 p-6 bg-white/70 dark:bg-gray-800/70 rounded-3xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-xl hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-500 hover:scale-105 group shadow-xl hover:shadow-2xl">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg">
                    <FaCheckCircle className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-bold text-lg">Solutions sur mesure</span>
                </div>
                <div className="flex items-center space-x-5 p-6 bg-white/70 dark:bg-gray-800/70 rounded-3xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-xl hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-500 hover:scale-105 group shadow-xl hover:shadow-2xl">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/40 dark:to-red-900/40 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg">
                    <FaCheckCircle className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-bold text-lg">Innovation continue</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <Link to="/about" className="inline-flex items-center justify-center px-10 py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-bold text-lg rounded-3xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-500 border-0 group">
                  {getTranslation('learnMore')}
                  <FaArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
                </Link>
                <Link to="/contact" className="inline-flex items-center justify-center px-10 py-5 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-lg rounded-3xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-500 border border-gray-200/50 dark:border-gray-600/50 backdrop-blur-xl">
                  {getTranslation('contactUs')}
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl rounded-3xl shadow-3xl p-10 border border-white/30 dark:border-gray-700/50">
                <div className="grid grid-cols-2 gap-8">
                  {services.map((service, index) => (
                    <div key={`service-item-${index}`} className={`${service.bgColor} dark:bg-gray-700/60 rounded-3xl p-8 border border-gray-100/50 dark:border-gray-600/50 hover:shadow-2xl transition-all duration-500 hover:scale-110 group`}>
                      <div className={`${service.iconColor} mb-6 group-hover:scale-125 transition-transform duration-500`}>
                        {service.icon}
                      </div>
                      <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-lg">{service.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{service.description}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-30 animate-bounce-gentle"></div>
              <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-30 animate-bounce-gentle" style={{ animationDelay: '1s' }}></div>
              <div className="absolute top-1/2 -right-8 w-20 h-20 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full opacity-40 animate-bounce-gentle" style={{ animationDelay: '2s' }}></div>
            </div>
          </div>
        </div>
      </section>

      {}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
        {}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-white/20 opacity-40"></div>
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-white/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-6xl lg:text-7xl font-black text-white mb-8 leading-tight">
              {getTranslation('ourNumbers') || 'Nos chiffres parlent d\'eux-mêmes'}
            </h2>
            <p className="text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed font-medium">
              {getTranslation('statsDescription') || 'Plus de 12 ans d\'expertise au service de votre réussite'}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {stats.map((stat, index) => (
              <div key={`stat-item-${index}`} className="text-center group">
                <div className="w-24 h-24 bg-white/30 backdrop-blur-xl rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:bg-white/50 group-hover:scale-110 transition-all duration-500 border border-white/30 shadow-2xl hover:shadow-3xl">
                  <div className="text-white group-hover:scale-110 transition-transform duration-500">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-6xl lg:text-7xl font-black text-white mb-4 group-hover:scale-110 transition-transform duration-500">{stat.number}</div>
                <div className="text-blue-100 font-bold text-xl">{stat.label}</div>
              </div>
          ))}
        </div>
        </div>
      </section>

      {}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 relative overflow-hidden">
        {}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-purple-400/8 to-pink-400/8 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-400/8 to-indigo-400/8 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-emerald-400/5 to-teal-400/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24">
            <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-100 via-pink-100 to-rose-100 dark:from-purple-900/40 dark:via-pink-900/40 dark:to-rose-900/40 text-purple-700 dark:text-purple-300 rounded-2xl text-sm font-bold shadow-2xl border border-purple-200/50 dark:border-purple-700/50 mb-10 backdrop-blur-sm">
              <FaLightbulb className="w-5 h-5 mr-3 animate-pulse" />
              {getTranslation('ourServices')}
            </div>
            <h2 className="text-6xl lg:text-7xl font-black text-gray-900 dark:text-white mb-10 leading-tight">
              {getTranslation('servicesTitle') || 'Nos services'}
            </h2>
            <p className="text-2xl text-gray-600 dark:text-gray-300 max-w-5xl mx-auto leading-relaxed font-medium">
              {getTranslation('servicesDescription') || 'Des solutions complètes pour sécuriser et optimiser votre infrastructure IT'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {services.map((service, index) => (
              <div key={`service-item-${index}`} className="group">
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-100/50 dark:border-gray-700/50 p-10 hover:shadow-3xl transition-all duration-700 hover:-translate-y-4 hover:scale-105">
                  <div className={`w-24 h-24 ${service.bgColor} rounded-3xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500 shadow-2xl`}>
                    <div className={`${service.iconColor} group-hover:scale-110 transition-transform duration-500`}>
                      {service.icon}
                    </div>
                  </div>
                  <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-6 leading-tight">{service.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-10 leading-relaxed text-lg font-medium">{service.description}</p>
                  <Link to="/services" className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 text-gray-700 dark:text-gray-300 font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-500 border border-gray-200/50 dark:border-gray-600/50 group">
                    {getTranslation('learnMore')}
                    <FaArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-20">
            <Link to="/services" className="inline-flex items-center justify-center px-12 py-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-black text-xl rounded-3xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-500 border-0 group">
              {getTranslation('viewAllServices')}
              <FaArrowRight className="w-6 h-6 ml-4 group-hover:translate-x-2 transition-transform duration-300" />
            </Link>
        </div>
        </div>
      </section>

      {}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-blue-50/40 to-indigo-50/40 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
        {}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-green-400/8 to-emerald-400/8 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tr from-cyan-400/8 to-blue-400/8 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 right-1/3 w-32 h-32 bg-gradient-to-r from-emerald-400/10 to-teal-400/10 rounded-full blur-2xl animate-pulse"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24">
            <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-100 via-emerald-100 to-teal-100 dark:from-green-900/40 dark:via-emerald-900/40 dark:to-teal-900/40 text-green-700 dark:text-green-300 rounded-2xl text-sm font-bold shadow-2xl border border-green-200/50 dark:border-green-700/50 mb-10 backdrop-blur-sm">
              <FaCog className="w-5 h-5 mr-3 animate-spin" />
              {getTranslation('latestNews')}
            </div>
            <h2 className="text-6xl lg:text-7xl font-black text-gray-900 dark:text-white mb-10 leading-tight">
              {getTranslation('blogTitle') || 'Dernières actualités'}
            </h2>
            <p className="text-2xl text-gray-600 dark:text-gray-300 max-w-5xl mx-auto leading-relaxed font-medium">
              {getTranslation('blogDescription') || 'Restez informé des dernières tendances en cybersécurité et technologies'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
            {blogPosts.map(post => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>

          <div className="text-center">
            <Link to="/blog" className="inline-flex items-center justify-center px-12 py-6 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white font-black text-xl rounded-3xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-500 border-0 group">
              {getTranslation('viewAllArticles')}
              <FaArrowRight className="w-6 h-6 ml-4 group-hover:translate-x-2 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>


      {}
      <TestimonialsSection />

      {}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/20 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
        {}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-400/8 to-indigo-400/8 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tr from-purple-400/8 to-pink-400/8 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 right-1/3 w-32 h-32 bg-gradient-to-r from-blue-400/10 to-indigo-400/10 rounded-full blur-2xl animate-pulse"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <LeafletMap />
        </div>
      </section>

      {}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
        {}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-white/20 opacity-50"></div>
          <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-white/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center text-white">
            <h2 className="text-6xl lg:text-7xl font-black mb-10 leading-tight">
              {getTranslation('contactCTATitle') || 'Un projet ? Besoin d\'un'} 
              <span className="text-yellow-300 animate-pulse"> {getTranslation('advice') || 'conseil'} </span>
              {getTranslation('contactCTAQuestion') || '?'}
            </h2>
            <p className="text-2xl text-blue-100 mb-16 max-w-4xl mx-auto leading-relaxed font-medium">
              {getTranslation('contactCTADescription') || 'Nos experts FastCube sont là pour vous accompagner dans tous vos projets IT. Contactez-nous pour un audit gratuit et personnalisé.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-8 justify-center">
              <Link to="/contact" className="inline-flex items-center justify-center px-12 py-6 bg-white text-gray-900 hover:bg-gray-100 group font-black text-xl rounded-3xl shadow-3xl hover:shadow-4xl transform hover:scale-105 transition-all duration-500 border-0">
                {getTranslation('contactUs')}
                <FaArrowRight className="w-6 h-6 ml-4 group-hover:translate-x-2 transition-transform duration-300" />
              </Link>
              <Link to="/appel-offre" className="inline-flex items-center justify-center px-12 py-6 bg-transparent text-white hover:bg-white/20 group font-black text-xl rounded-3xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-500 border-2 border-white/60 hover:border-white backdrop-blur-sm">
                {getTranslation('callForTenders')}
              </Link>
            </div>
        </div>
        </div>
      </section>
    </div>
  );
}
