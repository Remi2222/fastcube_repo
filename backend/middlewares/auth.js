const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token manquant' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    console.error('Erreur de vérification du token:', error.message);
    res.status(401).json({ error: 'Token invalide' });
  }
}

function role(requiredRole) {
  return (req, res, next) => {
    if (req.user?.role !== requiredRole) return res.status(403).json({ error: 'Accès refusé' });
    next();
  };
}

function adminAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token manquant' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Accès refusé - Admin requis' });
    }
    next();
  } catch {
    res.status(401).json({ error: 'Token invalide' });
  }
}

module.exports = { auth, role, adminAuth }; 