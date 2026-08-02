import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ChatbotWidget from './ChatbotWidget';

const ChatbotWrapper = () => {
  const location = useLocation();
  const { isLoggedIn, userRole } = useAuth();

  // Ne pas afficher le chatbot sur les pages admin
  const isAdminPage = location.pathname.startsWith('/admin');
  
  // Ne pas afficher le chatbot si l'utilisateur est admin
  const shouldShowChatbot = !isAdminPage && userRole !== 'admin';

  if (!shouldShowChatbot) {
    return null;
  }

  return (
    <ChatbotWidget 
      userId={isLoggedIn ? "8" : null} 
      showLogs={false} 
      position="full-right" 
      theme="blue" 
    />
  );
};

export default ChatbotWrapper;







