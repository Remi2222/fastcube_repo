import React from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaTicketAlt } from 'react-icons/fa';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../utils/translations';

export default function TicketsPage() {
  const { lang } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
              <FaTicketAlt className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
              {getTranslation(lang, 'tickets') || 'Tickets Support'}
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            {getTranslation(lang, 'ticketsHeroSubtitle')}
          </p>
          
          {}
          <Link
            to="/new-ticket"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            <FaPlus className="w-4 h-4" />
            {getTranslation(lang, 'createNewTicket')}
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            
            {}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{getTranslation(lang, 'existingTickets')}</h2>
              
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{getTranslation(lang, 'connectionProblem')}</h3>
                    <span className="bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 text-xs px-2 py-1 rounded-full">{getTranslation(lang, 'statusOpen')}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{getTranslation(lang, 'cannotConnect')}</p>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{getTranslation(lang, 'createdOn')} 2024-06-01 • {getTranslation(lang, 'priority')} : {getTranslation(lang, 'priorityHigh')}</div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{getTranslation(lang, 'quoteRequest')}</h3>
                    <span className="bg-yellow-100 dark:bg-yellow-800 text-yellow-700 dark:text-yellow-300 text-xs px-2 py-1 rounded-full">{getTranslation(lang, 'statusInProgress')}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{getTranslation(lang, 'needQuote')}</p>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{getTranslation(lang, 'createdOn')} 2024-06-02 • {getTranslation(lang, 'priority')} : {getTranslation(lang, 'priorityMedium')}</div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{getTranslation(lang, 'securityIncident')}</h3>
                    <span className="bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 text-xs px-2 py-1 rounded-full">{getTranslation(lang, 'statusResolved')}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{getTranslation(lang, 'firewallAlert')}</p>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{getTranslation(lang, 'createdOn')} 2024-06-03 • {getTranslation(lang, 'priority')} : {getTranslation(lang, 'priorityCritical')}</div>
                </div>
              </div>
            </div>

            {}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{getTranslation(lang, 'createNewTicket')}</h2>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {getTranslation(lang, 'subject')}
                  </label>
                  <input
                    type="text"
                    placeholder={getTranslation(lang, 'subjectPlaceholder')}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {getTranslation(lang, 'message')}
                  </label>
                  <textarea
                    rows={4}
                    placeholder={getTranslation(lang, 'messagePlaceholder')}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {getTranslation(lang, 'priority')}
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option value="low">{getTranslation(lang, 'low')}</option>
                    <option value="normal">{getTranslation(lang, 'normal')}</option>
                    <option value="high">{getTranslation(lang, 'high')}</option>
                    <option value="urgent">{getTranslation(lang, 'urgent')}</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                  {getTranslation(lang, 'createNewTicket')}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 