import React from 'react';
import { Link } from 'react-router-dom';
import { FaCalendar, FaArrowRight, FaTag } from 'react-icons/fa';

export default function BlogPostCard({ post, title, excerpt, date, tags, id, image }) {
  // Support both object and individual props
  const postData = post || { title, excerpt, date, tags, id, image };
  
  // Safety check - if no data is provided, return null or a placeholder
  if (!postData || !postData.title) {
    return (
      <article className="group">
        <div className="card h-full">
          <div className="card-body">
            <p className="text-gray-500">Article non disponible</p>
          </div>
        </div>
      </article>
    );
  }
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <article className="group">
      <div className="card h-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
        {/* Image */}
        {postData.image && (
          <div className="relative overflow-hidden">
            <img
              src={postData.image}
              alt={postData.title}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        )}

        <div className="card-body">
          {/* Meta Information */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <div className="flex items-center space-x-2">
              <FaCalendar className="w-4 h-4" />
              <span>{formatDate(postData.date)}</span>
            </div>
            {postData.tags && postData.tags.length > 0 && (
              <div className="flex items-center space-x-1">
                <FaTag className="w-3 h-3" />
                <span className="text-xs">{postData.tags[0]}</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors duration-300 line-clamp-2">
            {postData.title}
          </h3>

          {/* Excerpt */}
          <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">
            {postData.excerpt}
          </p>

          {/* Tags */}
          {postData.tags && postData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {postData.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={`${tag-item-${index}}`}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700 hover:bg-primary-200 transition-colors duration-200"
                >
                  {tag}
                </span>
              ))}
              {postData.tags.length > 3 && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  +{postData.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* CTA Link */}
          <div className="mt-auto">
            <Link 
              to={`/blog/${postData.id}`}
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium group/link transition-colors duration-200"
            >
              Lire l'article
              <FaArrowRight className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>
        </div>

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-secondary-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      </div>
    </article>
  );
} 