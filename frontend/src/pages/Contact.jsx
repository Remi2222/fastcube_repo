import React, { useState, useRef } from 'react';
import { 
  FaPaperclip, FaTimes, FaCheckCircle, FaSpinner, FaPhone, FaEnvelope, 
  FaMapMarkerAlt, FaClock, FaUser, FaBuilding, FaShieldAlt, FaCloud,
  FaNetworkWired, FaTools, FaHeadset, FaFileUpload, FaRobot, FaArrowRight,
  FaWhatsapp, FaLinkedin, FaTwitter, FaGlobe, FaDownload, FaHandshake,
  FaQuestionCircle, FaCogs, FaChevronDown, FaCog
} from 'react-icons/fa';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../utils/translations';
import { validateForm } from '../utils/formValidation';
import { API_BASE_URL } from "../config/api";


const getRequestCategories = (lang) => [
  {
    id: 'devis',
    name: getTranslation(lang, 'quoteRequest'),
    icon: <FaBuilding className="w-5 h-5" />,
    description: getTranslation(lang, 'quoteDescription'),
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    id: 'support',
    name: getTranslation(lang, 'technicalSupport'),
    icon: <FaHeadset className="w-5 h-5" />,
    description: getTranslation(lang, 'supportDescription'),
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50'
  },
  {
    id: 'securite',
    name: getTranslation(lang, 'cybersecurity'),
    icon: <FaShieldAlt className="w-5 h-5" />,
    description: getTranslation(lang, 'securityDescription'),
    color: 'from-red-500 to-red-600',
    bgColor: 'bg-red-50'
  },
  {
    id: 'cloud',
    name: getTranslation(lang, 'cloudSolutions'),
    icon: <FaCloud className="w-5 h-5" />,
    description: getTranslation(lang, 'cloudDescription'),
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    id: 'reseau',
    name: getTranslation(lang, 'networkInfrastructure'),
    icon: <FaNetworkWired className="w-5 h-5" />,
    description: getTranslation(lang, 'networkDescription'),
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-50'
  },
  {
    id: 'audit',
    name: getTranslation(lang, 'auditConsulting'),
    icon: <FaTools className="w-5 h-5" />,
    description: getTranslation(lang, 'auditDescription'),
    color: 'from-indigo-500 to-indigo-600',
    bgColor: 'bg-indigo-50'
  },
  {
    id: 'partenariat',
    name: getTranslation(lang, 'partnership'),
    icon: <FaHandshake className="w-5 h-5" />,
    description: getTranslation(lang, 'partnershipDescription'),
    color: 'from-teal-500 to-teal-600',
    bgColor: 'bg-teal-50'
  },
  {
    id: 'autre',
    name: getTranslation(lang, 'otherRequest'),
    icon: <FaQuestionCircle className="w-5 h-5" />,
    description: getTranslation(lang, 'otherDescription'),
    color: 'from-gray-500 to-gray-600',
    bgColor: 'bg-gray-50'
  }
];


const contactInfo = [
  {
    icon: <FaPhone className="w-6 h-6" />,
    title: "Téléphone",
            value: "+212 6 43 77 66 35",
    subtitle: "Lun-Ven: 9h-18h",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    icon: <FaEnvelope className="w-6 h-6" />,
    title: "Email",
    value: "contact@fastcube.ma",
    subtitle: "Réponse sous 24h",
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50"
  },
  {
    icon: <FaMapMarkerAlt className="w-6 h-6" />,
    title: "Adresse",
    value: "123 Avenue Mohammed V",
    subtitle: "Casablanca, Maroc",
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50"
  },
  {
    icon: <FaWhatsapp className="w-6 h-6" />,
    title: "WhatsApp",
    value: "+212 6 00 00 00 00",
    subtitle: "Support instantané",
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50"
  }
];

