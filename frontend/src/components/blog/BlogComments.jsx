import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from "../config/api";
import { 
  FaUserCircle, FaHeart, FaReply, FaThumbsUp, FaThumbsDown, 
  FaEdit, FaTrash, FaClock, FaUser, FaCheckCircle
} from 'react-icons/fa';
import { Button, Card } from '../ui';

export default function BlogComments({ articleId, currentUser, onCommentCountChange }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Charger les commentaires
  useEffect(() => {
    fetchComments();
  }, [articleId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/blog/articles/${articleId}/comments`);
      const data = await response.json();
      
      if (data.success) {
        setComments(data.data);
      } else {
        // Fallback vers des commentaires d'exemple
        setComments([
          {
            id: 1,
            content: "Excellent article ! Très bien expliqué et facile à comprendre. Merci pour ces insights.",
            author: "Ahmed Benali",
            authorId: "user1",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 heures ago
            likes: 12,
            dislikes: 0,
            userLiked: false,
            userDisliked: false,
            replies: []
          },
          {
            id: 2,
            content: "Je suis d'accord avec les points soulevés. C'est exactement ce que nous cherchions pour notre projet.",
            author: "Fatima Zahra",
            authorId: "user2",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
            createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 heures ago
            likes: 8,
            dislikes: 1,
            userLiked: true,
            userDisliked: false,
            replies: []
          }
        ]);
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError('Erreur lors du chargement des commentaires');
    } finally {
      setLoading(false);
    }
  };

  // Ajouter un commentaire
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/blog/articles/${articleId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          content: newComment,
          parentId: replyTo?.id || null
        })
      });

      const data = await response.json();
      
              if (data.success) {
          // Ajouter le nouveau commentaire à la liste
          const newCommentObj = {
            id: data.data.id,
            content: newComment,
            author: currentUser.name || currentUser.email,
            authorId: currentUser.id,
            avatar: currentUser.avatar || `https://ui-avatars.com/api/?name=${currentUser.name || currentUser.email}&background=3b82f6&color=fff`,
            createdAt: new Date(),
            likes: 0,
            dislikes: 0,
            userLiked: false,
            userDisliked: false,
            replies: []
          };

          if (replyTo) {
            // Ajouter comme réponse
            setComments(prev => prev.map(comment => 
              comment.id === replyTo.id 
                ? { ...comment, replies: [...comment.replies, newCommentObj] }
                : comment
            ));
            setReplyTo(null);
          } else {
            // Ajouter comme nouveau commentaire
            setComments(prev => [newCommentObj, ...prev]);
          }

          // Mettre à jour le compteur de commentaires
          if (onCommentCountChange) {
            onCommentCountChange(comments.length + 1);
          }

          setNewComment('');
        }
    } catch (err) {
      console.error('Error posting comment:', err);
      setError('Erreur lors de l\'ajout du commentaire');
    } finally {
      setLoading(false);
    }
  };

  // Gérer les likes/dislikes
  const handleLike = async (commentId, isLike = true) => {
    if (!currentUser) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/blog/comments/${commentId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ isLike })
      });

      const data = await response.json();
      
      if (data.success) {
        // Mettre à jour l'état local
        setComments(prev => prev.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              likes: data.data.likes,
              dislikes: data.data.dislikes,
              userLiked: data.data.userLiked,
              userDisliked: data.data.userDisliked
            };
          }
          // Vérifier aussi dans les réponses
          if (comment.replies) {
            return {
              ...comment,
              replies: comment.replies.map(reply => 
                reply.id === commentId 
                  ? {
                      ...reply,
                      likes: data.data.likes,
                      dislikes: data.data.dislikes,
                      userLiked: data.data.userLiked,
                      userDisliked: data.data.userDisliked
                    }
                  : reply
              )
            };
          }
          return comment;
        }));
      }
    } catch (err) {
      console.error('Error handling like:', err);
    }
  };

  // Supprimer un commentaire
  const handleDeleteComment = async (commentId) => {
    if (!currentUser) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/blog/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        // Supprimer de la liste locale
        setComments(prev => prev.filter(comment => comment.id !== commentId));
        
        // Mettre à jour le compteur de commentaires
        if (onCommentCountChange) {
          onCommentCountChange(comments.length - 1);
        }
      }
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  // Formater la date
  const formatDate = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `Il y a ${minutes} min`;
    if (hours < 24) return `Il y a ${hours}h`;
    if (days < 7) return `Il y a ${days}j`;
    return new Date(date).toLocaleDateString('fr-FR');
  };

  // Composant de commentaire individuel
  const CommentItem = ({ comment, isReply = false }) => {
    const canEdit = currentUser && (currentUser.id === comment.authorId || currentUser.role === 'admin');
    const canDelete = currentUser && (currentUser.id === comment.authorId || currentUser.role === 'admin');

    return (
      <div className={`${isReply ? 'ml-8 border-l-2 border-blue-200 pl-4' : ''}`}>
        <div className="flex items-start space-x-3 mb-4">
          <img
            src={comment.avatar}
            alt={comment.author}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                  {comment.author}
                </h4>
                {comment.authorId === currentUser?.id && (
                  <FaCheckCircle className="w-4 h-4 text-blue-500" title="Vous" />
                )}
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                <FaClock className="w-3 h-3" />
                <span>{formatDate(comment.createdAt)}</span>
              </div>
            </div>

            {editingComment?.id === comment.id ? (
              <div className="mb-3">
                <textarea
                  value={editingComment.content}
                  onChange={(e) => setEditingComment({...editingComment, content: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none"
                  rows="3"
                />
                <div className="flex space-x-2 mt-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      // Sauvegarder l'édition
                      setEditingComment(null);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Sauvegarder
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingComment(null)}
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
                {comment.content}
              </p>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleLike(comment.id, true)}
                  className={`flex items-center space-x-1 text-xs transition-colors duration-200 ${
                    comment.userLiked 
                      ? 'text-blue-600' 
                      : 'text-gray-500 hover:text-blue-600'
                  }`}
                >
                  <FaThumbsUp className={`w-3 h-3 ${comment.userLiked ? 'fill-current' : ''}`} />
                  <span>{comment.likes}</span>
                </button>

                <button
                  onClick={() => handleLike(comment.id, false)}
                  className={`flex items-center space-x-1 text-xs transition-colors duration-200 ${
                    comment.userDisliked 
                      ? 'text-red-600' 
                      : 'text-gray-500 hover:text-red-600'
                  }`}
                >
                  <FaThumbsDown className={`w-3 h-3 ${comment.userDisliked ? 'fill-current' : ''}`} />
                  <span>{comment.dislikes}</span>
                </button>

                {!isReply && (
                  <button
                    onClick={() => setReplyTo(comment)}
                    className="flex items-center space-x-1 text-xs text-gray-500 hover:text-blue-600 transition-colors duration-200"
                  >
                    <FaReply className="w-3 h-3" />
                    <span>Répondre</span>
                  </button>
                )}
              </div>

              {/* Actions d'édition/suppression */}
              {(canEdit || canDelete) && (
                <div className="flex items-center space-x-2">
                  {canEdit && (
                    <button
                      onClick={() => setEditingComment(comment)}
                      className="text-xs text-gray-500 hover:text-blue-600 transition-colors duration-200"
                    >
                      <FaEdit className="w-3 h-3" />
                    </button>
                  )}
                  {canDelete && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-xs text-gray-500 hover:text-red-600 transition-colors duration-200"
                    >
                      <FaTrash className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Réponses */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-4 space-y-3">
                {comment.replies.map(reply => (
                  <CommentItem key={reply.id} comment={reply} isReply={true} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading && comments.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Chargement des commentaires...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Zone de commentaire */}
      {currentUser ? (
        <Card variant="elevated" className="p-6">
          <div className="flex items-start space-x-4">
            <img
              src={currentUser.avatar || `https://ui-avatars.com/api/?name=${currentUser.name || currentUser.email}&background=3b82f6&color=fff`}
              alt={currentUser.name || currentUser.email}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <form onSubmit={handleSubmitComment}>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={replyTo ? `Répondre à ${replyTo.author}...` : "Ajouter un commentaire..."}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none"
                  rows="3"
                  required
                />
                
                {replyTo && (
                  <div className="mt-2 mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Répondre à <span className="font-semibold">{replyTo.author}</span>
                    </p>
                    <button
                      type="button"
                      onClick={() => setReplyTo(null)}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1"
                    >
                      Annuler la réponse
                    </button>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Connecté en tant que <span className="font-semibold">{currentUser.name || currentUser.email}</span>
                  </span>
                  <Button
                    type="submit"
                    disabled={loading || !newComment.trim()}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0"
                  >
                    {loading ? 'Envoi...' : (replyTo ? 'Répondre' : 'Commenter')}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </Card>
      ) : (
        <Card variant="elevated" className="p-6 text-center">
          <FaUserCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Connectez-vous pour commenter
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Rejoignez la conversation en vous connectant à votre compte
          </p>
          <Button
            variant="primary"
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0"
          >
            Se connecter
          </Button>
        </Card>
      )}

      {/* Liste des commentaires */}
      {comments.length > 0 ? (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Commentaires ({comments.length})
          </h3>
          {comments.map(comment => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <FaUserCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Aucun commentaire pour le moment
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Soyez le premier à partager votre avis !
          </p>
        </div>
      )}

      {/* Gestion des erreurs */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
          <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
