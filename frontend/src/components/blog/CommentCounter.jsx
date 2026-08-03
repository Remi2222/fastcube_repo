import React, { useState, useEffect } from 'react';
import { FaComments, FaComment } from 'react-icons/fa';
import { API_BASE_URL } from "../../config/api";

export default function CommentCounter({ articleId, initialCount = 0, onCountChange }) {
  const [commentCount, setCommentCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  // Charger le nombre réel de commentaires
  useEffect(() => {
    fetchCommentCount();
  }, [articleId]);

  const fetchCommentCount = async () => {
    try {
      setLoading(true);
      
      // Appel API pour récupérer le nombre de commentaires
      const response = await fetch(`${API_BASE_URL}/api/blog/articles/${articleId}/comments/count`);
      
      if (response.ok) {
        const data = await response.json();
        const newCount = data.count || 0;
        setCommentCount(newCount);
        
        // Notifier le composant parent du changement
        if (onCountChange) {
          onCountChange(newCount);
        }
      }
    } catch (err) {
      console.error('Error fetching comment count:', err);
      // Garder le count initial en cas d'erreur
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour le compteur (appelé quand un commentaire est ajouté/supprimé)
  const updateCount = (newCount) => {
    setCommentCount(newCount);
    if (onCountChange) {
      onCountChange(newCount);
    }
  };

  // Formater le nombre de commentaires
  const formatCommentCount = (count) => {
    if (count === 0) return '0';
    if (count === 1) return '1';
    if (count < 1000) return count.toString();
    if (count < 1000000) return `${(count / 1000).toFixed(1)}K`;
    return `${(count / 1000000).toFixed(1)}M`;
  };

  // Exposer la fonction de mise à jour pour les composants parents
  React.useImperativeHandle(React.useRef(), () => ({
    updateCount,
    refresh: fetchCommentCount
  }));

  return (
    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
      <div className="flex items-center space-x-1">
        {commentCount > 0 ? (
          <FaComments className="w-4 h-4 text-blue-500" />
        ) : (
          <FaComment className="w-4 h-4" />
        )}
        <span className="font-medium">
          {loading ? '...' : formatCommentCount(commentCount)}
        </span>
      </div>
      {commentCount === 0 && (
        <span className="text-xs text-gray-400">
          Aucun commentaire
        </span>
      )}
    </div>
  );
}






























