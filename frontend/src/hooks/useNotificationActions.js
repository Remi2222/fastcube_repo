import { useNotifications } from '../contexts/NotificationContext';

export const useNotificationActions = () => {
  const { addNotification, NOTIFICATION_TYPES } = useNotifications();

  
  const notifyTicketUpdate = (ticketId, message) => {
    addNotification({
      type: NOTIFICATION_TYPES.TICKET_UPDATE,
      title: `Ticket #${ticketId} mis à jour`,
      message: message,
      priority: 'medium',
      icon: 'ticket',
      color: 'blue'
    });
  };

  
  const notifyTicketCreated = (ticketId) => {
    addNotification({
      type: NOTIFICATION_TYPES.TICKET_CREATED,
      title: `Nouveau ticket #${ticketId}`,
      message: 'Votre ticket de support a été créé avec succès.',
      priority: 'low',
      icon: 'ticket',
      color: 'green'
    });
  };

  
  const notifyTicketResolved = (ticketId) => {
    addNotification({
      type: NOTIFICATION_TYPES.TICKET_RESOLVED,
      title: `Ticket #${ticketId} résolu`,
      message: 'Votre problème a été résolu avec succès.',
      priority: 'low',
      icon: 'check',
      color: 'green'
    });
  };

  
  const notifySystemAlert = (title, message, priority = 'medium') => {
    addNotification({
      type: NOTIFICATION_TYPES.SYSTEM_ALERT,
      title: title,
      message: message,
      priority: priority,
      icon: 'warning',
      color: priority === 'high' ? 'red' : 'orange'
    });
  };

  
  const notifyMaintenance = (message) => {
    addNotification({
      type: NOTIFICATION_TYPES.MAINTENANCE,
      title: 'Maintenance programmée',
      message: message,
      priority: 'high',
      icon: 'warning',
      color: 'orange'
    });
  };

  
  const notifyNewMessage = (sender, message) => {
    addNotification({
      type: NOTIFICATION_TYPES.NEW_MESSAGE,
      title: `Nouveau message de ${sender}`,
      message: message,
      priority: 'medium',
      icon: 'message',
      color: 'purple'
    });
  };

  
  const notifyAccountUpdate = (message) => {
    addNotification({
      type: NOTIFICATION_TYPES.ACCOUNT_UPDATE,
      title: 'Profil mis à jour',
      message: message,
      priority: 'low',
      icon: 'user',
      color: 'gray'
    });
  };

  return {
    notifyTicketUpdate,
    notifyTicketCreated,
    notifyTicketResolved,
    notifySystemAlert,
    notifyMaintenance,
    notifyNewMessage,
    notifyAccountUpdate
  };
};












