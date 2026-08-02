import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaPlay, FaShieldAlt, FaNetworkWired, FaCloud, FaRocket } from 'react-icons/fa';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../utils/translations';

const slides = [
  {
    image: '/cc.jpeg',
    title: "FASTCUBE, l'innovation au service de votre sécurité numérique",
    subtitle: "Solutions sur-mesure, expertise reconnue, accompagnement de confiance.",
    cta: { label: 'Découvrir nos solutions', link: '/services' },
    icon: <FaShieldAlt className="w-8 h-8" />,
    color: "from-blue-600 to-indigo-600"
  },
  {
    image: '/cc.jpeg',
    title: 'Cybersécurité, Cloud, Réseaux & Data Center',
    subtitle: 'Des services adaptés à vos enjeux métiers et à la transformation digitale.',
    cta: { label: 'Nos services', link: '/services' },
    icon: <FaNetworkWired className="w-8 h-8" />,
    color: "from-purple-600 to-pink-600"
  },
  {
    image: '/cc.jpeg',
    title: 'Expertise technique et accompagnement personnalisé',
    subtitle: 'Plus de 12 ans d\'expérience au service de votre réussite digitale.',
    cta: { label: 'Nous contacter', link: '/contact' },
    icon: <FaCloud className="w-8 h-8" />,
    color: "from-green-600 to-emerald-600"
  },
  {
    image: '/cc.jpeg',
    title: 'Innovation et excellence technologique',
    subtitle: 'Découvrez nos solutions de pointe pour votre transformation numérique.',
    cta: { label: 'Démarrer un projet', link: '/contact' },
    icon: <FaRocket className="w-8 h-8" />,
    color: "from-orange-600 to-red-600"
  }
];

export default function HeroSlider() {
  const { lang } = useLanguage();
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const next = () => setCurrent((c) => (c + 1) % slides.length);
  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const timer = setTimeout(next, 5000);
    return () => clearTimeout(timer);
  }, [current, isAutoPlaying]);

  const handleSlideClick = (index) => {
    setCurrent(index);
    setIsAutoPlaying(false);
    // Redémarrer l'auto-play après 10 secondes
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  return (
    <section className="relative w-full h-[80vh] md:h-[90vh] overflow-hidden shadow-2xl">
      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            i === current ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-105'
          }`}
        >
          {/* Background Image */}
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover object-center brightness-75"
          />
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/50"></div>
          
          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 mb-6">
                <div className="text-white">
                  {slide.icon}
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white drop-shadow-2xl mb-6 leading-tight animate-fade-in-up" 
                  style={{animationDelay:'200ms'}}>
                {slide.title}
              </h1>

              {/* Subtitle */}
              <p className="text-lg md:text-2xl text-white/95 mb-8 animate-fade-in-up max-w-3xl mx-auto leading-relaxed" 
                 style={{animationDelay:'400ms'}}>
                {slide.subtitle}
              </p>

              {/* CTA Button */}
              <div className="animate-fade-in-up" style={{animationDelay:'600ms'}}>
                <Link
                  to={slide.cta.link}
                  className={`inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-br ${slide.color} text-white font-semibold shadow-xl hover:scale-105 transition-all duration-300 border border-white/20 group`}
                >
                  {slide.cta.label}
                  <FaArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button 
        onClick={prev} 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 border border-white/30 z-20"
        aria-label="Slide précédent"
      >
        <svg width="24" height="24" fill="none" stroke="currentColor">
          <path d="M15 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      
      <button 
        onClick={next} 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 border border-white/30 z-20"
        aria-label="Slide suivant"
      >
        <svg width="24" height="24" fill="none" stroke="currentColor">
          <path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Progress Bar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full overflow-hidden z-20">
        <div 
          className="h-full bg-white transition-all duration-1000 ease-linear"
          style={{ width: `${((current + 1) / slides.length) * 100}%` }}
        ></div>
      </div>

      {/* Dots Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => handleSlideClick(i)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`w-4 h-4 rounded-full transition-all duration-300 hover:scale-125 ${
              i === current 
                ? 'bg-white scale-125 shadow-lg' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Aller à la slide ${i+1}`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex flex-col items-center space-y-2 text-white/60">
          <span className="text-sm font-medium">Scroll</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </div>

      {/* Pause/Play Button */}
      <button
        onClick={() => setIsAutoPlaying(!isAutoPlaying)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 border border-white/30 z-20"
        aria-label={isAutoPlaying ? 'Pause' : 'Play'}
      >
        {isAutoPlaying ? (
          <svg width="20" height="20" fill="currentColor">
            <rect x="6" y="4" width="4" height="12"/>
            <rect x="14" y="4" width="4" height="12"/>
          </svg>
        ) : (
          <FaPlay className="w-4 h-4" />
        )}
      </button>
    </section>
  );
} 