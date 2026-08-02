import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader, Brain, Zap, Target, TrendingUp } from 'lucide-react';

const ClaudeStyleChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // Utiliser un sessionId persistant
  const [sessionId] = useState(() => {
    const savedSessionId = localStorage.getItem('claude_style_session');
    return savedSessionId || `claude-session-${Date.now()}`;
  });
  const [insights, setInsights] = useState(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll vers le bas des messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Sauvegarder le sessionId pour la persistance
  useEffect(() => {
    localStorage.setItem('claude_style_session', sessionId);
  }, [sessionId]);

  // Charger les messages depuis localStorage au montage
  useEffect(() => {
    const savedMessages = localStorage.getItem(`claude_messages_${sessionId}`);
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        setMessages(parsedMessages);
        console.log('📚 Messages Claude chargés depuis localStorage:', parsedMessages.length);
      } catch (error) {
        console.error('Erreur lors du chargement depuis localStorage:', error);
      }
    }
  }, [sessionId]);

  // Sauvegarder automatiquement les messages à chaque changement
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`claude_messages_${sessionId}`, JSON.stringify(messages));
    }
  }, [messages, sessionId]);

  // Ajouter un message de bienvenue au démarrage
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: Date.now(),
        type: 'bot',
        content: 'Salut ! Je suis l\'assistant Claude-style de FastCube. Je peux t\'aider avec des analyses approfondies, des explications détaillées et des conseils personnalisés. Que veux-tu savoir ?',
        timestamp: new Date(),
        confidence: 1.0,
        analysis: { complexity: 'simple', messageType: 'greeting' }
      }]);
    }
  }, [isOpen, messages.length]);

  // Fonction pour envoyer un message
  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8001/chatbot/claude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: inputMessage,
          session_id: sessionId,
          user_id: 8,
          user_name: 'Utilisateur'
        })
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: data.data?.response || 'Désolé, je n\'ai pas pu générer de réponse.',
        timestamp: new Date(),
        confidence: data.data?.confidence || 0.5,
        analysis: data.data?.analysis,
        suggestions: data.data?.suggestions || []
      };

      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Désolé, je rencontre un problème technique. Veuillez réessayer dans quelques instants.',
        timestamp: new Date(),
        confidence: 0.0,
        analysis: { complexity: 'simple', messageType: 'error' }
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour gérer la touche Entrée
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Fonction pour charger les insights
  const loadInsights = async () => {
    try {
      const response = await fetch('http://localhost:8001/chatbot/claude/insights');
      if (response.ok) {
        const data = await response.json();
        setInsights(data.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des insights:', error);
    }
  };

  // Fonction pour formater la complexité
  const getComplexityColor = (complexity) => {
    switch (complexity) {
      case 'expert': return 'text-red-600 bg-red-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'simple': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Fonction pour formater le type de message
  const getMessageTypeIcon = (messageType) => {
    switch (messageType) {
      case 'explanation_request': return <Brain className="w-4 h-4" />;
      case 'help_request': return <Target className="w-4 h-4" />;
      case 'creation_request': return <Zap className="w-4 h-4" />;
      default: return <Bot className="w-4 h-4" />;
    }
  };

  return (
    <>
      {/* Bouton flottant */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 z-50"
        title="Chatbot Claude-style"
      >
        <Brain size={24} />
      </button>

      {/* Interface du chatbot */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-40">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain size={20} />
              <div>
                <h3 className="font-semibold">Claude-style Assistant</h3>
                <p className="text-xs opacity-90">Analyse intelligente & réponses réfléchies</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              ×
            </button>
          </div>

          {/* Zone de messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                  <div className={`flex items-start space-x-2 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-purple-600 text-white'
                    }`}>
                      {message.type === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <div className={`rounded-lg p-3 ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      
                      {/* Métadonnées pour les messages du bot */}
                      {message.type === 'bot' && message.analysis && (
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center space-x-2 text-xs">
                            <span className={`px-2 py-1 rounded-full ${getComplexityColor(message.analysis.complexity)}`}>
                              {message.analysis.complexity}
                            </span>
                            <span className="flex items-center space-x-1 text-gray-500">
                              {getMessageTypeIcon(message.analysis.messageType)}
                              <span>{message.analysis.messageType}</span>
                            </span>
                          </div>
                          
                          {/* Confiance masquée pour l'utilisateur final */}
                          {false && message.confidence && (
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              <TrendingUp size={12} />
                              <span>Confiance: {Math.round(message.confidence * 100)}%</span>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg flex items-center space-x-2">
                  <Bot size={16} />
                  <Loader className="animate-spin" size={16} />
                  <span className="text-sm">Analyse en cours...</span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Zone de saisie */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Posez une question complexe..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={false}
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim()}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white p-2 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
                aria-label="Envoyer le message"
              >
                <Send size={20} />
              </button>
            </div>
            
            {/* Bouton pour charger les insights */}
            <div className="mt-2 flex justify-center">
              <button
                onClick={loadInsights}
                className="text-xs text-gray-500 hover:text-purple-600 transition-colors"
              >
                Voir les insights de performance
              </button>
            </div>
          </div>

          {/* Panel d'insights */}
          {insights && (
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <h4 className="font-semibold text-sm mb-2">Insights de Performance</h4>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="font-medium">Conversations actives:</span> {insights.conversation_count}
                </div>
                {insights.improvement_areas.length > 0 && (
                  <div>
                    <span className="font-medium">Domaines d'amélioration:</span>
                    <ul className="list-disc list-inside ml-2">
                      {insights.improvement_areas.map((area, index) => (
                        <li key={index}>{area}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ClaudeStyleChatbot;
