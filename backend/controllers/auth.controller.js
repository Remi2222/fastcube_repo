const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users.model');

exports.register = async (req, res) => {
  try {
    console.log('=== DEBUG REGISTER ===');
    console.log('req.body complet:', JSON.stringify(req.body, null, 2));
    console.log('Type de req.body:', typeof req.body);
    console.log('Clés reçues:', Object.keys(req.body));
    
    const { first_name, last_name, email, password, company, phone, role } = req.body;
    
    console.log('Champs extraits:');
    console.log('- first_name:', first_name, 'Type:', typeof first_name);
    console.log('- last_name:', last_name, 'Type:', typeof last_name);
    console.log('- email:', email, 'Type:', typeof email);
    console.log('- password:', password ? '***' : 'undefined', 'Type:', typeof password);
    console.log('- company:', company, 'Type:', typeof company);
    console.log('=== FIN DEBUG ===');
    
    
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ 
        error: 'Champs requis manquants',
        required: ['first_name', 'last_name', 'email', 'password'],
        received: Object.keys(req.body),
        receivedValues: {
          first_name: first_name || null,
          last_name: last_name || null,
          email: email || null,
          password: password ? '***' : null
        }
      });
    }
    
    console.log('Tentative d\'inscription pour:', email);
    
    const existing = await User.findByEmail(email);
    if (existing) {
      console.log('Email déjà utilisé:', email);
      return res.status(409).json({ error: 'Email déjà utilisé' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    console.log('Mot de passe hashé pour:', email);
    
    
    const name = `${first_name} ${last_name}`.trim();
    
    const userId = await User.create({
      first_name,
      last_name,
      email,
      password_hash,
      phone: phone || null,
      role: role || 'user'
    });
     
    const user = await User.findById(userId);
    console.log('Utilisateur créé avec succès:', user.id, user.first_name );
    
    res.status(201).json({ 
      id: user.id, 
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email, 
      phone: user.phone, 
      role: user.role 
    });
  } catch (err) {
    console.error('Erreur lors de l\'inscription:', err);
    res.status(500).json({ error: 'Erreur serveur', details: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Champs requis manquants' });

    console.log('Tentative de connexion pour:', email);
    
    const user = await User.findByEmail(email);
    if (!user) {
      console.log('Utilisateur non trouvé:', email);
      return res.status(401).json({ error: 'Email ou mot de passe invalide' });
    }

    console.log('Utilisateur trouvé:', user.id, user.name);
    
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      console.log('Mot de passe invalide pour:', email);
      return res.status(401).json({ error: 'Email ou mot de passe invalide' });
    }

    console.log('Connexion réussie pour:', email);
    
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email, 
        phone: user.phone, 
        role: user.role 
      } 
    });
  } catch (err) {
    console.error('Erreur lors de la connexion:', err);
    res.status(500).json({ error: 'Erreur serveur', details: err.message });
  }
}; 