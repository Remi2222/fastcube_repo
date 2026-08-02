import React, { useState, useEffect } from 'react';

const AdminSolutionsManager = () => {
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingSolution, setEditingSolution] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    image_url: '',
    features: '',
    benefits: '',
    use_cases: '',
    pricing_info: '',
    status: 'active'
  });
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [statuses] = useState(['active', 'inactive', 'coming_soon']);

  // Récupérer toutes les solutions
  const fetchSolutions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/solutions', {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSolutions(data.data || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des solutions:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSolutions();
  }, []);

  // Réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      image_url: '',
      features: '',
      benefits: '',
      use_cases: '',
      pricing_info: '',
      status: 'active'
    });
    setEditingSolution(null);
  };

  // Ouvrir le formulaire pour ajouter
  const handleAdd = () => {
    resetForm();
    setShowForm(true);
  };

  // Ouvrir le formulaire pour modifier
  const handleEdit = (solution) => {
    setFormData({
      title: solution.title,
      description: solution.description,
      category: solution.category,
      image_url: solution.image_url || '',
      features: solution.features ? (typeof solution.features === 'string' ? solution.features : JSON.stringify(solution.features, null, 2)) : '',
      benefits: solution.benefits || '',
      use_cases: solution.use_cases || '',
      pricing_info: solution.pricing_info || '',
      status: solution.status
    });
    setEditingSolution(solution);
    setShowForm(true);
  };

  // Fermer le formulaire
  const handleCloseForm = () => {
    setShowForm(false);
    resetForm();
  };

  // Gérer les changements du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category) {
      alert('Le titre, la description et la catégorie sont requis');
      return;
    }

    // Vérifier l'authentification
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Vous devez être connecté pour effectuer cette action');
      return;
    }

    try {
      setSubmitting(true);
      
      // Préparer les données
      const solutionData = {
        ...formData,
        features: formData.features ? formData.features.split('\n').filter(f => f.trim()) : []
      };

      const url = editingSolution 
        ? `http://localhost:5000/api/solutions/${editingSolution.id}`
        : 'http://localhost:5000/api/solutions';
      
      const method = editingSolution ? 'PUT' : 'POST';

      const token = localStorage.getItem('token');
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(solutionData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erreur HTTP:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      
      if (result.success) {
        alert(editingSolution ? 'Solution mise à jour avec succès !' : 'Solution créée avec succès !');
        handleCloseForm();
        fetchSolutions(); // Recharger la liste
      } else {
        console.error('Erreur API:', result);
        alert('Erreur: ' + (result.message || 'Erreur inconnue'));
      }
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      alert('Erreur lors de la sauvegarde: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Supprimer une solution
  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette solution ?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/solutions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        alert('Solution supprimée avec succès !');
        fetchSolutions(); // Recharger la liste
      } else {
        alert('Erreur: ' + result.message);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression: ' + error.message);
    }
  };

  // Filtrer les solutions
  const filteredSolutions = solutions.filter(solution => {
    const matchesSearch = solution.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         solution.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         solution.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !selectedStatus || solution.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-red-600 text-lg font-semibold mb-2">Erreur de chargement</div>
        <div className="text-red-500">{error}</div>
        <button 
          onClick={fetchSolutions}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* En-tête */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestion des Solutions</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Gérez vos solutions et services</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <span className="text-xl">+</span>
          {showForm ? 'Masquer le formulaire' : 'Ajouter une solution'}
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg text-center">
          <div className="text-3xl font-bold text-blue-600">{solutions.length}</div>
          <div className="text-blue-800 font-medium">Total</div>
        </div>
        <div className="bg-green-50 p-6 rounded-lg text-center">
          <div className="text-3xl font-bold text-green-600">
            {solutions.filter(s => s.status === 'active').length}
          </div>
          <div className="text-green-800 font-medium">Actives</div>
        </div>
        <div className="bg-yellow-50 p-6 rounded-lg text-center">
          <div className="text-3xl font-bold text-yellow-600">
            {solutions.filter(s => s.status === 'coming_soon').length}
          </div>
          <div className="text-yellow-800 font-medium">Bientôt disponibles</div>
        </div>
        <div className="bg-red-50 p-6 rounded-lg text-center">
          <div className="text-3xl font-bold text-red-600">
            {solutions.filter(s => s.status === 'inactive').length}
          </div>
          <div className="text-red-800 font-medium">Inactives</div>
        </div>
      </div>

      {/* Filtres */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Rechercher une solution..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="sm:w-48">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tous les statuts</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status === 'active' ? 'Active' : 
                 status === 'inactive' ? 'Inactive' : 
                 status === 'coming_soon' ? 'Bientôt disponible' : status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Formulaire d'ajout/modification */}
      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {editingSolution ? 'Modifier la Solution' : 'Ajouter une nouvelle Solution'}
          </h2>
          {editingSolution && (
            <button
              onClick={handleCloseForm}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
            >
              ×
            </button>
          )}
        </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Titre */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Titre *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Catégorie */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Catégorie *
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Statut */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Statut
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="coming_soon">Bientôt disponible</option>
                    </select>
                  </div>

                  {/* Image URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL de l'image
                    </label>
                    <input
                      type="url"
                      name="image_url"
                      value={formData.image_url}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Features */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fonctionnalités (une par ligne)
                  </label>
                  <textarea
                    name="features"
                    value={formData.features}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Surveillance 24/7&#10;Détection d'intrusion&#10;Réponse automatisée"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Bénéfices */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bénéfices
                  </label>
                  <textarea
                    name="benefits"
                    value={formData.benefits}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Cas d'usage */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cas d'usage
                  </label>
                  <textarea
                    name="use_cases"
                    value={formData.use_cases}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Tarification */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Informations tarifaires
                  </label>
                  <textarea
                    name="pricing_info"
                    value={formData.pricing_info}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Boutons */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    {editingSolution ? 'Annuler' : 'Effacer'}
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {submitting ? 'Sauvegarde...' : (editingSolution ? 'Mettre à jour' : 'Créer')}
                  </button>
                </div>
              </form>
        </div>
      )}

      {/* Liste des solutions */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Solution
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catégorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Créée le
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSolutions.map((solution) => (
                <tr key={solution.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        {solution.image_url ? (
                          <img 
                            className="h-12 w-12 rounded-lg object-cover" 
                            src={solution.image_url} 
                            alt={solution.title}
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-lg">
                            🚀
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {solution.title}
                        </div>
                        <div className="text-sm text-gray-500 line-clamp-2">
                          {solution.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {solution.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      solution.status === 'active' ? 'bg-green-100 text-green-800' :
                      solution.status === 'inactive' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {solution.status === 'active' ? 'Active' : 
                       solution.status === 'inactive' ? 'Inactive' : 
                       solution.status === 'coming_soon' ? 'Bientôt disponible' : solution.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(solution.created_at).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(solution)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(solution.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredSolutions.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              {solutions.length === 0 ? 'Aucune solution créée' : 'Aucune solution trouvée'}
            </div>
            <div className="text-gray-400 mt-2">
              {solutions.length === 0 ? 'Commencez par ajouter votre première solution' : 'Essayez de modifier vos critères de recherche'}
            </div>
          </div>
        )}
      </div>

      {/* Pagination simple */}
      {filteredSolutions.length > 0 && (
        <div className="mt-8 text-center">
          <div className="text-gray-600">
            Affichage de {filteredSolutions.length} solution{filteredSolutions.length > 1 ? 's' : ''} sur {solutions.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSolutionsManager;




