import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Bot, User, Loader, MessageSquare } from 'lucide-react';

const ChatbotSimple = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // Utiliser un sessionId persistant
  const [sessionId] = useState(() => {
    const savedSessionId = localStorage.getItem('chatbot_simple_session');
    return savedSessionId || `simple-session-${Date.now()}`;
  });
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
    localStorage.setItem('chatbot_simple_session', sessionId);
  }, [sessionId]);

  // Charger les messages depuis localStorage au montage
  useEffect(() => {
    const savedMessages = localStorage.getItem(`chatbot_messages_${sessionId}`);
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        setMessages(parsedMessages);
        console.log('📚 Messages chargés depuis localStorage:', parsedMessages.length);
      } catch (error) {
        console.error('Erreur lors du chargement depuis localStorage:', error);
      }
    }
  }, [sessionId]);

  // Sauvegarder automatiquement les messages à chaque changement
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`chatbot_messages_${sessionId}`, JSON.stringify(messages));
    }
  }, [messages, sessionId]);

  // Ajouter un message de bienvenue au démarrage
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: Date.now(),
        type: 'bot',
        content: 'Bonjour ! Je suis le chatbot FASTCUBE. Comment puis-je vous aider ?',
        timestamp: new Date()
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
      const response = await fetch('http://localhost:8002/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          session_id: sessionId,
          user_id: 'user-123'
        })
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: data.response,
        timestamp: new Date(),
        intent: data.intent,
        confidence: data.confidence
      };

      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);

      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Désolé, je rencontre un problème technique. Veuillez réessayer.',
        timestamp: new Date()
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

  // Fonction pour formater l'horodatage
  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <>
      {/* Bouton de chat flottant */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50"
          aria-label="Ouvrir le chat"
        >
          <MessageSquare size={24} />
        </button>
      )}

      {/* Fenêtre de chat */}
      {isOpen && (
        <div className="fixed top-0 right-0 h-full w-96 bg-white shadow-2xl border-l border-gray-200 flex flex-col z-50">
          {/* En-tête du chat */}
          <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot size={20} />
              <h3 className="font-semibold">Chatbot FASTCUBE</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-blue-700 p-1 rounded transition-colors"
              aria-label="Fermer le chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Zone de messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.type === 'bot' && <Bot size={16} className="mt-1 flex-shrink-0" />}
                    {message.type === 'user' && <User size={16} className="mt-1 flex-shrink-0" />}
                    <div className="flex-1">
                      <p className="text-sm">{message.content}</p>
                      <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                        <span>{formatTime(message.timestamp)}</span>
                        {message.intent && (
                          <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded">
                            {message.intent}
                          </span>
                        )}
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
                  <span className="text-sm">Le chatbot réfléchit...</span>
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
                placeholder="Tapez votre message..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={false}
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-2 rounded-lg transition-colors"
                aria-label="Envoyer le message"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotSimple;


