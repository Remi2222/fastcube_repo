import React from 'react';
import { useNotificationActions } from '../hooks/useNotificationActions';
import { useAuth } from '../contexts/AuthContext';
import { FaBell, FaTicketAlt, FaExclamationTriangle, FaCog, FaEnvelope, FaUser } from 'react-icons/fa';

const NotificationDemo = () => {
  const { isLoggedIn } = useAuth();
  const {
    notifyTicketUpdate,
    notifyTicketCreated,
    notifyTicketResolved,
    notifySystemAlert,
    notifyMaintenance,
    notifyNewMessage,
    notifyAccountUpdate
  } = useNotificationActions();

  if (!isLoggedIn) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2">
          <FaBell className="w-5 h-5 text-yellow-600" />
          <p className="text-yellow-800 dark:text-yellow-200">
            Connectez-vous pour voir les notifications en action
          </p>
        </div>
      </div>
    );
  }

  // Générer des IDs dynamiques pour les démonstrations
  const generateDemoId = () => Math.floor(Math.random() * 9000) + 1000;
  
  const demoActions = [
    {
      title: 'Ticket mis à jour',
      description: 'Simuler une mise à jour de ticket',
      icon: FaTicketAlt,
      color: 'blue',
      action: () => notifyTicketUpdate(generateDemoId().toString(), 'Votre ticket a été assigné à un technicien')
    },
    {
      title: 'Nouveau ticket',
      description: 'Créer un nouveau ticket',
      icon: FaTicketAlt,
      color: 'green',
      action: () => notifyTicketCreated(generateDemoId().toString())
    },
    {
      title: 'Ticket résolu',
      description: 'Marquer un ticket comme résolu',
      icon: FaTicketAlt,
      color: 'green',
      action: () => notifyTicketResolved(generateDemoId().toString())
    },
    {
      title: 'Alerte système',
      description: 'Envoyer une alerte système',
      icon: FaExclamationTriangle,
      color: 'red',
      action: () => notifySystemAlert('Alerte système', 'Problème de performance détecté', 'high')
    },
    {
      title: 'Maintenance',
      description: 'Notifier une maintenance',
      icon: FaCog,
      color: 'orange',
      action: () => notifyMaintenance('Maintenance prévue demain de 2h à 4h')
    },
    {
      title: 'Nouveau message',
      description: 'Simuler un nouveau message',
      icon: FaEnvelope,
      color: 'purple',
      action: () => notifyNewMessage('Support Technique', 'Nous avons besoin de plus d\'informations')
    },
    {
      title: 'Profil mis à jour',
      description: 'Confirmer une mise à jour de profil',
      icon: FaUser,
      color: 'gray',
      action: () => notifyAccountUpdate('Vos informations ont été mises à jour avec succès')
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
          <FaBell className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Démonstration des Notifications
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Testez le système de notifications en temps réel
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {demoActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={action.action}
              className={`group p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-${action.color}-300 dark:hover:border-${action.color}-600 transition-all duration-300 hover:shadow-lg hover:scale-105`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg bg-${action.color}-100 dark:bg-${action.color}-900/20`}>
                  <Icon className={`w-5 h-5 text-${action.color}-600 dark:text-${action.color}-400`} />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {action.title}
                </h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-left">
                {action.description}
              </p>
            </button>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
          💡 Comment utiliser les notifications
        </h4>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• Cliquez sur l'icône de cloche dans la navbar pour voir vos notifications</li>
          <li>• Le badge rouge indique le nombre de notifications non lues</li>
          <li>• Vous pouvez marquer les notifications comme lues ou les supprimer</li>
          <li>• Les notifications sont automatiquement générées lors des actions importantes</li>
        </ul>
      </div>
    </div>
  );
};

export default NotificationDemo;










