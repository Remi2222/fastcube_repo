import React, { useState } from 'react';
import { FaSmile, FaFrown, FaMeh, FaHeart, FaAngry, FaSadTear, FaLaugh, FaSurprise } from 'react-icons/fa';

const SentimentTest = () => {
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const testPhrases = [
    "Je suis vraiment content de ce service !",
    "C'est terrible, rien ne fonctionne !",
    "Bonjour, j'ai une question technique",
    "Merci beaucoup pour votre aide !",
    "Je suis frustré par ce problème",
    "Excellent travail, bravo !",
    "Je ne comprends pas cette fonctionnalité",
    "C'est génial, j'adore !"
  ];

  const analyzeSentiment = async () => {
    if (!text.trim()) {
      setError('Veuillez entrer du texte à analyser');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8001/chatbot/sentiment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          user_id: 8
        })
      });

      const data = await response.json();

      if (data.success) {
        setAnalysis(data.data);
      } else {
        setError(data.message || 'Erreur lors de l\'analyse');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return <FaSmile className="text-green-500 text-4xl" />;
      case 'negative':
        return <FaFrown className="text-red-500 text-4xl" />;
      default:
        return <FaMeh className="text-gray-500 text-4xl" />;
    }
  };

  const getEmotionIcon = (emotion) => {
    switch (emotion) {
      case 'joy':
      case 'happiness':
        return <FaLaugh className="text-yellow-500" />;
      case 'sadness':
        return <FaSadTear className="text-blue-500" />;
      case 'anger':
        return <FaAngry className="text-red-500" />;
      case 'excitement':
        return <FaHeart className="text-pink-500" />;
      case 'surprise':
        return <FaSurprise className="text-purple-500" />;
      default:
        return <FaMeh className="text-gray-500" />;
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'negative':
        return 'bg-red-100 border-red-300 text-red-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getScoreColor = (score) => {
    if (score > 0.3) return 'text-green-600';
    if (score < -0.3) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🧠 Test d'Analyse de Sentiment
          </h1>
          <p className="text-xl text-gray-600">
            Testez l'analyse de sentiment de notre chatbot intelligent
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Entrez votre texte
            </h2>

            <div className="space-y-4">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Tapez votre message ici pour analyser le sentiment..."
                className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />

              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-medium text-gray-700">Phrases de test :</span>
                {testPhrases.map((phrase, index) => (
                  <button
                    key={index}
                    onClick={() => setText(phrase)}
                    className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
                  >
                    {phrase.substring(0, 30)}...
                  </button>
                ))}
              </div>

              <button
                onClick={analyzeSentiment}
                disabled={loading || !text.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Analyse en cours...
                  </>
                ) : (
                  'Analyser le sentiment'
                )}
              </button>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
            </div>
          </div>

          {}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Résultats de l'analyse
            </h2>

            {analysis ? (
              <div className="space-y-6">
                {/* Sentiment principal */}
                <div className={`border-2 rounded-xl p-6 ${getSentimentColor(analysis.sentiment.sentiment)}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Sentiment Principal</h3>
                    {getSentimentIcon(analysis.sentiment.sentiment)}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Type :</span>
                      <span className="font-semibold capitalize">{analysis.sentiment.sentiment}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Score :</span>
                      <span className={`font-semibold ${getScoreColor(analysis.sentiment.score)}`}>
                        {analysis.sentiment.score.toFixed(3)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Confiance :</span>
                      <span className="font-semibold">
                        {(analysis.sentiment.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Émotions détectées */}
                {analysis.sentiment.emotions.length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Émotions détectées</h3>
                    <div className="flex flex-wrap gap-2">
                      {analysis.sentiment.emotions.map((emotion, index) => (
                        <div key={index} className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border">
                          {getEmotionIcon(emotion)}
                          <span className="text-sm font-medium capitalize">{emotion}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Détails de l'analyse */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Détails de l'analyse</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Mots positifs :</span>
                      <span className="font-semibold text-green-600">
                        {analysis.sentiment.details.positive.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mots négatifs :</span>
                      <span className="font-semibold text-red-600">
                        {analysis.sentiment.details.negative.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mots neutres :</span>
                      <span className="font-semibold text-gray-600">
                        {analysis.sentiment.details.neutral.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Score emoji :</span>
                      <span className="font-semibold text-purple-600">
                        {analysis.sentiment.details.emoji.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Analyse contextuelle */}
                {analysis.contextual && (
                  <div className="bg-blue-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-blue-900 mb-4">Analyse contextuelle</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Tendance :</span>
                        <span className="font-semibold capitalize">
                          {analysis.contextual.historicalContext?.trend || 'stable'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sentiment moyen :</span>
                        <span className={`font-semibold ${getScoreColor(analysis.contextual.historicalContext?.averageSentiment || 0)}`}>
                          {(analysis.contextual.historicalContext?.averageSentiment || 0).toFixed(3)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Réponse adaptée */}
                {analysis.adapted_response && (
                  <div className="bg-green-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-green-900 mb-4">Réponse adaptée</h3>
                    <p className="text-green-800 italic">"{analysis.adapted_response}"</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <FaMeh className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  Entrez du texte et cliquez sur "Analyser" pour voir les résultats
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SentimentTest;
