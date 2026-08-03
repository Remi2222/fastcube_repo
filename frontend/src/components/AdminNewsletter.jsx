import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaUsers, FaChartLine, FaRobot, FaClock, FaPaperPlane } from 'react-icons/fa';
import { API_BASE_URL } from "../config/api";

const AdminNewsletter = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('ai-generated');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState(null);

  useEffect(() => {
    fetchNewsletterData();
  }, []);

  const fetchNewsletterData = async () => {
    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token d\'authentification manquant');
        return;
      }

      // Récupérer les abonnés
      const subscribersResponse = await fetch(`${API_BASE_URL}/api/newsletter/subscribers`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!subscribersResponse.ok) {
        throw new Error(`Erreur HTTP: ${subscribersResponse.status}`);
      }

      const subscribersData = await subscribersResponse.json();
      
      // Récupérer les statistiques
      const statsResponse = await fetch(`${API_BASE_URL}/api/newsletter/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const statsData = await statsResponse.json();

      if (subscribersData.success) {
        setSubscribers(subscribersData.data.subscribers || []);
      }

      if (statsData.success) {
        setStats(statsData.data);
      }

    } catch (err) {
      console.error('Erreur lors de la récupération des données newsletter:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateAIContent = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/api/newsletter/generate-content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          prompt: aiPrompt || 'Générer une newsletter sur les actualités cybersécurité et cloud computing',
          interests: ['cybersecurity', 'cloud', 'development'],
          tone: 'professional',
          language: 'fr'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setGeneratedContent(data.data);
      } else {
        setError(data.message || 'Erreur lors de la génération du contenu');
      }
    } catch (error) {
      setError('Erreur lors de la génération du contenu par IA');
    } finally {
      setLoading(false);
    }
  };

  const sendNewsletter = async (content) => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/api/newsletter/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          subject: content.subject,
          html: content.html_content,
          text: content.text_content,
          scheduled_at: scheduledDate && scheduledTime ? `${scheduledDate}T${scheduledTime}` : null
        })
      });

      const data = await response.json();
      
      if (data.success) {
        alert(`Newsletter envoyée avec succès à ${data.data.emails_sent} abonnés !`);
        fetchNewsletterData(); // Rafraîchir les données
      } else {
        setError(data.message || 'Erreur lors de l\'envoi de la newsletter');
      }
    } catch (error) {
      setError('Erreur lors de l\'envoi de la newsletter');
    } finally {
      setLoading(false);
    }
  };

  const scheduleNewsletter = async (content) => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/api/newsletter/schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          subject: content.subject,
          html: content.html_content,
          text: content.text_content,
          scheduled_at: `${scheduledDate}T${scheduledTime}`,
          frequency: 'weekly'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Newsletter programmée avec succès !');
      } else {
        setError(data.message || 'Erreur lors de la programmation');
      }
    } catch (error) {
      setError('Erreur lors de la programmation de la newsletter');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          📧 Gestion Newsletter
        </h1>
        <p className="text-gray-600">
          Gérez vos newsletters avec envoi automatisé et génération de contenu par IA
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <FaUsers className="text-blue-600 text-2xl mr-4" />
            <div>
              <p className="text-sm text-gray-600">Total Abonnés</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total_subscribers || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <FaEnvelope className="text-green-600 text-2xl mr-4" />
            <div>
              <p className="text-sm text-gray-600">Emails Aujourd'hui</p>
              <p className="text-2xl font-bold text-gray-900">{stats.emails_sent_today || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <FaChartLine className="text-purple-600 text-2xl mr-4" />
            <div>
              <p className="text-sm text-gray-600">Taux d'Ouverture</p>
              <p className="text-2xl font-bold text-gray-900">{stats.open_rate ? `${(stats.open_rate * 100).toFixed(1)}%` : '0%'}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <FaClock className="text-orange-600 text-2xl mr-4" />
            <div>
              <p className="text-sm text-gray-600">Dernière Mise à jour</p>
              <p className="text-sm font-bold text-gray-900">
                {stats.last_updated ? new Date(stats.last_updated).toLocaleDateString('fr-FR') : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Génération de contenu par IA */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <FaRobot className="mr-2 text-blue-600" />
            Génération IA
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prompt IA
              </label>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Décrivez le contenu que vous souhaitez générer..."
              />
            </div>
            
            <button
              onClick={generateAIContent}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Génération...' : 'Générer du contenu'}
            </button>
          </div>

          {generatedContent && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Contenu généré :</h3>
              <div className="space-y-2">
                <p><strong>Sujet :</strong> {generatedContent.subject}</p>
                <div className="max-h-40 overflow-y-auto">
                  <p><strong>Contenu :</strong></p>
                  <div dangerouslySetInnerHTML={{ __html: generatedContent.html_content }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Programmation d'envoi */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <FaClock className="mr-2 text-green-600" />
            Programmation
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date d'envoi
              </label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Heure d'envoi
              </label>
              <input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => generatedContent && sendNewsletter(generatedContent)}
                disabled={!generatedContent || loading}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center"
              >
                <FaPaperPlane className="mr-2" />
                Envoyer maintenant
              </button>
              
              <button
                onClick={() => generatedContent && scheduleNewsletter(generatedContent)}
                disabled={!generatedContent || !scheduledDate || !scheduledTime || loading}
                className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 disabled:opacity-50"
              >
                Programmer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des abonnés */}
      <div className="mt-8 bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            Abonnés ({subscribers.length})
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entreprise
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fréquence
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Intérêts
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date d'inscription
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subscribers.map((subscriber) => (
                <tr key={subscriber.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {subscriber.first_name} {subscriber.last_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{subscriber.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{subscriber.company || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      subscriber.frequency === 'daily' ? 'bg-red-100 text-red-800' :
                      subscriber.frequency === 'weekly' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {subscriber.frequency}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {Array.isArray(subscriber.interests) ? subscriber.interests.join(', ') : subscriber.interests}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(subscriber.created_at).toLocaleDateString('fr-FR')}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminNewsletter; 