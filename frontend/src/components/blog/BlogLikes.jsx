import React, { useState, useEffect } from 'react';
import { FaHeart, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { API_BASE_URL } from "../config/api";
import { Button } from '../ui';

export default function BlogLikes({ articleId, currentUser, initialLikes = 0, initialDislikes = 0 }) {
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [userLiked, setUserLiked] = useState(false);
  const [userDisliked, setUserDisliked] = useState(false);
  const [loading, setLoading] = useState(false);

  // Charger l'état des likes de l'utilisateur
  useEffect(() => {
    if (currentUser) {
      fetchUserLikeStatus();
    }
  }, [currentUser, articleId]);

  const fetchUserLikeStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/blog/articles/${articleId}/like-status`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserLiked(data.userLiked || false);
        setUserDisliked(data.userDisliked || false);
      }
    } catch (err) {
      console.error('Error fetching like status:', err);
    }
  };

  const handleLike = async (isLike = true) => {
    if (!currentUser) {
      // Rediriger vers la page de connexion
      window.location.href = '/login';
      return;
    }

    if (loading) return;

    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/api/blog/articles/${articleId}/like`, {
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
        setLikes(data.data.likes);
        setDislikes(data.data.dislikes);
        setUserLiked(data.data.userLiked);
        setUserDisliked(data.data.userDisliked);
      }
    } catch (err) {
      console.error('Error handling like:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLikeClick = () => {
    if (userLiked) {
      // Si déjà liké, retirer le like
      handleLike(true);
    } else {
      // Ajouter un like
      handleLike(true);
      // Si disliké, retirer le dislike
      if (userDisliked) {
        handleLike(false);
      }
    }
  };

  const handleDislikeClick = () => {
    if (userDisliked) {
      // Si déjà disliké, retirer le dislike
      handleLike(false);
    } else {
      // Ajouter un dislike
      handleLike(false);
      // Si liké, retirer le like
      if (userLiked) {
        handleLike(true);
      }
    }
  };

  return (
    <div className="flex items-center space-x-4">
      {/* Bouton Like */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLikeClick}
        disabled={loading}
        className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
          userLiked 
            ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700' 
            : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20'
        }`}
      >
        <FaHeart className={`w-4 h-4 ${userLiked ? 'fill-current text-blue-600' : ''}`} />
        <span className="text-sm font-medium">{likes}</span>
      </Button>

      {/* Bouton Dislike */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDislikeClick}
        disabled={loading}
        className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
          userDisliked 
            ? 'text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700' 
            : 'text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
        }`}
      >
        <FaThumbsDown className={`w-4 h-4 ${userDisliked ? 'fill-current text-red-600' : ''}`} />
        <span className="text-sm font-medium">{dislikes}</span>
      </Button>

      {/* Indicateur de chargement */}
      {loading && (
        <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
      )}
    </div>
  );
}






























