import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, userRole } = useAuth();

  
  const NOTIFICATION_TYPES = {
    TICKET_UPDATE: 'ticket_update',
    TICKET_CREATED: 'ticket_created',
    TICKET_RESOLVED: 'ticket_resolved',
    SYSTEM_ALERT: 'system_alert',
    MAINTENANCE: 'maintenance',
    NEW_MESSAGE: 'new_message',
    ACCOUNT_UPDATE: 'account_update'
  };

  
  const generateDemoNotifications = () => {
    if (!isLoggedIn) return [];

    const demoNotifications = [
      {
        id: 1,
        type: NOTIFICATION_TYPES.TICKET_UPDATE,
        title: 'Ticket #1234 mis à jour',
        message: 'Votre ticket de support a été mis à jour par notre équipe technique.',
        timestamp: new Date(Date.now() - 1000 * 60 * 5), 
        read: false,
        priority: 'medium',
        icon: 'ticket',
        color: 'blue'
      },
      {
        id: 2,
        type: NOTIFICATION_TYPES.SYSTEM_ALERT,
        title: 'Maintenance programmée',
        message: 'Une maintenance est prévue demain de 2h à 4h du matin.',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), 
        read: false,
        priority: 'high',
        icon: 'warning',
        color: 'orange'
      },
      {
        id: 3,
        type: NOTIFICATION_TYPES.TICKET_RESOLVED,
        title: 'Ticket #1230 résolu',
        message: 'Votre problème de connexion a été résolu avec succès.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), 
        read: true,
        priority: 'low',
        icon: 'check',
        color: 'green'
      },
      {
        id: 4,
        type: NOTIFICATION_TYPES.NEW_MESSAGE,
        title: 'Nouveau message',
        message: 'Vous avez reçu un nouveau message de notre équipe support.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), 
        read: true,
        priority: 'medium',
        icon: 'message',
        color: 'purple'
      },
      {
        id: 5,
        type: NOTIFICATION_TYPES.ACCOUNT_UPDATE,
        title: 'Profil mis à jour',
        message: 'Vos informations de profil ont été mises à jour avec succès.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), 
        read: true,
        priority: 'low',
        icon: 'user',
        color: 'gray'
      }
    ];

    return demoNotifications;
  };

  
  useEffect(() => {
    if (isLoggedIn) {
      const demoNotifications = generateDemoNotifications();
      setNotifications(demoNotifications);
      const unread = demoNotifications.filter(n => !n.read).length;
      setUnreadCount(unread);
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [isLoggedIn]);

  
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      timestamp: new Date(),
      read: false,
      priority: 'medium',
      color: 'blue',
      ...notification
    };

    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
  };

  
  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  
  const removeNotification = (notificationId) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === notificationId);
      const newNotifications = prev.filter(n => n.id !== notificationId);
      
      if (notification && !notification.read) {
        setUnreadCount(count => Math.max(0, count - 1));
      }
      
      return newNotifications;
    });
  };

  
  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  
  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };

  
  const closeNotifications = () => {
    setIsOpen(false);
  };

  
  const getUnreadNotifications = () => {
    return notifications.filter(notification => !notification.read);
  };

  
  const getNotificationsByType = (type) => {
    return notifications.filter(notification => notification.type === type);
  };

  
  const getNotificationsByPriority = (priority) => {
    return notifications.filter(notification => notification.priority === priority);
  };

  const value = {
    notifications,
    unreadCount,
    isOpen,
    NOTIFICATION_TYPES,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    toggleNotifications,
    closeNotifications,
    getUnreadNotifications,
    getNotificationsByType,
    getNotificationsByPriority
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};












