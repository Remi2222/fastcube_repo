import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from "../config/api";
import { 
  FaComment, FaUser, FaEnvelope, FaClock, FaCheck, FaTimes, 
  FaTrash, FaEye, FaSpinner, FaExclamationTriangle, FaInfoCircle,
  FaFilter, FaSearch, FaSort, FaSortUp, FaSortDown
} from 'react-icons/fa';

const AdminCommentairesManager = () => {
  const [commentaires, setCommentaires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredCommentaires, setFilteredCommentaires] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedCommentaire, setSelectedCommentaire] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Récupérer tous les commentaires
  const fetchCommentaires = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/commentaires/admin/all`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCommentaires(data.data || []);
        setFilteredCommentaires(data.data || []);
      } else {
        throw new Error('Erreur lors de la récupération des commentaires');
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrer et trier les commentaires
  useEffect(() => {
    let filtered = commentaires;

    // Filtrage par statut
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(c => c.status === selectedStatus);
    }

    // Filtrage par recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(c => 
        (c.content && c.content.toLowerCase().includes(term)) ||
        (c.author_name && c.author_name.toLowerCase().includes(term)) ||
        (c.author_email && c.author_email.toLowerCase().includes(term)) ||
        (c.blog_title && c.blog_title.toLowerCase().includes(term))
      );
    }

    // Tri
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === 'created_at' || sortField === 'updated_at') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredCommentaires(filtered);
  }, [commentaires, selectedStatus, searchTerm, sortField, sortDirection]);

  // Approuver un commentaire
  const approveCommentaire = async (id) => {
    try {
      setActionLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/commentaires/admin/${id}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        await fetchCommentaires();
      } else {
        throw new Error('Erreur lors de l\'approbation');
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setActionLoading(false);
    }
  };

  // Rejeter un commentaire
  const rejectCommentaire = async (id) => {
    try {
      setActionLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/commentaires/admin/${id}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        await fetchCommentaires();
      } else {
        throw new Error('Erreur lors du rejet');
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setActionLoading(false);
    }
  };

  // Supprimer un commentaire
  const deleteCommentaire = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) {
      return;
    }

    try {
      setActionLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/commentaires/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        await fetchCommentaires();
      } else {
        throw new Error('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setActionLoading(false);
    }
  };

  // Gérer le tri
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Obtenir le badge de statut
  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { color: 'from-yellow-500 to-orange-500', text: 'En attente' },
      'approved': { color: 'from-green-500 to-emerald-500', text: 'Approuvé' },
      'rejected': { color: 'from-red-500 to-pink-500', text: 'Rejeté' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${config.color}`}>
        {config.text}
      </span>
    );
  };

  // Charger les commentaires au montage
  useEffect(() => {
    fetchCommentaires();
  }, []);

  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-100/50 dark:border-gray-600/50 p-8">
      
      {/* En-tête */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
            <FaComment className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-gray-800 dark:text-white">
              Gestion des Commentaires
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {filteredCommentaires.length} commentaire{filteredCommentaires.length !== 1 ? 's' : ''} trouvé{filteredCommentaires.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Filtre par statut */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Statut
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
          >
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="approved">Approuvés</option>
            <option value="rejected">Rejetés</option>
          </select>
        </div>

        {/* Recherche */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Recherche
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher dans les commentaires..."
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
        </div>

        {/* Bouton de rafraîchissement */}
        <div className="flex items-end">
          <button
            onClick={fetchCommentaires}
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <FaSpinner className="w-4 h-4 animate-spin" />
                Chargement...
              </>
            ) : (
              <>
                <FaEye className="w-4 h-4" />
                Actualiser
              </>
            )}
          </button>
        </div>
      </div>

      {/* Table des commentaires */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-4 px-4">
                <button
                  onClick={() => handleSort('author_name')}
                  className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Auteur
                  {sortField === 'author_name' && (
                    sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />
                  )}
                </button>
              </th>
              <th className="text-left py-4 px-4">
                <button
                  onClick={() => handleSort('content')}
                  className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Commentaire
                  {sortField === 'content' && (
                    sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />
                  )}
                </button>
              </th>
              <th className="text-left py-4 px-4">Blog</th>
              <th className="text-left py-4 px-4">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Statut
                  {sortField === 'status' && (
                    sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />
                  )}
                </button>
              </th>
              <th className="text-left py-4 px-4">
                <button
                  onClick={() => handleSort('created_at')}
                  className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Date
                  {sortField === 'created_at' && (
                    sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />
                  )}
                </button>
              </th>
              <th className="text-left py-4 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCommentaires.map((commentaire) => (
              <tr key={commentaire.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                      <FaUser className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-800 dark:text-white">
                        {commentaire.author_name || `${commentaire.first_name || ''} ${commentaire.last_name || ''}`}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {commentaire.author_email || commentaire.email}
                      </div>
                    </div>
                  </div>
                </td>
                
                <td className="py-4 px-4">
                  <div className="max-w-xs">
                    <div className="text-gray-800 dark:text-white text-sm line-clamp-2">
                      {commentaire.content}
                    </div>
                    <button
                      onClick={() => {
                        setSelectedCommentaire(commentaire);
                        setShowModal(true);
                      }}
                      className="text-blue-600 dark:text-blue-400 text-xs hover:underline mt-1"
                    >
                      Voir plus
                    </button>
                  </div>
                </td>
                
                <td className="py-4 px-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {commentaire.blog_title || 'Blog supprimé'}
                  </div>
                </td>
                
                <td className="py-4 px-4">
                  {getStatusBadge(commentaire.status)}
                </td>
                
                <td className="py-4 px-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(commentaire.created_at)}
                  </div>
                </td>
                
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    {commentaire.status === 'pending' && (
                      <>
                        <button
                          onClick={() => approveCommentaire(commentaire.id)}
                          disabled={actionLoading}
                          className="p-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                          title="Approuver"
                        >
                          <FaCheck className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => rejectCommentaire(commentaire.id)}
                          disabled={actionLoading}
                          className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                          title="Rejeter"
                        >
                          <FaTimes className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    
                    <button
                      onClick={() => deleteCommentaire(commentaire.id)}
                      disabled={actionLoading}
                      className="p-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
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

      {/* État vide */}
      {!loading && filteredCommentaires.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <FaComment className="w-8 h-8 text-gray-500 dark:text-gray-400" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-2">Aucun commentaire trouvé</p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            {searchTerm || selectedStatus !== 'all' 
              ? 'Essayez de modifier vos filtres de recherche'
              : 'Les commentaires apparaîtront ici une fois créés'
            }
          </p>
        </div>
      )}

      {/* Modal de détail du commentaire */}
      {showModal && selectedCommentaire && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Détail du commentaire
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Auteur
                  </label>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    {selectedCommentaire.author_name || `${selectedCommentaire.first_name || ''} ${selectedCommentaire.last_name || ''}`}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    {selectedCommentaire.author_email || selectedCommentaire.email}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Blog
                  </label>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    {selectedCommentaire.blog_title || 'Blog supprimé'}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Commentaire
                  </label>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-800 dark:text-gray-200">
                    {selectedCommentaire.content}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Statut
                    </label>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      {getStatusBadge(selectedCommentaire.status)}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date de création
                    </label>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-sm">
                      {formatDate(selectedCommentaire.created_at)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-xl transition-all duration-300"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCommentairesManager;
