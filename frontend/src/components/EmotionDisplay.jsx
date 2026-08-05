import React, { useState, useEffect } from 'react';
import { FaHeart, FaSmile, FaFrown, FaAngry, FaSurprise, FaSadTear, FaMeh, FaExclamationTriangle, FaClock, FaShieldAlt, FaBrain, FaChartLine } from 'react-icons/fa';
import { CHATBOT_BASE_URL } from '../config/api';
const EmotionDisplay = ({ emotionData, showDetails = false, className = '', onAnalyzeSentiment }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [sentimentResult, setSentimentResult] = useState(null);

  useEffect(() => {
    if (emotionData) {
      setIsVisible(true);
      const timer = setTimeout(() => setIsVisible(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [emotionData]);

  // Fonction pour analyser le sentiment d'un texte
  const analyzeSentiment = async (text) => {
    if (!text || isAnalyzing) return;
    
    setIsAnalyzing(true);
    try {
      const response = await fetch('${CHATBOT_BASE_URL}/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text: text,
          include_analysis: true 
        })
      });

      if (response.ok) {
        const result = await response.json();
        setSentimentResult(result.data);
        
        // Appeler la fonction de callback si fournie
        if (onAnalyzeSentiment) {
          onAnalyzeSentiment(result.data);
        }
      }
    } catch (error) {
      console.error('Erreur lors de l\'analyse de sentiment:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!emotionData || !isVisible) return null;

  const getEmotionIcon = (emotionType) => {
    switch (emotionType?.toLowerCase()) {
      case 'joy':
      case 'satisfaction':
      case 'excitement':
        return <FaHeart className="text-red-500" />;
      case 'sadness':
      case 'frustration':
        return <FaSadTear className="text-blue-500" />;
      case 'anger':
        return <FaAngry className="text-red-600" />;
      case 'fear':
      case 'confusion':
        return <FaExclamationTriangle className="text-yellow-500" />;
      case 'surprise':
        return <FaSurprise className="text-purple-500" />;
      case 'confidence':
        return <FaShieldAlt className="text-green-500" />;
      case 'neutral':
        return <FaMeh className="text-gray-500" />;
      default:
        return <FaSmile className="text-gray-400" />;
    }
  };

  const getUrgencyIcon = (urgencyLevel) => {
    switch (urgencyLevel?.toLowerCase()) {
      case 'critical':
        return <FaExclamationTriangle className="text-red-600 animate-pulse" />;
      case 'high':
        return <FaClock className="text-orange-500" />;
      case 'medium':
        return <FaClock className="text-yellow-500" />;
      case 'low':
        return <FaClock className="text-green-500" />;
      default:
        return <FaClock className="text-gray-400" />;
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'negative':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'mixed':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'critical':
        return 'bg-red-100 border-red-300 text-red-800';
      case 'high':
        return 'bg-orange-100 border-orange-300 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'low':
        return 'bg-green-100 border-green-300 text-green-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-md ${className}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-3">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold text-lg">
              🧠 Analyse Émotionnelle
            </h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {/* Interface d'analyse de sentiment */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-3">
            <FaBrain className="text-purple-500" />
            <h4 className="font-semibold text-gray-800 dark:text-white">Analyse de Sentiment</h4>
          </div>
          
          <div className="space-y-3">
            <textarea
              placeholder="Tapez un texte pour analyser le sentiment..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
              rows="3"
              id="sentiment-text-input"
            />
            
            <button
              onClick={() => {
                const text = document.getElementById('sentiment-text-input').value;
                if (text.trim()) {
                  analyzeSentiment(text);
                }
              }}
              disabled={isAnalyzing}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              {isAnalyzing ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Analyse en cours...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <FaBrain className="w-4 h-4" />
                  Analyser le sentiment
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Affichage des résultats de l'analyse de sentiment */}
          {sentimentResult && (
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
              <div className="flex items-center gap-2 mb-3">
                <FaChartLine className="text-blue-500" />
                <h5 className="font-semibold text-blue-800 dark:text-blue-200">Résultats de l'Analyse</h5>
              </div>
              
              <div className="space-y-3">
                {/* Sentiment global */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Sentiment:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    sentimentResult.sentiment.overall === 'positive' ? 'bg-green-100 text-green-800' :
                    sentimentResult.sentiment.overall === 'negative' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {sentimentResult.sentiment.overall === 'positive' ? '😊 Positif' :
                     sentimentResult.sentiment.overall === 'negative' ? '😞 Négatif' :
                     '😐 Neutre'}
                  </span>
                </div>
                
                {/* Score de sentiment */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Score:</span>
                  <span className="text-sm font-mono text-gray-800 dark:text-white">
                    {sentimentResult.sentiment.score.toFixed(3)}
                  </span>
                </div>
                
                {/* Émotion détectée */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Émotion:</span>
                  <span className="text-sm font-medium text-gray-800 dark:text-white capitalize">
                    {sentimentResult.emotion.primary}
                  </span>
                </div>
                
                {/* Niveau d'urgence */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Urgence:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    sentimentResult.urgency.level === 'urgent' ? 'bg-red-100 text-red-800' :
                    sentimentResult.urgency.level === 'high' ? 'bg-orange-100 text-orange-800' :
                    sentimentResult.urgency.level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {sentimentResult.urgency.level === 'urgent' ? '🔴 Critique' :
                     sentimentResult.urgency.level === 'high' ? '🟠 Élevée' :
                     sentimentResult.urgency.level === 'medium' ? '🟡 Moyenne' :
                     '🟢 Faible'}
                  </span>
                </div>
                
                {/* Confiance */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Confiance:</span>
                  <span className="text-sm font-mono text-gray-800 dark:text-white">
                    {(sentimentResult.sentiment.confidence * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Émotion Principale */}
          {emotionData.primary_emotion && (
            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-2xl">
                {getEmotionIcon(emotionData.primary_emotion.type)}
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-white">
                  {emotionData.primary_emotion.type}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Confiance: {(emotionData.primary_emotion.confidence * 100).toFixed(1)}%
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-blue-600">
                  {(emotionData.primary_emotion.score * 100).toFixed(0)}%
                </div>
                <div className="text-xs text-gray-500 capitalize">
                  {emotionData.primary_emotion.intensity}
                </div>
              </div>
            </div>
          )}

          {/* Sentiment Global */}
          {emotionData.overall_sentiment && (
            <div className={`p-3 rounded-lg border ${getSentimentColor(emotionData.overall_sentiment)}`}>
              <div className="flex items-center justify-between">
                <span className="font-medium">Sentiment Global</span>
                <span className="text-sm font-semibold capitalize">
                  {emotionData.overall_sentiment}
                </span>
              </div>
            </div>
          )}

          {/* Niveau d'Urgence */}
          {emotionData.urgency_level && (
            <div className="flex items-center space-x-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-700">
              <div className="text-xl text-orange-600">
                {getUrgencyIcon(emotionData.urgency_level)}
              </div>
              <div className="flex-1">
                <div className="font-medium text-orange-800 dark:text-orange-200">
                  Niveau d'Urgence
                </div>
                <div className="text-sm text-orange-600 dark:text-orange-300 capitalize">
                  {emotionData.urgency_level}
                </div>
              </div>
            </div>
          )}

          {/* Satisfaction Client */}
          {emotionData.customer_satisfaction !== undefined && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
              <div className="flex items-center justify-between">
                <span className="font-medium text-blue-800 dark:text-blue-200">
                  Satisfaction Client
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-blue-200 dark:bg-blue-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${((emotionData.customer_satisfaction + 1) / 2) * 100}%`
                      }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-blue-800 dark:text-blue-200">
                    {emotionData.customer_satisfaction > 0 ? '+' : ''}
                    {(emotionData.customer_satisfaction * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Recommandée */}
          {emotionData.recommended_action && (
            <div className={`p-3 rounded-lg border ${getPriorityColor(emotionData.recommended_action.includes('CRITICAL') ? 'critical' : 'medium')}`}>
              <div className="flex items-center space-x-2">
                <FaExclamationTriangle className="text-orange-500" />
                <span className="font-medium">Action Recommandée</span>
              </div>
              <div className="text-sm mt-1 font-mono bg-white dark:bg-gray-700 px-2 py-1 rounded">
                {emotionData.recommended_action}
              </div>
            </div>
          )}

          {/* Détails Avancés */}
          {showDetails && emotionData.metadata && (
            <div className="border-t pt-3">
              <details className="group">
                <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  📊 Métadonnées Techniques
                </summary>
                <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  <div>Mots détectés: {emotionData.metadata.emotion_count || 0}</div>
                  <div>Diversité émotionnelle: {emotionData.metadata.emotion_diversity || 0}</div>
                  <div>Longueur texte: {emotionData.metadata.text_length || 0} caractères</div>
                  <div>Confiance moyenne: {(emotionData.metadata.confidence_average * 100).toFixed(1)}%</div>
                </div>
              </details>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2 text-center">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Analyse en temps réel • IA FASTCUBE
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmotionDisplay;
