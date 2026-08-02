import React, { useState } from 'react';
import ChatbotEnhanced from '../components/ChatbotEnhanced';
import ChatbotSimple from '../components/ChatbotSimple';
import ChatbotAdvanced from '../components/ChatbotAdvanced';

const ChatbotDemo = () => {
  const [selectedChatbot, setSelectedChatbot] = useState('enhanced');

  const chatbots = {
    enhanced: {
      name: 'Chatbot Enhanced',
      description: 'Version complète avec logs en temps réel et fonctionnalités avancées',
      component: ChatbotEnhanced
    },
    simple: {
      name: 'Chatbot Simple',
      description: 'Version simplifiée pour les pages basiques',
      component: ChatbotSimple
    },
    advanced: {
      name: 'Chatbot Advanced',
      description: 'Version avancée avec paramètres et animations',
      component: ChatbotAdvanced
    }
  };

  const SelectedChatbot = chatbots[selectedChatbot].component;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Démonstration du Chatbot FASTCUBE
          </h1>
          <p className="text-gray-600 mb-8">
            Testez les différentes versions du chatbot avec intelligence contextuelle
          </p>

          {}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Choisissez une version du chatbot :
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(chatbots).map(([key, chatbot]) => (
                <button
                  key={key}
                  onClick={() => setSelectedChatbot(key)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    selectedChatbot === key
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <h3 className="font-semibold mb-2">{chatbot.name}</h3>
                  <p className="text-sm opacity-75">{chatbot.description}</p>
                </button>
              ))}
            </div>
          </div>

          {}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {chatbots[selectedChatbot].name}
            </h3>
            <p className="text-gray-600 mb-4">
              {chatbots[selectedChatbot].description}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Fonctionnalités :</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {selectedChatbot === 'enhanced' && (
                    <>
                      <li>• Logs en temps réel</li>
                      <li>• Analyse d'intention</li>
                      <li>• Extraction d'entités</li>
                      <li>• Gestion de la mémoire</li>
                      <li>• Suggestions contextuelles</li>
                    </>
                  )}
                  {selectedChatbot === 'simple' && (
                    <>
                      <li>• Interface simplifiée</li>
                      <li>• Messages de base</li>
                      <li>• Horodatage</li>
                      <li>• Indicateur de confiance</li>
                    </>
                  )}
                  {selectedChatbot === 'advanced' && (
                    <>
                      <li>• Paramètres personnalisables</li>
                      <li>• Animations avancées</li>
                      <li>• Mode réduit</li>
                      <li>• Logs détaillés</li>
                      <li>• Interface responsive</li>
                    </>
                  )}
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Instructions :</h4>
                <ol className="text-sm text-gray-600 space-y-1">
                  <li>1. Cliquez sur le bouton de chat en bas à droite</li>
                  <li>2. Tapez un message dans la zone de saisie</li>
                  <li>3. Observez la réponse du chatbot</li>
                  <li>4. {selectedChatbot === 'enhanced' && 'Consultez les logs en bas'}
                      {selectedChatbot === 'simple' && 'Vérifiez l\'intention détectée'}
                      {selectedChatbot === 'advanced' && 'Explorez les paramètres en haut'}</li>
                </ol>
              </div>
            </div>
          </div>

          {}
          <div className="bg-blue-50 rounded-lg p-6">
            <h4 className="font-medium text-blue-800 mb-3">
              Messages de test suggérés :
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-white rounded p-3">
                <strong className="text-blue-700">Salutation :</strong>
                <p className="text-sm text-gray-600">"Bonjour, comment allez-vous ?"</p>
              </div>
              <div className="bg-white rounded p-3">
                <strong className="text-blue-700">Demande de devis :</strong>
                <p className="text-sm text-gray-600">"Je voudrais un devis pour un site web"</p>
              </div>
              <div className="bg-white rounded p-3">
                <strong className="text-blue-700">Support technique :</strong>
                <p className="text-sm text-gray-600">"J'ai un problème avec mon site"</p>
              </div>
              <div className="bg-white rounded p-3">
                <strong className="text-blue-700">Information géographique :</strong>
                <p className="text-sm text-gray-600">"Quelle est la capitale de la France ?"</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {}
      <SelectedChatbot />
    </div>
  );
};

export default ChatbotDemo;


