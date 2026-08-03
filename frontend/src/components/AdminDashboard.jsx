import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaShieldAlt, FaUsers, FaTicketAlt, FaChartBar, FaCog, FaSignOutAlt, 
  FaComments, FaCalendarAlt, FaFileAlt, FaHandshake, FaServer, FaCogs,
  FaBell, FaSearch, FaPlus, FaEye, FaEdit, FaTrash, FaCheckCircle,
  FaExclamationTriangle, FaArrowUp, FaArrowDown, FaSync
} from 'react-icons/fa';
import '../styles/admin-dashboard.css';
import AdminTestimonials from './AdminTestimonials';
import AdminTickets from './AdminTickets';
import AdminUsers from './AdminUsers';
import AdminTenders from './AdminTenders';
import AdminPropositions from './AdminPropositions';
import AdminCommentairesManager from './AdminCommentairesManager';
import AdminPartenairesManager from './AdminPartenairesManager';
import AdminBlogManager from './AdminBlogManager';
import AdminServicesManager from './AdminServicesManager';
import AdminSolutionsManager from './AdminSolutionsManager';
import { API_BASE_URL } from "../config/api";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    users: { total: 0, admins: 0, clients: 0, recent: 0, growth: 0 },
    tickets: { total: 0, active: 0, resolved: 0, pending: 0, growth: 0 },
    testimonials: { total: 0, approved: 0, pending: 0, growth: 0 },
    tenders: { total: 0, active: 0, closed: 0, awarded: 0, growth: 0 },
    partenaires: { total: 0, actifs: 0, inactifs: 0, growth: 0 },
    propositions: { total: 0, en_attente: 0, acceptee: 0, refusee: 0, en_cours_evaluation: 0, growth: 0 },
    blogs: { total: 0, published: 0, draft: 0, total_views: 0, growth: 0 },
    services: { total: 0, active: 0, growth: 0 },
    solutions: { total: 0, active: 0, growth: 0 }
  });
  const [recentTickets, setRecentTickets] = useState([]);
  const [recentPropositions, setRecentPropositions] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier l'authentification admin au chargement
    const initializeDashboard = async () => {
      await checkAdminAuth();
      if (activeTab === 'overview') {
        fetchDashboardData();
      }
    };
    initializeDashboard();
  }, [activeTab]);

  // Vérifier l'authentification admin
  const checkAdminAuth = async () => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    const userEmail = localStorage.getItem('userEmail');
    const userName = localStorage.getItem('userName');
    const userId = localStorage.getItem('userId');

    console.log('🔍 Vérification auth admin:', { token: !!token, userRole, userEmail, userName, userId });

    if (!token || userRole !== 'admin') {
      console.log('❌ Accès refusé - Redirection vers login');
      navigate('/login?redirect=admin-dashboard');
      return;
    }

    // Récupérer les vraies données de l'utilisateur admin depuis la base de données
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const userData = data.data;
          setAdminUser({
            id: userData.id,
            name: userData.name || `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || userData.email,
            email: userData.email,
            role: userData.role,
            first_name: userData.first_name,
            last_name: userData.last_name
          });
          
          // Mettre à jour le localStorage avec les vraies données
          localStorage.setItem('userName', userData.name || `${userData.first_name || ''} ${userData.last_name || ''}`.trim());
          localStorage.setItem('userEmail', userData.email);
          
          console.log('✅ Admin authentifié avec vraies données:', userData);
        }
      } else {
        // Fallback sur les données du localStorage si l'API échoue
        setAdminUser({
          id: userId,
          name: userName,
          email: userEmail,
          role: userRole
        });
        console.log('⚠️ Utilisation des données localStorage (API échouée)');
      }
    } catch (error) {
      console.error('❌ Erreur récupération données admin:', error);
      // Fallback sur les données du localStorage
      setAdminUser({
        id: userId,
        name: userName,
        email: userEmail,
        role: userRole
      });
    }
  };

  // Initialiser le thème au chargement
  useEffect(() => {
    const theme = localStorage.getItem('theme');
    const isDark = theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);


  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      const userRole = localStorage.getItem('userRole');
      
      console.log('🔍 Token:', token ? 'Présent' : 'Manquant');
      console.log('🔍 Rôle utilisateur:', userRole);
      
      if (!token) {
        setError('Token d\'authentification manquant');
        return;
      }
      
      if (userRole !== 'admin') {
        setError('Accès refusé. Rôle admin requis.');
        return;
      }


      // Récupérer les statistiques
      const statsResponse = await fetch(`${API_BASE_URL}/api/dashboard/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!statsResponse.ok) {
        throw new Error(`Erreur HTTP: ${statsResponse.status}`);
      }

      const statsData = await statsResponse.json();
      if (statsData.success) {
        setStats(statsData.data);
      }

      // Récupérer les tickets récents
      const ticketsResponse = await fetch(`${API_BASE_URL}/api/dashboard/recent-tickets?limit=4`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (ticketsResponse.ok) {
        const ticketsData = await ticketsResponse.json();
        if (ticketsData.success) {
          setRecentTickets(ticketsData.data);
        }
      }

      // Récupérer les propositions récentes
      const propositionsResponse = await fetch(`${API_BASE_URL}/api/propositions/all`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (propositionsResponse.ok) {
        const propositionsData = await propositionsResponse.json();
        if (propositionsData.success) {
          setRecentPropositions(propositionsData.data.slice(0, 4));
        }
      }

      // Récupérer les témoignages
      console.log('🔍 Récupération des témoignages...');
      const testimonialsResponse = await fetch(`${API_BASE_URL}/api/testimonials`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('📊 Réponse témoignages:', testimonialsResponse.status, testimonialsResponse.statusText);
      
      if (testimonialsResponse.ok) {
        const testimonialsData = await testimonialsResponse.json();
        console.log('📝 Données témoignages:', testimonialsData);
        if (testimonialsData.success) {
          setTestimonials(testimonialsData.data);
          console.log('✅ Témoignages chargés:', testimonialsData.data.length);
        }
      } else {
        const errorText = await testimonialsResponse.text();
        console.error('❌ Erreur témoignages:', errorText);
      }

      // Récupérer les partenaires
      console.log('🔍 Récupération des partenaires...');
      const partnersResponse = await fetch(`${API_BASE_URL}/api/partenaires`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('📊 Réponse partenaires:', partnersResponse.status, partnersResponse.statusText);
      
      if (partnersResponse.ok) {
        const partnersData = await partnersResponse.json();
        console.log('📝 Données partenaires:', partnersData);
        if (partnersData.success) {
          setPartners(partnersData.data);
          console.log('✅ Partenaires chargés:', partnersData.data.length);
        }
      } else {
        const errorText = await partnersResponse.text();
        console.error('❌ Erreur partenaires:', errorText);
      }

    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  // Gestionnaires pour les boutons d'action
  const handleViewTicket = (ticketId) => {
    setActiveTab('tickets');
    // Ici vous pourriez ouvrir un modal ou naviguer vers les détails du ticket
    console.log('Voir ticket:', ticketId);
  };

  const handleEditTicket = (ticketId) => {
    setActiveTab('tickets');
    // Ici vous pourriez ouvrir un modal d'édition ou naviguer vers l'édition du ticket
    console.log('Modifier ticket:', ticketId);
  };

  const handleViewTestimonial = (testimonialId) => {
    setActiveTab('testimonials');
    console.log('Voir témoignage:', testimonialId);
  };

  const handleEditTestimonial = (testimonialId) => {
    setActiveTab('testimonials');
    console.log('Modifier témoignage:', testimonialId);
  };

  const handleViewPartner = (partnerId) => {
    setActiveTab('partenaires');
    console.log('Voir partenaire:', partnerId);
  };

  const handleEditPartner = (partnerId) => {
    setActiveTab('partenaires');
    console.log('Modifier partenaire:', partnerId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ouvert': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'en_cours': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'resolu': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'ferme': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgente': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'haute': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'moyenne': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'basse': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-gray-900 dark:via-gray-800/50 dark:to-indigo-900/30">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                  <FaShieldAlt className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Gestion FastCube
                    {adminUser && (
                      <span className="ml-2 text-blue-600 dark:text-blue-400">
                        • Connecté en tant que {adminUser.name || adminUser.email}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.location.reload()}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Actualiser les données"
              >
                <FaSync className="w-4 h-4" />
              </button>
              
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {isDarkMode ? '🌞' : '🌙'}
              </button>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <FaSignOutAlt className="w-4 h-4" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation moderne */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-2 mb-8">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'overview', label: 'Vue d\'ensemble', icon: FaChartBar, color: 'from-blue-500 to-blue-600', count: stats.users?.total || 0 },
              { id: 'services', label: 'Services', icon: FaServer, color: 'from-green-500 to-green-600', count: stats.services?.total || 0 },
              { id: 'solutions', label: 'Solutions', icon: FaCogs, color: 'from-purple-500 to-purple-600', count: stats.solutions?.total || 0 },
              { id: 'tickets', label: 'Tickets', icon: FaTicketAlt, color: 'from-orange-500 to-orange-600', count: stats.tickets?.total || 0 },
              { id: 'testimonials', label: 'Témoignages', icon: FaComments, color: 'from-pink-500 to-pink-600', count: stats.testimonials?.total || 0 },
              { id: 'commentaires', label: 'Commentaires', icon: FaComments, color: 'from-indigo-500 to-indigo-600', count: 0 },
              { id: 'tenders', label: 'Appels d\'Offre', icon: FaCalendarAlt, color: 'from-teal-500 to-teal-600', count: stats.tenders?.total || 0 },
              { id: 'propositions', label: 'Propositions', icon: FaHandshake, color: 'from-cyan-500 to-cyan-600', count: stats.propositions?.total || 0 },
              { id: 'partenaires', label: 'Partenaires', icon: FaHandshake, color: 'from-emerald-500 to-emerald-600', count: stats.partenaires?.total || 0 },
              { id: 'blogs', label: 'Blogs', icon: FaFileAlt, color: 'from-violet-500 to-violet-600', count: stats.blogs?.total || 0 },
              { id: 'users', label: 'Utilisateurs', icon: FaUsers, color: 'from-rose-500 to-rose-600', count: stats.users?.total || 0 },
              { id: 'settings', label: 'Paramètres', icon: FaCog, color: 'from-gray-500 to-gray-600', count: 0 }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 transform hover:scale-105 ${
                    isActive
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span className="hidden sm:inline">{tab.label}</span>
                  {tab.count > 0 && (
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Contenu des onglets */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Statistics */}
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">Chargement des statistiques...</p>
                </div>
              </div>
            ) : error ? (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Erreur</h3>
                    <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Carte Utilisateurs */}
                <div className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                        <FaUsers className="w-6 h-6 text-white" />
                      </div>
                      <div className={`flex items-center text-sm font-medium ${
                        (stats.users.growth || 0) >= 0 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {(stats.users.growth || 0) >= 0 ? (
                          <FaArrowUp className="w-3 h-3 mr-1" />
                        ) : (
                          <FaArrowDown className="w-3 h-3 mr-1" />
                        )}
                        {stats.users.growth ? `+${stats.users.growth}%` : '0%'}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Utilisateurs totaux</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stats.users?.total || 0}</p>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        {stats.users?.recent || 0} nouveaux ce mois
                      </div>
                    </div>
                  </div>
                </div>

                {/* Carte Tickets Actifs */}
                <div className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg">
                        <FaTicketAlt className="w-6 h-6 text-white" />
                      </div>
                      <div className={`flex items-center text-sm font-medium ${
                        (stats.tickets.growth || 0) >= 0 ? 'text-orange-500' : 'text-red-500'
                      }`}>
                        {(stats.tickets.growth || 0) >= 0 ? (
                          <FaArrowUp className="w-3 h-3 mr-1" />
                        ) : (
                          <FaArrowDown className="w-3 h-3 mr-1" />
                        )}
                        {stats.tickets.growth ? `+${stats.tickets.growth}%` : '0%'}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Tickets actifs</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stats.tickets?.active || 0}</p>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                        {stats.tickets?.pending || 0} en attente
                      </div>
                    </div>
                  </div>
                </div>

                {/* Carte Témoignages */}
                <div className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl shadow-lg">
                        <FaComments className="w-6 h-6 text-white" />
                      </div>
                      <div className={`flex items-center text-sm font-medium ${
                        (stats.testimonials.growth || 0) >= 0 ? 'text-pink-500' : 'text-red-500'
                      }`}>
                        {(stats.testimonials.growth || 0) >= 0 ? (
                          <FaArrowUp className="w-3 h-3 mr-1" />
                        ) : (
                          <FaArrowDown className="w-3 h-3 mr-1" />
                        )}
                        {stats.testimonials.growth ? `+${stats.testimonials.growth}%` : '0%'}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Témoignages</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stats.testimonials?.total || 0}</p>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                        {stats.testimonials?.approved || 0} approuvés
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* Tickets récents */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-b border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg">
                    <FaTicketAlt className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tickets Récents</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Derniers tickets créés par les clients</p>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                {recentTickets.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaTicketAlt className="w-8 h-8 text-gray-400" />
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Aucun ticket récent</h4>
                    <p className="text-gray-600 dark:text-gray-400">Les nouveaux tickets apparaîtront ici</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                    {recentTickets.map((ticket, index) => (
                      <div key={ticket.id} className="p-6 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors duration-200 group">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-sm font-mono text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                {ticket.reference}
                              </span>
                              <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(ticket.status)}`}>
                                {ticket.status === 'ouvert' && 'Ouvert'}
                                {ticket.status === 'en_cours' && 'En cours'}
                                {ticket.status === 'resolu' && 'Résolu'}
                                {ticket.status === 'ferme' && 'Fermé'}
                              </span>
                              <span className={`px-3 py-1 text-xs font-medium rounded-full ${getPriorityColor(ticket.priority)}`}>
                                {ticket.priority === 'urgente' && 'Urgente'}
                                {ticket.priority === 'haute' && 'Haute'}
                                {ticket.priority === 'moyenne' && 'Moyenne'}
                                {ticket.priority === 'basse' && 'Basse'}
                              </span>
                            </div>
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {ticket.subject}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              Client: {ticket.customer_name || 'N/A'}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <button 
                              onClick={() => handleViewTicket(ticket.id)}
                              className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                              title="Voir les détails"
                            >
                              <FaEye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleEditTicket(ticket.id)}
                              className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                              title="Modifier le ticket"
                            >
                              <FaEdit className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Témoignages récents */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 border-b border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg">
                    <FaComments className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Témoignages Récents</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Derniers témoignages des clients</p>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                {testimonials.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaComments className="w-8 h-8 text-gray-400" />
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Aucun témoignage récent</h4>
                    <p className="text-gray-600 dark:text-gray-400">Les nouveaux témoignages apparaîtront ici</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                    {testimonials.slice(0, 4).map((testimonial, index) => (
                      <div key={testimonial.id || index} className="p-6 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors duration-200 group">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                testimonial.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                                testimonial.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                                'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                              }`}>
                                {testimonial.status === 'approved' && 'Approuvé'}
                                {testimonial.status === 'pending' && 'En attente'}
                                {testimonial.status === 'rejected' && 'Rejeté'}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {testimonial.rating ? '★'.repeat(testimonial.rating) : '★★★★★'}
                              </span>
                            </div>
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                              {testimonial.user_name || testimonial.name || 'Client anonyme'}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                              {testimonial.message || testimonial.content || testimonial.testimonial || 'Aucun contenu'}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <button 
                              onClick={() => handleViewTestimonial(testimonial.id)}
                              className="p-2 text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                              title="Voir les détails"
                            >
                              <FaEye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleEditTestimonial(testimonial.id)}
                              className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                              title="Modifier le témoignage"
                            >
                              <FaEdit className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Partenaires récents */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-b border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg">
                    <FaHandshake className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Partenaires Récents</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Derniers partenaires ajoutés</p>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                {partners.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaHandshake className="w-8 h-8 text-gray-400" />
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Aucun partenaire récent</h4>
                    <p className="text-gray-600 dark:text-gray-400">Les nouveaux partenaires apparaîtront ici</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                    {partners.slice(0, 4).map((partner, index) => (
                      <div key={partner.id || index} className="p-6 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors duration-200 group">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                partner.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                                partner.status === 'inactive' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' :
                                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                              }`}>
                                {partner.status === 'active' && 'Actif'}
                                {partner.status === 'inactive' && 'Inactif'}
                                {partner.status === 'pending' && 'En attente'}
                              </span>
                            </div>
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                              {partner.name || partner.nom || 'Partenaire'}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                              {partner.description || partner.description || 'Aucune description'}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <button 
                              onClick={() => handleViewPartner(partner.id)}
                              className="p-2 text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                              title="Voir les détails"
                            >
                              <FaEye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleEditPartner(partner.id)}
                              className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                              title="Modifier le partenaire"
                            >
                              <FaEdit className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-b border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                  <FaServer className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Gestion des Services</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Ajoutez, modifiez ou supprimez les services de votre entreprise</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <AdminServicesManager />
            </div>
          </div>
        )}

        {activeTab === 'solutions' && (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-b border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                  <FaCogs className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Gestion des Solutions</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Ajoutez, modifiez ou supprimez les solutions de votre entreprise</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <AdminSolutionsManager />
            </div>
          </div>
        )}

        {activeTab === 'tickets' && (
          <AdminTickets />
        )}

        {activeTab === 'testimonials' && (
          <AdminTestimonials />
        )}

        {activeTab === 'commentaires' && (
          <AdminCommentairesManager />
        )}

        {activeTab === 'tenders' && (
          <AdminTenders />
        )}

        {activeTab === 'propositions' && (
          <AdminPropositions />
        )}

        {activeTab === 'partenaires' && (
          <AdminPartenairesManager />
        )}

        {activeTab === 'blogs' && (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border-b border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-violet-500 to-violet-600 rounded-lg">
                  <FaFileAlt className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Gestion des Blogs</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Créez, modifiez et gérez vos articles de blog</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <AdminBlogManager />
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <AdminUsers />
        )}

        {activeTab === 'settings' && (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 border-b border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg">
                  <FaCog className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Paramètres</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Configuration du système et préférences</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCog className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Paramètres</h4>
                <p className="text-gray-600 dark:text-gray-400">Interface de configuration à implémenter</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;
