import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function ViewCounter({ articleId, initialViews = 0 }) {
  const [views, setViews] = useState(initialViews);
  const [hasViewed, setHasViewed] = useState(false);
  const [loading, setLoading] = useState(false);

  // Vérifier si l'utilisateur a déjà vu cet article
  useEffect(() => {
    const viewedArticles = JSON.parse(localStorage.getItem('viewedArticles') || '[]');
    if (viewedArticles.includes(articleId)) {
      setHasViewed(true);
    }
  }, [articleId]);

  // Incrémenter le compteur de vues
  useEffect(() => {
    if (!hasViewed) {
      incrementViewCount();
    }
  }, [hasViewed]);

  const incrementViewCount = async () => {
    try {
      setLoading(true);
      
      // Appel API pour incrémenter les vues
      const response = await fetch(`http://localhost:5000/api/blog/articles/${articleId}/view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setViews(data.views);
        
        // Marquer comme vu dans le localStorage
        const viewedArticles = JSON.parse(localStorage.getItem('viewedArticles') || '[]');
        if (!viewedArticles.includes(articleId)) {
          viewedArticles.push(articleId);
          localStorage.setItem('viewedArticles', JSON.stringify(viewedArticles));
          setHasViewed(true);
        }
      } else {
        // Fallback : incrémenter localement
        setViews(prev => prev + 1);
        setHasViewed(true);
      }
    } catch (err) {
      console.error('Error incrementing view count:', err);
      // Fallback : incrémenter localement
      setViews(prev => prev + 1);
      setHasViewed(true);
    } finally {
      setLoading(false);
    }
  };

  // Formater le nombre de vues
  const formatViews = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
      <div className="flex items-center space-x-1">
        {hasViewed ? (
          <FaEye className="w-4 h-4 text-blue-500" />
        ) : (
          <FaEyeSlash className="w-4 h-4" />
        )}
        <span className="font-medium">
          {loading ? '...' : formatViews(views)}
        </span>
      </div>
      {!hasViewed && (
        <span className="text-xs text-blue-500 animate-pulse">
          +1
        </span>
      )}
    </div>
  );
}






























