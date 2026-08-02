import { useEffect, useState } from "react";
import { FaTicketAlt, FaClock, FaExclamationTriangle, FaCheckCircle, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTicket, setEditingTicket] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/tickets/mine", {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des tickets');
      }
      
      const data = await response.json();
      setTickets(data.data || []);
    } catch (err) {
      console.error('Erreur:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ouvert':
        return 'bg-blue-100 text-blue-700';
      case 'en_cours':
        return 'bg-yellow-100 text-yellow-700';
      case 'resolu':
        return 'bg-green-100 text-green-700';
      case 'ferme':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critique':
        return 'bg-red-100 text-red-700';
      case 'haute':
        return 'bg-orange-100 text-orange-700';
      case 'moyenne':
        return 'bg-yellow-100 text-yellow-700';
      case 'basse':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleEditTicket = (ticket) => {
    setEditingTicket(ticket);
  };

  const handleUpdateTicket = async (updatedData) => {
    try {
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
      const response = await fetch(`http://localhost:5000/api/tickets/${ticketId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        
        const updatedTickets = tickets.filter(ticket => ticket.id !== ticketId);
        setTickets(updatedTickets);
        
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

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Chargement des tickets...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="text-center py-8">
          <div className="text-red-500 mb-4">
            <FaExclamationTriangle className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Erreur</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchTickets}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <FaTicketAlt className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="font-bold text-xl text-gray-900">Mes Tickets</h2>
            <p className="text-sm text-gray-600">
              {tickets.length} ticket{tickets.length !== 1 ? 's' : ''} au total
            </p>
          </div>
        </div>
        <Link
          to="/new-ticket"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          Nouveau Ticket
        </Link>
      </div>

      {tickets.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaTicketAlt className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun ticket</h3>
          <p className="text-gray-600 mb-6">
            Vous n'avez pas encore créé de tickets de support.
          </p>
          <Link
            to="/new-ticket"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Créer votre premier ticket
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{ticket.subject}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {ticket.description}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                    {ticket.status}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <FaClock className="w-3 h-3" />
                    <span>Créé le {formatDate(ticket.created_at)}</span>
                  </div>
                  {ticket.reference && (
                    <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                      {ticket.reference}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Link
                    to={`/ticket/${ticket.id}`}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <FaEye className="w-3 h-3" />
                    <span>Voir</span>
                  </Link>
                  
                  {/* Boutons d'action */}
                  <button
                    onClick={() => handleEditTicket(ticket)}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors"
                    title="Modifier"
                  >
                    <FaEdit className="w-3 h-3" />
                    <span>Modifier</span>
                  </button>
                  
                  <button
                    onClick={() => setShowDeleteConfirm(ticket.id)}
                    className="flex items-center gap-1 text-red-600 hover:text-red-700 transition-colors"
                    title="Supprimer"
                  >
                    <FaTrash className="w-3 h-3" />
                    <span>Supprimer</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {}
      {editingTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Modifier le ticket</h3>
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
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaTrash className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Confirmer la suppression</h3>
              <p className="text-gray-600 mb-6">
                Êtes-vous sûr de vouloir supprimer ce ticket ? Cette action est irréversible.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
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