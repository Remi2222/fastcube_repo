import React, { useState } from 'react';
import { FaBrain, FaChartLine, FaSmile, FaFrown, FaMeh, FaExclamationTriangle, FaClock, FaShieldAlt } from 'react-icons/fa';
import { CHATBOT_BASE_URL } from '../config/api';
const SentimentAnalysisTest = () => {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Exemples de textes pour tester
  const exampleTexts = [
    "Je suis très satisfait de ce service, c'est excellent !",
    "Ce produit est terrible, je suis très déçu de la qualité.",
    "Le service est correct, rien de spécial.",
    "URGENT : J'ai un problème critique avec votre système !",
    "Merci beaucoup, votre équipe est très professionnelle.",
    "Je suis frustré par le manque de réactivité.",
    "Votre solution a dépassé mes attentes, bravo !"
  ];

  const analyzeSentiment = async (textToAnalyze) => {
    if (!textToAnalyze.trim()) return;
    
    setIsAnalyzing(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await fetch('${CHATBOT_BASE_URL}/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text: textToAnalyze,
          include_analysis: true 
        })
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data.data);
      } else {
        const errorData = await response.json();
        setError(`Erreur ${response.status}: ${errorData.detail || 'Erreur inconnue'}`);
      }
    } catch (err) {
      setError(`Erreur de connexion: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    analyzeSentiment(text);
  };

  const handleExampleClick = (exampleText) => {
    setText(exampleText);
    analyzeSentiment(exampleText);
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return <FaSmile className="w-6 h-6 text-green-500" />;
      case 'negative':
        return <FaFrown className="w-6 h-6 text-red-500" />;
      case 'neutral':
        return <FaMeh className="w-6 h-6 text-gray-500" />;
      default:
        return <FaMeh className="w-6 h-6 text-gray-400" />;
    }
  };

  const getUrgencyIcon = (urgency) => {
    switch (urgency) {
      case 'urgent':
        return <FaExclamationTriangle className="w-5 h-5 text-red-600" />;
      case 'high':
        return <FaClock className="w-5 h-5 text-orange-500" />;
      case 'medium':
        return <FaClock className="w-5 h-5 text-yellow-500" />;
      case 'low':
        return <FaClock className="w-5 h-5 text-green-500" />;
      default:
        return <FaClock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getEmotionIcon = (emotion) => {
    switch (emotion) {
      case 'joy':
        return <FaSmile className="w-5 h-5 text-yellow-500" />;
      case 'sadness':
        return <FaFrown className="w-5 h-5 text-blue-500" />;
      case 'anger':
        return <FaExclamationTriangle className="w-5 h-5 text-red-500" />;
      case 'fear':
        return <FaExclamationTriangle className="w-5 h-5 text-purple-500" />;
      case 'surprise':
        return <FaExclamationTriangle className="w-5 h-5 text-pink-500" />;
      case 'confidence':
        return <FaShieldAlt className="w-5 h-5 text-green-500" />;
      default:
        return <FaMeh className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            🧠 Test de l'Analyse de Sentiment
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Testez notre API d'analyse de sentiment intelligente
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Interface de test */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <FaBrain className="w-8 h-8 text-purple-500" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Analyse de Sentiment
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Texte à analyser
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Tapez un texte pour analyser le sentiment..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white bg-white dark:bg-gray-700 resize-none"
                  rows="6"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isAnalyzing || !text.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isAnalyzing ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    Analyse en cours...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <FaBrain className="w-5 h-5" />
                    Analyser le sentiment
                  </span>
                )}
              </button>
            </form>

            {/* Exemples */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                Exemples de test
              </h3>
              <div className="space-y-2">
                {exampleTexts.map((example, index) => (
                  <button
                    key={`example-item-${index}`}
                    onClick={() => handleExampleClick(example)}
                    className="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors text-sm text-gray-700 dark:text-gray-300"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Résultats */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <FaChartLine className="w-8 h-8 text-blue-500" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Résultats de l'Analyse
              </h2>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-4">
                <p className="font-medium">Erreur</p>
                <p className="text-sm">{error}</p>
              </div>
            )}

            {result ? (
              <div className="space-y-6">
                {/* Sentiment global */}
                <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
                  <div className="flex justify-center mb-3">
                    {getSentimentIcon(result.sentiment.overall)}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                    Sentiment {result.sentiment.overall === 'positive' ? 'Positif' : 
                               result.sentiment.overall === 'negative' ? 'Négatif' : 'Neutre'}
                  </h3>
                  <p className="text-2xl font-mono text-blue-600 dark:text-blue-400">
                    Score: {result.sentiment.score.toFixed(3)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Confiance: {(result.sentiment.confidence * 100).toFixed(1)}%
                  </p>
                </div>

                {/* Émotion et urgence */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-700">
                    <div className="flex items-center gap-2 mb-2">
                      {getEmotionIcon(result.emotion.primary)}
                      <span className="font-semibold text-yellow-800 dark:text-yellow-200">
                        Émotion
                      </span>
                    </div>
                    <p className="text-lg font-medium text-yellow-800 dark:text-yellow-200 capitalize">
                      {result.emotion.primary}
                    </p>
                    {result.emotion.secondary && (
                      <p className="text-sm text-yellow-600 dark:text-yellow-300 capitalize">
                        Secondaire: {result.emotion.secondary}
                      </p>
                    )}
                  </div>

                  <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-700">
                    <div className="flex items-center gap-2 mb-2">
                      {getUrgencyIcon(result.urgency.level)}
                      <span className="font-semibold text-orange-800 dark:text-orange-200">
                        Urgence
                      </span>
                    </div>
                    <p className="text-lg font-medium text-orange-800 dark:text-orange-200 capitalize">
                      {result.urgency.level}
                    </p>
                    <p className="text-sm text-orange-600 dark:text-orange-300">
                      Confiance: {(result.urgency.confidence * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>

                {/* Analyse détaillée */}
                {result.analysis && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                      Analyse Détaillée
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                        <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">
                          Mots Positifs
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-300">
                          {result.analysis.positive_words.length > 0 
                            ? result.analysis.positive_words.join(', ')
                            : 'Aucun mot positif détecté'}
                        </p>
                      </div>
                      
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-700">
                        <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">
                          Mots Négatifs
                        </p>
                        <p className="text-xs text-red-600 dark:text-red-300">
                          {result.analysis.negative_words.length > 0 
                            ? result.analysis.negative_words.join(', ')
                            : 'Aucun mot négatif détecté'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        <span className="font-medium">Nombre de mots:</span> {result.analysis.word_count}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        <span className="font-medium">Émotion détectée:</span> {result.analysis.has_emotion ? 'Oui' : 'Non'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <FaBrain className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">Aucune analyse effectuée</p>
                <p className="text-sm">Tapez un texte et cliquez sur "Analyser" pour commencer</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SentimentAnalysisTest;

















