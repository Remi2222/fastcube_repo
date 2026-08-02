import React, { useState, useEffect } from 'react';
import { FaHistory, FaTrash, FaEye, FaPlus, FaDownload, FaUpload } from 'react-icons/fa';

const ConversationManager = ({ onLoadConversation, onNewConversation, currentConversationId }) => {
  const [conversations, setConversations] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = () => {
    try {
      const saved = localStorage.getItem('fastcube_chatbot_conversation');
      if (saved) {
        const conversationData = JSON.parse(saved);
        setConversations([conversationData]);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des conversations:', err);
    }
  };

  const deleteConversation = (conversationId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette conversation ?')) {
      if (conversationId === currentConversationId) {
        onNewConversation();
      }
      localStorage.removeItem('fastcube_chatbot_conversation');
      setConversations([]);
      setIsOpen(false);
    }
  };

  const exportConversation = (conversation) => {
    try {
      const dataStr = JSON.stringify(conversation, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `conversation_${conversation.id}.json`;
      link.click();
      URL.revokeObjectURL(url);
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
            onLoadConversation(conversationData);
            loadConversations();
            setIsOpen(false);
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

  const getConversationPreview = (messages) => {
    if (messages.length === 0) return 'Aucun message';
    const lastMessage = messages[messages.length - 1];
    return lastMessage.text.length > 50 
      ? lastMessage.text.substring(0, 50) + '...' 
      : lastMessage.text;
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-all duration-200 conversation-manager-toggle"
        title="Gérer les conversations"
      >
        <FaHistory />
      </button>

      {isOpen && (
        <div className="conversation-manager-overlay" onClick={() => setIsOpen(false)}>
          <div className="conversation-manager-modal" onClick={(e) => e.stopPropagation()}>
            <div className="conversation-manager-header">
              <h3>💬 Gestion des Conversations</h3>
              <button onClick={() => setIsOpen(false)} className="close-btn">×</button>
            </div>

            <div className="conversation-manager-content">
              {conversations.length === 0 ? (
                <div className="no-conversations">
                  <p>Aucune conversation sauvegardée</p>
                  <button 
                    onClick={onNewConversation}
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <FaPlus /> Démarrer une nouvelle conversation
                  </button>
                </div>
              ) : (
                <div className="conversations-list">
                  {conversations.map((conversation) => (
                    <div 
                      key={conversation.id} 
                      className={`conversation-item ${conversation.id === currentConversationId ? 'current' : ''}`}
                    >
                      <div className="conversation-header">
                        <div className="conversation-meta">
                          <span className="conversation-id">
                            💬 {conversation.messageCount} messages
                          </span>
                          <span className="conversation-date">
                            {formatDate(conversation.lastUpdated)}
                          </span>
                        </div>
                        <div className="conversation-actions">
                          <button
                            onClick={() => onLoadConversation(conversation)}
                            className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded text-xs transition-all duration-200"
                            title="Charger cette conversation"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => exportConversation(conversation)}
                            className="inline-flex items-center px-2 py-1 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded text-xs transition-all duration-200"
                            title="Exporter cette conversation"
                          >
                            <FaDownload />
                          </button>
                          <button
                            onClick={() => deleteConversation(conversation.id)}
                            className="inline-flex items-center px-2 py-1 bg-red-600 hover:bg-red-700 text-white font-medium rounded text-xs transition-all duration-200"
                            title="Supprimer cette conversation"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                      <div className="conversation-preview">
                        {getConversationPreview(conversation.messages)}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="conversation-manager-actions">
                <div className="import-section">
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
                </div>
                
                <button 
                  onClick={onNewConversation}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  <FaPlus /> Nouvelle conversation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConversationManager;




