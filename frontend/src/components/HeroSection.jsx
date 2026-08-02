import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaPlay, FaShieldAlt, FaNetworkWired, FaCloud, FaRocket, FaUsers, FaAward } from 'react-icons/fa';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../utils/translations';

export default function HeroSection() {
  const { lang } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column - Text Content */}
          <div className="text-center lg:text-left">
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-sm font-medium">
                <FaRocket className="w-4 h-4 mr-2 text-blue-400" />
                {getTranslation(lang, 'innovationBadge') || 'Innovation & Excellence'}
              </div>

              {/* Main Heading */}
              <div className="space-y-6">
                <h1 className="text-4xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight">
                  {getTranslation(lang, 'welcome')}{' '}
                  <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    FastCube
                  </span>
                </h1>
                <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  {getTranslation(lang, 'heroSubtitle')}
                </p>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-white">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <FaShieldAlt className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="text-sm font-medium">{getTranslation(lang, 'advancedSecurity')}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <FaNetworkWired className="w-5 h-5 text-purple-400" />
                  </div>
                  <span className="text-sm font-medium">{getTranslation(lang, 'robustInfrastructure')}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-pink-500/20 rounded-xl flex items-center justify-center">
                    <FaCloud className="w-5 h-5 text-pink-400" />
                  </div>
                  <span className="text-sm font-medium">{getTranslation(lang, 'modernCloud')}</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link 
                  to="/contact" 
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 hover:bg-gray-100 group font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl"
                >
                  {getTranslation(lang, 'startProject')}
                  <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white hover:bg-white hover:text-gray-900 group font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                  <FaPlay className="w-4 h-4 mr-2" />
                  {getTranslation(lang, 'viewPresentation')}
                </button>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-8 pt-8 border-t border-white/10">
                <div className="flex items-center space-x-2 text-gray-300">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm">{getTranslation(lang, 'satisfiedClients')}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                  <span className="text-sm">{getTranslation(lang, 'support24h')}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
                  <span className="text-sm">{getTranslation(lang, 'projectsCompleted') || '500+ Projets'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Visual Elements */}
          <div className="relative">
            {/* Main Card */}
            <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 shadow-2xl">
              <div className="grid grid-cols-2 gap-6">
                {/* Cybersecurity Card */}
                <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl p-6 border border-blue-500/30">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                    <FaShieldAlt className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Cybersécurité</h3>
                  <p className="text-gray-300 text-sm">Protection avancée</p>
                </div>

                {/* Network Card */}
                <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl p-6 border border-purple-500/30">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                    <FaNetworkWired className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Réseau</h3>
                  <p className="text-gray-300 text-sm">Infrastructure robuste</p>
                </div>

                {/* Cloud Card */}
                <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl p-6 border border-green-500/30">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
                    <FaCloud className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Cloud</h3>
                  <p className="text-gray-300 text-sm">Solutions modernes</p>
                </div>

                {/* Consulting Card */}
                <div className="bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-2xl p-6 border border-pink-500/30">
                  <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center mb-4">
                    <FaUsers className="w-6 h-6 text-pink-400" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Conseil</h3>
                  <p className="text-gray-300 text-sm">Expertise dédiée</p>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-8 -left-8 w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 animate-bounce-gentle"></div>
            <div className="absolute -bottom-8 -right-8 w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 animate-bounce-gentle" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex flex-col items-center space-y-2 text-white/60">
          <span className="text-sm font-medium">Scroll</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </div>
    </section>
  );
} 