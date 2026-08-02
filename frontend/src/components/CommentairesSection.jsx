import React, { useState, useEffect } from 'react';
import { 
  FaComment, FaPaperPlane, FaThumbsUp, FaReply, 
  FaEdit, FaTrash, FaUser, FaClock, FaSpinner 
} from 'react-icons/fa';

const CommentairesSection = ({ blogId, isAuthenticated, currentUser }) => {
  const [commentaires, setCommentaires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [commentContent, setCommentContent] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');

  // Utiliser les informations utilisateur passées en props
  useEffect(() => {
    console.log('🔍 CommentairesSection - isAuthenticated:', isAuthenticated);
    console.log('🔍 CommentairesSection - currentUser:', currentUser);
    if (isAuthenticated && currentUser) {
      setUserInfo(currentUser);
      console.log('✅ UserInfo défini:', currentUser);
    } else {
      console.log('❌ UserInfo non défini - isAuthenticated:', isAuthenticated, 'currentUser:', currentUser);
    }
  }, [isAuthenticated, currentUser]);

  // Récupérer les commentaires
  const fetchCommentaires = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/commentaires/blog/${blogId}`);
      
      if (response.ok) {
        const data = await response.json();
        // Vérifier le format de la réponse et extraire les commentaires
        if (data && Array.isArray(data)) {
          setCommentaires(data);
        } else if (data && data.data && Array.isArray(data.data)) {
          setCommentaires(data.data);
        } else if (data && Array.isArray(data.commentaires)) {
          setCommentaires(data.commentaires);
        } else {
          console.log('Format de réponse inattendu:', data);
          setCommentaires([]);
        }
      } else {
        setError('Erreur lors de la récupération des commentaires');
        setCommentaires([]);
      }
    } catch (error) {
      setError('Erreur de connexion');
      setCommentaires([]);
    } finally {
      setLoading(false);
    }
  };

  // Soumettre un commentaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!commentContent.trim()) {
      setError('Le commentaire ne peut pas être vide');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      console.log('🔍 handleSubmit - isAuthenticated:', isAuthenticated);
      console.log('🔍 handleSubmit - userInfo:', userInfo);
      console.log('🔍 handleSubmit - commentContent:', commentContent);

      const commentData = {
        blog_id: blogId,
        content: commentContent.trim(),
        // Utiliser les infos de l'utilisateur connecté
        user_id: userInfo.id,
        author_name: userInfo.name || `${userInfo.first_name || ''} ${userInfo.last_name || ''}`.trim() || userInfo.email,
        author_email: userInfo.email
      };

      console.log('🔍 commentData:', commentData);

      // Vérifier que tous les champs requis sont présents
      if (!commentData.author_name || !commentData.author_email) {
        setError('Informations utilisateur manquantes. Veuillez vous reconnecter.');
        return;
      }

      const response = await fetch('http://localhost:5000/api/commentaires', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentData)
      });

      if (response.ok) {
        setCommentContent('');
        await fetchCommentaires(); // Recharger les commentaires
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erreur lors de l\'ajout du commentaire');
      }
    } catch (error) {
      setError('Erreur de connexion');
    } finally {
      setSubmitting(false);
    }
  };

  // Formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Charger les commentaires au montage
  useEffect(() => {
    fetchCommentaires();
  }, [blogId]);

  if (loading) {
    return (
      <div className="text-center py-6">
        <FaSpinner className="w-6 h-6 text-blue-500 animate-spin mx-auto mb-3" />
        <p className="text-gray-600 text-sm">Chargement des commentaires...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <FaComment className="w-4 h-4 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Commentaires ({commentaires.length})
          </h3>
          <p className="text-gray-600 text-xs">
            Partagez vos pensées et réagissez aux articles
          </p>
        </div>
      </div>

      {/* Formulaire d'ajout de commentaire */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <FaUser className="w-3 h-3 text-white" />
              </div>
              <div className="flex-1">
                {/* Affichage du nom de l'utilisateur connecté */}
                {userInfo && (
                  <div className="mb-2 text-xs text-gray-600">
                    <span className="font-medium">
                      {userInfo.first_name} {userInfo.last_name}
                    </span>
                    <span className="text-gray-500 ml-2">({userInfo.email})</span>
                  </div>
                )}
                
                {/* Champ commentaire uniquement */}
                <textarea
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="Écrivez votre commentaire..."
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                  rows="3"
                  required
                />
                
                {error && (
                  <p className="text-red-500 text-xs mt-1">{error}</p>
                )}
                
                <div className="flex justify-end mt-2">
                  <button
                    type="submit"
                    disabled={submitting || !commentContent.trim()}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-md transition-colors text-sm"
                  >
                    {submitting ? (
                      <FaSpinner className="w-3 h-3 animate-spin" />
                    ) : (
                      <FaPaperPlane className="w-3 h-3" />
                    )}
                    {submitting ? 'Envoi...' : 'Publier'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6 text-center">
          <FaComment className="w-5 h-5 text-blue-500 mx-auto mb-2" />
          <p className="text-blue-800 font-medium mb-1 text-sm">
            Connectez-vous pour commenter
          </p>
          <p className="text-blue-600 text-xs">
            Vous devez être connecté pour ajouter un commentaire
          </p>
        </div>
      )}

      {/* Liste des commentaires */}
      <div className="space-y-3">
        {commentaires.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <FaComment className="w-10 h-10 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">Aucun commentaire pour le moment</p>
            <p className="text-xs">Soyez le premier à commenter !</p>
          </div>
        ) : (
          commentaires.map((commentaire) => (
            <div key={commentaire.id} className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaUser className="w-3 h-3 text-gray-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-800 text-sm">
                      {commentaire.author_name}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500 text-xs flex items-center gap-1">
                      <FaClock className="w-2 h-2" />
                      {formatDate(commentaire.created_at)}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-2">{commentaire.content}</p>
                  
                  <div className="flex items-center gap-3 text-xs">
                    <button className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors">
                      <FaThumbsUp className="w-2 h-2" />
                      J'aime
                    </button>
                    <button className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors">
                      <FaReply className="w-2 h-2" />
                      Répondre
                    </button>
                    {isAuthenticated && (
                      <>
                        <button className="flex items-center gap-1 text-gray-500 hover:text-green-600 transition-colors">
                          <FaEdit className="w-2 h-2" />
                          Modifier
                        </button>
                        <button className="flex items-center gap-1 text-gray-500 hover:text-red-600 transition-colors">
                          <FaTrash className="w-2 h-2" />
                          Supprimer
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentairesSection;
