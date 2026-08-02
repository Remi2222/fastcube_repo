import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaUser, FaEnvelope, FaPhone, FaEdit, FaSave, FaTimes, FaShieldAlt, 
  FaCalendarAlt, FaMapMarkerAlt, FaGlobe, FaBell,
  FaCamera, FaSignOutAlt, FaLock, FaEye, FaEyeSlash, FaHistory,
  FaCog, FaUserCog, FaTicketAlt, FaPlus, FaNewspaper
} from 'react-icons/fa';
import DarkModeToggle from '../components/DarkModeToggle';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useLanguage } from '../contexts/LanguageContext';
import { useDarkMode } from '../contexts/DarkModeContext';


export default function ClientAccount() {
  const navigate = useNavigate();
  const { lang, getTranslation, changeLanguage } = useLanguage();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userTickets, setUserTickets] = useState([]);
  const [selectedTab, setSelectedTab] = useState('profile');
  
  
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: ''
  });
  
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  
  const [preferences, setPreferences] = useState({
    language: lang,
    emailNotifications: true,
    darkMode: isDarkMode
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    fetchUserData();
    fetchUserTickets();
  }, [navigate]);


  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserData(data.data);
        setEditForm({
          name: `${data.data.first_name || ''} ${data.data.last_name || ''}`.trim() || '',
          email: data.data.email || '',
          phone: data.data.phone || '',
          address: data.data.address || '',
          city: data.data.city || '',
          country: data.data.country || ''
        });
      } else {
        console.error('Erreur lors de la récupération des données utilisateur');
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserTickets = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('🔍 Récupération des tickets pour l\'utilisateur...');
      
      const response = await fetch('http://localhost:5000/api/tickets/mine', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('📡 Réponse API tickets:', response.status, response.statusText);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📡 Données tickets reçues:', data);
        setUserTickets(data.data || []);
      } else if (response.status === 401) {
        console.error('❌ Token invalide - Redirection vers login');
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userEmail');
        navigate('/login');
      } else {
        console.error('❌ Erreur API tickets:', response.status);
        const errorText = await response.text();
        console.error('❌ Détails erreur:', errorText);
        setUserTickets([]);
      }
    } catch (error) {
      console.error('❌ Erreur de connexion tickets:', error);
      setUserTickets([]);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      console.log('📝 Envoi des données de mise à jour:', editForm);
      
      const response = await fetch('http://localhost:5000/api/users/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });
      
      console.log('📡 Réponse API:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Données mises à jour:', data);
        setUserData(data.data);
        setIsEditing(false);
        alert(getTranslation('modal.info_updated'));
      } else {
        const errorData = await response.json();
        console.error('❌ Erreur API:', errorData);
        alert(errorData.message || getTranslation('modal.error_update'));
      }
    } catch (error) {
      console.error('❌ Erreur de connexion:', error);
      alert(getTranslation('modal.error_update'));
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert(getTranslation('modal.passwords_dont_match'));
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      alert(getTranslation('modal.password_too_short'));
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/users/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });
      
      if (response.ok) {
        alert(getTranslation('modal.password_changed'));
        setIsChangingPassword(false);
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        const data = await response.json();
        alert(data.message || getTranslation('modal.error_password'));
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert(getTranslation('modal.error_password'));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const handleTicketClick = (ticket) => {
    navigate(`/ticket/${ticket.id}`);
  };




  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-20 transition-colors duration-300">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">{getTranslation('account.loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-20 transition-colors duration-300">
      <div className="container mx-auto px-4 py-12">
        {}
        <div className="text-center mb-12">
          <button 
            onClick={() => navigate('/client-dashboard')} 
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mb-6 transition-colors"
          >
            {getTranslation('account.back_dashboard')}
          </button>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{getTranslation('account.title')}</h1>
          
          {}
          {userData && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {userData.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="text-left">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{userData.name}</h2>
                  <p className="text-gray-600 dark:text-gray-300">{userData.email}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Membre depuis {userData.created_at ? new Date(userData.created_at).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
              
              {}
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                {userData.phone && (
                  <div className="flex items-center gap-2">
                    <FaPhone className="text-blue-600" />
                    <span className="text-gray-700 dark:text-gray-300">{userData.phone}</span>
                  </div>
                )}
                {userData.address && (
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-blue-600" />
                    <span className="text-gray-700 dark:text-gray-300">{userData.address}</span>
                  </div>
                )}
                {userData.city && userData.country && (
                  <div className="flex items-center gap-2">
                    <FaGlobe className="text-blue-600" />
                    <span className="text-gray-700 dark:text-gray-300">{userData.city}, {userData.country}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="max-w-6xl mx-auto">
          {}
          <div className="flex flex-wrap justify-center mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-2 transition-colors">
            <button
              onClick={() => setSelectedTab('profile')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                selectedTab === 'profile' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              <FaUser className="inline mr-2" />
              {getTranslation('account.profile')}
            </button>
            <button
              onClick={() => setSelectedTab('tickets')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                selectedTab === 'tickets' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              <FaTicketAlt className="inline mr-2" />
              {getTranslation('account.tickets')}
            </button>
            <button
              onClick={() => navigate('/newsletter')}
              className="px-6 py-3 rounded-lg font-medium transition-colors text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
            >
              <FaNewspaper className="inline mr-2" />
              Newsletter
            </button>
            <button
              onClick={() => setSelectedTab('preferences')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                selectedTab === 'preferences' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              <FaCog className="inline mr-2" />
              {getTranslation('account.preferences')}
            </button>
          </div>

          {}
          {selectedTab === 'profile' && (
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 transition-colors">
              {}
              <div className="text-center mb-8">
                <div className="relative inline-block">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto">
                    {userData?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                    <FaCamera className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {}
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <FaUser className="inline mr-2" />
                      {getTranslation('account.full_name')}
                    </label>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <span className="text-gray-900 dark:text-white">{userData?.name || getTranslation('account.not_provided')}</span>
                      {!isEditing && (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="ml-auto text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <FaEnvelope className="inline mr-2" />
                      {getTranslation('account.email')}
                    </label>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <span className="text-gray-900 dark:text-white">{userData?.email || getTranslation('account.not_provided')}</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <FaPhone className="inline mr-2" />
                      {getTranslation('account.phone')}
                    </label>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <span className="text-gray-900 dark:text-white">{userData?.phone || getTranslation('account.not_provided')}</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <FaMapMarkerAlt className="inline mr-2" />
                      {getTranslation('account.address')}
                    </label>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <span className="text-gray-900 dark:text-white">{userData?.address || getTranslation('account.not_provided')}</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <FaMapMarkerAlt className="inline mr-2" />
                      {getTranslation('account.city')}
                    </label>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <span className="text-gray-900 dark:text-white">{userData?.city || getTranslation('account.not_provided')}</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <FaGlobe className="inline mr-2" />
                      {getTranslation('account.country')}
                    </label>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <span className="text-gray-900 dark:text-white">{userData?.country || getTranslation('account.not_provided')}</span>
                    </div>
                  </div>
                </div>

                {}
                <div className="flex flex-wrap gap-4 justify-center pt-6 border-t border-gray-200 dark:border-gray-600">
                  <button
                    onClick={() => setIsChangingPassword(true)}
                    className="inline-flex items-center gap-2 bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    <FaLock className="w-4 h-4" />
                    {getTranslation('account.change_password')}
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <FaSignOutAlt className="w-4 h-4" />
                    {getTranslation('account.logout')}
                  </button>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'tickets' && (
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 transition-colors">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">{getTranslation('tickets.title')}</h2>
              
              {!userData ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-300">{getTranslation('account.loading_tickets')}</p>
                </div>
              ) : userTickets.length === 0 ? (
                <div className="text-center py-12">
                  <FaTicketAlt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{getTranslation('account.no_tickets')}</p>
                  <a 
                    href="/new-ticket"
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FaPlus className="w-4 h-4" />
                    {getTranslation('account.create_ticket')}
                  </a>
                </div>
              ) : (
                <div className="space-y-4">
                  {userTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      onClick={() => handleTicketClick(ticket)}
                      className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow bg-white dark:bg-gray-700"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 dark:text-white mb-2">{ticket.subject}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{ticket.description?.substring(0, 100)}...</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                            <span>#{ticket.reference}</span>
                            <span>{new Date(ticket.created_at).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US')}</span>
                            <span className={`px-2 py-1 rounded-full ${
                              ticket.status === 'ouvert' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                              ticket.status === 'en_cours' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                              ticket.status === 'resolu' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                              'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                            }`}>
                              {ticket.status === 'ouvert' ? getTranslation('tickets.status.open') :
                               ticket.status === 'en_cours' ? getTranslation('tickets.status.in_progress') :
                               ticket.status === 'resolu' ? getTranslation('tickets.status.resolved') :
                               getTranslation('tickets.status.closed')}
                            </span>
                          </div>
                        </div>
                        <FaEye className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}


          {selectedTab === 'preferences' && (
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 transition-colors">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">{getTranslation('preferences.title')}</h2>
              
              <div className="space-y-6">
                                 <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                     <FaGlobe className="inline mr-2" />
                     {getTranslation('preferences.language')}
                   </label>
                   <div className="flex justify-center">
                     <LanguageSwitcher lang={lang} setLang={changeLanguage} />
                   </div>
                 </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <label className="font-medium text-gray-700 dark:text-gray-300">
                      <FaBell className="inline mr-2" />
                      {getTranslation('preferences.email_notifications')}
                    </label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{getTranslation('preferences.email_notifications_desc')}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.emailNotifications}
                      onChange={(e) => setPreferences({...preferences, emailNotifications: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <label className="font-medium text-gray-700 dark:text-gray-300">
                      {getTranslation('preferences.dark_mode')}
                    </label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{getTranslation('preferences.dark_mode_desc')}</p>
                  </div>
                  <DarkModeToggle />
                </div>
              </div>
            </div>
          )}
        </div>

        {}
        {isEditing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full transition-colors">
              <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">{getTranslation('modal.edit_info')}</h3>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{getTranslation('account.full_name')}</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{getTranslation('account.phone')}</label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{getTranslation('account.address')}</label>
                  <input
                    type="text"
                    value={editForm.address}
                    onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{getTranslation('account.city')}</label>
                    <input
                      type="text"
                      value={editForm.city}
                      onChange={(e) => setEditForm({...editForm, city: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{getTranslation('account.country')}</label>
                    <input
                      type="text"
                      value={editForm.country}
                      onChange={(e) => setEditForm({...editForm, country: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FaSave className="inline mr-2" />
                    {getTranslation('account.save')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <FaTimes className="inline mr-2" />
                    {getTranslation('account.cancel')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isChangingPassword && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full transition-colors">
              <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">{getTranslation('modal.change_password')}</h3>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{getTranslation('modal.current_password')}</label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                      className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.current ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{getTranslation('modal.new_password')}</label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                      className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.new ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{getTranslation('modal.confirm_password')}</label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                      className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.confirm ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FaLock className="inline mr-2" />
                    {getTranslation('account.change_password')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsChangingPassword(false);
                      setPasswordForm({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                      });
                    }}
                    className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <FaTimes className="inline mr-2" />
                    {getTranslation('account.cancel')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 