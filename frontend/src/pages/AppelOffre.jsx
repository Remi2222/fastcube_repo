import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { 
  FaSearch, 
  FaFilter, 
  FaCalendarAlt, 
  FaFileAlt, 
  FaDownload, 
  FaUpload, 
  FaBuilding, 
  FaPhone, 
  FaEnvelope, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaClock, 
  FaEye, 
  FaPlus,
  FaQuestionCircle,
  FaShieldAlt,
  FaHandshake,
  FaTimes
} from 'react-icons/fa';
import { useLanguage } from '../contexts/LanguageContext';

import { useAuth } from '../contexts/AuthContext';
import { validateForm } from '../utils/formValidation';
import { API_BASE_URL } from "../config/api";

export default function AppelOffre() {
  const { lang, getTranslation } = useLanguage();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTender, setSelectedTender] = useState(null);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [searchParams] = useSearchParams();

  
  const fallbackTenders = [
    {
      id: 1,
      reference: 'ADO-2025-001',
      title: 'Développement d\'une plateforme de cybersécurité',
      category: 'IT',
      description: 'Création d\'une solution complète de monitoring et protection contre les cybermenaces',
      publishedDate: '2025-01-15',
      deadline: '2025-02-28',
      status: 'En cours',
      budget: '50,000 - 80,000 MAD',
      requirements: ['CV technique', 'Devis détaillé', 'Attestation d\'assurance', 'Références clients'],
      criteria: ['Expertise cybersécurité', 'Expérience similaire', 'Prix compétitif', 'Délai de livraison'],
      contactEmail: 'tenders@fastcube.com',
      contactPhone: '+212 6 43 77 66 35'
    },
    {
      id: 2,
      reference: 'ADO-2025-002',
      title: 'Fourniture d\'équipements réseau',
      category: 'Fourniture',
      description: 'Acquisition de switches, routeurs et équipements de sécurité réseau',
      publishedDate: '2025-01-10',
      deadline: '2025-02-15',
      status: 'En cours',
      budget: '25,000 - 40,000 MAD',
      requirements: ['Catalogue produits', 'Devis technique', 'Garantie constructeur', 'Certifications'],
      criteria: ['Qualité des équipements', 'Prix', 'Garantie', 'Support technique'],
      contactEmail: 'tenders@fastcube.com',
      contactPhone: '+212 6 43 77 66 35'
    }
  ];

  
  const fetchTenders = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${API_BASE_URL}/api/tenders`);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        
        const transformedTenders = data.data.map(tender => ({
          id: tender.id,
          reference: tender.reference || `ADO-${new Date(tender.created_at).getFullYear()}-${String(tender.id).padStart(3, '0')}`,
          title: tender.title,
          category: 'IT', 
          description: tender.description,
          publishedDate: tender.created_at,
          deadline: tender.deadline,
          status: new Date(tender.deadline) > new Date() ? 'En cours' : 'Clôturé',
          budget: tender.budget,
          requirements: ['CV technique', 'Devis détaillé', 'Attestation d\'assurance', 'Références clients'],
          criteria: ['Expertise technique', 'Expérience similaire', 'Prix compétitif', 'Délai de livraison'],
          contactEmail: 'tenders@fastcube.com',
          contactPhone: '+212 6 43 77 66 35',
          cahier_charges_path: tender.cahier_charges_path,
          cahier_charges_name: tender.cahier_charges_name
        }));
        setTenders(transformedTenders);
      } else {
        setError(data.message || 'Erreur lors de la récupération des appels d\'offre');
        setTenders(fallbackTenders);
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des appels d\'offre:', err);
      setError(err.message);
      setTenders(fallbackTenders);
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    fetchTenders();
  }, []);

  
  useEffect(() => {
    const tenderId = searchParams.get('tenderId');
    if (tenderId && tenders.length > 0) {
      const tender = tenders.find(t => t.id == tenderId);
      if (tender) {
        setSelectedTender(tender);

      }
    }
  }, [searchParams, tenders]);

  const categories = [
    { value: 'all', label: 'Toutes les catégories' },
    { value: 'IT', label: 'Informatique' },
    { value: 'Fourniture', label: 'Fourniture' },
    { value: 'Formation', label: 'Formation' },
    { value: 'Audit', label: 'Audit' }
  ];

  const statusColors = {
    'En cours': 'bg-green-100 text-green-800',
    'En évaluation': 'bg-yellow-100 text-yellow-800',
    'Clôturé': 'bg-gray-100 text-gray-800'
  };

  
  const filteredTenders = tenders.filter(tender => {
    const matchesCategory = selectedCategory === 'all' || tender.category === selectedCategory;
    const matchesSearch = (tender.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (tender.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleTenderClick = (tender) => {
    setSelectedTender(tender);
    setShowSubmissionForm(false);
    setSelectedFiles([]);
  };

  const handleSubmitProposal = async (e) => {
    e.preventDefault();
    
    
    const formData = new FormData(e.target);
    const fullName = formData.get('company');
    const address = formData.get('address');
    const phone = formData.get('phone');
    const email = formData.get('email');
    const comment = formData.get('comment');
    
    
    const formDataForValidation = { fullName, address, phone, email };
    const requiredFields = ['fullName', 'address', 'phone', 'email'];
    const validation = validateForm(formDataForValidation, requiredFields, {
      validateEmailField: 'email',
      customMessage: 'Veuillez remplir tous les champs obligatoires.'
    });

    if (!validation.isValid) {
      return;
    }
    
    
    const proposalData = new FormData();
    proposalData.append('tender_id', selectedTender.id);
    proposalData.append('full_name', fullName);
    proposalData.append('address', address);
    proposalData.append('phone', phone);
    proposalData.append('email', email);
    if (comment) {
      proposalData.append('comment', comment);
    }
    
    
    const fileInput = document.getElementById('file-upload');
    if (fileInput && fileInput.files.length > 0) {
      for (let i = 0; i < fileInput.files.length; i++) {
        proposalData.append('files', fileInput.files[i]);
      }
    }
    
    try {
      
      const response = await fetch(`${API_BASE_URL}/api/propositions`, {
        method: 'POST',
        body: proposalData
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        alert(`✅ Proposition soumise avec succès !
        
