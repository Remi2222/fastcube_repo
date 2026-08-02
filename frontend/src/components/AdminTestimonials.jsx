import React, { useState, useEffect } from 'react';

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      console.log('🔍 Token présent:', !!token);
      
      if (!token) {
        setError('Token d\'authentification manquant');
        return;
      }

      console.log('🔍 Récupération des témoignages...');
      const response = await fetch('http://localhost:5000/api/testimonials', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('📊 Réponse témoignages:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erreur témoignages:', errorText);
        throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('📊 Témoignages récupérés:', data);
      
      if (data.success) {
        setTestimonials(data.data || []);
        console.log('✅ Témoignages chargés:', data.data?.length || 0);
      } else {
        setError(data.message || 'Erreur lors de la récupération des témoignages');
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des témoignages:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token d\'authentification manquant');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/testimonials/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        console.log('✅ Statut mis à jour avec succès');
        fetchTestimonials(); // Recharger les témoignages
      } else {
        setError(data.message || 'Erreur lors de la mise à jour du statut');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      setError(error.message);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Chargement des témoignages...</p>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Erreur</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
            <button
              onClick={fetchTestimonials}
              className="mt-2 text-sm text-red-800 hover:text-red-900 underline"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  const pending = testimonials.filter(t => t.status === 'pending');
  const approved = testimonials.filter(t => t.status === 'approved');
  const rejected = testimonials.filter(t => t.status === 'rejected');

  // Fonction pour nettoyer le texte (supprimer ponctuation, normaliser)
  const cleanText = (text) => {
    return text.toLowerCase()
      .replace(/[^\w\s]/g, '') // Supprimer ponctuation
      .replace(/\s+/g, ' ') // Normaliser espaces
      .trim();
  };

  // Fonction pour détecter la similarité entre deux textes
  const calculateSimilarity = (text1, text2) => {
    const clean1 = cleanText(text1);
    const clean2 = cleanText(text2);
    
    // Si les textes sont identiques après nettoyage
    if (clean1 === clean2) return 1.0;
    
    // Détection de phrases communes
    const sentences1 = text1.toLowerCase().split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 10);
    const sentences2 = text2.toLowerCase().split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 10);
    
    let commonSentences = 0;
    sentences1.forEach(sentence1 => {
      sentences2.forEach(sentence2 => {
        if (sentence1.includes(sentence2) || sentence2.includes(sentence1)) {
          commonSentences++;
        }
      });
    });
    
    // Si des phrases communes sont trouvées
    if (commonSentences > 0) {
      return 0.9; // Très haute similarité
    }
    
    // Analyse par mots
    const words1 = clean1.split(/\s+/);
    const words2 = clean2.split(/\s+/);
    const commonWords = words1.filter(word => words2.includes(word) && word.length > 3);
    
    // Calcul de similarité basé sur les mots communs
    const similarity = commonWords.length / Math.max(words1.length, words2.length);
    
    // Bonus pour les mots importants communs
    const importantWords = ['excellent', 'service', 'client', 'très', 'bon', 'qualité', 'professionnel', 'réactif'];
    const commonImportant = commonWords.filter(word => importantWords.includes(word));
    
    return Math.min(1.0, similarity + (commonImportant.length * 0.1));
  };

  // Détecter les témoignages similaires
  const findSimilarTestimonials = (testimonial) => {
    return testimonials.filter(other => {
      if (other.id === testimonial.id) return false;
      const similarity = calculateSimilarity(testimonial.message, other.message);
      return similarity > 0.6; // Seuil réduit à 60% pour mieux détecter
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <div className="mt-2 flex items-center space-x-4">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Total: {testimonials.length} | En attente: {pending.length} | Approuvés: {approved.length} | Rejetés: {rejected.length}
          </span>
        </div>
      </div>
      
             {pending.length > 0 && (
         <div className="mb-8">
           <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">En attente ({pending.length})</h2>
          <div className="space-y-4">
            {pending.map(testimonial => {
              const similarTestimonials = findSimilarTestimonials(testimonial);
              return (
                                 <div key={testimonial.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                                      {similarTestimonials.length > 0 && (
                      <div className="mb-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm font-medium text-red-800 dark:text-red-200">
                            🚨 REDONDANCE DÉTECTÉE ({similarTestimonials.length} témoignage(s) similaire(s))
                          </span>
                        </div>
                        <div className="mt-2 text-xs text-red-700 dark:text-red-300">
                          <strong>Témoignages similaires :</strong> {similarTestimonials.map(t => t.user_name).join(', ')}
                        </div>
                        <div className="mt-1 text-xs text-red-600 dark:text-red-400">
                          <strong>Conseil :</strong> Vérifiez si ce témoignage est original avant approbation
                        </div>
                      </div>
                    )}
                                     <div className="flex justify-between items-start">
                     <div>
                       <h3 className="font-semibold text-gray-900 dark:text-white">{testimonial.user_name}</h3>
                       <p className="text-gray-600 dark:text-gray-400 mb-2">"{testimonial.message}"</p>
                       <div className="flex items-center">
                         {[...Array(5)].map((_, i) => (
                           <span key={i} className={i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}>★</span>
                         ))}
                         <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">{testimonial.rating}/5</span>
                       </div>
                     </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleStatusUpdate(testimonial.id, 'approved')}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Approuver
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(testimonial.id, 'rejected')}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Refuser
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

             {approved.length > 0 && (
         <div>
           <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Approuvés ({approved.length})</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {approved.map(testimonial => (
               <div key={testimonial.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                 <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">{testimonial.user_name}</h3>
                 <p className="text-gray-600 dark:text-gray-400 mb-3">"{testimonial.message}"</p>
                 <div className="flex items-center">
                   {[...Array(5)].map((_, i) => (
                     <span key={i} className={i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}>★</span>
                   ))}
                   <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">{testimonial.rating}/5</span>
                 </div>
               </div>
             ))}
           </div>
         </div>
       )}

       {/* Section témoignages rejetés */}
       {rejected.length > 0 && (
         <div className="mb-8">
           <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Rejetés ({rejected.length})</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {rejected.map(testimonial => (
               <div key={testimonial.id} className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg shadow border border-red-200 dark:border-red-800">
                 <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">{testimonial.user_name}</h3>
                 <p className="text-gray-600 dark:text-gray-400 mb-3">"{testimonial.message}"</p>
                 <div className="flex items-center justify-between">
                   <div className="flex items-center">
                     {[...Array(5)].map((_, i) => (
                       <span key={i} className={i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}>★</span>
                     ))}
                     <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">{testimonial.rating}/5</span>
                   </div>
                   <button
                     onClick={() => handleStatusUpdate(testimonial.id, 'approved')}
                     className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                   >
                     Approuver
                   </button>
                 </div>
               </div>
             ))}
           </div>
         </div>
       )}

             {testimonials.length === 0 && (
         <div className="text-center py-12">
           <p className="text-gray-600 dark:text-gray-400">Aucun témoignage disponible</p>
         </div>
       )}
    </div>
  );
};

export default AdminTestimonials; 