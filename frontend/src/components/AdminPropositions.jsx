import React, { useState, useEffect } from 'react';
import { FaEye, FaTrash, FaCheck, FaTimes, FaClock, FaDownload } from 'react-icons/fa';
import { API_BASE_URL } from "../config/api";

export default function AdminPropositions() {
  const [propositions, setPropositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchPropositions();
  }, []);

  const fetchPropositions = async () => {
    try {
      const token = localStorage.getItem('token');
      
      console.log('🔍 Token récupéré:', token ? 'Présent' : 'Manquant');
      
      if (!token) {
        setError('Token d\'authentification manquant. Veuillez vous reconnecter.');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/propositions/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPropositions(data.data);
      } else if (response.status === 401) {
        setError('Token invalide ou expiré. Veuillez vous reconnecter.');
      } else if (response.status === 403) {
        setError('Accès refusé. Vous devez avoir les permissions administrateur.');
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(`Erreur lors du chargement des propositions: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (proposalId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/propositions/${proposalId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        // Mettre à jour la liste
        setPropositions(prev => 
          prev.map(prop => 
            prop.id === proposalId 
              ? { ...prop, status: newStatus }
              : prop
          )
        );
      } else {
        alert('Erreur lors de la mise à jour du statut');
      }
    } catch (error) {
      alert('Erreur de connexion');
    }
  };

  const handleDelete = async (proposalId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette proposition ?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/propositions/${proposalId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setPropositions(prev => prev.filter(prop => prop.id !== proposalId));
      } else {
        alert('Erreur lors de la suppression');
      }
    } catch (error) {
      alert('Erreur de connexion');
    }
  };

  const handleDownloadFile = async (proposalId, fileName, fileIndex) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/propositions/${proposalId}/files/${fileIndex}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Erreur lors du téléchargement du fichier');
      }
    } catch (error) {
      console.error('Erreur de téléchargement:', error);
      alert('Erreur de connexion lors du téléchargement');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'en_attente': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'acceptee': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'refusee': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'en_cours_evaluation': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'en_attente': return 'En attente';
      case 'acceptee': return 'Acceptée';
      case 'refusee': return 'Refusée';
      case 'en_cours_evaluation': return 'En cours d\'évaluation';
      default: return status;
    }
  };

  const filteredPropositions = propositions.filter(proposition => {
    if (filter === 'all') return true;
    return proposition.status === filter;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <div className="text-red-600 dark:text-red-400 mb-4">
          {error}
        </div>
        <button
          onClick={() => {
            setError(null);
            setLoading(true);
            fetchPropositions();
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          🔄 Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestion des Propositions
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gérez les propositions soumises pour les appels d'offre
          </p>
        </div>
        
        {/* Filtres */}
        <div className="flex flex-wrap gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            <option value="all">Toutes</option>
            <option value="en_attente">En attente</option>
            <option value="en_cours_evaluation">En cours d'évaluation</option>
            <option value="acceptee">Acceptées</option>
            <option value="refusee">Refusées</option>
          </select>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <FaClock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{propositions.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <FaClock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">En attente</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {propositions.filter(p => p.status === 'en_attente').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <FaCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Acceptées</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {propositions.filter(p => p.status === 'acceptee').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <FaTimes className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Refusées</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {propositions.filter(p => p.status === 'refusee').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des propositions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                   Nom complet
                 </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Appel d'offre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Statut
                </th>
                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                   Fichiers
                 </th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                   Date
                 </th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                   Actions
                 </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredPropositions.map((proposition) => (
                <tr key={proposition.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                     <td className="px-6 py-4 whitespace-nowrap">
                     <div>
                       <div className="text-sm font-medium text-gray-900 dark:text-white">
                         {proposition.full_name}
                       </div>
                       <div className="text-sm text-gray-500 dark:text-gray-400">
                         {proposition.address}
                       </div>
                     </div>
                   </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {proposition.tender_title}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {proposition.tender_reference}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {proposition.email}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {proposition.phone}
                    </div>
                  </td>
                                     <td className="px-6 py-4 whitespace-nowrap">
                     <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(proposition.status)}`}>
                       {getStatusText(proposition.status)}
                     </span>
                   </td>
                   <td className="px-6 py-4 whitespace-nowrap">
                     {proposition.files_names && proposition.files_names.length > 0 ? (
                       <div className="space-y-1">
                         {proposition.files_names.map((fileName, index) => (
                           <button
                             key={`fileName-item-${index}`}
                             onClick={() => handleDownloadFile(proposition.id, fileName, index)}
                             className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-xs"
                             title={`Télécharger ${fileName}`}
                           >
                             <FaDownload className="w-3 h-3" />
                             <span className="truncate max-w-20">{fileName}</span>
                           </button>
                         ))}
                       </div>
                     ) : (
                       <span className="text-gray-400 text-xs">Aucun fichier</span>
                     )}
                   </td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                     {new Date(proposition.created_at).toLocaleDateString('fr-FR')}
                   </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedProposal(proposition);
                          setShowModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        title="Voir les détails"
                      >
                        <FaEye className="w-4 h-4" />
                      </button>
                      
                      {proposition.status === 'en_attente' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(proposition.id, 'acceptee')}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                            title="Accepter"
                          >
                            <FaCheck className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(proposition.id, 'refusee')}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            title="Refuser"
                          >
                            <FaTimes className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      
                      <button
                        onClick={() => handleDelete(proposition.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
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
        
        {filteredPropositions.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              Aucune proposition trouvée
            </p>
          </div>
        )}
      </div>

      {/* Modal de détails */}
      {showModal && selectedProposal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Détails de la proposition
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                                 <div>
                   <h4 className="font-medium text-gray-900 dark:text-white mb-2">Nom complet</h4>
                   <p className="text-gray-600 dark:text-gray-400">{selectedProposal.full_name}</p>
                   <p className="text-gray-600 dark:text-gray-400">{selectedProposal.address}</p>
                 </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Contact</h4>
                  <p className="text-gray-600 dark:text-gray-400">Email: {selectedProposal.email}</p>
                  <p className="text-gray-600 dark:text-gray-400">Téléphone: {selectedProposal.phone}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Appel d'offre</h4>
                  <p className="text-gray-600 dark:text-gray-400">{selectedProposal.tender_title}</p>
                  <p className="text-gray-600 dark:text-gray-400">Référence: {selectedProposal.tender_reference}</p>
                </div>
                
                {selectedProposal.comment && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Commentaire</h4>
                    <p className="text-gray-600 dark:text-gray-400">{selectedProposal.comment}</p>
                  </div>
                )}
                
                {selectedProposal.files_names && selectedProposal.files_names.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Fichiers joints</h4>
                    <div className="space-y-2">
                      {selectedProposal.files_names.map((fileName, index) => (
                        <div key={`fileName-item-${index}`} className="flex items-center space-x-2">
                          <FaDownload className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-400">{fileName}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Statut</h4>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedProposal.status)}`}>
                    {getStatusText(selectedProposal.status)}
                  </span>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Date de soumission</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    {new Date(selectedProposal.created_at).toLocaleString('fr-FR')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 