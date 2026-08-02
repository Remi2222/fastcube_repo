import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye, FaCalendarAlt, FaMoneyBillWave, FaTag } from 'react-icons/fa';

const AdminTenders = () => {
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTender, setEditingTender] = useState(null);

  // État du formulaire
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    budget: '',
    deadline: '',
    requirements: '',
    criteria: '',
    contactEmail: 'tenders@fastcube.com',
    contactPhone: '+33 1 23 45 67 89'
  });

  // État pour le fichier uploadé
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    fetchTenders();
  }, []);

  const fetchTenders = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token d\'authentification manquant');
        return;
      }

      const response = await fetch('http://localhost:5000/api/tenders', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setTenders(data.data || []);
      } else {
        setError(data.message || 'Erreur lors de la récupération des appels d\'offre');
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des appels d\'offre:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token d\'authentification manquant');
        return;
      }

      // Créer FormData pour l'envoi de fichiers
      const formDataToSend = new FormData();
      
      // Ajouter les données du formulaire
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('technologies', formData.technologies);
      formDataToSend.append('budget', formData.budget);
      formDataToSend.append('deadline', formData.deadline);
      formDataToSend.append('requirements', formData.requirements ? formData.requirements.split('\n').filter(req => req.trim()).join('\n') : '');
      formDataToSend.append('criteria', formData.criteria ? formData.criteria.split('\n').filter(crit => crit.trim()).join('\n') : '');
      formDataToSend.append('contactEmail', formData.contactEmail);
      formDataToSend.append('contactPhone', formData.contactPhone);

      // Ajouter le fichier s'il y en a un
      if (uploadedFile) {
        formDataToSend.append('cahierCharges', uploadedFile);
      }

      const url = editingTender 
        ? `http://localhost:5000/api/tenders/${editingTender.id}`
        : 'http://localhost:5000/api/tenders';
      
      const method = editingTender ? 'PUT' : 'POST';

      // Debug: afficher le contenu de FormData
      console.log('=== DÉBOGAGE FRONTEND ===');
      console.log('FormData contenu:');
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`${key}:`, value);
      }
      console.log('URL:', url);
      console.log('Méthode:', method);
      console.log('========================');

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
          // Ne pas définir Content-Type, il sera automatiquement défini avec la boundary pour FormData
        },
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la sauvegarde');
      }

      const data = await response.json();
      if (data.success) {
        setShowForm(false);
        setEditingTender(null);
        resetForm();
        fetchTenders();
        alert(editingTender ? 'Appel d\'offre mis à jour avec succès' : 'Appel d\'offre créé avec succès');
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet appel d\'offre ?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token d\'authentification manquant');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/tenders/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        fetchTenders();
        alert('Appel d\'offre supprimé avec succès');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setError(error.message);
    }
  };

  const handleEdit = (tender) => {
    setEditingTender(tender);
    setFormData({
      title: tender.title,
      description: tender.description,
      technologies: tender.technologies || '',
      budget: tender.budget || '',
      deadline: tender.deadline,
      requirements: tender.requirements || '',
      criteria: tender.criteria || '',
      contactEmail: tender.contact_email || 'tenders@fastcube.com',
      contactPhone: tender.contact_phone || '+33 1 23 45 67 89'
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      technologies: '',
      budget: '',
      deadline: '',
      requirements: '',
      criteria: '',
      contactEmail: 'tenders@fastcube.com',
      contactPhone: '+33 1 23 45 67 89'
    });
    setUploadedFile(null);
    setFileName('');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const formatBudget = (budget) => {
    return budget || 'Non spécifié';
  };

  // Fonction pour gérer l'upload de fichier
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier le type de fichier
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if (!allowedTypes.includes(file.type)) {
        alert('Veuillez sélectionner un fichier PDF, DOC, DOCX ou TXT.');
        return;
      }

      // Vérifier la taille (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('Le fichier est trop volumineux. Taille maximum : 10MB.');
        return;
      }

      setUploadedFile(file);
      setFileName(file.name);
    }
  };

  // Fonction pour supprimer le fichier uploadé
  const removeFile = () => {
    setUploadedFile(null);
    setFileName('');
  };

     if (loading) {
     return (
       <div className="flex items-center justify-center p-8">
         <div className="text-center">
           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
           <p className="text-gray-600 dark:text-gray-400">Chargement des appels d'offre...</p>
         </div>
       </div>
     );
   }

  return (
    <div className="max-w-7xl mx-auto">
             <div className="mb-6 flex justify-between items-center">
         <div>
           <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestion des Appels d'Offre</h1>
           <p className="text-gray-600 dark:text-gray-400 mt-1">Créez et gérez les appels d'offre de l'entreprise</p>
         </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingTender(null);
            resetForm();
          }}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center"
        >
          <FaPlus className="w-4 h-4 mr-2" />
          Nouvel Appel d'Offre
        </button>
      </div>

             {error && (
         <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
           <div className="flex">
             <div className="flex-shrink-0">
               <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
               </svg>
             </div>
             <div className="ml-3">
               <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Erreur</h3>
               <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
             </div>
           </div>
         </div>
       )}

             {/* Formulaire */}
       {showForm && (
         <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
           <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
             {editingTender ? 'Modifier l\'Appel d\'Offre' : 'Nouvel Appel d\'Offre'}
           </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                   Titre *
                 </label>
                 <input
                   type="text"
                   required
                   value={formData.title}
                   onChange={(e) => setFormData({...formData, title: e.target.value})}
                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                 />
               </div>

                             <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                   Budget
                 </label>
                 <input
                   type="text"
                   value={formData.budget}
                   onChange={(e) => setFormData({...formData, budget: e.target.value})}
                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                   placeholder="ex: 25000 MAD"
                 />
               </div>

                             <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                   Date Limite *
                 </label>
                 <input
                   type="date"
                   required
                   value={formData.deadline}
                   onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                 />
               </div>
            </div>

                         <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                 Description *
               </label>
               <textarea
                 required
                 rows={4}
                 value={formData.description}
                 onChange={(e) => setFormData({...formData, description: e.target.value})}
                 className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                 placeholder="Description détaillée de l'appel d'offre..."
               />
             </div>

                         <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                 Technologies
               </label>
               <textarea
                 rows={3}
                 value={formData.technologies}
                 onChange={(e) => setFormData({...formData, technologies: e.target.value})}
                 className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                 placeholder="Technologies requises, frameworks, outils..."
               />
             </div>

             {/* Documents requis */}
             <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                 Documents requis (un par ligne)
               </label>
               <textarea
                 rows={4}
                 value={formData.requirements}
                 onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                 className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                 placeholder="CV technique&#10;Devis détaillé&#10;Attestation d'assurance&#10;Références clients"
               />
             </div>

             {/* Critères de sélection */}
             <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                 Critères de sélection (un par ligne)
               </label>
               <textarea
                 rows={4}
                 value={formData.criteria}
                 onChange={(e) => setFormData({...formData, criteria: e.target.value})}
                 className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                 placeholder="Expertise technique&#10;Expérience similaire&#10;Prix compétitif&#10;Délai de livraison"
               />
             </div>

             {/* Upload du cahier de charges */}
             <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                 Cahier de charges (PDF, DOC, DOCX, TXT)
               </label>
               <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
                 {!uploadedFile ? (
                   <div className="text-center">
                     <input
                       type="file"
                       accept=".pdf,.doc,.docx,.txt"
                       onChange={handleFileUpload}
                       className="hidden"
                       id="file-upload"
                     />
                     <label htmlFor="file-upload" className="cursor-pointer">
                       <div className="text-gray-500 dark:text-gray-400 mb-2">
                         <svg className="mx-auto h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                         </svg>
                       </div>
                       <p className="text-sm text-gray-600 dark:text-gray-400">
                         Cliquez pour sélectionner un fichier ou glissez-le ici
                       </p>
                       <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                         PDF, DOC, DOCX, TXT (max 10MB)
                       </p>
                     </label>
                   </div>
                 ) : (
                   <div className="flex items-center justify-between">
                     <div className="flex items-center">
                       <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                         <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                       </svg>
                       <span className="text-sm text-gray-900 dark:text-white">{fileName}</span>
                     </div>
                     <button
                       type="button"
                       onClick={removeFile}
                       className="text-red-500 hover:text-red-700"
                     >
                       <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                         <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                       </svg>
                     </button>
                   </div>
                 )}
               </div>
             </div>

             {/* Informations de contact */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                   Email de contact
                 </label>
                 <input
                   type="email"
                   value={formData.contactEmail}
                   onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                   placeholder="tenders@fastcube.com"
                 />
               </div>

               <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                   Téléphone de contact
                 </label>
                 <input
                   type="tel"
                   value={formData.contactPhone}
                   onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                   placeholder="+33 1 23 45 67 89"
                 />
               </div>
             </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingTender(null);
                  resetForm();
                }}
                className="inline-flex items-center px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-medium rounded-lg transition-all duration-200"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                {editingTender ? 'Mettre à jour' : 'Créer'}
              </button>
            </div>
          </form>
        </div>
      )}

             {/* Liste des appels d'offre */}
       <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
         <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
           <h3 className="text-lg font-medium text-gray-900 dark:text-white">
             Appels d'Offre ({tenders.length})
           </h3>
         </div>
        
                 {tenders.length === 0 ? (
           <div className="text-center py-12">
             <FaCalendarAlt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
             <p className="text-gray-600 dark:text-gray-400">Aucun appel d'offre trouvé</p>
           </div>
         ) : (
          <div className="overflow-x-auto">
                         <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
               <thead className="bg-gray-50 dark:bg-gray-700">
                 <tr>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                     Titre
                   </th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                     Technologies
                   </th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                     Budget
                   </th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                     Date Limite
                   </th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                     Actions
                   </th>
                 </tr>
               </thead>
               <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                 {tenders.map((tender) => (
                   <tr key={tender.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                     <td className="px-6 py-4">
                       <div className="text-sm font-medium text-gray-900 dark:text-white">{tender.title}</div>
                       <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                         {tender.description}
                       </div>
                     </td>
                     <td className="px-6 py-4">
                       <div className="text-sm text-gray-900 dark:text-white max-w-xs truncate">
                         {tender.technologies || 'Non spécifié'}
                       </div>
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                       <div className="flex items-center">
                         <FaMoneyBillWave className="w-4 h-4 text-green-600 mr-1" />
                         {formatBudget(tender.budget)}
                       </div>
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                       <div className="flex items-center">
                         <FaCalendarAlt className="w-4 h-4 text-blue-600 mr-1" />
                         {formatDate(tender.deadline)}
                       </div>
                     </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(tender)}
                          className="text-green-600 hover:text-green-900"
                          title="Modifier"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(tender.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Supprimer"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTenders; 