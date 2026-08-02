import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isLoggedIn, userRole } = useAuth();

  // Si l'utilisateur n'est pas connecté, rediriger vers la page d'accueil
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  // Si un rôle spécifique est requis et que l'utilisateur n'a pas ce rôle
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // Si tout est OK, afficher le composant enfant
  return children;
};

export default ProtectedRoute; 