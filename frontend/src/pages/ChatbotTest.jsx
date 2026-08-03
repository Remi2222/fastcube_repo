import React, { useState, useEffect } from 'react';
import ChatbotWidget from '../components/ChatbotWidget';
import { Database, User, MessageSquare, Settings, BarChart3 } from 'lucide-react';
import { API_BASE_URL } from "../config/api";

const ChatbotTest = () => {
  const [userId, setUserId] = useState('1'); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [stats, setStats] = useState(null);
  const [preferences, setPreferences] = useState(null);

  
  useEffect(() => {
    
    setUserInfo({
      id: userId,
      username: 'Test User',
      email: 'test@fastcube.com'
    });
    setIsLoggedIn(true);
  }, [userId]);

  
  const loadUserStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chatbot/stats/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  
  const loadUserPreferences = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chatbot/preferences/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPreferences(data.preferences);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des préférences:', error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      loadUserStats();
      loadUserPreferences();
    }
  }, [isLoggedIn]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Test du Chatbot FASTCUBE avec Base de Données
          </h1>
          <p className="text-gray-600">
            Testez le chatbot avec persistance des messages et gestion des utilisateurs
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <User size={20} className="mr-2" />
                Informations Utilisateur
              </h2>
              
              {userInfo ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">ID Utilisateur</label>
                    <p className="text-lg font-semibold text-gray-900">{userInfo.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Nom d'utilisateur</label>
                    <p className="text-lg font-semibold text-gray-900">{userInfo.username}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-lg font-semibold text-gray-900">{userInfo.email}</p>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <button
                      onClick={() => setUserId(userId === '1' ? '2' : '1')}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                    >
                      Changer d'utilisateur (ID: {userId === '1' ? '2' : '1'})
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Chargement des informations utilisateur...</p>
              )}
            </div>

            {}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Settings size={20} className="mr-2" />
                Préférences
              </h2>
              
              {preferences ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Langue</label>
                    <p className="text-sm text-gray-900">{preferences.preferred_language}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Thème</label>
                    <p className="text-sm text-gray-900">{preferences.theme}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Style de communication</label>
                    <p className="text-sm text-gray-900">{preferences.communication_style}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={preferences.show_timestamps}
                        readOnly
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-600">Horodatages</span>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={preferences.show_confidence}
                        readOnly
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-600">Confiance</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Chargement des préférences...</p>
              )}
            </div>

            {}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <BarChart3 size={20} className="mr-2" />
                Statistiques
              </h2>
              
              {stats ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Messages totaux</label>
                    <p className="text-lg font-semibold text-gray-900">
                      {stats.reduce((sum, stat) => sum + stat.total_messages, 0)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Messages utilisateur</label>
                    <p className="text-lg font-semibold text-gray-900">
                      {stats.reduce((sum, stat) => sum + stat.user_messages, 0)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Messages bot</label>
                    <p className="text-lg font-semibold text-gray-900">
                      {stats.reduce((sum, stat) => sum + stat.bot_messages, 0)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Confiance moyenne</label>
                    <p className="text-lg font-semibold text-gray-900">
                      {stats.length > 0 ? (stats.reduce((sum, stat) => sum + (stat.avg_confidence || 0), 0) / stats.length * 100).toFixed(1) : 0}%
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Chargement des statistiques...</p>
              )}
            </div>
          </div>

          {}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <MessageSquare size={20} className="mr-2" />
                Test du Chatbot
              </h2>
              
              <div className="space-y-4">
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
                    <div>• Persistance des préférences</div>
                    <div>• Statistiques d'utilisation</div>
                    <div>• Logs en temps réel</div>
                    <div>• Changement d'utilisateur</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Informations sur la base de données */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Database size={20} className="mr-2" />
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
        variant="enhanced" 
        userId={userId} 
        showLogs={true}
        position="bottom-right"
        theme="blue"
      />
    </div>
  );
};

export default ChatbotTest;


