import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaFilter, FaComments, FaClock, FaCheckCircle, FaExclamationTriangle, FaTimes, FaPlus, FaEye, FaComment, FaUser, FaTicketAlt, FaEdit, FaTrash, FaStar } from 'react-icons/fa';
import TestimonialForm from '../../components/TestimonialForm';

export default function ClientDashboard() {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [editingTicket, setEditingTicket] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await fetch("http://localhost:5000/api/users/me", {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.ok) {
            const data = await response.json();
            setUserData(data.data);
          }
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données utilisateur:", error);
      }
    };
    fetchUserData();
  }, []);

  
  useEffect(() => {
    const fetchTickets = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token") || localStorage.getItem("userToken");
        const userRole = localStorage.getItem("userRole");
        const userEmail = localStorage.getItem("userEmail");
        

        
        if (!token) {
          console.error("❌ Aucun token trouvé - Redirection vers login");
          setTickets([]);
          setFilteredTickets([]);
          window.location.href = "/login";
          return;
        }

        const res = await fetch("http://localhost:5000/api/tickets/mine", {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (res.ok) {
          const data = await res.json();
          
          
          const ticketsArray = data.data || data || [];
          
          
          setTickets(ticketsArray);
          setFilteredTickets(ticketsArray);
        } else if (res.status === 401) {
          
          localStorage.removeItem("token");
          localStorage.removeItem("userToken");
          localStorage.removeItem("userRole");
          localStorage.removeItem("userEmail");
          window.location.href = "/login";
        } else {
          const errorText = await res.text();
          setTickets([]);
          setFilteredTickets([]);
        }
      } catch (e) {
        setTickets([]);
        setFilteredTickets([]);
      }
      setIsLoading(false);
    };
    fetchTickets();
  }, []);

  
  useEffect(() => {
    let filtered = tickets;

    
    if (searchTerm) {
      filtered = filtered.filter(ticket =>
        ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }

    setFilteredTickets(filtered);
  }, [tickets, searchTerm, statusFilter]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ouvert':
        return <FaExclamationTriangle className="w-5 h-5 text-orange-500" />;
      case 'en_cours':
        return <FaClock className="w-5 h-5 text-blue-500" />;
      case 'resolu':
        return <FaCheckCircle className="w-5 h-5 text-green-500" />;
      case 'ferme':
        return <FaTimes className="w-5 h-5 text-gray-500" />;
      default:
        return <FaComments className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ouvert':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'en_cours':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'resolu':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'ferme':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const addComment = () => {
    if (!newComment.trim() || !selectedTicket) return;

    const comment = {
      id: Date.now(),
      author: 'Vous',
      message: newComment,
      timestamp: new Date().toISOString(),
      isStaff: false
    };

    const updatedTickets = tickets.map(ticket =>
      ticket.id === selectedTicket.id
        ? { ...ticket, comments: [...ticket.comments, comment] }
        : ticket
    );

    setTickets(updatedTickets);
    setSelectedTicket({ ...selectedTicket, comments: [...selectedTicket.comments, comment] });
    setNewComment('');
  };

  const handleEditTicket = (ticket) => {
    setEditingTicket(ticket);
  };

  const handleUpdateTicket = async (updatedData) => {
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("userToken");
      const response = await fetch(`http://localhost:5000/api/tickets/${editingTicket.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });

      if (response.ok) {
        
        const updatedTickets = tickets.map(ticket =>
          ticket.id === editingTicket.id ? { ...ticket, ...updatedData } : ticket
        );
        setTickets(updatedTickets);
        setFilteredTickets(updatedTickets);
        
        
        if (selectedTicket && selectedTicket.id === editingTicket.id) {
          setSelectedTicket({ ...selectedTicket, ...updatedData });
        }
        
        setEditingTicket(null);
        alert('Ticket mis à jour avec succès !');
      } else {
        alert('Erreur lors de la mise à jour du ticket');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la mise à jour du ticket');
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("userToken");
      const response = await fetch(`http://localhost:5000/api/tickets/${ticketId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        
        const updatedTickets = tickets.filter(ticket => ticket.id !== ticketId);
        setTickets(updatedTickets);
        setFilteredTickets(updatedTickets);
        
        
        if (selectedTicket && selectedTicket.id === ticketId) {
          setSelectedTicket(null);
        }
        
        setShowDeleteConfirm(null);
        alert('Ticket supprimé avec succès !');
      } else {
        alert('Erreur lors de la suppression du ticket');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression du ticket');
    }
  };

  
  const token = localStorage.getItem("token") || localStorage.getItem("userToken");
  const userRole = localStorage.getItem("userRole");
  const userEmail = localStorage.getItem("userEmail");

  if (!token || !userRole || !userEmail) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-20">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
              <p className="font-semibold">Vous n'êtes pas connecté</p>
              <p className="text-sm">Veuillez vous connecter pour accéder à votre dashboard.</p>
            </div>
            <button 
              onClick={() => window.location.href = '/login'} 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Se connecter
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-20">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Chargement de vos tickets...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Mon Espace Client</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">Gérez vos tickets de support et suivez leur progression</p>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Connecté en tant que :</strong> {userData ? `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || userData.email : 'Chargement...'} ({userEmail})
            </p>
            {userData?.phone && (
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                <strong>Téléphone :</strong> {userData.phone}
              </p>
            )}
            {userData?.city && userData?.country && (
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                <strong>Localisation :</strong> {userData.city}, {userData.country}
              </p>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Liste des tickets */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              {/* Filtres et recherche */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Rechercher un ticket..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black dark:text-white bg-white dark:bg-gray-700"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black dark:text-white bg-white dark:bg-gray-700"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="ouvert">Ouvert</option>
                  <option value="en_cours">En cours</option>
                  <option value="resolu">Résolu</option>
                  <option value="ferme">Fermé</option>
                </select>
              </div>

              {/* Liste des tickets */}
              <div className="space-y-4">
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement des tickets...</p>
                  </div>
                ) : filteredTickets.length === 0 ? (
                  <div className="text-center py-8">
                    <FaComments className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-300 mb-4">Aucun ticket trouvé</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Vous n'avez pas encore créé de tickets de support.</p>
                    <Link 
                      to="/new-ticket" 
                      className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FaPlus className="w-4 h-4" />
                      Créer un nouveau ticket
                    </Link>
                  </div>
                ) : (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                      Vos Tickets ({filteredTickets.length})
                    </h3>
                  </div>
                )}
                
                {filteredTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className={`border rounded-xl p-4 cursor-pointer transition-all hover:shadow-lg ${
                      selectedTicket?.id === ticket.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700'
                    }`}
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="font-semibold text-gray-800 dark:text-white text-lg">{ticket.subject}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(ticket.status)}`}>
                            {ticket.status === 'ouvert' && '🔵 Ouvert'}
                            {ticket.status === 'en_cours' && '🟡 En cours'}
                            {ticket.status === 'resolu' && '🟢 Résolu'}
                            {ticket.status === 'ferme' && '⚫ Fermé'}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority === 'critique' && '🔴 Critique'}
                            {ticket.priority === 'haute' && '🟠 Haute'}
                            {ticket.priority === 'moyenne' && '🟡 Moyenne'}
                            {ticket.priority === 'basse' && '🟢 Basse'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{ticket.description}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-4">
                            <span className="font-mono bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
                              {ticket.reference || `ID: ${ticket.id}`}
                            </span>
                            <span>📅 {formatDate(ticket.created_at || ticket.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(ticket.status)}
                            <FaEye className="w-4 h-4 text-gray-400" />
                            
                            {}
                            <div className="flex items-center gap-1 ml-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditTicket(ticket);
                                }}
                                className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                                title="Modifier"
                              >
                                <FaEdit className="w-3 h-3" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowDeleteConfirm(ticket.id);
                                }}
                                className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                                title="Supprimer"
                              >
                                <FaTrash className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {}
          <div className="lg:col-span-1">
            {selectedTicket ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">Détails du ticket</h2>
                  <button
                    onClick={() => setSelectedTicket(null)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <FaTimes className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-2">{selectedTicket.subject}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{selectedTicket.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">Statut</span>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusIcon(selectedTicket.status)}
                        <span className="text-sm font-medium">
                          {selectedTicket.status === 'ouvert' && 'Ouvert'}
                          {selectedTicket.status === 'en_cours' && 'En cours'}
                          {selectedTicket.status === 'resolu' && 'Résolu'}
                          {selectedTicket.status === 'ferme' && 'Fermé'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">Priorité</span>
                      <div className="mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedTicket.priority)}`}>
                          {selectedTicket.priority === 'urgent' && 'Urgente'}
                          {selectedTicket.priority === 'high' && 'Haute'}
                          {selectedTicket.priority === 'medium' && 'Moyenne'}
                          {selectedTicket.priority === 'low' && 'Basse'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Créé le</span>
                    <p className="text-sm dark:text-gray-300">{formatDate(selectedTicket.created_at || selectedTicket.createdAt)}</p>
                  </div>

                  {}
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                      <FaComment className="w-4 h-4" />
                      Commentaires ({selectedTicket.comments?.length || 0})
                    </h4>
                    
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {selectedTicket.comments && selectedTicket.comments.length > 0 ? (
                        selectedTicket.comments.map((comment) => (
                          <div key={comment.id} className={`p-3 rounded-lg ${
                            comment.isStaff ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500' : 'bg-gray-50 dark:bg-gray-700 border-l-4 border-gray-300 dark:border-gray-600'
                          }`}>
                            <div className="flex items-center justify-between mb-1">
                              <span className={`text-sm font-medium ${
                                comment.isStaff ? 'text-blue-800 dark:text-blue-200' : 'text-gray-800 dark:text-white'
                              }`}>
                                {comment.author}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formatDate(comment.timestamp)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{comment.message}</p>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                          <p>Aucun commentaire pour le moment</p>
                        </div>
                      )}
                    </div>

                    {}
                    {selectedTicket.status !== 'resolu' && selectedTicket.status !== 'ferme' && (
                      <div className="mt-4">
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Ajouter un commentaire..."
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black dark:text-white bg-white dark:bg-gray-700"
                        />
                        <button
                          onClick={addComment}
                          disabled={!newComment.trim()}
                          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Ajouter un commentaire
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 text-center">
                <FaComments className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-300">Sélectionnez un ticket pour voir les détails</p>
              </div>
            )}
          </div>
        </div>

        {}
        <div className="mt-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Partagez votre expérience
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Laissez un témoignage sur nos services
            </p>
          </div>
          <TestimonialForm />
        </div>

        {}
        <div className="mt-8 text-center space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/new-ticket"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaPlus className="w-5 h-5" />
              Créer un nouveau ticket
            </Link>
            <Link
              to="/my-tickets"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              <FaTicketAlt className="w-5 h-5" />
              Mes Tickets
            </Link>
            <Link
              to="/client-account"
              className="inline-flex items-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <FaUser className="w-5 h-5" />
              Mon Compte
            </Link>
          </div>
        </div>
      </div>

      {}
      {editingTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">Modifier le ticket</h3>
            <EditTicketForm 
              ticket={editingTicket} 
              onUpdate={handleUpdateTicket}
              onCancel={() => setEditingTicket(null)}
            />
          </div>
        </div>
      )}

      {}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaTrash className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 dark:text-white">Confirmer la suppression</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Êtes-vous sûr de vouloir supprimer ce ticket ? Cette action est irréversible.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors dark:text-white"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleDeleteTicket(showDeleteConfirm)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      

    </div>
  );
}


function EditTicketForm({ ticket, onUpdate, onCancel }) {
  const [formData, setFormData] = useState({
    subject: ticket.subject,
    description: ticket.description,
    priority: ticket.priority,
    category: ticket.category
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const priorities = [
    { value: 'basse', label: 'Basse' },
    { value: 'moyenne', label: 'Moyenne' },
    { value: 'haute', label: 'Haute' },
    { value: 'critique', label: 'Critique' }
  ];

  const categories = [
    { value: 'technique', label: 'Problème Technique' },
    { value: 'billing', label: 'Facturation' },
    { value: 'account', label: 'Compte Utilisateur' },
    { value: 'feature', label: 'Demande de Fonctionnalité' },
    { value: 'other', label: 'Autre' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Sujet
        </label>
        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priorité
          </label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {priorities.map(priority => (
              <option key={priority.value} value={priority.value}>
                {priority.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Catégorie
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Mettre à jour
        </button>
      </div>
    </form>
  );
} 