import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaBuilding, FaRocket } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from "../config/api";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [redirectMessage, setRedirectMessage] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  // Vérifier les paramètres d'URL pour la redirection
  useEffect(() => {
    const redirect = searchParams.get('redirect');
    const tenderId = searchParams.get('tenderId');
    const message = searchParams.get('message');
    
    if (redirect === 'tenders' && tenderId) {
      setRedirectMessage('Connectez-vous pour télécharger le cahier de charges');
    }
    
    if (message === 'inscription_reussie') {
      setRedirectMessage('Inscription réussie ! Connectez-vous maintenant avec vos identifiants.');
    }
    
    if (message === 'chatbot_redirect') {
      setRedirectMessage('Connectez-vous pour utiliser le chatbot et sauvegarder vos conversations.');
    }
  }, [searchParams]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok && data.token) {
        // Utiliser le contexte d'authentification pour une mise à jour immédiate
        login({
          id: data.user.id,
          role: data.user.role,
          email: data.user.email,
          token: data.token,
          name: data.user.name || data.user.email,
          first_name: data.user.first_name || '',
          last_name: data.user.last_name || ''
        });
        
        // Stocker aussi dans localStorage pour compatibilité
        localStorage.setItem('token', data.token);
        localStorage.setItem('userRole', data.user.role);
        localStorage.setItem('userEmail', data.user.email);
        
        // Vérifier s'il y a une redirection après connexion
        const redirect = searchParams.get('redirect');
        const tenderId = searchParams.get('tenderId');
        
        if (redirect === 'tenders' && tenderId) {
          // Rediriger vers la page des appels d'offre avec l'ID du tender
          navigate(`/appel-offre?tenderId=${tenderId}`);
        } else if (redirect === 'chatbot') {
          // Rediriger vers la page d'accueil pour utiliser le chatbot
          navigate('/');
        } else if (data.user.role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/client-account');
        }
      } else {
        setError(data.error || 'Email ou mot de passe invalide');
      }
    } catch (err) {
      setError('Erreur serveur');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md mx-auto">
        {/* Header Card */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg mb-6">
            <FaRocket className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3">
            Bienvenue
          </h1>
          <p className="text-gray-600 text-lg">Connectez-vous à votre espace</p>
          {redirectMessage && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl shadow-sm">
              <p className="text-blue-700 text-sm font-medium">{redirectMessage}</p>
            </div>
          )}
        </div>

        {/* Main Form Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div className="group">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
                Adresse email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400/20 focus:border-blue-500 text-gray-900 bg-white/90 placeholder-gray-400 transition-all duration-200 shadow-sm"
                  placeholder="votre@email.com"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="group">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-3">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400/20 focus:border-blue-500 text-gray-900 bg-white/90 placeholder-gray-400 transition-all duration-200 shadow-sm"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 focus:outline-none transition-colors duration-200"
                >
                  {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl shadow-sm text-center animate-pulse">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  {error}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 focus:ring-blue-400/30 text-white"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Connexion...
                </div>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Pas encore de compte ?{' '}
              <Link 
                to="/register" 
                className="text-blue-600 hover:text-blue-700 font-semibold underline underline-offset-4 hover:underline-offset-2 transition-all duration-200"
              >
                S'inscrire
              </Link>
            </p>
          </div>
        </div>

        {/* Company Info */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center gap-2 text-gray-500 text-sm">
            <FaBuilding className="w-4 h-4" />
            <span>FastCube Solutions</span>
          </div>
        </div>
      </div>
    </div>
  );
} 