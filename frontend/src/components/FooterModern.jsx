import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaYoutube, FaGithub, FaArrowUp, FaEnvelope, FaPhone, FaMapMarkerAlt, FaShieldAlt, FaRocket, FaUsers, FaAward } from 'react-icons/fa';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../utils/translations';

export default function FooterModern() {
  const { lang } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-pattern-dots"></div>
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10">
        {/* Top Section */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">F</span>
                </div>
      <div>
                  <h3 className="font-display font-bold text-2xl text-white">FastCube</h3>
                  <p className="text-sm text-gray-400">Innovation & Excellence</p>
                </div>
              </div>
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                {getTranslation(lang, 'footerDescription') || 'Expert en cybersécurité, réseaux et solutions cloud. Nous accompagnons votre transformation digitale avec des solutions innovantes et sécurisées.'}
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-blue-600/20 hover:bg-blue-600 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 group">
                  <FaFacebook className="w-4 h-4 text-blue-400 group-hover:text-white" />
                </a>
                <a href="#" className="w-10 h-10 bg-purple-600/20 hover:bg-purple-600 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 group">
                  <FaTwitter className="w-4 h-4 text-purple-400 group-hover:text-white" />
                </a>
                <a href="#" className="w-10 h-10 bg-blue-700/20 hover:bg-blue-700 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 group">
                  <FaLinkedin className="w-4 h-4 text-blue-500 group-hover:text-white" />
                </a>
                <a href="#" className="w-10 h-10 bg-pink-600/20 hover:bg-pink-600 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 group">
                  <FaInstagram className="w-4 h-4 text-pink-400 group-hover:text-white" />
                </a>
                <a href="#" className="w-10 h-10 bg-red-600/20 hover:bg-red-600 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 group">
                  <FaYoutube className="w-4 h-4 text-red-400 group-hover:text-white" />
                </a>
        </div>
      </div>

            {/* Quick Links */}
      <div>
              <h4 className="text-lg font-semibold text-white mb-6 flex items-center">
                <FaRocket className="w-5 h-5 mr-2 text-blue-400" />
                {getTranslation(lang, 'quickLinks')}
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/about" className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center group">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 group-hover:scale-150 transition-transform duration-200"></span>
                    {getTranslation(lang, 'about')}
                  </Link>
                </li>
                <li>
                  <Link to="/services" className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center group">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-3 group-hover:scale-150 transition-transform duration-200"></span>
                    {getTranslation(lang, 'services')}
                  </Link>
                </li>
                <li>
                  <Link to="/solutions" className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center group">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-3 group-hover:scale-150 transition-transform duration-200"></span>
                    {getTranslation(lang, 'solutions')}
                  </Link>
                </li>
                <li>
                  <Link to="/partners" className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center group">
                    <span className="w-2 h-2 bg-pink-400 rounded-full mr-3 group-hover:scale-150 transition-transform duration-200"></span>
                    {getTranslation(lang, 'partners')}
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center group">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mr-3 group-hover:scale-150 transition-transform duration-200"></span>
                    {getTranslation(lang, 'blog')}
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center group">
                    <span className="w-2 h-2 bg-red-400 rounded-full mr-3 group-hover:scale-150 transition-transform duration-200"></span>
                    {getTranslation(lang, 'contact')}
                  </Link>
                </li>
        </ul>
      </div>

            {/* Services */}
      <div>
              <h4 className="text-lg font-semibold text-white mb-6 flex items-center">
                <FaShieldAlt className="w-5 h-5 mr-2 text-purple-400" />
                {getTranslation(lang, 'services')}
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/services#cybersecurity" className="text-gray-300 hover:text-purple-400 transition-colors duration-200 flex items-center group">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 group-hover:scale-150 transition-transform duration-200"></span>
                    Cybersécurité
                  </Link>
                </li>
                <li>
                  <Link to="/services#network" className="text-gray-300 hover:text-purple-400 transition-colors duration-200 flex items-center group">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 group-hover:scale-150 transition-transform duration-200"></span>
                    Infrastructure Réseau
                  </Link>
                </li>
                <li>
                  <Link to="/services#cloud" className="text-gray-300 hover:text-purple-400 transition-colors duration-200 flex items-center group">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3 group-hover:scale-150 transition-transform duration-200"></span>
                    Solutions Cloud
                  </Link>
                </li>
                <li>
                  <Link to="/services#consulting" className="text-gray-300 hover:text-purple-400 transition-colors duration-200 flex items-center group">
                    <span className="w-2 h-2 bg-pink-500 rounded-full mr-3 group-hover:scale-150 transition-transform duration-200"></span>
                    Conseil IT
                  </Link>
                </li>
                <li>
                  <Link to="/services#development" className="text-gray-300 hover:text-purple-400 transition-colors duration-200 flex items-center group">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-3 group-hover:scale-150 transition-transform duration-200"></span>
                    Développement
                  </Link>
                </li>
                <li>
                  <Link to="/services#support" className="text-gray-300 hover:text-purple-400 transition-colors duration-200 flex items-center group">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-3 group-hover:scale-150 transition-transform duration-200"></span>
                    Support 24/7
                  </Link>
                </li>
        </ul>
      </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-6 flex items-center">
                <FaUsers className="w-5 h-5 mr-2 text-green-400" />
                {getTranslation(lang, 'contact')}
              </h4>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <FaEnvelope className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">{getTranslation(lang, 'email')}</p>
                    <a href="mailto:contact@fastcube.ma" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                      contact@fastcube.ma
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-600/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <FaPhone className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">{getTranslation(lang, 'phone')}</p>
                                          <a href="tel:+212643776635" className="text-gray-300 hover:text-green-400 transition-colors duration-200">
                      +212 6 43 77 66 35
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <FaMapMarkerAlt className="w-4 h-4 text-purple-400" />
                  </div>
      <div>
                    <p className="text-sm text-gray-400">{getTranslation(lang, 'address')}</p>
                    <p className="text-gray-300">
                      Casablanca, Maroc<br />
                      {getTranslation(lang, 'addressDetails')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Newsletter */}
              <div className="mt-8">
                <h5 className="text-sm font-semibold text-white mb-3">{getTranslation(lang, 'newsletter')}</h5>
                <div className="flex flex-col space-y-3">
                  <div className="flex">
                    <input
                      type="email"
                      placeholder={getTranslation(lang, 'emailPlaceholder')}
                      className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors duration-200"
                    />
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-r-lg transition-colors duration-200">
                      <FaArrowUp className="w-4 h-4 transform rotate-45" />
                    </button>
                  </div>
                  <Link 
                    to="/newsletter" 
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200 text-center"
                  >
                    S'inscrire à la newsletter complète →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              
              {/* Copyright */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <FaAward className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm text-gray-400">
                    © {currentYear} FastCube. {getTranslation(lang, 'allRightsReserved')}
                  </span>
                </div>
              </div>

              {/* Legal Links */}
              <div className="flex items-center space-x-6">
                <Link to="/privacy" className="text-sm text-gray-400 hover:text-blue-400 transition-colors duration-200">
                  {getTranslation(lang, 'privacyPolicy')}
                </Link>
                <Link to="/terms" className="text-sm text-gray-400 hover:text-blue-400 transition-colors duration-200">
                  {getTranslation(lang, 'termsOfService')}
                </Link>
                <Link to="/cookies" className="text-sm text-gray-400 hover:text-blue-400 transition-colors duration-200">
                  {getTranslation(lang, 'cookiePolicy')}
                </Link>
              </div>

              {/* Back to Top */}
              <button
                onClick={scrollToTop}
                className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center hover:shadow-lg hover:scale-110 transition-all duration-300"
                aria-label={getTranslation(lang, 'backToTop')}
              >
                <FaArrowUp className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-green-500/5 rounded-full blur-2xl"></div>
    </div>
  </footer>
);
} 