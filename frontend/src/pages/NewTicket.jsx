import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTicketAlt, FaExclamationTriangle, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import { useLanguage } from '../contexts/LanguageContext';


export default function NewTicket() {
  const { lang, getTranslation } = useLanguage();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    priority: 'moyenne',
    category: 'technique',
    contactEmail: localStorage.getItem('userEmail') || '',
    contactPhone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/tickets/create', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setTimeout(() => {
          navigate('/client-dashboard');
        }, 3000);
      } else {
        setSubmitStatus('error');
        console.error('Erreur:', data.message);
      }
    } catch (error) {
      setSubmitStatus('error');
      console.error('Erreur réseau:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const priorities = [
    { value: 'basse', label: getTranslation('priority.low'), color: 'text-green-600', bgColor: 'bg-green-100' },
    { value: 'moyenne', label: getTranslation('priority.medium'), color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
    { value: 'haute', label: getTranslation('priority.high'), color: 'text-orange-600', bgColor: 'bg-orange-100' },
    { value: 'critique', label: getTranslation('priority.critical'), color: 'text-red-600', bgColor: 'bg-red-100' }
  ];

  const categories = [
    { value: 'technique', label: getTranslation('ticket.category.technical') },
    { value: 'billing', label: getTranslation('ticket.category.billing') },
    { value: 'account', label: getTranslation('ticket.category.account') },
    { value: 'feature', label: getTranslation('ticket.category.feature') },
    { value: 'other', label: getTranslation('ticket.category.other') }
  ];

  if (submitStatus === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Ticket Créé avec Succès !</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Votre ticket a été enregistré. Notre équipe vous répondra dans les plus brefs délais.
          </p>
          <button
            onClick={() => navigate('/client-dashboard')}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Retour au Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {}
        <div className="text-center mb-12">
          <button
            onClick={() => navigate('/client-dashboard')}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors"
          >
            <FaArrowLeft className="w-4 h-4" />
            Retour au dashboard
          </button>
          
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FaTicketAlt className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
              Nouveau Ticket Support
            </h1>
          </div>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Créez un nouveau ticket de support. Notre équipe vous répondra dans les plus brefs délais.
          </p>
        </div>

        {}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sujet du ticket *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Décrivez brièvement votre problème"
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              {}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description détaillée *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Décrivez en détail votre problème, les étapes pour le reproduire, et tout autre information utile..."
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              {}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Catégorie
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Priorité
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    {priorities.map(priority => (
                      <option key={priority.value} value={priority.value}>
                        {priority.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email de contact
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    placeholder="votre@email.com"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Téléphone (optionnel)
                  </label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    placeholder="+212 6 12 34 56 78"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              {}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <FaExclamationTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-yellow-800 mb-1">
                      Information importante
                    </h3>
                    <p className="text-sm text-yellow-700">
                      Pour les problèmes urgents ou critiques, veuillez nous contacter directement par téléphone au +212 6 43 77 66 35.
                    </p>
                  </div>
                </div>
              </div>

              {}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => navigate('/tickets')}
                  className="inline-flex items-center px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-medium rounded-lg transition-all duration-200 flex-1"
                  disabled={isSubmitting}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex-1"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Création en cours...
                    </div>
                  ) : (
                    'Créer le Ticket'
                  )}
                </button>
              </div>

              {}
              {submitStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                  <p className="text-red-700">
                    Une erreur s'est produite. Veuillez réessayer.
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 