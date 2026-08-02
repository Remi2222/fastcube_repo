const jwt = require('jsonwebtoken');




function optionalAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    
    return next();
  }
  
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    
    console.log('Token invalide ou expiré:', error.message);
    next();
  }
}

module.exports = { optionalAuth };