export default function Contact() {
  const { lang } = useLanguage();
  const fileInputRef = useRef(null);
  const requestCategories = getRequestCategories(lang);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    city: '',
    country: '',
    category: '',
    subject: '',
    message: '',
    priority: 'normal',
    preferredContact: 'email'
  });

  const [attachments, setAttachments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [showAiResponse, setShowAiResponse] = useState(false);

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      const maxSize = 10 * 1024 * 1024; 
      const allowedTypes = ['image/*', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      
      if (file.size > maxSize) {
        alert(`Le fichier ${file.name} est trop volumineux (max 10MB)`);
        return false;
      }
      
      return true;
    });

    setAttachments(prev => [...prev, ...validFiles]);
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  
  const generateAiResponse = async (formData) => {
    const responses = {
      devis: "Merci pour votre demande de devis ! Notre équipe commerciale va analyser vos besoins et vous contacter sous 24h avec une proposition personnalisée. En attendant, vous pouvez consulter nos tarifs indicatifs sur notre site.",
      support: "Nous avons bien reçu votre demande de support technique. Un ticket a été créé et notre équipe technique va vous répondre dans les plus brefs délais. Numéro de ticket : #" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      securite: "Votre demande concernant la cybersécurité a été transmise à nos experts. Nous vous proposons un audit de sécurité gratuit pour évaluer vos besoins. Un consultant vous contactera sous 48h.",
      cloud: "Merci pour votre intérêt pour nos solutions cloud ! Notre architecte cloud va analyser votre infrastructure actuelle et vous proposer un plan de migration optimisé.",
      reseau: "Votre demande d'infrastructure réseau a été reçue. Nous vous proposons une consultation gratuite pour évaluer vos besoins et vous présenter nos solutions.",
      audit: "Nous avons bien reçu votre demande d'audit. Notre équipe de consultants va préparer une proposition détaillée incluant méthodologie, planning et tarifs.",
      partenariat: "Merci pour votre intérêt pour un partenariat ! Notre équipe business va analyser votre proposition et vous recontacter rapidement.",
      autre: "Nous avons bien reçu votre message. Notre équipe va l'analyser et vous répondre dans les plus brefs délais."
    };

    return responses[formData.category] || responses.autre;
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      
      const requiredFields = ['firstName', 'lastName', 'email', 'subject', 'message'];
      const validation = validateForm(formData, requiredFields, {
        validateEmailField: 'email',
        customMessage: 'Veuillez remplir tous les champs obligatoires (marqués d\'un *)'
      });

      if (!validation.isValid) {
        setIsSubmitting(false);
        return;
      }

      
      const formDataToSend = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        city: formData.city,
        country: formData.country,
        category: formData.category,
        subject: formData.subject,
        message: formData.message,
        priority: formData.priority,
        preferredContact: formData.preferredContact,
        attachments: attachments.map(file => ({
          name: file.name,
          size: file.size,
          type: file.type
        }))
      };

      
      const response = await fetch(`${API_BASE_URL}/api/contacts/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataToSend)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Erreur lors de l\'envoi du message');
      }

      
      setAiResponse(result.data.aiResponse);
      setShowAiResponse(true);
      setIsSubmitted(true);

      
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        city: '',
        country: '',
        category: '',
        subject: '',
        message: '',
        priority: 'normal',
        preferredContact: 'email'
      });
      setAttachments([]);

    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      alert(error.message || 'Une erreur est survenue lors de l\'envoi du message.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      
      {}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-indigo-600/5"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-400/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>
      
      {}
      <section className="relative py-24 lg:py-36 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            {}
            <div className="inline-flex items-center px-6 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold mb-8 shadow-xl border border-blue-200/50 dark:border-blue-700/50">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 animate-pulse"></div>
              <FaHeadset className="w-4 h-4 mr-2" />
              {getTranslation(lang, 'supportAndContact')}
            </div>
            
            {}
            <h1 className="text-5xl lg:text-7xl font-black text-gray-900 dark:text-white mb-8 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                {getTranslation(lang, 'contactHeroTitle')}
              </span>
            </h1>
            
            {}
            <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed mb-12 max-w-3xl mx-auto font-medium">
              {getTranslation(lang, 'contactHeroSubtitle')}
            </p>
            
            {}
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a href="tel:+212643776635" className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-bold rounded-2xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 border-0">
                <div className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300">
                  <FaPhone className="w-full h-full" />
                </div>
                {getTranslation(lang, 'callUs')}
                <div className="w-2 h-2 bg-white/60 rounded-full ml-3 group-hover:animate-pulse"></div>
              </a>
              <a href="mailto:contact@fastcube.ma" className="group inline-flex items-center justify-center px-8 py-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-2 border-blue-600/50 dark:border-blue-400/50 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
                <div className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300">
                  <FaEnvelope className="w-full h-full" />
                </div>
                {getTranslation(lang, 'sendEmail')}
                <div className="w-2 h-2 bg-blue-600/60 rounded-full ml-3 group-hover:animate-pulse"></div>
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          
          {}
          <div className="lg:col-span-2">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden relative">
              
              {}
              <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-8 text-white overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <FaHeadset className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black mb-2">{getTranslation(lang, 'advancedContactForm')}</h2>
                      <p className="text-blue-100 text-lg font-medium">{getTranslation(lang, 'fillFormDescription')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {}
              <form onSubmit={handleSubmit} className="p-10 space-y-8">
                
                {}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <FaUser className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Informations personnelles</h3>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        {getTranslation(lang, 'firstName')} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 group-hover:border-blue-300 dark:group-hover:border-blue-500"
                          placeholder={getTranslation(lang, 'firstName')}
                        />
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        {getTranslation(lang, 'lastName')} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 group-hover:border-blue-300 dark:group-hover:border-blue-500"
                          placeholder={getTranslation(lang, 'lastName')}
                        />
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
                      <FaEnvelope className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Informations de contact</h3>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        {getTranslation(lang, 'email')} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 group-hover:border-green-300 dark:group-hover:border-green-500"
                          placeholder="votre@email.com"
                        />
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        {getTranslation(lang, 'phone')}
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 group-hover:border-green-300 dark:group-hover:border-green-500"
                          placeholder="+212 6 00 00 00 00"
                        />
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                      <FaBuilding className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Informations entreprise</h3>
                  </div>
                  
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      {getTranslation(lang, 'company')}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 group-hover:border-purple-300 dark:group-hover:border-purple-500"
                        placeholder={getTranslation(lang, 'companyPlaceholder')}
                      />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Ville
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 group-hover:border-purple-300 dark:group-hover:border-purple-500"
                          placeholder="Votre ville"
                        />
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Pays
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 group-hover:border-purple-300 dark:group-hover:border-purple-500"
                          placeholder="Votre pays"
                        />
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                      <FaCogs className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Type de demande</h3>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {requestCategories.map((category) => (
                      <div
                        key={category.id}
                        onClick={() => setFormData(prev => ({ ...prev, category: category.id }))}
                        className={`group p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                          formData.category === category.id
                            ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 shadow-lg scale-105'
                            : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm'
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                            {category.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 dark:text-white text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                              {category.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
                              {category.description}
                            </p>
                          </div>
                          {formData.category === category.id && (
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                              <FaCheckCircle className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                    ))}
                  </div>
                </div>

                {}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <FaCog className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Préférences</h3>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        {getTranslation(lang, 'priority')}
                      </label>
                      <div className="relative">
                        <select
                          name="priority"
                          value={formData.priority}
                          onChange={handleInputChange}
                          className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-900 dark:text-gray-100 group-hover:border-indigo-300 dark:group-hover:border-indigo-500 appearance-none cursor-pointer"
                        >
                          <option value="low">{getTranslation(lang, 'low')}</option>
                          <option value="normal">{getTranslation(lang, 'normal')}</option>
                          <option value="high">{getTranslation(lang, 'high')}</option>
                          <option value="urgent">{getTranslation(lang, 'urgent')}</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                          <FaChevronDown className="w-4 h-4 text-gray-400" />
                        </div>
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        {getTranslation(lang, 'preferredContact')}
                      </label>
                      <div className="relative">
                        <select
                          name="preferredContact"
                          value={formData.preferredContact}
                          onChange={handleInputChange}
                          className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-900 dark:text-gray-100 group-hover:border-indigo-300 dark:group-hover:border-indigo-500 appearance-none cursor-pointer"
                        >
                          <option value="email">{getTranslation(lang, 'email')}</option>
                          <option value="phone">{getTranslation(lang, 'phone')}</option>
                          <option value="whatsapp">{getTranslation(lang, 'whatsapp')}</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                          <FaChevronDown className="w-4 h-4 text-gray-400" />
                        </div>
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
                      <FaEnvelope className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Votre message</h3>
                  </div>
                  
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      {getTranslation(lang, 'subject')} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-300 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 group-hover:border-teal-300 dark:group-hover:border-teal-500"
                        placeholder={getTranslation(lang, 'subjectPlaceholder')}
                      />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-teal-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      {getTranslation(lang, 'message')} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-300 resize-none bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 group-hover:border-teal-300 dark:group-hover:border-teal-500"
                        placeholder={getTranslation(lang, 'messagePlaceholder')}
                      />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-teal-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>
                </div>

                {}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg flex items-center justify-center">
                      <FaFileUpload className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Pièces jointes</h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">(optionnel)</span>
                  </div>
                  
                  <div className="group border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 text-center hover:border-pink-400 dark:hover:border-pink-500 transition-all duration-300 hover:bg-pink-50/50 dark:hover:bg-pink-900/10">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/*,.pdf,.doc,.docx"
                    />
                    <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <FaFileUpload className="w-8 h-8 text-white" />
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current.click()}
                      className="inline-flex items-center px-6 py-3 bg-white dark:bg-gray-800 border-2 border-pink-300 dark:border-pink-600 text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/20 hover:border-pink-400 dark:hover:border-pink-500 font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      <FaFileUpload className="w-4 h-4 mr-2" />
                      {getTranslation(lang, 'selectFiles')}
                    </button>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 font-medium">
                      {getTranslation(lang, 'acceptedFormats')} - Les fichiers sont optionnels
                    </p>
                  </div>

                  {}
                  {attachments.length > 0 && (
                    <div className="space-y-3">
                      {attachments.map((file, index) => (
                        <div key={`file-item-${index}`} className="group flex items-center justify-between p-4 bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-2xl border border-pink-200 dark:border-pink-700/50 hover:shadow-lg transition-all duration-300">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center">
                              <FaPaperclip className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{file.name}</span>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAttachment(index)}
                            className="w-8 h-8 bg-red-100 dark:bg-red-900/20 text-red-500 hover:bg-red-200 dark:hover:bg-red-900/40 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
                          >
                            <FaTimes className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {}
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-800 text-white font-black py-6 px-8 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-2xl flex items-center justify-center relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10 flex items-center">
                      {isSubmitting ? (
                        <>
                          <FaSpinner className="w-6 h-6 mr-3 animate-spin" />
                          <span className="text-lg">{getTranslation(lang, 'sending')}</span>
                        </>
                      ) : (
                        <>
                          <FaArrowRight className="w-6 h-6 mr-3 group-hover:translate-x-1 transition-transform duration-300" />
                          <span className="text-lg">{getTranslation(lang, 'sendMessage')}</span>
                        </>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {}
          <div className="space-y-8">
            
            {}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -translate-y-12 translate-x-12"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-br from-green-500/10 to-teal-500/10 rounded-full translate-y-10 -translate-x-10"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <FaHeadset className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white">{getTranslation(lang, 'ourCoordinates')}</h3>
                </div>
                
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={`info-item-${index}`} className="group flex items-start space-x-4 p-4 rounded-2xl hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 dark:hover:from-blue-900/10 dark:hover:to-purple-900/10 transition-all duration-300">
                      <div className={`w-14 h-14 bg-gradient-to-br ${info.color} rounded-2xl flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        {info.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 dark:text-white text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">{info.title}</h4>
                        <p className="text-gray-700 dark:text-gray-300 font-semibold text-lg">{info.value}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{info.subtitle}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-full -translate-y-10 -translate-x-10"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center">
                    <FaClock className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white">{getTranslation(lang, 'openingHours')}</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700/50">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">{getTranslation(lang, 'mondayFriday')}</span>
                    <span className="font-bold text-green-600 dark:text-green-400 text-lg">9h - 18h</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-700/50">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">{getTranslation(lang, 'saturday')}</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400 text-lg">9h - 13h</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-700/50">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">{getTranslation(lang, 'sunday')}</span>
                    <span className="font-bold text-red-600 dark:text-red-400 text-lg">{getTranslation(lang, 'closed')}</span>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200 dark:border-blue-700/50">
                  <p className="text-sm text-blue-700 dark:text-blue-300 font-semibold">
                    <strong>{getTranslation(lang, 'emergencySupport')}</strong> {getTranslation(lang, 'emergencySupportDesc')}
                  </p>
                </div>
              </div>
            </div>

            {}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8 relative overflow-hidden">
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full translate-y-12 translate-x-12"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                    <FaGlobe className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white">{getTranslation(lang, 'followUs')}</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <a href="#" className="group flex items-center justify-center p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl text-white hover:from-green-600 hover:to-emerald-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                    <FaWhatsapp className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-300" />
                    <span className="font-semibold">WhatsApp</span>
                  </a>
                  <a href="#" className="group flex items-center justify-center p-4 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl text-white hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                    <FaLinkedin className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-300" />
                    <span className="font-semibold">LinkedIn</span>
                  </a>
                  <a href="#" className="group flex items-center justify-center p-4 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl text-white hover:from-blue-500 hover:to-cyan-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                    <FaTwitter className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-300" />
                    <span className="font-semibold">Twitter</span>
                  </a>
                  <a href="#" className="group flex items-center justify-center p-4 bg-gradient-to-br from-gray-600 to-gray-700 rounded-2xl text-white hover:from-gray-700 hover:to-gray-800 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                    <FaGlobe className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-300" />
                    <span className="font-semibold">Website</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {}
      {showAiResponse && aiResponse && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-lg z-50 flex items-center justify-center p-4">
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl max-w-3xl w-full p-8 shadow-2xl border border-white/20 dark:border-gray-700/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-green-500/10 to-teal-500/10 rounded-full translate-y-12 -translate-x-12"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                    <FaRobot className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white">{getTranslation(lang, 'aiResponseTitle')}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{getTranslation(lang, 'aiResponseSubtitle')}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAiResponse(false)}
                  className="w-10 h-10 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-all duration-300 hover:scale-110"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-8 mb-8 border border-blue-200/50 dark:border-blue-700/50">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                    <FaCheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg font-medium">{aiResponse}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 text-sm text-green-600 dark:text-green-400 font-semibold">
                  <div className="w-6 h-6 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                    <FaCheckCircle className="w-4 h-4" />
                  </div>
                  <span>{getTranslation(lang, 'messageSentSuccess')}</span>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setShowAiResponse(false)}
                    className="inline-flex items-center px-6 py-3 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500 font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    {getTranslation(lang, 'close')}
                  </button>
                  <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-800 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 hover:scale-105">
                    <FaDownload className="w-4 h-4 mr-2" />
                    {getTranslation(lang, 'save')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  );
} 