import React, { useState, useEffect } from 'react';
import { FaTicketAlt, FaUser, FaEnvelope, FaPhone, FaTrash, FaEye, FaCheck, FaTimes } from 'react-icons/fa';

const AdminTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token d\'authentification manquant');
        return;
      }

      const response = await fetch('http://localhost:5000/api/tickets/all', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log('📊 Tickets récupérés:', data);
      
      if (data.success) {
        setTickets(data.data || []);
      } else {
        setError(data.message || 'Erreur lors de la récupération des tickets');
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des tickets:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTicket = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce ticket ?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token d\'authentification manquant');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/tickets/${id}`, {
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
        console.log('✅ Ticket supprimé avec succès');
        fetchTickets(); // Recharger les tickets
      } else {
        setError(data.message || 'Erreur lors de la suppression du ticket');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du ticket:', error);
      setError(error.message);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token d\'authentification manquant');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/tickets/${id}/status`, {
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
        fetchTickets(); // Recharger les tickets
      } else {
        setError(data.message || 'Erreur lors de la mise à jour du statut');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      setError(error.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ouvert': return 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200';
      case 'en_cours': return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200';
      case 'resolu': return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200';
      case 'ferme': return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgente': return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200';
      case 'haute': return 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200';
      case 'moyenne': return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200';
      case 'basse': return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  const openTicketModal = (ticket) => {
    setSelectedTicket(ticket);
    setShowModal(true);
  };

  if (loading) return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Chargement des tickets...</p>
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
            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Erreur</h3>
            <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
            <button
              onClick={fetchTickets}
              className="mt-2 text-sm text-red-800 dark:text-red-200 hover:text-red-900 dark:hover:text-red-100 underline"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestion des tickets</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Gérez tous les tickets de support des clients</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center">
            <FaTicketAlt className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{tickets.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center">
            <FaTicketAlt className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Ouverts</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{tickets.filter(t => t.status === 'ouvert').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center">
            <FaTicketAlt className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">En cours</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{tickets.filter(t => t.status === 'en_cours').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center">
            <FaTicketAlt className="w-6 h-6 text-green-600 dark:text-green-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Résolus</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{tickets.filter(t => t.status === 'resolu').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des tickets */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Tous les tickets</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Référence</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Sujet</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Priorité</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {ticket.reference}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {ticket.subject}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {ticket.user_name || ticket.contact_email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(ticket.created_at).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openTicketModal(ticket)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Voir les détails"
                      >
                        <FaEye className="w-4 h-4" />
                      </button>
                      {ticket.status === 'ouvert' && (
                        <button
                          onClick={() => handleUpdateStatus(ticket.id, 'en_cours')}
                          className="text-blue-600 hover:text-blue-900"
                          title="Marquer en cours"
                        >
                          <FaCheck className="w-4 h-4" />
                        </button>
                      )}
                      {ticket.status === 'en_cours' && (
                        <button
                          onClick={() => handleUpdateStatus(ticket.id, 'resolu')}
                          className="text-green-600 hover:text-green-900"
                          title="Marquer résolu"
                        >
                          <FaCheck className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteTicket(ticket.id)}
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
      </div>

      {/* Modal de détails du ticket */}
      {showModal && selectedTicket && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border border-gray-200 dark:border-gray-700 w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Ticket {selectedTicket.reference}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Sujet</h4>
                  <p className="text-gray-600 dark:text-gray-400">{selectedTicket.subject}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Description</h4>
                  <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{selectedTicket.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Client</h4>
                    <p className="text-gray-600 dark:text-gray-400">{selectedTicket.user_name || 'Anonyme'}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Email</h4>
                    <p className="text-gray-600 dark:text-gray-400">{selectedTicket.contact_email || selectedTicket.user_email}</p>
                  </div>
                  {selectedTicket.contact_phone && (
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Téléphone</h4>
                      <p className="text-gray-600 dark:text-gray-400">{selectedTicket.contact_phone}</p>
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Date de création</h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {new Date(selectedTicket.created_at).toLocaleString('fr-FR')}
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedTicket.status)}`}>
                    {selectedTicket.status}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(selectedTicket.priority)}`}>
                    {selectedTicket.priority}
                  </span>
                </div>
                
                <div className="flex space-x-2 pt-4">
                  {selectedTicket.contact_email && (
                    <a
                      href={`mailto:${selectedTicket.contact_email}`}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      <FaEnvelope className="w-4 h-4 mr-2" />
                      Contacter par email
                    </a>
                  )}
                  {selectedTicket.contact_phone && (
                    <a
                      href={`tel:${selectedTicket.contact_phone}`}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      <FaPhone className="w-4 h-4 mr-2" />
                      Appeler
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tickets.length === 0 && (
        <div className="text-center py-12">
          <FaTicketAlt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Aucun ticket disponible</p>
        </div>
      )}
    </div>
  );
};

export default AdminTickets;
