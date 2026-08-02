import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaTimes, FaSpinner, FaArrowUp, FaArrowDown, FaKeyboard } from 'react-icons/fa';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../utils/translations';

export default function IntelligentSearch({ 
  isOpen, 
  onClose, 
  placeholder = "Rechercher sur tout le site...",
  showGlobalSearch = true 
}) {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [searchHistory, setSearchHistory] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Charger l'historique de recherche
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      const history = JSON.parse(savedHistory);
      setSearchHistory(history);
      setRecentSearches(history.slice(0, 5));
    }
  }, []);

  // Sauvegarder l'historique de recherche
  const saveToHistory = (searchTerm) => {
    if (!searchTerm.trim()) return;
    
    const newHistory = [
      searchTerm,
      ...searchHistory.filter(item => item !== searchTerm)
    ].slice(0, 10);
    
    setSearchHistory(newHistory);
    setRecentSearches(newHistory.slice(0, 5));
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

  // Générer des suggestions intelligentes
  const generateSuggestions = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setLoading(true);
    
    try {
      // Suggestions basées sur le contenu du site
      const allSuggestions = [
        // Services
        { type: 'service', title: 'Cybersécurité', url: '/services', category: 'Sécurité' },
        { type: 'service', title: 'Cloud Computing', url: '/services', category: 'Infrastructure' },
        { type: 'service', title: 'Développement Web', url: '/services', category: 'Développement' },
        { type: 'service', title: 'Audit IT', url: '/services', category: 'Conseil' },
        
        // Solutions
        { type: 'solution', title: 'SOC Externalisé', url: '/solutions', category: 'Sécurité' },
        { type: 'solution', title: 'Migration Cloud', url: '/solutions', category: 'Infrastructure' },
        { type: 'solution', title: 'Conformité RGPD', url: '/solutions', category: 'Conformité' },
        
        // Blog
        { type: 'blog', title: 'Tendances Cybersécurité 2024', url: '/blog/1', category: 'Blog' },
        { type: 'blog', title: 'SOC Externalisé Avantages', url: '/blog/2', category: 'Blog' },
        { type: 'blog', title: 'Transformation Digitale', url: '/blog/3', category: 'Blog' },
        
        // Pages
        { type: 'page', title: 'À propos', url: '/about', category: 'Pages' },
        { type: 'page', title: 'Contact', url: '/contact', category: 'Pages' },
        { type: 'page', title: 'Partenaires', url: '/partners', category: 'Pages' },
        { type: 'page', title: 'Appels d\'offres', url: '/appel-offre', category: 'Pages' },
        
        // Tickets (si connecté)
        { type: 'ticket', title: 'Mes Tickets', url: '/my-tickets', category: 'Support' },
        { type: 'ticket', title: 'Nouveau Ticket', url: '/new-ticket', category: 'Support' },
      ];

      // Filtrer les suggestions basées sur la recherche
      const filtered = allSuggestions.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );

      // Ajouter des suggestions d'historique
      const historySuggestions = searchHistory
        .filter(item => item.toLowerCase().includes(searchTerm.toLowerCase()))
        .map(item => ({ type: 'history', title: item, url: null, category: 'Historique' }));

      // Combiner et limiter les résultats
      const combined = [...historySuggestions, ...filtered].slice(0, 8);
      setSuggestions(combined);
      setShowSuggestions(true);
      
    } catch (error) {
      console.error('Erreur lors de la génération des suggestions:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  // Gérer les changements de recherche
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);
    
    if (value.trim()) {
      generateSuggestions(value);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Gérer la soumission de recherche
  const handleSearchSubmit = (searchTerm = query) => {
    if (!searchTerm.trim()) return;
    
    saveToHistory(searchTerm);
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    onClose();
    
    // Navigation vers la page de résultats
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
  };

  // Gérer les touches du clavier
  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          const suggestion = suggestions[selectedIndex];
          if (suggestion.url) {
            navigate(suggestion.url);
            onClose();
          } else {
            handleSearchSubmit(suggestion.title);
          }
        } else {
          handleSearchSubmit();
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  };

  // Gérer le clic sur une suggestion
  const handleSuggestionClick = (suggestion) => {
    if (suggestion.url) {
      navigate(suggestion.url);
      onClose();
    } else {
      handleSearchSubmit(suggestion.title);
    }
  };

  // Focus sur l'input quand le modal s'ouvre
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 animate-slide-down">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {getTranslation(lang, 'search') || 'Recherche'}
            </h3>
            <button
              onClick={onClose}
              className="inline-flex items-center px-3 py-2 bg-transparent hover:bg-gray-100 text-gray-700 hover:text-gray-900 font-medium rounded-lg transition-all duration-200 text-sm"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          {/* Barre de recherche */}
          <div className="relative mb-4">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            {loading && (
              <FaSpinner className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 animate-spin" />
            )}
          </div>

          {/* Suggestions */}
          {showSuggestions && (
            <div ref={suggestionsRef} className="space-y-2">
              {suggestions.length > 0 ? (
                suggestions.map((suggestion, index) => (
                  <button
                    key={`${suggestion.type}-${index}`}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={`w-full text-left p-3 rounded-lg transition-colors duration-200 ${
                      index === selectedIndex
                        ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          suggestion.type === 'service' ? 'bg-green-500' :
                          suggestion.type === 'solution' ? 'bg-blue-500' :
                          suggestion.type === 'blog' ? 'bg-purple-500' :
                          suggestion.type === 'page' ? 'bg-gray-500' :
                          suggestion.type === 'ticket' ? 'bg-orange-500' :
                          'bg-yellow-500'
                        }`} />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {suggestion.title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {suggestion.category}
                          </div>
                        </div>
                      </div>
                      {suggestion.url && (
                        <FaArrowUp className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </button>
                ))
              ) : query.trim() && !loading ? (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                  Aucun résultat trouvé
                </div>
              ) : null}
            </div>
          )}

          {/* Recherches récentes */}
          {!query.trim() && recentSearches.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Recherches récentes
              </h4>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={`search-item-${index}`}
                    onClick={() => handleSearchSubmit(search)}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Raccourcis clavier */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <FaKeyboard className="w-3 h-3" />
                <span>↑↓ Naviguer</span>
              </div>
              <div className="flex items-center space-x-1">
                <FaArrowUp className="w-3 h-3" />
                <span>Entrée Sélectionner</span>
              </div>
              <div className="flex items-center space-x-1">
                <FaTimes className="w-3 h-3" />
                <span>Échap Fermer</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 