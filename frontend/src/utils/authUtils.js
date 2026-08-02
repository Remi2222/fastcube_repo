


export const clearAllAuthData = () => {
  console.log('🧹 Nettoyage complet des données d\'authentification...');
  
  
  const keysToRemove = [
    'token',
    'userToken',
    'authToken',
    'jwt',
    'access_token',
    'userRole',
    'userEmail',
    'user',
    'fastcube_chat_history'
  ];
  
  keysToRemove.forEach(key => {
    if (localStorage.getItem(key)) {
      console.log(`🗑️ Suppression de ${key}`);
      localStorage.removeItem(key);
    }
  });
  
  console.log('✅ Nettoyage terminé');
};


export const isTokenValid = (token) => {
  if (!token) return false;
  
  try {
    
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    
    if (payload.exp && payload.exp < currentTime) {
      console.log('⚠️ Token expiré');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('❌ Token invalide:', error);
    return false;
  }
};


export const getValidToken = () => {
  const token = localStorage.getItem('token') || localStorage.getItem('userToken');
  
  if (!token) {
    console.log('❌ Aucun token trouvé');
    return null;
  }
  
  if (!isTokenValid(token)) {
    console.log('❌ Token expiré, nettoyage...');
    clearAllAuthData();
    return null;
  }
  
  return token;
};


export const forceReauth = () => {
  clearAllAuthData();
  window.location.href = '/login?reason=token_expired';
};


export const debugAuthState = () => {
  console.log('🔍 État actuel du localStorage:');
  
  const authKeys = ['token', 'userToken', 'userRole', 'userEmail'];
  authKeys.forEach(key => {
    const value = localStorage.getItem(key);
    if (value) {
      console.log(`  ${key}:`, value.length > 50 ? value.substring(0, 50) + '...' : value);
    } else {
      console.log(`  ${key}: null`);
    }
  });
  
  const token = getValidToken();
  console.log('🎫 Token valide disponible:', !!token);
};


































