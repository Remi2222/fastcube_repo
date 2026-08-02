import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaCalendar, FaUser, FaTag } from 'react-icons/fa';

export default function BlogPostCard({ post }) {
  // Safety check for post data
  if (!post || !post.title) {
    return (
      <div className="bg-white dark:bg-gray-700 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-600 p-6 animate-pulse">
        <div className="h-48 bg-gray-200 rounded-xl mb-4"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 bg-gray-200 rounded mb-4 w-2/3"></div>
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <article className="group bg-white dark:bg-gray-700 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-600 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={post.image || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80'}
          alt={post.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Meta Information */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <FaCalendar className="w-3 h-3" />
              <span>{formatDate(post.date)}</span>
            </div>
            {post.author && (
              <div className="flex items-center space-x-1">
                <FaUser className="w-3 h-3" />
                <span>{post.author}</span>
              </div>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-2">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed line-clamp-3">
          {post.excerpt}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.slice(0, 3).map((tag, index) => (
              <span
                key={`${post.id}-tag-${index}`}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
              >
                <FaTag className="w-2 h-2 mr-1" />
                {tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300">
                +{post.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Read More Button */}
        <div className="flex items-center justify-between">
          <Link
            to={`/blog/${post.id}`}
            className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 text-sm group"
          >
            Lire
            <FaArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
          
          {/* Reading Time Estimate */}
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {Math.ceil((post.excerpt?.length || 0) / 200)} min de lecture
          </span>
        </div>
      </div>
    </article>
  );
} 