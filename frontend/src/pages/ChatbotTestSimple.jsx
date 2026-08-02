import React, { useState } from 'react';
import ChatbotWidget from '../components/ChatbotWidget';

const ChatbotTestSimple = () => {
  const [userId, setUserId] = useState('1');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Test du Chatbot FASTCUBE
          </h1>
          <p className="text-gray-600">
            Testez le chatbot avec persistance des messages en base de données
          </p>
        </div>

        {}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Contrôles de Test
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID Utilisateur de Test
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Entrez un ID utilisateur"
                />
                <button
                  onClick={() => setUserId(userId === '1' ? '2' : '1')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Changer (ID: {userId === '1' ? '2' : '1'})
                </button>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-medium text-blue-800 mb-2">Instructions de test :</h3>
              <ol className="text-sm text-blue-700 space-y-1">
                <li>1. Cliquez sur le bouton de chat en bas à droite</li>
                <li>2. Tapez un message pour tester la communication</li>
                <li>3. Observez les logs en temps réel</li>
                <li>4. Vérifiez que les messages sont sauvegardés en base</li>
                <li>5. Changez d'utilisateur pour tester la persistance</li>
              </ol>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-medium text-green-800 mb-2">Messages de test suggérés :</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-green-700">
                <div>• "Bonjour, comment allez-vous ?"</div>
                <div>• "Je voudrais un devis pour un site web"</div>
                <div>• "J'ai un problème technique"</div>
                <div>• "Quelle est la capitale de la France ?"</div>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4">
              <h3 className="font-medium text-yellow-800 mb-2">Fonctionnalités testées :</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-yellow-700">
                <div>• Sauvegarde des messages en base</div>
                <div>• Gestion des sessions utilisateur</div>
                <div>• Logs en temps réel</div>
                <div>• Changement d'utilisateur</div>
                <div>• Interface responsive</div>
                <div>• Gestion des erreurs</div>
              </div>
            </div>
          </div>
        </div>

        {/* Informations sur la base de données */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Informations sur la Base de Données
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-2">Tables créées</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• chatbot_messages</li>
                <li>• chatbot_sessions</li>
                <li>• chatbot_user_preferences</li>
                <li>• chatbot_usage_stats</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-2">Vues créées</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• chatbot_user_stats</li>
                <li>• chatbot_recent_messages</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-2">Fonctionnalités</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Sauvegarde automatique</li>
                <li>• Gestion des sessions</li>
                <li>• Préférences utilisateur</li>
                <li>• Statistiques temps réel</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-2">API Endpoints</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• POST /api/chatbot/message</li>
                <li>• GET /api/chatbot/message/:userId</li>
                <li>• GET /api/chatbot/preferences/:userId</li>
                <li>• GET /api/chatbot/stats/:userId</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Widget du chatbot */}
      <ChatbotWidget
        userId={userId} 
        showLogs={false}
        position="full-right"
        theme="blue"
      />
    </div>
  );
};

export default ChatbotTestSimple;
