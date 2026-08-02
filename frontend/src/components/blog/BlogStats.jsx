import React, { useState, useEffect } from 'react';
import { 
  FaEye, FaComments, FaHeart, FaUsers, FaRocket, 
  FaLightbulb, FaChartLine, FaStar
} from 'react-icons/fa';

export default function BlogStats() {
  const [stats, setStats] = useState({
    totalViews: 0,
    totalComments: 0,
    totalLikes: 0,
    totalArticles: 0,
    activeUsers: 0,
    trendingTopics: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogStats();
  }, []);

  const fetchBlogStats = async () => {
    try {
      setLoading(true);
      
      // Récupérer depuis l'API
      const response = await fetch('http://localhost:5000/api/blog/stats');
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.success) {
          setStats(data.data);
          return;
        }
      }
      
      // Si l'API échoue, afficher des statistiques à zéro
      console.log('API not available, displaying zero stats');
      setStats({
        totalViews: 0,
        totalComments: 0,
        totalLikes: 0,
        totalArticles: 0,
        activeUsers: 0,
        trendingTopics: 0
      });
      
    } catch (err) {
      console.error('Error fetching blog stats:', err);
      // En cas d'erreur, afficher des statistiques à zéro
      setStats({
        totalViews: 0,
        totalComments: 0,
        totalLikes: 0,
        totalArticles: 0,
        activeUsers: 0,
        trendingTopics: 0
      });
    } finally {
      setLoading(false);
    }
  };


  const formatNumber = (num) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  if (loading) {
    return (
      <div className="py-20 bg-gradient-to-r from-blue-600 to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
            <p className="mt-6 text-xl text-white">Chargement des statistiques...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700 relative overflow-hidden">
      {/* Éléments décoratifs */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute top-32 right-20 w-24 h-24 bg-purple-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-28 h-28 bg-indigo-400/20 rounded-full blur-2xl animate-pulse delay-2000"></div>
          <div className="absolute bottom-32 right-1/3 w-20 h-20 bg-blue-400/20 rounded-full blur-xl animate-pulse delay-3000"></div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Statistiques <span className="text-blue-200">FastCube</span>
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Découvrez l'impact de notre blog technologique en temps réel
          </p>
        </div>
        
        {/* Grille des statistiques */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Total des vues */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FaEye className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">
                {formatNumber(stats.totalViews)}
              </h3>
              <p className="text-blue-100 font-medium">Vues Totales</p>
              <p className="text-blue-200 text-sm mt-2">Engagement croissant</p>
            </div>
          </div>

          {/* Total des commentaires */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FaComments className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">
                {formatNumber(stats.totalComments)}
              </h3>
              <p className="text-blue-100 font-medium">Commentaires</p>
              <p className="text-blue-200 text-sm mt-2">Communauté active</p>
            </div>
          </div>

          {/* Total des likes */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FaHeart className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">
                {formatNumber(stats.totalLikes)}
              </h3>
              <p className="text-blue-100 font-medium">Likes Totaux</p>
              <p className="text-blue-200 text-sm mt-2">Contenu apprécié</p>
            </div>
          </div>

          {/* Total des articles */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-400 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FaLightbulb className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">
                {stats.totalArticles}
              </h3>
              <p className="text-blue-100 font-medium">Articles Publiés</p>
              <p className="text-blue-200 text-sm mt-2">Contenu riche</p>
            </div>
          </div>

          {/* Utilisateurs actifs */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FaUsers className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">
                {formatNumber(stats.activeUsers)}
              </h3>
              <p className="text-blue-100 font-medium">Utilisateurs Actifs</p>
              <p className="text-blue-200 text-sm mt-2">Communauté engagée</p>
            </div>
          </div>

          {/* Sujets tendance */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FaChartLine className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">
                {stats.trendingTopics}
              </h3>
              <p className="text-blue-100 font-medium">Sujets Tendance</p>
              <p className="text-blue-200 text-sm mt-2">Innovation continue</p>
            </div>
          </div>
        </div>

        {/* Indicateur de mise à jour */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 border border-white/20">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-blue-100 text-sm font-medium">
              Statistiques mises à jour en temps réel
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}






























