import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, FaCalendar, FaUser, FaEye, FaSpinner, 
  FaExclamationTriangle, FaShare, FaBookmark,
  FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp,
  FaClock, FaTags, FaHeart, FaComment, FaRocket,
  FaLightbulb, FaArrowRight
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import CommentairesSection from './CommentairesSection';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Récupérer le blog
  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/blogs/${id}`);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setBlog(result.data);
      } else {
        throw new Error(result.error || 'Erreur lors de la récupération du blog');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du blog:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return 'Date non disponible';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Partager sur les réseaux sociaux
  const shareOnSocial = (platform) => {
    const url = window.location.href;
    const title = blog?.title || 'Article FastCube';
    const text = blog?.content?.substring(0, 100) || 'Découvrez cet article intéressant';

    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  // Copier le lien
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      // Vous pouvez ajouter une notification de succès ici
    } catch (err) {
      console.error('Erreur lors de la copie du lien:', err);
    }
  };

  useEffect(() => {
    fetchBlog();
    // Incrémenter les vues quand l'article est consulté
    incrementViews();
  }, [id]);

  // Incrémenter les vues
  const incrementViews = async () => {
    try {
      await fetch(`http://localhost:5000/api/blogs/${id}/view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
    } catch (error) {
      console.error('Erreur lors de l\'incrémentation des vues:', error);
      // Ne pas faire échouer le chargement de l'article
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 pt-20">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <FaRocket className="w-10 h-10 text-white" />
              </div>
              <div className="absolute inset-0 w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full opacity-20 animate-ping"></div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Chargement de l'article...</h2>
            <p className="text-gray-600">Préparation de votre lecture</p>
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
            <div className="flex gap-4 justify-center">
              <button 
                onClick={fetchBlog}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <FaRocket className="w-4 h-4 mr-2" />
                Réessayer
              </button>
              <button 
                onClick={() => navigate('/blog')}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-500 to-slate-500 text-white font-semibold rounded-xl hover:from-gray-600 hover:to-slate-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <FaArrowLeft className="w-4 h-4 mr-2" />
                Retour au blog
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 pt-20">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaExclamationTriangle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Article non trouvé</h2>
            <p className="text-gray-600 mb-6">L'article que vous recherchez n'existe pas ou a été supprimé.</p>
            <button 
              onClick={() => navigate('/blog')}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <FaArrowLeft className="w-4 h-4 mr-2" />
              Retour au blog
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 pt-20">
      {/* Bouton Retour */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <button
          onClick={() => navigate('/blog')}
          className="inline-flex items-center gap-3 px-6 py-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl border border-gray-100/50 dark:border-gray-600/50"
        >
          <FaArrowLeft className="w-5 h-5" />
          Retour au blog
        </button>
      </div>

      {/* Article Principal */}
      <article className="max-w-5xl mx-auto px-6 pb-20">
        {/* En-tête de l'article */}
        <header className="text-center mb-16">
          {/* Badge de catégorie */}
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 dark:from-blue-900/40 dark:via-indigo-900/40 dark:to-purple-900/40 text-blue-700 dark:text-blue-300 rounded-2xl text-sm font-bold shadow-xl border border-blue-200/50 dark:border-blue-700/50 backdrop-blur-sm mb-8">
            <FaLightbulb className="w-4 h-4 mr-2" />
            Article FastCube
          </div>
          
          {/* Titre */}
          <h1 className="text-4xl lg:text-6xl font-black text-gray-900 dark:text-white mb-8 leading-tight">
            {blog.title}
          </h1>
          
          {/* Métadonnées */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-gray-600 dark:text-gray-400 mb-8">
            <div className="flex items-center gap-2">
              <FaUser className="w-5 h-5 text-blue-500" />
              <span className="font-medium">ID: {blog.author_id}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCalendar className="w-5 h-5 text-green-500" />
              <span className="font-medium">{formatDate(blog.created_at)}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaClock className="w-5 h-5 text-purple-500" />
              <span className="font-medium">5 min de lecture</span>
            </div>
            <div className="flex items-center gap-2">
              <FaEye className="w-5 h-5 text-orange-500" />
              <span className="font-medium">{blog.total_views || 0} vues</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={copyLink}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-2xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <FaShare className="w-4 h-4" />
              Copier le lien
            </button>
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg border border-gray-100/50 dark:border-gray-600/50">
              <FaBookmark className="w-4 h-4" />
              Sauvegarder
            </button>
          </div>
        </header>

        {/* Image principale */}
        {blog.image_url && (
          <div className="mb-16">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={blog.image_url}
                alt={blog.title}
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
            </div>
          </div>
        )}

        {/* Contenu de l'article */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl rounded-3xl shadow-2xl p-12 border border-gray-100/50 dark:border-gray-600/50 mb-16">
          <div className="prose prose-lg prose-blue dark:prose-invert max-w-none">
            <div 
              className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>
        </div>

        {/* Partage social */}
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-700 dark:via-gray-700 dark:to-gray-700 rounded-3xl shadow-xl p-8 border border-blue-100/50 dark:border-blue-700/50 mb-16">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Partagez cet article
          </h3>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => shareOnSocial('facebook')}
              className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl"
            >
              <FaFacebook className="w-6 h-6" />
            </button>
            <button
              onClick={() => shareOnSocial('twitter')}
              className="w-14 h-14 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl"
            >
              <FaTwitter className="w-6 h-6" />
            </button>
            <button
              onClick={() => shareOnSocial('linkedin')}
              className="w-14 h-14 bg-blue-700 hover:bg-blue-800 text-white rounded-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl"
            >
              <FaLinkedin className="w-6 h-6" />
            </button>
            <button
              onClick={() => shareOnSocial('whatsapp')}
              className="w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl"
            >
              <FaWhatsapp className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Section Commentaires */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-100/50 dark:border-gray-600/50">
          <CommentairesSection 
            blogId={id} 
            isAuthenticated={isLoggedIn} 
            currentUser={user} 
          />
        </div>
      </article>
    </div>
  );
};

export default BlogDetail;
