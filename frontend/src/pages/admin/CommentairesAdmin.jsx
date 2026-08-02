import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const CommentairesAdmin = () => {
  const { user } = useAuth();
  const [commentaires, setCommentaires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); 

  
  const fetchCommentaires = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/commentaires/admin/all');
      
      if (response.ok) {
        const data = await response.json();
        setCommentaires(data.data || []);
      } else {
        setError('Erreur lors de la récupération des commentaires');
      }
    } catch (error) {
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  
  const approveCommentaire = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/commentaires/admin/${id}/approve`, {
        method: 'PUT'
      });
      
      if (response.ok) {
        await fetchCommentaires(); 
      } else {
        setError('Erreur lors de l\'approbation');
      }
    } catch (error) {
      setError('Erreur de connexion');
    }
  };

  
  const rejectCommentaire = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/commentaires/admin/${id}/reject`, {
        method: 'PUT'
      });
      
      if (response.ok) {
        await fetchCommentaires(); 
      } else {
        setError('Erreur lors du rejet');
      }
    } catch (error) {
      setError('Erreur de connexion');
    }
  };

  
  const deleteCommentaire = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/commentaires/${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          await fetchCommentaires(); 
        } else {
          setError('Erreur lors de la suppression');
        }
      } catch (error) {
        setError('Erreur de connexion');
      }
    }
  };

  useEffect(() => {
    fetchCommentaires();
  }, []);

  
  const filteredCommentaires = commentaires.filter(comment => {
    if (filter === 'all') return true;
    return comment.status === filter;
  });

  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  
  const getStatusText = (status) => {
    switch (status) {
      case 'approved': return 'Approuvé';
      case 'rejected': return 'Rejeté';
      case 'pending': return 'En attente';
      default: return 'Inconnu';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Commentaires</h1>
        <p className="text-gray-600">Approuvez ou rejetez les commentaires des utilisateurs</p>
      </div>

      {}
      <div className="mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Tous ({commentaires.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === 'pending' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            En attente ({commentaires.filter(c => c.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === 'approved' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Approuvés ({commentaires.filter(c => c.status === 'approved').length})
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === 'rejected' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Rejetés ({commentaires.filter(c => c.status === 'rejected').length})
          </button>
        </div>
      </div>

      {}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {}
      <div className="space-y-4">
        {filteredCommentaires.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Aucun commentaire trouvé
          </div>
        ) : (
          filteredCommentaires.map((comment) => (
            <div key={comment.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {comment.author_name}
                  </h3>
                  <p className="text-sm text-gray-600">{comment.author_email}</p>
                  <p className="text-sm text-gray-500">{formatDate(comment.created_at)}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(comment.status)}`}>
                    {getStatusText(comment.status)}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-gray-800 leading-relaxed">{comment.content}</p>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Blog: {comment.blog_title || `ID: ${comment.blog_id}`}
                </div>
                
                <div className="flex space-x-2">
                  {comment.status === 'pending' && (
                    <>
                      <button
                        onClick={() => approveCommentaire(comment.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Approuver
                      </button>
                      <button
                        onClick={() => rejectCommentaire(comment.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Rejeter
                      </button>
                    </>
                  )}
                  
                  {comment.status === 'approved' && (
                    <button
                      onClick={() => rejectCommentaire(comment.id)}
                      className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                    >
                      Rejeter
                    </button>
                  )}
                  
                  {comment.status === 'rejected' && (
                    <button
                      onClick={() => approveCommentaire(comment.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Approuver
                    </button>
                  )}
                  
                  <button
                    onClick={() => deleteCommentaire(comment.id)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentairesAdmin;







