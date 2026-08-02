const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { executeQuery } = require('../config/database-unified');


const JWT_SECRET = process.env.JWT_SECRET || 'fastcube-jwt-secret-2024-ultra-secure';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

class AuthService {
  
  
  generateToken(payload) {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN
    });
  }

  
  generateRefreshToken(payload) {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_REFRESH_EXPIRES_IN
    });
  }

  
  verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error('Token invalide ou expiré');
    }
  }

  
  async hashPassword(password) {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  
  async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  
  async login(email, password) {
    try {
      console.log(`🔐 Tentative de connexion pour: ${email}`);

      
      const sql = `
        SELECT id, first_name, last_name, email, password_hash, role, status, 
               login_attempts, locked_until, last_login
        FROM users 
        WHERE email = ?
      `;
      
      const users = await executeQuery(sql, [email]);
      
      if (users.length === 0) {
        throw new Error('Email ou mot de passe incorrect');
      }

      const user = users[0];

      
      if (user.status !== 'active') {
        throw new Error('Compte inactif ou suspendu');
      }

      
      if (user.locked_until && new Date() < new Date(user.locked_until)) {
        throw new Error('Compte temporairement verrouillé. Réessayez plus tard.');
      }

      
      const isPasswordValid = await this.comparePassword(password, user.password_hash);
      
      if (!isPasswordValid) {
        
        await this.incrementLoginAttempts(user.id);
        throw new Error('Email ou mot de passe incorrect');
      }

      
      await this.resetLoginAttempts(user.id);
      await this.updateLastLogin(user.id);

      
      const tokenPayload = {
        id: user.id,
        email: user.email,
        role: user.role
      };

      const token = this.generateToken(tokenPayload);
      const refreshToken = this.generateRefreshToken(tokenPayload);

      console.log(`✅ Connexion réussie pour ${user.email} (${user.role})`);

      return {
        success: true,
        message: 'Connexion réussie',
        user: {
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          role: user.role
        },
        token,
        refreshToken
      };

    } catch (error) {
      console.error('❌ Erreur lors de la connexion:', error.message);
      throw error;
    }
  }

  
  async register(firstName, lastName, email, password, company = null, jobTitle = null) {
    try {
      console.log(`📝 Inscription d'un nouvel utilisateur: ${email}`);

      
      const checkSql = 'SELECT id FROM users WHERE email = ?';
      const existingUsers = await executeQuery(checkSql, [email]);
      
      if (existingUsers.length > 0) {
        throw new Error('Un compte avec cet email existe déjà');
      }

      
      const passwordHash = await this.hashPassword(password);

      
      const insertSql = `
        INSERT INTO users (
          first_name, last_name, email, password_hash, company, job_title,
          role, status, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, 'user', 'active', NOW(), NOW())
      `;

      const result = await executeQuery(insertSql, [
        firstName, lastName, email, passwordHash, company || null, jobTitle || null
      ]);

      console.log(`✅ Inscription réussie pour ${email} (ID: ${result.insertId})`);

      return {
        success: true,
        message: 'Inscription réussie',
        user: {
          id: result.insertId,
          firstName,
          lastName,
          email,
          role: 'user'
        }
      };

    } catch (error) {
      console.error('❌ Erreur lors de l\'inscription:', error.message);
      throw error;
    }
  }

  
  async getUserById(userId) {
    try {
      const sql = `
        SELECT id, first_name, last_name, email, role, status, company, job_title,
               city, country, avatar, last_login, created_at
        FROM users 
        WHERE id = ? AND status = 'active'
      `;
      
      const users = await executeQuery(sql, [userId]);
      
      if (users.length === 0) {
        throw new Error('Utilisateur non trouvé');
      }

      const user = users[0];
      return {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        role: user.role,
        status: user.status,
        company: user.company,
        jobTitle: user.job_title,
        city: user.city,
        country: user.country,
        avatar: user.avatar,
        lastLogin: user.last_login,
        createdAt: user.created_at
      };

    } catch (error) {
      console.error('❌ Erreur lors de la récupération de l\'utilisateur:', error.message);
      throw error;
    }
  }

  
  async incrementLoginAttempts(userId) {
    const sql = `
      UPDATE users 
      SET login_attempts = login_attempts + 1,
          locked_until = CASE 
            WHEN login_attempts >= 4 THEN DATE_ADD(NOW(), INTERVAL 30 MINUTE)
            ELSE locked_until
          END
      WHERE id = ?
    `;
    await executeQuery(sql, [userId]);
  }

  
  async resetLoginAttempts(userId) {
    const sql = 'UPDATE users SET login_attempts = 0, locked_until = NULL WHERE id = ?';
    await executeQuery(sql, [userId]);
  }

  
  async updateLastLogin(userId) {
    const sql = 'UPDATE users SET last_login = NOW(), last_activity = NOW() WHERE id = ?';
    await executeQuery(sql, [userId]);
  }
}

module.exports = new AuthService();
