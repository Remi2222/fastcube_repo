import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaComment, FaUser, FaCalendarAlt } from 'react-icons/fa';

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTicketDetails();
  }, [id]);

  const fetchTicketDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/tickets/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setTicket(data.data);
      } else {
        alert('Erreur lors de la récupération du ticket');
        navigate('/client-dashboard');
      }
    } catch (error) {
      console.error('Erreur:', error);
      navigate('/client-dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement du ticket...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <button 
            onClick={() => navigate('/client-dashboard')}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
          >
            <FaArrowLeft className="w-4 h-4" />
            Retour au dashboard
          </button>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {ticket?.subject || 'Détails du ticket'}
          </h1>
          <p className="text-gray-600">Ticket #{ticket?.reference}</p>
        </div>

        {ticket && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Description</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
              </div>
              
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Informations</h2>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-600">Statut:</span>
                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {ticket.status}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Priorité:</span>
                    <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                      {ticket.priority}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Créé le:</span>
                    <span className="ml-2 text-gray-700">
                      {new Date(ticket.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 