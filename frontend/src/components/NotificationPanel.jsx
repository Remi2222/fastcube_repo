import React from 'react';
import { 
  FaTimes, FaCheck, FaTrash, FaBell, FaTicketAlt, FaExclamationTriangle, 
  FaCheckCircle, FaEnvelope, FaUser, FaCog, FaClock, FaEye
} from 'react-icons/fa';
import { useNotifications } from '../contexts/NotificationContext';

const NotificationPanel = () => {
  const {
    notifications,
    unreadCount,
    isOpen,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    closeNotifications,
    getUnreadNotifications
  } = useNotifications();

  if (!isOpen) return null;

  const getIcon = (type, icon) => {
    const iconMap = {
      ticket: FaTicketAlt,
      warning: FaExclamationTriangle,
      check: FaCheckCircle,
      message: FaEnvelope,
      user: FaUser,
      system: FaCog
    };
    
    return iconMap[icon] || FaBell;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-50 dark:bg-red-900/20';
      case 'medium': return 'text-orange-500 bg-orange-50 dark:bg-orange-900/20';
      case 'low': return 'text-green-500 bg-green-50 dark:bg-green-900/20';
      default: return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
    }
  };

  const getTypeColor = (color) => {
    const colorMap = {
      blue: 'text-blue-500',
      orange: 'text-orange-500',
      green: 'text-green-500',
      purple: 'text-purple-500',
      red: 'text-red-500',
      gray: 'text-gray-500'
    };
    
    return colorMap[color] || 'text-blue-500';
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes}min`;
    if (hours < 24) return `Il y a ${hours}h`;
    return `Il y a ${days}j`;
  };

  const unreadNotifications = getUnreadNotifications();

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={closeNotifications}
      />
      
      {/* Panel */}
      <div className="absolute right-4 top-20 w-96 max-w-sm bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 animate-slide-in-down">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <FaBell className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Notifications
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  title="Tout marquer comme lu"
                >
                  <FaCheck className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={closeNotifications}
                className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaBell className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Aucune notification
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Vous n'avez pas de nouvelles notifications
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
              {notifications.map((notification) => {
                const Icon = getIcon(notification.type, notification.icon);
                const isUnread = !notification.read;
                
                return (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors duration-200 ${
                      isUnread ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className={`p-2 rounded-lg ${getPriorityColor(notification.priority)}`}>
                        <Icon className={`w-4 h-4 ${getTypeColor(notification.color)}`} />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h4 className={`text-sm font-semibold ${
                              isUnread 
                                ? 'text-gray-900 dark:text-white' 
                                : 'text-gray-700 dark:text-gray-300'
                            }`}>
                              {notification.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                <FaClock className="w-3 h-3" />
                                {formatTime(notification.timestamp)}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(notification.priority)}`}>
                                {notification.priority}
                              </span>
                            </div>
                          </div>
                          
                          {/* Actions */}
                          <div className="flex items-center gap-1">
                            {isUnread && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                title="Marquer comme lu"
                              >
                                <FaEye className="w-3 h-3" />
                              </button>
                            )}
                            <button
                              onClick={() => removeNotification(notification.id)}
                              className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                              title="Supprimer"
                            >
                              <FaTrash className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {notifications.length} notification{notifications.length > 1 ? 's' : ''}
              </span>
              <button
                onClick={clearAllNotifications}
                className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
              >
                Tout supprimer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;










