import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HeaderFastCube from './components/HeaderFastCube';
import FooterModern from './components/FooterModern';
import ChatbotWrapper from './components/ChatbotWrapper';
import Homepage from './pages/Homepage';
import AboutUs from './pages/AboutUs';
import Services from './pages/Services';
import SolutionsPage from './pages/SolutionsPage';
import SolutionDetail from './pages/SolutionDetail';
import Contact from './pages/Contact';
import BlogPage from './pages/BlogPage';
import BlogDetail from './components/BlogDetail';
import SearchResults from './pages/SearchResults';
import Newsletter from './pages/Newsletter';
import Partners from './pages/Partners';
import TicketsPage from './pages/TicketsPage';
import AppelOffre from './pages/AppelOffre';
import SentimentAnalysisTest from './components/SentimentAnalysisTest';
import ChatbotPersistenceDemo from './components/ChatbotPersistenceDemo';
import ChatbotTestSimple from './pages/ChatbotTestSimple';
import SentimentTest from './pages/SentimentTest';
import Login from './components/Login';
import Register from './components/Register';
import ClientDashboard from './pages/ClientDashboard';
import AdminDashboard from './components/AdminDashboard';
import NewTicket from './pages/NewTicket';
import TicketDetail from './pages/TicketDetail';
import ClientAccount from './pages/ClientAccount';
import AdminAccount from './pages/AdminAccount';
import MyTickets from './pages/MyTickets';
import NotFound from './components/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import { LanguageProvider } from './contexts/LanguageContext';
import { DarkModeProvider } from './contexts/DarkModeContext';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import './App.css';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/services" element={<Services />} />
      <Route path="/solutions" element={<SolutionsPage />} />
      <Route path="/solutions/:id" element={<SolutionDetail />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:id" element={<BlogDetail />} />
      <Route path="/search" element={<SearchResults />} />
      <Route path="/partners" element={<Partners />} />
      <Route path="/tickets" element={
        <ProtectedRoute>
          <TicketsPage />
        </ProtectedRoute>
      } />
      <Route path="/appel-offre" element={<AppelOffre />} />
      <Route path="/sentiment-analysis-test" element={<SentimentAnalysisTest />} />
      <Route path="/sentiment-test" element={<SentimentTest />} />
      <Route path="/chatbot-persistence-demo" element={<ChatbotPersistenceDemo />} />
      <Route path="/chatbot-test" element={<ChatbotTestSimple />} />
      
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Dashboard Routes */}
      <Route path="/client-dashboard" element={
        <ProtectedRoute>
          <ClientDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin-dashboard" element={
        <ProtectedRoute requiredRole="admin">
          <AdminDashboard />
        </ProtectedRoute>
      } />
      
      {/* Ticket Routes */}
      <Route path="/new-ticket" element={
        <ProtectedRoute>
          <NewTicket />
        </ProtectedRoute>
      } />
      <Route path="/ticket/:id" element={
        <ProtectedRoute>
          <TicketDetail />
        </ProtectedRoute>
      } />
      <Route path="/my-tickets" element={
        <ProtectedRoute>
          <MyTickets />
        </ProtectedRoute>
      } />
      <Route path="/client-account" element={
        <ProtectedRoute>
          <ClientAccount />
        </ProtectedRoute>
      } />
      <Route path="/admin-account" element={
        <ProtectedRoute requiredRole="admin">
          <AdminAccount />
        </ProtectedRoute>
      } />
      
      {/* Newsletter Route */}
      <Route path="/newsletter" element={<Newsletter />} />
      
      {/* Redirection pour /compte vers /client-account */}
      <Route path="/compte" element={<Navigate to="/client-account" replace />} />
      
      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  // Neon Cursor Logic
  useEffect(() => {
    const cursor = document.createElement('div');
    cursor.className = 'neon-cursor';
    cursor.style.cssText = `
      position: fixed;
      width: 20px;
      height: 20px;
      background: radial-gradient(circle, rgba(59, 130, 246, 0.8) 0%, rgba(59, 130, 246, 0.4) 50%, transparent 100%);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      mix-blend-mode: screen;
      transition: transform 0.1s ease;
      transform: translate(-50%, -50%);
    `;
    document.body.appendChild(cursor);

    const updateCursor = (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    };

    const addCursorEffect = (e) => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
      cursor.style.background = 'radial-gradient(circle, rgba(147, 51, 234, 0.8) 0%, rgba(147, 51, 234, 0.4) 50%, transparent 100%)';
    };

    const removeCursorEffect = (e) => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      cursor.style.background = 'radial-gradient(circle, rgba(59, 130, 246, 0.8) 0%, rgba(59, 130, 246, 0.4) 50%, transparent 100%)';
    };

    document.addEventListener('mousemove', updateCursor);
    document.addEventListener('mouseenter', updateCursor);
    
    // Add hover effects to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, [role="button"]');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', addCursorEffect);
      el.addEventListener('mouseleave', removeCursorEffect);
    });

    return () => {
      document.removeEventListener('mousemove', updateCursor);
      document.removeEventListener('mouseenter', updateCursor);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', addCursorEffect);
        el.removeEventListener('mouseleave', removeCursorEffect);
      });
      if (cursor.parentNode) {
        cursor.parentNode.removeChild(cursor);
      }
    };
  }, []);

  return (
    <AuthProvider>
      <LanguageProvider>
        <DarkModeProvider>
          <NotificationProvider>
            <Router>
              <div className="App">
                <HeaderFastCube />
                <main>
                  <AppRoutes />
                </main>
                <FooterModern />
                <ChatbotWrapper />
              </div>
            </Router>
          </NotificationProvider>
        </DarkModeProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
