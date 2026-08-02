import React from "react";

export default function LanguageSwitcher({ lang, setLang }) {
  const languages = [
    { code: 'fr', label: 'FR', flag: '🇫🇷' },
    { code: 'en', label: 'EN', flag: '🇺🇸' }
  ];

  return (
    <div className="flex gap-1">
      {languages.map((language) => (
        <button
          key={language.code}
          onClick={() => setLang(language.code)}
          className={`px-2 py-1 font-medium transition-all duration-200 relative group rounded-lg ${
            lang === language.code
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
              : 'bg-transparent hover:bg-gray-100 hover:shadow-sm text-gray-700 hover:text-gray-900'
          }`}
          aria-label={`Switch to ${language.label}`}
        >
          <span className="flex items-center space-x-1">
            <span className="text-sm">{language.flag}</span>
            <span className="text-xs font-semibold">{language.label}</span>
          </span>
          
          {/* Active indicator */}
          {lang === language.code && (
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
          )}
        </button>
      ))}
    </div>
  );
} 