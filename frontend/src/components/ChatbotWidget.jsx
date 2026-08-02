import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { X, Send, Bot, User, Loader, MessageSquare, Database, Wifi, WifiOff, Lock, Trash2 } from 'lucide-react';

const ChatbotWidget = ({ 
  variant = 'enhanced', 
  userId = null, 
  showLogs = true,
  position = 'bottom-right',
  theme = 'blue'
}) => {
  const { isLoggedIn, userRole, user } = useAuth();
  
  // Utiliser l'ID utilisateur du contexte d'authentification
  const currentUserId = user?.id || userId;
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // Utiliser un sessionId persistant basé sur l'utilisateur
  const [sessionId, setSessionId] = useState(() => {
    const userId = user?.id || 'anonymous';
    const savedSessionId = localStorage.getItem(`chatbot_session_${userId}`);
    if (savedSessionId) {
      return savedSessionId;
    }
    // Créer un sessionId stable basé sur l'utilisateur et la date (change toutes les semaines)
    const weekNumber = Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 7));
    const newSessionId = `session-${userId}-${weekNumber}`;
    localStorage.setItem(`chatbot_session_${userId}`, newSessionId);
    return newSessionId;
  });
  const [logs, setLogs] = useState([]);
  const [isOnline, setIsOnline] = useState(true);
  const [showLogsPanel, setShowLogsPanel] = useState(showLogs);
  const messagesEndRef = useRef(null);
  const logsEndRef = useRef(null);

  // Auto-scroll vers le bas des messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Auto-scroll vers le bas des logs
  const scrollLogsToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Gérer l'ouverture du chatbot avec vérification d'authentification
  const handleChatbotClick = () => {
    // Si l'utilisateur n'est pas connecté, rediriger vers login
    if (!isLoggedIn) {
      navigate('/login?redirect=chatbot');
      return;
    }

    // Si l'utilisateur est admin, ne pas afficher le chatbot
    if (userRole === 'admin') {
      addLog('warning', 'Le chatbot n\'est pas disponible pour les administrateurs');
      return;
    }

    // Ouvrir le chatbot pour les utilisateurs normaux
    setIsOpen(true);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    scrollLogsToBottom();
  }, [logs]);

  // Vérifier la connectivité
  useEffect(() => {
    const checkOnlineStatus = async () => {
      try {
        const response = await fetch('http://localhost:8001/chatbot/health', {
          method: 'GET',
          timeout: 5000
        });
        setIsOnline(response.ok);
      } catch (error) {
        setIsOnline(false);
      }
    };

    checkOnlineStatus();
    const interval = setInterval(checkOnlineStatus, 30000); // Vérifier toutes les 30 secondes
    return () => clearInterval(interval);
  }, []);

  // Fonction pour charger les messages depuis localStorage
  const loadMessagesFromLocalStorage = () => {
    try {
      const savedMessages = localStorage.getItem(`chatbot_messages_${sessionId}`);
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages);
        setMessages(parsedMessages);
        addLog('info', 'Messages chargés depuis localStorage', { count: parsedMessages.length });
        return true; // Messages chargés
      }
    } catch (error) {
      addLog('error', 'Erreur lors du chargement depuis localStorage', { error: error.message });
    }
    return false; // Aucun message chargé
  };

  // Fonction pour charger les messages depuis la base de données
  const loadMessagesFromDatabase = async () => {
    try {
      console.log(`🔄 Chargement des messages pour la session: ${sessionId}`);
      addLog('info', `Chargement des messages pour la session: ${sessionId}`);
      
      const response = await fetch(`http://localhost:8001/chatbot/messages/session/${sessionId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      console.log(`📡 Réponse API: ${response.status} ${response.statusText}`);

      if (response.ok) {
        const data = await response.json();
        console.log(`📦 Données reçues:`, data);
        
        if (data.success && data.messages && data.messages.length > 0) {
          const formattedMessages = data.messages.map(msg => ({
            id: msg.id,
            type: msg.message_type === 'user' ? 'user' : 'bot',
            content: msg.content,
            timestamp: new Date(msg.created_at),
            intent: msg.intent,
            confidence: msg.confidence,
            contextType: msg.context_type,
            entities: msg.entities,
            suggestions: msg.suggestions,
            shouldTriggerQuote: msg.should_trigger_quote
          }));
          
          console.log(`✅ ${formattedMessages.length} messages formatés:`, formattedMessages);
          setMessages(formattedMessages);
          saveMessagesToLocalStorage(formattedMessages);
          addLog('info', `${formattedMessages.length} messages chargés depuis la base de données`);
        } else {
          console.log('ℹ️ Aucun message trouvé dans la base de données');
          addLog('info', 'Aucun message trouvé dans la base de données');
        }
      } else {
        console.error(`❌ Erreur API: ${response.status}`);
        addLog('error', `Erreur API: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement:', error);
      addLog('error', 'Erreur lors du chargement depuis la base de données', { error: error.message });
    }
  };

  // Fonction pour sauvegarder les messages dans localStorage
  const saveMessagesToLocalStorage = (messagesToSave) => {
    try {
      localStorage.setItem(`chatbot_messages_${sessionId}`, JSON.stringify(messagesToSave));
      addLog('info', 'Messages sauvegardés dans localStorage');
    } catch (error) {
      addLog('error', 'Erreur lors de la sauvegarde dans localStorage', { error: error.message });
    }
  };

  // Fonction pour ajouter le message de bienvenue
  const addWelcomeMessage = () => {
    const userName = user?.first_name || user?.name || 'Utilisateur';
    const welcomeMessage = user?.first_name 
      ? `Bonjour ${userName} ! Je suis l'assistant IA de FASTCUBE. Comment puis-je vous aider aujourd'hui ?`
      : 'Bonjour ! Je suis l\'assistant IA de FASTCUBE. Comment puis-je vous aider aujourd\'hui ?';
    
    const welcomeMsg = {
      id: Date.now(),
      type: 'bot',
      content: welcomeMessage,
      timestamp: new Date(),
      intent: 'greeting',
      confidence: 1.0
    };
    
    setMessages(prev => [...prev, welcomeMsg]);
    addLog('info', 'Message de bienvenue ajouté');
  };

  // Sauvegarder le sessionId pour la persistance
  useEffect(() => {
    const userId = user?.id || 'anonymous';
    localStorage.setItem(`chatbot_session_${userId}`, sessionId);
  }, [sessionId, user?.id]);

  // Nettoyer les anciennes sessions au montage
  useEffect(() => {
    cleanupOldSessions();
  }, []);

  // Charger l'historique des messages depuis la base de données et localStorage
  useEffect(() => {
    if (currentUserId) {
      // Charger depuis la base de données au démarrage
      loadMessagesFromDatabase();
    } else {
      // Charger depuis localStorage si pas d'userId
      const messagesLoaded = loadMessagesFromLocalStorage();
      if (!messagesLoaded) {
        addWelcomeMessage();
      }
    }
  }, [currentUserId, sessionId]);

  // Sauvegarder automatiquement les messages à chaque changement
  useEffect(() => {
    if (messages.length > 0) {
      saveMessagesToLocalStorage(messages);
    }
  }, [messages]);

  // Ajouter le message de bienvenue si aucun message n'est chargé
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Attendre un peu pour s'assurer que le chargement est terminé
      const timer = setTimeout(() => {
        if (messages.length === 0) {
          addWelcomeMessage();
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, messages.length]);

  // Fonction pour nettoyer les anciennes sessions
  const cleanupOldSessions = () => {
    try {
      const userId = user?.id || 'anonymous';
      const keys = Object.keys(localStorage);
      const sessionKeys = keys.filter(key => 
        key.startsWith('chatbot_session_') && !key.includes(userId)
      );
      
      // Supprimer les sessions d'autres utilisateurs (garder seulement les 5 plus récentes)
      sessionKeys.forEach(key => {
        const sessionData = localStorage.getItem(key);
        if (sessionData) {
          try {
            // Vérifier si les données sont du JSON valide
            const parsedData = JSON.parse(sessionData);
            const sessionTime = parsedData.timestamp || 0;
            const now = Date.now();
            const daysDiff = (now - sessionTime) / (1000 * 60 * 60 * 24);
            
            if (daysDiff > 7) { // Supprimer les sessions de plus de 7 jours
              localStorage.removeItem(key);
            }
          } catch (parseError) {
            // Si ce n'est pas du JSON valide, supprimer la clé
            console.warn(`Données invalides pour la session ${key}, suppression...`);
            localStorage.removeItem(key);
          }
        }
      });
    } catch (error) {
      console.warn('Erreur lors du nettoyage des sessions:', error);
    }
  };

  // Fonction pour charger l'historique des messages
  const loadMessageHistory = async () => {
    try {
      const response = await fetch(`http://localhost:8001/chatbot/message/${currentUserId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        const loadedMessages = data.messages || [];
        setMessages(loadedMessages);
        addLog('info', 'Historique des messages chargé', { count: loadedMessages.length });
        
        // Si aucun message n'a été chargé, ajouter le message de bienvenue
        if (loadedMessages.length === 0) {
          addWelcomeMessage();
        }
      } else {
        // En cas d'erreur, charger depuis localStorage d'abord
        const messagesLoaded = loadMessagesFromLocalStorage();
        if (!messagesLoaded) {
          addWelcomeMessage();
        }
      }
    } catch (error) {
      addLog('error', 'Erreur lors du chargement de l\'historique', { error: error.message });
      // En cas d'erreur, charger depuis localStorage d'abord
      const messagesLoaded = loadMessagesFromLocalStorage();
      if (!messagesLoaded) {
        addWelcomeMessage();
      }
    }
  };

  // Fonction pour sauvegarder un message dans la base de données
  const saveMessage = async (message) => {
    if (!currentUserId) return;

    try {
      const response = await fetch('http://localhost:8001/chatbot/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          content: message.content,
          message_type: message.type || 'user',
          user_id: currentUserId
        })
      });

      if (response.ok) {
        addLog('success', 'Message sauvegardé en base', { type: message.type });
      } else {
        addLog('warning', 'Erreur lors de la sauvegarde du message');
      }
    } catch (error) {
      addLog('error', 'Erreur de sauvegarde', { error: error.message });
    }
  };

  // Fonction pour ajouter des logs
  const addLog = (type, message, data = null) => {
    const logEntry = {
      id: Date.now(),
      type, // 'info', 'success', 'error', 'warning'
      message,
      data,
      timestamp: new Date()
    };
    setLogs(prev => [...prev, logEntry]);
  };

  // Fonction pour réinitialiser la conversation
  const resetConversation = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/chatbot/reset-conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          user_id: currentUserId
        })
      });

      if (response.ok) {
        const data = await response.json();
        const newSessionId = data.data.session_id;
        
        // Mettre à jour le sessionId
        setSessionId(newSessionId);
        const userId = user?.id || 'anonymous';
        localStorage.setItem(`chatbot_session_${userId}`, newSessionId);
        
        // Vider les messages
        setMessages([]);
        
        addLog(`🔄 Nouvelle conversation créée (Session: ${newSessionId})`, 'system');
      }
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error);
      addLog(`❌ Erreur réinitialisation: ${error.message}`, 'error');
    }
  };

  // Fonction pour envoyer un message
  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    const newMessages = [...messages, userMessage];
    console.log('Message utilisateur ajouté:', userMessage);
    console.log('Nouveaux messages:', newMessages);
    setMessages(newMessages);
    setInputMessage('');
    setIsLoading(true);

    // Sauvegarder le message utilisateur
    await saveMessage(userMessage);
    
    // Sauvegarder dans localStorage
    saveMessagesToLocalStorage(newMessages);

    // Ajouter log de début
    addLog('info', 'Envoi du message au chatbot...', { message: inputMessage });

    try {
      const response = await fetch('http://localhost:8001/chatbot/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: inputMessage,
          session_id: sessionId,
          user_id: currentUserId || 5, // Utiliser l'ID utilisateur connecté ou 5 par défaut (utilisateur existant)
          user_name: user?.first_name || user?.name || 'Utilisateur',
          user_email: user?.email || null
        })
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      
      // Ajouter log de succès
      addLog('success', 'Réponse reçue du chatbot', {
        intent: data.data?.intent,
        confidence: data.data?.confidence,
        context_type: data.data?.context_type
      });

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: data.data?.response || data.response || 'Désolé, je n\'ai pas pu générer de réponse.',
        timestamp: new Date(),
        intent: data.data?.intent,
        confidence: data.data?.confidence,
        contextType: data.data?.context_type,
        entities: data.data?.entities,
        suggestions: data.data?.suggestions,
        shouldTriggerQuote: data.data?.should_trigger_quote
      };

      const updatedMessages = [...newMessages, botMessage];
      console.log('Messages mis à jour:', updatedMessages);
      setMessages(updatedMessages);

      // Sauvegarder la réponse du chatbot
      await saveMessage(botMessage);
      
      // Sauvegarder dans localStorage
      saveMessagesToLocalStorage(updatedMessages);

      // Log des entités extraites
      if (data.entities && Object.keys(data.entities).length > 0) {
        addLog('info', 'Entités extraites', data.entities);
      }

      // Log des suggestions
      if (data.suggestions && data.suggestions.length > 0) {
        addLog('info', 'Suggestions générées', data.suggestions);
      }

    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      
      // Ajouter log d'erreur
      addLog('error', 'Erreur lors de la communication avec le chatbot', {
        error: error.message
      });

      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Désolé, je rencontre un problème technique. Veuillez réessayer dans quelques instants.',
        timestamp: new Date(),
        intent: 'error',
        confidence: 0.0
      };

      const errorMessages = [...messages, errorMessage];
      setMessages(errorMessages);
      await saveMessage(errorMessage);
      
      // Sauvegarder dans localStorage
      saveMessagesToLocalStorage(errorMessages);
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
  if (!timestamp) return ""; // ou return "??:??";
  return new Date(timestamp).toLocaleTimeString();
};


  // Fonction pour obtenir la couleur du log
  const getLogColor = (type) => {
    switch (type) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      default: return 'text-blue-600';
    }
  };

  // Fonction pour obtenir la couleur de l'intention
  const getIntentColor = (intent) => {
    switch (intent) {
      case 'greeting': return 'bg-green-100 text-green-800';
      case 'request_quote': return 'bg-blue-100 text-blue-800';
      case 'technical_support': return 'bg-red-100 text-red-800';
      case 'country_info': return 'bg-purple-100 text-purple-800';
      case 'general_info': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  // Fonction pour obtenir les classes de position
  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-left':
        return 'bottom-6 left-6';
      case 'top-right':
        return 'top-6 right-6';
      case 'top-left':
        return 'top-6 left-6';
      default:
        return 'bottom-6 right-6';
    }
  };

  // Fonction pour obtenir les classes de thème
  const getThemeClasses = () => {
    switch (theme) {
      case 'green':
        return {
          button: 'bg-green-600 hover:bg-green-700',
          header: 'bg-green-600',
          headerHover: 'hover:bg-green-700',
          sendButton: 'bg-green-600 hover:bg-green-700',
          userMessage: 'bg-green-600 text-white'
        };
      case 'purple':
        return {
          button: 'bg-purple-600 hover:bg-purple-700',
          header: 'bg-purple-600',
          headerHover: 'hover:bg-purple-700',
          sendButton: 'bg-purple-600 hover:bg-purple-700',
          userMessage: 'bg-purple-600 text-white'
        };
      default:
        return {
          button: 'bg-blue-600 hover:bg-blue-700',
          header: 'bg-blue-600',
          headerHover: 'hover:bg-blue-700',
          sendButton: 'bg-blue-600 hover:bg-blue-700',
          userMessage: 'bg-blue-600 text-white'
        };
    }
  };

  const themeClasses = getThemeClasses();

  return (
    <>
      {/* Bouton de chat flottant */}
      {!isOpen && (
        <button
          onClick={handleChatbotClick}
          className={`fixed ${getPositionClasses()} ${themeClasses.button} text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50 ${
            !isLoggedIn ? 'opacity-75' : userRole === 'admin' ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          aria-label={!isLoggedIn ? "Se connecter pour utiliser le chat" : userRole === 'admin' ? "Chat non disponible pour les admins" : "Ouvrir le chat"}
          title={!isLoggedIn ? "Connectez-vous pour utiliser le chatbot" : userRole === 'admin' ? "Le chatbot n'est pas disponible pour les administrateurs" : "Ouvrir le chatbot"}
        >
          {!isLoggedIn ? <Lock size={24} /> : userRole === 'admin' ? <Lock size={24} /> : <MessageSquare size={24} />}
        </button>
      )}

      {/* Fenêtre de chat */}
      {isOpen && (
        <div className="fixed top-0 right-0 h-full w-96 bg-white shadow-2xl border-l border-gray-200 flex flex-col z-50">
          {/* En-tête du chat */}
          <div className={`${themeClasses.header} text-white p-4 flex items-center justify-between`}>
            <div className="flex items-center space-x-2">
              <Bot size={20} />
              <h3 className="font-semibold">Chatbot FASTCUBE</h3>
              {isOnline ? (
                <Wifi size={16} className="text-green-300" />
              ) : (
                <WifiOff size={16} className="text-red-300" />
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  setMessages([]);
                  saveMessagesToLocalStorage([]);
                  addLog('info', 'Conversation effacée');
                }}
                className={`${themeClasses.headerHover} p-1 rounded transition-colors`}
                aria-label="Effacer la conversation"
                title="Effacer la conversation"
              >
                <Trash2 size={16} />
              </button>
              <button
                onClick={resetConversation}
                className={`${themeClasses.headerHover} p-1 rounded transition-colors`}
                aria-label="Nouvelle conversation"
                title="Nouvelle conversation"
              >
                <MessageSquare size={16} />
              </button>
              {variant === 'enhanced' && (
                <button
                  onClick={() => setShowLogsPanel(!showLogsPanel)}
                  className={`${themeClasses.headerHover} p-1 rounded transition-colors`}
                  aria-label="Afficher/masquer les logs"
                >
                  <Database size={16} />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className={`${themeClasses.headerHover} p-1 rounded transition-colors`}
                aria-label="Fermer le chat"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Zone de messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={message.id || `${message.type}-${index}`}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.type === 'user'
                      ? themeClasses.userMessage
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
                          <span className={`px-2 py-1 rounded text-xs ${getIntentColor(message.intent)}`}>
                            {message.intent}
                          </span>
                        )}
                      </div>
                      {/* Confiance masquée pour l'utilisateur final */}
                      {false && variant === 'enhanced' && message.confidence !== undefined && (
                        <div className="mt-1 text-xs opacity-70">
                          Confiance: {(message.confidence * 100).toFixed(0)}%
                        </div>
                      )}
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
                disabled={!isOnline}
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || !isOnline}
                className={`${themeClasses.sendButton} disabled:bg-gray-400 text-white p-2 rounded-lg transition-colors`}
                aria-label="Envoyer le message"
              >
                <Send size={20} />
              </button>
            </div>
            {!isOnline && (
              <p className="text-xs text-red-600 mt-2 flex items-center">
                <WifiOff size={12} className="mr-1" />
                Connexion au chatbot perdue
              </p>
            )}
          </div>

          {/* Zone de logs (repliable) */}
          {variant === 'enhanced' && showLogsPanel && (
            <div className="border-t border-gray-200">
              <details className="group">
                <summary className="cursor-pointer p-3 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Logs du système ({logs.length})
                  </span>
                  <span className="text-xs text-gray-500 group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <div className="max-h-32 overflow-y-auto bg-gray-900 text-green-400 p-3 text-xs font-mono">
                  {logs.length === 0 ? (
                    <div className="text-gray-500">Aucun log pour le moment...</div>
                  ) : (
                    logs.map((log) => (
                      <div key={log.id} className="mb-1">
                        <span className="text-gray-400">
                          [{formatTime(log.timestamp)}]
                        </span>

                        <span className={`ml-2 ${getLogColor(log.type)}`}>
                          [{log.type.toUpperCase()}]
                        </span>
                        <span className="ml-2">{log.message}</span>
                        {log.data && (
                          <div className="ml-4 text-gray-300">
                            {JSON.stringify(log.data, null, 2)}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                  <div ref={logsEndRef} />
                </div>
              </details>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;