📧 Un email de confirmation a été envoyé à ${email}
📋 Référence: ${data.data.reference}
👤 Nom: ${fullName}

Nous vous contacterons dans les plus brefs délais pour la suite du processus.`);
        setShowSubmissionForm(false);
      } else {
        alert(`❌ Erreur lors de la soumission: ${data.message || 'Erreur inconnue'}`);
      }
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      alert('❌ Erreur de connexion. Veuillez réessayer.');
    }
  };

  
  const handleDownloadSpecs = async (tender) => {
    try {
      
      
      if (!tender.cahier_charges_path && !tender.cahier_charges_name) {
        alert('Aucun cahier des charges disponible pour cet appel d\'offre.');
        return;
      }

      
      if (tender.cahier_charges_path && tender.cahier_charges_name) {
        
        const response = await fetch(`${API_BASE_URL}/api/tenders/${tender.id}/download`);
        
        if (response.ok) {
          
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          
          const link = document.createElement('a');
          link.href = url;
          link.download = tender.cahier_charges_name;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          return;
        } else if (response.status === 401) {
          
          navigate(`/login?redirect=appel-offre&tenderId=${tender.id}`);
          return;
        }
      }
      
      
      const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cahier de Charges - ${tender.title || tender.titre}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        .header { text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
        .section { margin-bottom: 25px; }
        .section h2 { color: #2563eb; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
        .info-item { background: #f8fafc; padding: 15px; border-radius: 8px; }
        .list { margin-left: 20px; }
        .list li { margin-bottom: 8px; }
        .contact { background: #eff6ff; padding: 20px; border-radius: 8px; margin-top: 30px; }
        @media print { body { margin: 20px; } }
    </style>
</head>
<body>
    <div class="header">
        <h1>Cahier de Charges</h1>
        <h2>${tender.title}</h2>
        <p><strong>Référence:</strong> ${tender.reference || `ADO-${tender.id}`}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString('fr-FR')}</p>
    </div>

    <div class="section">
        <h2>Description du Projet</h2>
        <p>${tender.description}</p>
    </div>

    <div class="info-grid">
        <div class="info-item">
            <h3>Budget Estimé</h3>
            <p><strong>${tender.budget ? (tender.budget.includes('DH') ? tender.budget : `${tender.budget} DH`) : 'Non spécifié'}</strong></p>
        </div>
        <div class="info-item">
            <h3>Date Limite</h3>
            <p><strong>${new Date(tender.deadline).toLocaleDateString('fr-FR')}</strong></p>
        </div>
    </div>

    <div class="section">
        <h2>Documents Requis</h2>
        <ul class="list">
            ${tender.requirements.map(req => `<li>${req}</li>`).join('')}
        </ul>
    </div>

    <div class="section">
        <h2>Critères de Sélection</h2>
        <ul class="list">
            ${tender.criteria.map(crit => `<li>${crit}</li>`).join('')}
        </ul>
    </div>

    <div class="contact">
        <h2>Contact</h2>
        <p><strong>Email:</strong> <a href="mailto:${tender.contactEmail}">${tender.contactEmail}</a></p>
        <p><strong>Téléphone:</strong> <a href="tel:${tender.contactPhone}">${tender.contactPhone}</a></p>
    </div>
</body>
</html>
      `;

      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `Cahier_Charges_${tender.reference || tender.id}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      alert('Erreur lors du téléchargement du cahier de charges');
    }
  };

  
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                <FaFileAlt className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
                Appels d'offres en cours
              </h1>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Découvrez nos opportunités d'affaires et participez à nos appels d'offres. 
              Nous recherchons des partenaires qualifiés pour nos projets IT et cybersécurité.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                <div className="text-2xl font-bold text-blue-600">{tenders.filter(t => t.status === 'En cours').length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Appels actifs</div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
                <div className="text-2xl font-bold text-green-600">{tenders.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Total des appels</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
                <div className="text-2xl font-bold text-purple-600">24/7</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Support disponible</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column - Tenders List */}
          <div className="lg:col-span-2">
            
            {/* Filters and Search */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Rechercher un appel d'offre..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>
                
                {/* Category Filter */}
                <div className="sm:w-48">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Chargement des appels d'offre...</p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
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
                      onClick={fetchTenders}
                      className="mt-2 text-sm text-red-800 dark:text-red-200 hover:text-red-900 dark:hover:text-red-100 underline"
                    >
                      Réessayer
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tenders List */}
            {!loading && !error && (
              <div className="space-y-6">
                {filteredTenders.map(tender => (
                  <div
                    key={tender.id}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer"
                    onClick={() => handleTenderClick(tender)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
                            {tender.reference || `ADO-${tender.id}`}
                          </span>
                          <span className={`text-sm font-medium px-3 py-1 rounded-full ${statusColors[tender.status]}`}>
                            {tender.status}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{tender.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">{tender.description}</p>
                      </div>
                      <FaEye className="w-5 h-5 text-gray-400 hover:text-blue-600 transition-colors" />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <FaCalendarAlt className="w-4 h-4" />
                        <span>Publié le {new Date(tender.publishedDate).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <FaClock className="w-4 h-4" />
                        <span>Limite : {new Date(tender.deadline).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <FaBuilding className="w-4 h-4" />
                        <span>{tender.category}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Budget estimé : <span className="font-medium text-gray-900 dark:text-white">
                          {tender.budget ? (tender.budget.includes('DH') ? tender.budget : `${tender.budget} DH`) : 'Non spécifié'}
                        </span>
                      </div>
                      <button className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                        Voir les détails
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No Results */}
            {!loading && !error && filteredTenders.length === 0 && (
              <div className="text-center py-12">
                <FaFileAlt className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Aucun appel d'offre trouvé</h3>
                <p className="text-gray-600 dark:text-gray-300">Essayez de modifier vos critères de recherche.</p>
              </div>
            )}
          </div>

          {/* Right Column - Details or Submission Form */}
          <div className="lg:col-span-1">
            {selectedTender && !showSubmissionForm && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Détails de l'appel</h2>
                  <button
                    onClick={() => setSelectedTender(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FaTimesCircle className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Basic Info */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{selectedTender.title}</h3>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      <div><strong>Référence :</strong> {selectedTender.reference}</div>
                      <div><strong>Catégorie :</strong> {selectedTender.category}</div>
                      <div><strong>Budget :</strong> {selectedTender.budget ? (selectedTender.budget.includes('DH') ? selectedTender.budget : `${selectedTender.budget} DH`) : 'Non spécifié'}</div>
                      <div><strong>Statut :</strong> 
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs ${statusColors[selectedTender.status]}`}>
                          {selectedTender.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Requirements */}
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Documents requis</h4>
                    <ul className="space-y-2">
                      {selectedTender.requirements.map((req, index) => (
                        <li key={`req-item-${index}`} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                          <FaCheckCircle className="w-4 h-4 text-green-500" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Criteria */}
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Critères de sélection</h4>
                    <ul className="space-y-2">
                      {selectedTender.criteria.map((criteria, index) => (
                        <li key={`criteria-item-${index}`} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                          <FaCheckCircle className="w-4 h-4 text-blue-500" />
                          {criteria}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Contact */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Contact</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <FaEnvelope className="w-4 h-4 text-gray-400" />
                        <a href={`mailto:${selectedTender.contactEmail}`} className="text-blue-600 hover:underline">
                          {selectedTender.contactEmail}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaPhone className="w-4 h-4 text-gray-400" />
                        <a href={`tel:${selectedTender.contactPhone}`} className="text-blue-600 hover:underline">
                          {selectedTender.contactPhone}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    <button 
                      onClick={() => handleDownloadSpecs(selectedTender)}
                      className="w-full inline-flex items-center px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                    >
                      <FaDownload className="w-4 h-4" />
                      Télécharger le cahier de charges
                    </button>

                    <button 
                      onClick={() => {
                        console.log('🔍 Utilisateur connecté:', isLoggedIn);
                        
                        if (!isLoggedIn) {
                          console.log('❌ Utilisateur non connecté, redirection vers login');
                          // Rediriger vers la page de connexion avec le tenderId
                          navigate(`/login?redirect=appel-offre&tenderId=${selectedTender.id}`);
                          return;
                        }
                        
                        console.log('✅ Utilisateur connecté, ouverture du formulaire');
                        setShowSubmissionForm(true);
                      }}
                      className="w-full inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <FaUpload className="w-4 h-4" />
                      Soumettre une offre
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showSubmissionForm && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Soumettre une offre</h2>
                  <button
                    onClick={() => setShowSubmissionForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FaTimesCircle className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmitProposal} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      name="company"
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="Votre nom complet"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Adresse *
                    </label>
                    <input
                      type="text"
                      name="address"
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="Adresse complète "
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Téléphone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="+212 666666666"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="client@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Fichiers (PDF, ZIP) *
                    </label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center">
                      <FaUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        Glissez vos fichiers ici ou cliquez pour sélectionner
                      </p>
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.zip,.doc,.docx"
                        className="hidden"
                        onChange={handleFileUpload}
                        id="file-upload"
                      />
                      <label htmlFor="file-upload" className="inline-flex items-center px-3 py-2 bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-medium rounded-lg transition-all duration-200 text-sm cursor-pointer">
                        Choisir des fichiers
                      </label>
                      
                      {/* Affichage des fichiers sélectionnés */}
                      {selectedFiles.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Fichiers sélectionnés ({selectedFiles.length}) :
                          </p>
                          <div className="space-y-1">
                            {selectedFiles.map((file, index) => (
                              <div key={`file-item-${index}`} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2">
                                <span className="text-sm text-gray-600 dark:text-gray-300 truncate">
                                  {file.name}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== index))}
                                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                >
                                  <FaTimes className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Commentaire (optionnel)
                    </label>
                    <textarea
                      name="comment"
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="Informations complémentaires..."
                    />
                  </div>

                  <button type="submit" className="w-full inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                    Envoyer la proposition
                  </button>
                </form>
              </div>
            )}

            {/* FAQ Section */}
            {!selectedTender && !showSubmissionForm && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <FaQuestionCircle className="w-6 h-6 text-blue-600" />
                  Questions fréquentes
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Comment soumettre une offre ?</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Cliquez sur "Voir les détails" puis "Soumettre une offre" pour accéder au formulaire de soumission.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Quels documents sont requis ?</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Les documents varient selon l'appel d'offre. Consultez les détails de chaque appel pour la liste complète.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Comment contacter l'équipe ?</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Utilisez les coordonnées fournies dans chaque appel d'offre ou contactez-nous via notre formulaire de contact.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer with Transparency Clause */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <FaShieldAlt className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Transparence et éthique</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6">
              Nous respectons les principes de transparence, égalité et concurrence dans la passation de nos marchés. 
              Chaque appel d'offre est traité de manière équitable et objective.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <FaHandshake className="w-4 h-4" />
                Transparence
              </span>
              <span className="flex items-center gap-1">
                <FaCheckCircle className="w-4 h-4" />
                Égalité
              </span>
              <span className="flex items-center gap-1">
                <FaShieldAlt className="w-4 h-4" />
                Concurrence
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 