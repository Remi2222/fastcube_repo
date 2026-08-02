import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaSearch, FaUserCircle, FaShieldAlt, FaBars, FaTimes, FaTicketAlt, 
  FaSignOutAlt, FaUserCog, FaRocket, FaGlobe, FaBell, FaCog, FaHome,
  FaInfoCircle, FaCogs, FaHandshake, FaBlog, FaFileContract, FaEnvelope,
  FaChevronDown, FaStar
} from 'react-icons/fa';

import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
// import { getTranslation } from '../utils/translations'; // Remplacé par LanguageContext
import IntelligentSearch from './IntelligentSearch';
import NotificationPanel from './NotificationPanel';
import '../styles/navbar-modern.css';

export default function HeaderFastCube() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const menuRef = useRef(null);
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { lang, changeLanguage, getTranslation } = useLanguage();
  const { isLoggedIn, userRole, logout, userEmail } = useAuth();
  const { unreadCount, toggleNotifications, isOpen: notificationsOpen } = useNotifications();

  // Menu items with modern icons and enhanced UX
  const menuItems = [
    { key: 'home', to: "/", icon: FaHome, color: 'from-blue-500 to-blue-600' },
    { key: 'about', to: "/about", icon: FaInfoCircle, color: 'from-green-500 to-green-600' },
    { key: 'services', to: "/services", icon: FaCogs, color: 'from-purple-500 to-purple-600' },
    { key: 'solutions', to: "/solutions", icon: FaRocket, color: 'from-orange-500 to-orange-600' },
    { key: 'partners', to: "/partners", icon: FaHandshake, color: 'from-pink-500 to-pink-600' },
    { key: 'blog', to: "/blog", icon: FaBlog, color: 'from-indigo-500 to-indigo-600' },
    { key: 'tenders', to: "/appel-offre", icon: FaFileContract, color: 'from-teal-500 to-teal-600' },
    { key: 'contact', to: "/contact", icon: FaEnvelope, color: 'from-rose-500 to-rose-600' },
  ];

  // Check if a link is active
  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch user data when logged in
  useEffect(() => {
    const fetchUserData = async () => {
      if (isLoggedIn) {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch('http://localhost:5000/api/users/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (response.ok) {
            const data = await response.json();
            setUserData(data.data);
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des données utilisateur:', error);
        }
      }
    };

    fetchUserData();
  }, [isLoggedIn]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle user menu click
  const handleUserClick = () => {
    if (isLoggedIn) {
      setUserMenuOpen(!userMenuOpen);
    } else {
      navigate('/login');
    }
  };

  // Handle logout
  const handleLogout = () => {
    if (confirm(getTranslation('confirmLogout') || 'Êtes-vous sûr de vouloir vous déconnecter ?')) {
      logout();
      setUserMenuOpen(false);
      navigate('/');
    }
  };

  // Handle dashboard click
  const handleDashboardClick = () => {
    if (userRole === 'admin') {
      navigate('/admin-dashboard');
    } else {
      navigate('/client-dashboard');
    }
    setUserMenuOpen(false);
  };

  return (
    <>
      {/* Ultra-Modern Header with Glassmorphism */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl border-b border-gray-200/50 dark:border-gray-700/50' 
          : 'bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg'
      }`}>
        
        {/* Navigation Container */}
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Main Navigation Row - Enhanced Height */}
          <div className="flex items-center justify-between h-18">
            
            {/* ===== LEFT: Enhanced Logo Section ===== */}
            <div className="flex items-center flex-shrink-0">
              <Link
                to="/"
                className="flex items-center space-x-4 group"
              >
                {/* Enhanced Logo Icon with Animation */}
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                    <FaRocket className="w-6 h-6 text-white group-hover:animate-bounce" />
                  </div>
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                </div>
                
                {/* Enhanced Logo Text with Gradient */}
                <div className="flex flex-col">
                  <span className="font-bold text-2xl bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 dark:from-white dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-500">
                    FastCube
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      Innovation & Excellence
                    </span>
                    <FaStar className="w-3 h-3 text-yellow-500 animate-pulse" />
                  </div>
                </div>
              </Link>
            </div>

            {/* ===== CENTER: Enhanced Navigation Menu ===== */}
            <div className="hidden lg:flex items-center justify-center flex-1 px-8">
              <ul className="flex items-center space-x-2">
                {menuItems.map(item => {
                  const Icon = item.icon;
                  const isItemActive = isActive(item.to);
                  return (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        className={`group relative flex items-center justify-center h-14 px-5 text-sm font-medium transition-all duration-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          isItemActive
                            ? `text-white bg-gradient-to-r ${item.color} shadow-lg transform scale-105`
                            : 'text-gray-700 dark:text-gray-300 hover:text-white hover:bg-gradient-to-r hover:shadow-lg hover:scale-105 dark:hover:text-white'
                        }`}
                      >
                        {/* Icon with Animation */}
                        <div className={`flex items-center gap-3 transition-all duration-300 ${
                          isItemActive ? 'text-white' : `text-gray-600 dark:text-gray-400 group-hover:text-white`
                        }`}>
                          <Icon className={`w-4 h-4 transition-transform duration-300 ${
                            isItemActive ? 'scale-110' : 'group-hover:scale-110 group-hover:rotate-12'
                          }`} />
                          <span className="font-semibold">{getTranslation(`nav.${item.key}`)}</span>
                        </div>
                        
                        {/* Enhanced Active Indicator */}
                        {isItemActive && (
                          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-white rounded-full shadow-lg"></div>
                        )}
                        
                        {/* Hover Glow Effect */}
                        <div className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* ===== RIGHT: Enhanced Actions Section ===== */}
            <div className="flex items-center space-x-3">
              
              {/* Enhanced Language Switcher */}
              <button 
                onClick={() => changeLanguage(lang === 'fr' ? 'en' : 'fr')}
                className="group relative flex items-center justify-center w-12 h-12 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-300 hover:scale-110"
                title={lang === 'fr' ? 'Switch to English' : 'Passer au français'}
              >
                <FaGlobe className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                <span className="ml-2 text-xs font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {lang === 'fr' ? 'EN' : 'FR'}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              {/* Enhanced Search Button */}
              <button
                onClick={() => setSearchOpen(true)}
                className="group relative flex items-center justify-center w-12 h-12 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-300 hover:scale-110"
                aria-label={getTranslation('search')}
              >
                <FaSearch className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              {/* Enhanced Notifications Button - Only for logged in users */}
              {isLoggedIn && (
                <button 
                  onClick={toggleNotifications}
                  className="group relative flex items-center justify-center w-12 h-12 text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-xl transition-all duration-300 hover:scale-110"
                >
                  <FaBell className="w-5 h-5 group-hover:animate-pulse" />
                  {unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-bounce">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              )}

              {/* Enhanced Tickets Button */}
              {isLoggedIn && userRole !== 'admin' && (
                <Link
                  to="/tickets"
                  className="group relative hidden sm:flex items-center justify-center h-12 px-5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-sm font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <FaTicketAlt className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                  <span>{getTranslation('tickets') || 'Tickets'}</span>
                  <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              )}

              {/* Enhanced User Menu / Login Button */}
              <div className="relative" ref={userMenuRef}>
                {isLoggedIn ? (
                  // Logged in - Enhanced User Menu
                  <>
                    <button
                      onClick={handleUserClick}
                      className="group relative flex items-center justify-center h-12 px-4 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 hover:from-blue-500 hover:to-purple-600 text-gray-700 dark:text-gray-300 hover:text-white text-sm font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    >
                      <FaUserCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                      <span className="hidden sm:block">
                        {getTranslation('account')}
                      </span>
                      <FaChevronDown className="w-3 h-3 ml-2 group-hover:rotate-180 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>

                    {/* Enhanced User Dropdown */}
                    {userMenuOpen && (
                      <div className="absolute right-0 mt-3 w-56 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 py-3 z-50 animate-fade-in-up">
                        
                        {/* User Info Header */}
                        <div className="px-4 py-2 border-b border-gray-200/50 dark:border-gray-700/50">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {userData ? (userData.first_name ? userData.first_name.charAt(0).toUpperCase() : userData.email.charAt(0).toUpperCase()) : 'U'}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                {userData ? `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || userData.email : 'Utilisateur'}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {userData ? userData.email : userEmail || 'Chargement...'}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Dashboard Option */}
                        <button
                          onClick={handleDashboardClick}
                          className="group w-full flex items-center h-12 px-4 text-sm text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition-all duration-200"
                        >
                          <FaShieldAlt className="w-4 h-4 mr-3 text-blue-500 group-hover:scale-110 transition-transform duration-200" />
                          <span className="font-medium">{getTranslation('dashboard')}</span>
                        </button>
                        
                        {/* Account Option */}
                        <Link
                          to={userRole === 'admin' ? "/admin-account" : "/client-account"}
                          onClick={() => setUserMenuOpen(false)}
                          className="group w-full flex items-center h-12 px-4 text-sm text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20 transition-all duration-200"
                        >
                          <FaUserCog className="w-4 h-4 mr-3 text-purple-500 group-hover:scale-110 transition-transform duration-200" />
                          <span className="font-medium">Mon Compte</span>
                        </Link>
                        
                        {/* Settings Option */}
                        <button className="group w-full flex items-center h-12 px-4 text-sm text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200">
                          <FaCog className="w-4 h-4 mr-3 text-gray-500 group-hover:rotate-90 transition-transform duration-200" />
                          <span className="font-medium">Paramètres</span>
                        </button>
                        
                        {/* Separator */}
                        <div className="border-t border-gray-200/50 dark:border-gray-700/50 my-2"></div>
                        
                        {/* Logout Option */}
                        <button
                          onClick={handleLogout}
                          className="group w-full flex items-center h-12 px-4 text-sm text-red-600 dark:text-red-400 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 dark:hover:from-red-900/20 dark:hover:to-pink-900/20 transition-all duration-200"
                        >
                          <FaSignOutAlt className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform duration-200" />
                          <span className="font-medium">{getTranslation('logout')}</span>
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  // Not logged in - Enhanced CTA Button
                  <button
                    onClick={handleUserClick}
                    className="group relative flex items-center justify-center h-12 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  >
                    <FaUserCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                    <span>{getTranslation('login')}</span>
                    <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                )}
              </div>

              {/* Enhanced Mobile Menu Button */}
              <button
                ref={menuRef}
                onClick={() => setOpen(!open)}
                className="group lg:hidden flex items-center justify-center w-12 h-12 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-300 hover:scale-110"
                aria-label={getTranslation('menu')}
              >
                <div className="relative">
                  {open ? (
                    <FaTimes className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                  ) : (
                    <FaBars className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>

          {/* ===== ENHANCED MOBILE NAVIGATION ===== */}
          <div
            className={`lg:hidden transition-all duration-500 ease-in-out overflow-hidden ${
              open
                ? 'max-h-screen opacity-100 visible'
                : 'max-h-0 opacity-0 invisible'
            }`}
          >
            <div className="px-4 pt-4 pb-6 space-y-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50 rounded-b-2xl shadow-2xl">
              
              {/* Primary Menu Items with Icons */}
              {menuItems.map(item => {
                const Icon = item.icon;
                const isItemActive = isActive(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`group flex items-center h-14 px-4 text-sm font-semibold rounded-xl transition-all duration-300 ${
                      isItemActive
                        ? `text-white bg-gradient-to-r ${item.color} shadow-lg transform scale-105`
                        : 'text-gray-700 dark:text-gray-300 hover:text-white hover:bg-gradient-to-r hover:shadow-lg hover:scale-105 dark:hover:text-white'
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    <Icon className={`w-5 h-5 mr-3 transition-transform duration-300 ${
                      isItemActive ? 'scale-110' : 'group-hover:scale-110 group-hover:rotate-12'
                    }`} />
                    <span>{getTranslation(`nav.${item.key}`)}</span>
                    <div className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                  </Link>
                );
              })}

              {/* Enhanced Language Switcher for Mobile */}
              <button
                onClick={() => {
                  changeLanguage(lang === 'fr' ? 'en' : 'fr');
                  setOpen(false);
                }}
                className="group flex items-center w-full h-14 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <FaGlobe className="w-5 h-5 mr-3 group-hover:rotate-180 transition-transform duration-500" />
                <span>{lang === 'fr' ? 'Switch to English' : 'Passer au français'}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              {/* Enhanced User Actions for Mobile */}
              {isLoggedIn && (
                <div className="pt-4 border-t border-gray-200/50 dark:border-gray-700/50 space-y-3">
                  
                  {/* Tickets Button */}
                  {userRole !== 'admin' && (
                    <Link
                      to="/tickets"
                      onClick={() => setOpen(false)}
                      className="group flex items-center w-full h-14 px-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-sm font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    >
                      <FaTicketAlt className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                      <span>{getTranslation('tickets') || 'Tickets'}</span>
                      <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </Link>
                  )}
                  
                  {/* Dashboard Button */}
                  <button
                    onClick={() => {
                      handleDashboardClick();
                      setOpen(false);
                    }}
                    className="group flex items-center w-full h-14 px-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-sm font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    <FaShieldAlt className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
                    <span>{getTranslation('dashboard')}</span>
                    <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>

                  {/* Account Button */}
                  <Link
                    to={userRole === 'admin' ? "/admin-account" : "/client-account"}
                    onClick={() => setOpen(false)}
                    className="group flex items-center w-full h-14 px-4 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 hover:from-purple-500 hover:to-pink-600 text-gray-700 dark:text-gray-300 hover:text-white text-sm font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    <FaUserCog className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
                    <span>Mon Compte</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>

                  {/* Logout Button */}
                  <button
                    onClick={() => {
                      handleLogout();
                      setOpen(false);
                    }}
                    className="group flex items-center w-full h-14 px-4 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white text-sm font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    <FaSignOutAlt className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
                    <span>{getTranslation('logout')}</span>
                    <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Search Modal */}
      <IntelligentSearch
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        placeholder="Rechercher sur tout le site..."
      />

      {/* Notifications Panel - Only for logged in users */}
      {isLoggedIn && <NotificationPanel />}
    </>
  );
} 