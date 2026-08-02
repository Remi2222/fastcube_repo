import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';

const TestimonialForm = () => {
  const [formData, setFormData] = useState({
    user_name: '',
    rating: 5,
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [existingTestimonial, setExistingTestimonial] = useState(null);

  useEffect(() => {
    fetchMyTestimonial();
  }, []);

  const fetchMyTestimonial = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('userToken');
      if (!token) return;

      const response = await fetch('http://localhost:5000/api/testimonials/my', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setExistingTestimonial(data.data);
        }
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'message') {
      const count = value.length;
      setCharCount(count);
      if (count > 300) return;
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('userToken');
      if (!token) {
        setMessage('Vous devez être connecté');
        return;
      }

      const url = existingTestimonial 
        ? 'http://localhost:5000/api/testimonials/my'
        : 'http://localhost:5000/api/testimonials';
      
      const method = existingTestimonial ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(data.message || 'Témoignage soumis avec succès !');
        if (!existingTestimonial) {
          setFormData({ user_name: '', rating: 5, message: '' });
          setCharCount(0);
        }
        await fetchMyTestimonial();
      } else {
        setMessage(data.message || 'Erreur lors de la soumission');
      }
    } catch (error) {
      setMessage('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  if (existingTestimonial && existingTestimonial.status === 'approved') {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Votre témoignage
        </h3>
        
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-gray-900 dark:text-white">
              {existingTestimonial.user_name}
            </h4>
            <span className="text-green-600 dark:text-green-400 text-sm">✓ Approuvé</span>
          </div>
          
          <div className="flex items-center mb-2">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={`w-4 h-4 ${
                  i < existingTestimonial.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                }`}
              />
            ))}
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              {existingTestimonial.rating}/5
            </span>
          </div>
          
          <p className="text-gray-700 dark:text-gray-300 italic">
            "{existingTestimonial.message}"
          </p>
        </div>
        
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Merci d'avoir partagé votre expérience !
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        {existingTestimonial ? 'Modifier votre témoignage' : 'Partagez votre expérience'}
      </h3>

      {existingTestimonial && existingTestimonial.status === 'pending' && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 mb-4">
          <p className="text-yellow-800 dark:text-yellow-400">
            Votre témoignage est en cours de modération
          </p>
        </div>
      )}

      {message && (
        <div className={`mb-4 p-4 rounded-lg ${
          message.includes('succès') 
            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
            : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nom ou pseudo *
          </label>
          <input
            type="text"
            name="user_name"
            value={formData.user_name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Votre nom ou pseudo"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Votre note *
          </label>
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                className="focus:outline-none"
              >
                <FaStar
                  className={`w-8 h-8 ${
                    star <= formData.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              </button>
            ))}
            <span className="ml-2 text-gray-700 dark:text-gray-300">
              {formData.rating}/5
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Votre témoignage * (max 300 caractères)
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={4}
            maxLength={300}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Partagez votre expérience..."
          />
          <div className="flex justify-between items-center mt-1">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {charCount}/300 caractères
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !formData.user_name || !formData.message}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Envoi en cours...' : (existingTestimonial ? 'Mettre à jour' : 'Soumettre')}
        </button>
      </form>
    </div>
  );
};

export default TestimonialForm; 