import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaEye, FaCalendar, FaUser, FaSearch, FaFilter, FaSpinner, 
  FaExclamationTriangle, FaComment, FaRocket, FaLightbulb, 
  FaArrowRight, FaClock, FaBookOpen, FaTags, FaShare
} from 'react-icons/fa';

const BlogDisplay = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [statuses, setStatuses] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [commentCounts, setCommentCounts] = useState({});

  useEffect(() => {
    fetchBlogs();
    fetchStatuses();
  }, []);

  useEffect(() => {
    filterBlogs();
  }, [blogs, searchTerm, selectedStatus]);

  // Récupérer le nombre de commentaires pour chaque blog
  useEffect(() => {
    if (blogs.length > 0) {
      fetchCommentCounts();
    }
  }, [blogs]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/blogs');
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        console.log('📊 Blogs chargés:', result.data.length);
        console.log('📈 Total des vues:', result.data.reduce((total, blog) => total + (blog.total_views || 0), 0));
        setBlogs(result.data);
      } else {
        throw new Error(result.error || 'Erreur lors de la récupération des blogs');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des blogs:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatuses = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/blogs/statuses');
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setStatuses(result.data);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des statuts:', error);
    }
  };

  // Récupérer le nombre de commentaires pour chaque blog
  const fetchCommentCounts = async () => {
    try {
      console.log('🔍 Récupération des compteurs de commentaires...');
      const counts = {};
      for (const blog of blogs) {
        console.log(`📖 Blog ${blog.id}: ${blog.title}`);
        const response = await fetch(`http://localhost:5000/api/commentaires/count/${blog.id}`);
        if (response.ok) {
          const result = await response.json();
          console.log(`📊 Commentaires pour blog ${blog.id}:`, result.data.count);
          counts[blog.id] = result.data.count;
        } else {
          console.error(`❌ Erreur pour blog ${blog.id}:`, response.status);
        }
      }
      console.log('📋 Compteurs finaux:', counts);
      setCommentCounts(counts);
    } catch (error) {
      console.error('Erreur lors de la récupération des compteurs de commentaires:', error);
    }
  };

  const filterBlogs = () => {
    let filtered = [...blogs];

    // Filtrer par statut
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(blog => blog.status === selectedStatus);
    }

    // Filtrer par recherche
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(blog => 
        blog.title.toLowerCase().includes(term) ||
        blog.content.toLowerCase().includes(term)
      );
    }

    setFilteredBlogs(filtered);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date non disponible';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
      case 'draft':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white';
      case 'archived':
        return 'bg-gradient-to-r from-gray-500 to-slate-500 text-white';
      default:
        return 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'published':
        return 'Publié';
      case 'draft':
        return 'Brouillon';
      case 'archived':
        return 'Archivé';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 pt-20">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <FaBookOpen className="w-10 h-10 text-white" />
              </div>
              <div className="absolute inset-0 w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full opacity-20 animate-ping"></div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Chargement en cours...</h2>
            <p className="text-gray-600">Préparation de nos meilleurs articles</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50/30 to-pink-50/30 pt-20">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaExclamationTriangle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Oups ! Une erreur s'est produite</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={fetchBlogs}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <FaRocket className="w-4 h-4 mr-2" />
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-gray-900 dark:via-gray-800/50 dark:to-indigo-900/30 pt-20">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 dark:from-blue-600/30 dark:to-indigo-600/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 dark:from-purple-600/30 dark:to-pink-600/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 dark:from-cyan-600/20 dark:to-blue-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 dark:from-blue-900/40 dark:via-indigo-900/40 dark:to-purple-900/40 text-blue-700 dark:text-blue-300 rounded-2xl text-sm font-bold shadow-2xl border border-blue-200/50 dark:border-blue-700/50 backdrop-blur-sm mb-10">
              <FaLightbulb className="w-5 h-5 mr-3 animate-bounce-gentle" />
              Blog FastCube
            </div>
            
            {/* Titre principal */}
            <h1 className="text-6xl lg:text-7xl font-black text-gray-900 dark:text-white mb-10 leading-tight">
              Découvrez nos{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                articles
              </span>
            </h1>
            
            {/* Sous-titre */}
            <p className="text-2xl lg:text-3xl text-gray-600 dark:text-gray-300 leading-relaxed mb-12 max-w-4xl mx-auto font-medium">
              Insights, actualités et conseils d'experts pour votre transformation digitale
            </p>

            {/* Statistiques */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl rounded-3xl p-6 text-center shadow-2xl border border-gray-100/50 dark:border-gray-600/50 hover:shadow-3xl transition-all duration-500 hover:scale-105 group">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                  <FaBookOpen className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-black text-blue-600 dark:text-blue-400 mb-2 group-hover:scale-110 transition-transform duration-500">
                  {blogs.length}
                </div>
                <div className="text-lg text-gray-600 dark:text-gray-300 font-bold">Articles</div>
              </div>
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl rounded-3xl p-6 text-center shadow-2xl border border-gray-100/50 dark:border-gray-600/50 hover:shadow-3xl transition-all duration-500 hover:scale-105 group">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                  <FaEye className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-black text-green-600 dark:text-green-400 mb-2 group-hover:scale-110 transition-transform duration-500">
                  {blogs.reduce((total, blog) => total + (blog.total_views || 0), 0)}
                </div>
                <div className="text-lg text-gray-600 dark:text-gray-300 font-bold">Vues</div>
              </div>
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl rounded-3xl p-6 text-center shadow-2xl border border-gray-100/50 dark:border-gray-600/50 hover:shadow-3xl transition-all duration-500 hover:scale-105 group">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                  <FaComment className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-black text-purple-600 dark:text-purple-400 mb-2 group-hover:scale-110 transition-transform duration-500">
                  {Object.values(commentCounts).reduce((total, count) => total + count, 0)}
                </div>
                <div className="text-lg text-gray-600 dark:text-gray-300 font-bold">Commentaires</div>
              </div>
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl rounded-3xl p-6 text-center shadow-2xl border border-gray-100/50 dark:border-gray-600/50 hover:shadow-3xl transition-all duration-500 hover:scale-105 group">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                  <FaUser className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-black text-orange-600 dark:text-orange-400 mb-2 group-hover:scale-110 transition-transform duration-500">
                  {blogs.filter(blog => blog.status === 'published').length}
                </div>
                <div className="text-lg text-gray-600 dark:text-gray-300 font-bold">Publiés</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section des Filtres */}
      <section className="py-16 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Filtres et recherche */}
          <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-700 dark:via-gray-700 dark:to-gray-700 rounded-3xl shadow-2xl p-8 border border-blue-100/50 dark:border-gray-600/50">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Barre de recherche */}
              <div className="flex-1">
                <div className="relative">
                  <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500 dark:text-blue-400 text-lg" />
                  <input
                    type="text"
                    placeholder="Rechercher dans nos articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-2 border-blue-200/50 dark:border-gray-600/50 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 text-lg transition-all duration-300 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              
              {/* Filtre par statut */}
              <div className="flex gap-3">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-6 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-2 border-blue-200/50 dark:border-gray-600/50 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 text-lg transition-all duration-300 cursor-pointer text-gray-900 dark:text-white"
                >
                  <option value="all">Tous les statuts</option>
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {getStatusLabel(status)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section des Articles */}
      <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-gray-900 dark:via-gray-800/30 dark:to-indigo-900/30 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          {/* Liste des blogs */}
          {filteredBlogs.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gradient-to-r from-gray-400 to-gray-500 dark:from-gray-600 dark:to-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaSearch className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-4">
                {searchTerm || selectedStatus !== 'all' 
                  ? 'Aucun article ne correspond à vos critères'
                  : 'Aucun article disponible pour le moment'
                }
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-lg max-w-md mx-auto">
                {searchTerm || selectedStatus !== 'all' 
                  ? 'Essayez de modifier vos filtres ou votre recherche pour trouver plus d\'articles.'
                  : 'Nous travaillons sur de nouveaux contenus passionnants. Revenez bientôt !'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredBlogs.map((blog, index) => (
                <article 
                  key={blog.id} 
                  className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden transition-all duration-700 hover:shadow-3xl hover:-translate-y-4 hover:scale-105 border border-gray-100/50 dark:border-gray-700/50 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Image */}
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={blog.image_url || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80'}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Badge de statut */}
                    <div className="absolute top-4 right-4">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-lg ${getStatusColor(blog.status)}`}>
                        {getStatusLabel(blog.status)}
                      </span>
                    </div>

                    {/* Overlay au hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-600/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-6">
                      <div className="text-white">
                        <FaArrowRight className="w-6 h-6 transform translate-x-0 group-hover:translate-x-2 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>

                  {/* Contenu */}
                  <div className="p-8">
                    {/* Métadonnées */}
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <FaUser className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                          <span>ID: {blog.author_id}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaCalendar className="w-4 h-4 text-green-500 dark:text-green-400" />
                          <span>{formatDate(blog.created_at)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaClock className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                        <span>5 min</span>
                      </div>
                    </div>

                    {/* Titre */}
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                      {blog.title}
                    </h2>

                    {/* Vues et commentaires */}
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-6">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <FaEye className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                          <span className="font-medium">{blog.total_views || 0}</span>
                          <span>vues</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaComment className="w-4 h-4 text-green-500 dark:text-green-400" />
                          <span className="font-medium">{commentCounts[blog.id] || 0}</span>
                          <span>commentaires</span>
                        </div>
                      </div>
                    </div>

                    {/* Bouton Lire plus */}
                    <Link
                      to={`/blog/${blog.id}`}
                      className="group/btn inline-flex items-center justify-center w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-4 px-6 rounded-2xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold text-lg"
                    >
                      <span>Lire l'article</span>
                      <FaArrowRight className="w-5 h-5 ml-3 transform translate-x-0 group-hover/btn:translate-x-2 transition-transform duration-300" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Pagination ou "Voir plus" */}
          {filteredBlogs.length > 0 && (
            <div className="text-center mt-16">
              <div className="inline-flex items-center gap-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl rounded-2xl px-8 py-4 shadow-xl border border-gray-100/50 dark:border-gray-700/50">
                <FaBookOpen className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                <p className="text-gray-700 dark:text-gray-300 font-medium">
                  Affichage de <span className="text-blue-600 dark:text-blue-400 font-bold">{filteredBlogs.length}</span> article{filteredBlogs.length > 1 ? 's' : ''} sur <span className="text-blue-600 dark:text-blue-400 font-bold">{blogs.length}</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BlogDisplay;
