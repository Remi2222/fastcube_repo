import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  
  useEffect(() => {
    const checkAuthStatus = () => {
      const role = localStorage.getItem('userRole');
      const email = localStorage.getItem('userEmail');
      const authToken = localStorage.getItem('token') || localStorage.getItem('userToken');
      const userId = localStorage.getItem('userId');
      const userName = localStorage.getItem('userName');
      const firstName = localStorage.getItem('firstName');
      const lastName = localStorage.getItem('lastName');
      
      if (role && authToken && userId) {
        setIsLoggedIn(true);
        setUserRole(role);
        setUserEmail(email);
        setToken(authToken);
        
        
        setUser({
          id: userId,
          name: userName || email || 'Utilisateur',
          first_name: firstName || '',
          last_name: lastName || '',
          email: email,
          role: role
        });
      } else {
        setIsLoggedIn(false);
        setUserRole(null);
        setUserEmail(null);
        setToken(null);
        setUser(null);
      }
    };

    checkAuthStatus();

    
    const handleStorageChange = (e) => {
      if (e.key === 'userRole' || e.key === 'userToken' || e.key === 'token') {
        checkAuthStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    
    window.addEventListener('focus', checkAuthStatus);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', checkAuthStatus);
    };
  }, []);

  
  const login = (userData) => {
    localStorage.setItem('userRole', userData.role);
    localStorage.setItem('userEmail', userData.email);
    localStorage.setItem('token', userData.token);
    localStorage.setItem('userId', userData.id || userData.userId);
    localStorage.setItem('userName', userData.name || userData.userName || userData.email);
    localStorage.setItem('firstName', userData.first_name || userData.firstName || '');
    localStorage.setItem('lastName', userData.last_name || userData.lastName || '');
    
    setIsLoggedIn(true);
    setUserRole(userData.role);
    setUserEmail(userData.email);
    setToken(userData.token);
    
    
    setUser({
      id: userData.id || userData.userId,
      name: userData.name || userData.userName || userData.email,
      first_name: userData.first_name || userData.firstName || '',
      last_name: userData.last_name || userData.lastName || '',
      email: userData.email,
      role: userData.role
    });
  };

  
  const logout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('token');
    localStorage.removeItem('userToken'); 
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
    
    
    localStorage.removeItem('fastcube_chat_history');
    
    setIsLoggedIn(false);
    setUserRole(null);
    setUserEmail(null);
    setToken(null);
    setUser(null);
  };

  const value = {
    isLoggedIn,
    userRole,
    userEmail,
    token,
    user,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 