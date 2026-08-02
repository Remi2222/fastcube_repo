import React, { useState, useEffect } from 'react';
import { FaSave, FaTrash, FaEye, FaDownload, FaUpload, FaHistory } from 'react-icons/fa';

const ChatbotPersistenceDemo = () => {
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [demoMessage, setDemoMessage] = useState('');

  useEffect(() => {
    loadAllConversations();
  }, []);

  const loadAllConversations = () => {
    try {
      const saved = localStorage.getItem('fastcube_chatbot_conversation');
      if (saved) {
        const conversationData = JSON.parse(saved);
        setConversations([conversationData]);
        setCurrentConversation(conversationData);
      }
    } catch (err) {
      console.error('Erreur lors du chargement:', err);
    }
  };

  const createDemoConversation = () => {
    const demoConversation = {
      id: `demo_${Date.now()}`,
      messages: [
        {
          id: 1,
          text: "Bonjour ! Comment puis-je vous aider ?",
          sender: "bot",
          timestamp: new Date().toLocaleTimeString()
        },
        {
          id: 2,
          text: "Je voudrais des informations sur vos services",
          sender: "user",
          timestamp: new Date().toLocaleTimeString()
        },
        {
          id: 3,
          text: "Bien sûr ! Nous proposons des services de développement web, mobile et d'IA.",
          sender: "bot",
          timestamp: new Date().toLocaleTimeString()
        }
      ],
      lastUpdated: new Date().toISOString(),
      messageCount: 3
    };

    localStorage.setItem('fastcube_chatbot_conversation', JSON.stringify(demoConversation));
    setConversations([demoConversation]);
    setCurrentConversation(demoConversation);
    console.log('🆕 Conversation de démonstration créée');
  };

  const addDemoMessage = () => {
    if (!demoMessage.trim() || !currentConversation) return;

    const newMessage = {
      id: Date.now(),
      text: demoMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    };

    const updatedConversation = {
      ...currentConversation,
      messages: [...currentConversation.messages, newMessage],
      messageCount: currentConversation.messages.length + 1,
      lastUpdated: new Date().toISOString()
    };

    localStorage.setItem('fastcube_chatbot_conversation', JSON.stringify(updatedConversation));
    setCurrentConversation(updatedConversation);
    setConversations([updatedConversation]);
    setDemoMessage('');
    console.log('💬 Message de démonstration ajouté');
  };

  const clearAllConversations = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer toutes les conversations ?')) {
      localStorage.removeItem('fastcube_chatbot_conversation');
      setConversations([]);
      setCurrentConversation(null);
      console.log('🗑️ Toutes les conversations supprimées');
    }
  };

  const exportConversation = () => {
    if (!currentConversation) return;

    try {
      const dataStr = JSON.stringify(currentConversation, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `conversation_${currentConversation.id}.json`;
      link.click();
      URL.revokeObjectURL(url);
      console.log('📤 Conversation exportée');
    } catch (err) {
      console.error('Erreur lors de l\'export:', err);
    }
  };

  const importConversation = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const conversationData = JSON.parse(e.target.result);
          if (conversationData.messages && Array.isArray(conversationData.messages)) {
            localStorage.setItem('fastcube_chatbot_conversation', JSON.stringify(conversationData));
            setCurrentConversation(conversationData);
            setConversations([conversationData]);
            console.log('📥 Conversation importée');
          } else {
            alert('Fichier de conversation invalide');
          }
        } catch (err) {
          alert('Erreur lors de l\'import du fichier');
        }
      };
      reader.readAsText(file);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="chatbot-persistence-demo">
      <div className="demo-header">
        <h2>🧪 Démonstration de la Persistance des Conversations</h2>
        <p>Testez la sauvegarde automatique des conversations du chatbot</p>
      </div>

      <div className="demo-controls">
        <div className="control-group">
          <h3>🎮 Contrôles de Test</h3>
          <div className="control-buttons">
            <button onClick={createDemoConversation} className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
              <FaSave /> Créer une conversation de démonstration
            </button>
            <button onClick={clearAllConversations} className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all duration-200">
              <FaTrash /> Supprimer toutes les conversations
            </button>
            <button onClick={loadAllConversations} className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-all duration-200">
              <FaHistory /> Recharger les conversations
            </button>
          </div>
        </div>

        <div className="control-group">
          <h3>💬 Ajouter un message de test</h3>
          <div className="message-input-group">
            <input
              type="text"
              value={demoMessage}
              onChange={(e) => setDemoMessage(e.target.value)}
              placeholder="Tapez un message de test..."
              className="demo-input"
            />
            <button 
              onClick={addDemoMessage}
              disabled={!demoMessage.trim() || !currentConversation}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Ajouter
            </button>
          </div>
        </div>

        <div className="control-group">
          <h3>📁 Import/Export</h3>
          <div className="import-export-buttons">
            <label htmlFor="import-file" className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-all duration-200">
              <FaUpload /> Importer une conversation
            </label>
            <input
              id="import-file"
              type="file"
              accept=".json"
              onChange={importConversation}
              style={{ display: 'none' }}
            />
            <button 
              onClick={exportConversation}
              disabled={!currentConversation}
              className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-all duration-200"
            >
              <FaDownload /> Exporter la conversation
            </button>
          </div>
        </div>
      </div>

      <div className="demo-status">
        <h3>📊 État Actuel</h3>
        <div className="status-grid">
          <div className="status-item">
            <strong>Conversations sauvegardées:</strong>
            <span className="status-value">{conversations.length}</span>
          </div>
          <div className="status-item">
            <strong>Conversation active:</strong>
            <span className="status-value">
              {currentConversation ? currentConversation.id : 'Aucune'}
            </span>
          </div>
          <div className="status-item">
            <strong>Messages totaux:</strong>
            <span className="status-value">
              {currentConversation ? currentConversation.messageCount : 0}
            </span>
          </div>
          <div className="status-item">
            <strong>Dernière mise à jour:</strong>
            <span className="status-value">
              {currentConversation ? formatDate(currentConversation.lastUpdated) : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {currentConversation && (
        <div className="demo-conversation">
          <h3>💬 Conversation Actuelle</h3>
          <div className="conversation-preview">
            <div className="conversation-header">
              <span className="conversation-id">ID: {currentConversation.id}</span>
              <span className="conversation-date">
                {formatDate(currentConversation.lastUpdated)}
              </span>
            </div>
            <div className="messages-preview">
              {currentConversation.messages.map((message, index) => (
                <div key={message.id} className={`message-preview ${message.sender}`}>
                  <span className="message-sender">
                    {message.sender === 'user' ? '👤' : '🤖'}
                  </span>
                  <span className="message-text">
                    {message.text.length > 100 
                      ? message.text.substring(0, 100) + '...' 
                      : message.text}
                  </span>
                  <span className="message-time">{message.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="demo-instructions">
        <h3>📋 Instructions de Test</h3>
        <ol>
          <li><strong>Créez une conversation de démonstration</strong> pour voir la persistance en action</li>
          <li><strong>Ajoutez des messages</strong> et observez la sauvegarde automatique</li>
          <li><strong>Fermez et rouvrez le chatbot</strong> - vos messages seront toujours là !</li>
          <li><strong>Exportez/importez</strong> des conversations pour tester la portabilité</li>
          <li><strong>Vérifiez la console</strong> pour voir les logs de persistance</li>
        </ol>
        
        <div className="demo-tip">
          <strong>💡 Astuce:</strong> Ouvrez la console du navigateur (F12) pour voir les logs détaillés 
          de la persistance des conversations.
        </div>
      </div>
    </div>
  );
};

export default ChatbotPersistenceDemo;




