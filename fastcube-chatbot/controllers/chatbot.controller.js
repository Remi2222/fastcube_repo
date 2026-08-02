const ChatbotMemoryModel = require('../models/chatbot-memory.model');
const ChatbotSessionsModel = require('../models/chatbot-session.model');
const ChatbotMessagesModel = require('../models/chatbot-message.model');
const {
    askGemini,
    formatResponse
} = require('../services/chatbot.service');



const {
    analyzeTrends,
    logUserInteraction
} = require('../services/analytics.service');

async function createMessage(req, res) {
    try {
        const { session_id, content, message_type = 'user', user_id = null } = req.body;

        let finalUserId = user_id || req.user?.id;

        if (!finalUserId && session_id) {
            try {
                console.log(`🔍 Tentative de récupération de l'ID client depuis la session: ${session_id}`);
                const session = await ChatbotSessionsModel.getSessionById(session_id);
                console.log('📋 Session récupérée:', session);
                if (session && session.user_id) {
                    finalUserId = session.user_id;
                    console.log(`✅ ID client récupéré depuis la session: ${finalUserId}`);
                } else {
                    console.log('⚠️ Aucun user_id trouvé dans la session');
                }
            } catch (error) {
                console.warn('⚠️ Impossible de récupérer l\'ID client depuis la session:', error.message);
            }
        }

        if (!finalUserId) {
            finalUserId = 8;
            console.log('⚠️ Utilisation de l\'ID par défaut (8)');
        }

        if (!session_id || !content) {
            return res.status(400).json({
                success: false,
                message: 'session_id et content sont requis'
            });
        }

        let botResponse = null;

        if (message_type === 'user') {
            const startTime = Date.now();

            try {
                const aiResponse = await askGemini(content);
                const processingTime = Date.now() - startTime;

                botResponse = aiResponse?.trim() || 'Désolé, je n\'ai pas pu générer de réponse.';

                console.log("✅ BOT TEXT FINAL:", botResponse);
                console.log(`⏱️ Temps de traitement: ${processingTime}ms`);

                await ChatbotMessagesModel.createMessage({
                    session_id,
                    user_id: finalUserId,
                    message_type: 'bot',
                    content: botResponse,
                    confidence: 0.8,
                    context_type: 'ai_response'
                });

                console.log('✅ Réponse du bot sauvegardée');

            } catch (error) {
                console.error('❌ Erreur lors de la génération de réponse:', error.message);

                botResponse = `Bonjour ${req.user?.first_name ? req.user.first_name.charAt(0).toUpperCase() + req.user.first_name.slice(1) : ''} ! Je suis l'assistant IA de FastCube — comment puis-je vous aider aujourd'hui ?`;

                await ChatbotMessagesModel.createMessage({
                    session_id,
                    user_id: finalUserId,
                    message_type: 'bot',
                    content: botResponse,
                    confidence: 0.5,
                    context_type: 'fallback_response'
                });
            }
        }

        const messageResult = await ChatbotMessagesModel.createMessage({
            session_id,
            user_id: finalUserId,
            message_type,
            content,
            confidence: 1.0,
            context_type: 'user_input'
        });

        console.log('✅ Message utilisateur sauvegardé:', messageResult);

        res.status(201).json({
            success: true,
            data: {
                id: messageResult.id,
                bot_response: botResponse ? botResponse : null
            },
            message: 'Message créé avec succès'
        });

    } catch (error) {
        console.error('Erreur lors de la création du message:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création du message',
            error: error.message
        });
    }
}
async function generateResponse(req, res) {
    try {
        const {
            question,
            user_id = 8,
            session_id = null
        } = req.body;

        if (!question) {
            return res.status(400).json({
                success: false,
                message: "Question requise"
            });
        }

        const startTime = Date.now();
        const sessionId = session_id || `session-${user_id}-${Date.now()}`;

        const aiResponse = await askGemini(question);

        const botText =
            aiResponse?.trim() ||
            "Désolé, je n'ai pas pu générer de réponse.";

        await ChatbotMessagesModel.createMessage({
            session_id: sessionId,
            user_id,
            message_type: "user",
            content: question,
            confidence: 1,
            context_type: "user_input"
        });

        await ChatbotMessagesModel.createMessage({
            session_id: sessionId,
            user_id,
            message_type: "bot",
            content: botText,
            confidence: 0.8,
            context_type: "ai_response"
        });

        if (typeof logUserInteraction === "function") {
            await logUserInteraction(
                user_id,
                sessionId,
                question,
                "chat",
                0.8
            );
        }

        res.json({
            success: true,
            data: {
                response: formatResponse(botText),
                processing_time_ms: Date.now() - startTime,
                confidence: 0.8
            }
        });

    } catch (error) {
        console.error("Erreur generateResponse :", error);

        res.status(500).json({
            success: false,
            message: "Erreur lors de la génération de réponse",
            error: error.message
        });
    }
}

async function analyzeText(req, res) {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ success: false, message: 'Texte requis pour l\'analyse' });
        }

        const analysis = {
            sentiment: 'positive',
            confidence: 0.8,
            keywords: text.split(' ').slice(0, 5),
            language: 'fr',
            length: text.length
        };

        res.json({ success: true, data: analysis });

    } catch (error) {
        console.error('Erreur lors de l\'analyse:', error);
        res.status(500).json({ success: false, message: 'Erreur lors de l\'analyse', error: error.message });
    }
}

async function getMessagesByUserId(req, res) {
    try {
        const { userId } = req.params;
        const { limit = 50 } = req.query;

        const messages = await ChatbotMessagesModel.getMessagesByUserId(userId, parseInt(limit));

        res.json({ success: true, data: messages, count: messages.length });

    } catch (error) {
        console.error('Erreur lors de la récupération des messages:', error);
        res.status(500).json({ success: false, message: 'Erreur lors de la récupération des messages', error: error.message });
    }
}


async function getMessagesBySession(req, res) {
    try {
        const { sessionId } = req.params;
        const { limit = 50 } = req.query;

        const messages = await ChatbotMessagesModel.getMessagesBySession(sessionId, parseInt(limit));

        res.json({ success: true, data: messages, count: messages.length });

    } catch (error) {
        console.error('Erreur lors de la récupération des messages de session:', error);
        res.status(500).json({ success: false, message: 'Erreur lors de la récupération des messages de session', error: error.message });
    }
}

async function createSession(req, res) {
    try {
        const { user_id = null } = req.body;
        const userIp = req.ip || req.connection.remoteAddress;
        const userAgent = req.get('User-Agent') || 'Unknown';

        const sessionId = `session-${user_id ? 'user' : 'anonymous'}-${Date.now()}`;
        await ChatbotSessionsModel.createSession({
            user_id,
            session_id: sessionId,
            metadata: { userIp, userAgent }
        });

        res.status(201).json({ success: true, data: { session_id: sessionId }, message: 'Session créée avec succès' });

    } catch (error) {
        console.error('Erreur lors de la création de session:', error);
        res.status(500).json({ success: false, message: 'Erreur lors de la création de session', error: error.message });
    }
}
async function deactivateSession(req, res) {
    try {
        const { sessionId } = req.params;
        const success = await ChatbotMessagesModel.deactivateSession(sessionId);

        if (!success) {
            return res.status(404).json({ success: false, message: 'Session non trouvée' });
        }

        res.json({ success: true, message: 'Session désactivée avec succès' });

    } catch (error) {
        console.error('Erreur lors de la désactivation de session:', error);
        res.status(500).json({ success: false, message: 'Erreur lors de la désactivation de session', error: error.message });
    }
}
async function getActiveSessions(req, res) {
    try {
        const { userId } = req.params;
        const sessions = await ChatbotMessagesModel.getActiveSessions(userId);
        res.json({ success: true, data: sessions, count: sessions.length });
    } catch (error) {
        console.error('Erreur lors de la récupération des sessions:', error);
        res.status(500).json({ success: false, message: 'Erreur lors de la récupération des sessions', error: error.message });
    }
}
async function getUserPreferences(req, res) {
    try {
        const { userId } = req.params;
        const preferences = await ChatbotMessagesModel.getUserPreferences(userId);
        res.json({ success: true, data: preferences });
    } catch (error) {
        console.error('Erreur lors de la récupération des préférences:', error);
        res.status(500).json({ success: false, message: 'Erreur lors de la récupération des préférences', error: error.message });
    }
}
async function updateUserPreferences(req, res) {
    try {
        const { userId } = req.params;
        const { preferences } = req.body;

        if (!preferences) {
            return res.status(400).json({ success: false, message: 'Préférences requises' });
        }

        await ChatbotMessagesModel.updateUserPreferences(userId, preferences);

        res.json({ success: true, message: 'Préférences mises à jour avec succès' });

    } catch (error) {
        console.error('Erreur lors de la mise à jour des préférences:', error);
        res.status(500).json({ success: false, message: 'Erreur lors de la mise à jour des préférences', error: error.message });
    }
}
async function getUsageStats(req, res) {
    try {
        const { userId } = req.params;
        const stats = await ChatbotMessagesModel.getUsageStats(userId);
        res.json({ success: true, data: stats });
    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques:', error);
        res.status(500).json({ success: false, message: 'Erreur lors de la récupération des statistiques', error: error.message });
    }
}
async function cleanupOldMessages(req, res) {
    try {
        const { daysOld = 30 } = req.body;
        const deletedCount = await ChatbotMessagesModel.cleanupOldMessages(daysOld);
        res.json({ success: true, message: `${deletedCount} anciens messages supprimés`, deleted_count: deletedCount });
    } catch (error) {
        console.error('Erreur lors du nettoyage:', error);
        res.status(500).json({ success: false, message: 'Erreur lors du nettoyage', error: error.message });
    }
}
async function deleteMessagesBySession(req, res) {
    try {
        const { sessionId } = req.params;
        const deletedCount = await ChatbotMessagesModel.deleteMessagesBySession(sessionId);
        res.json({ success: true, message: `${deletedCount} messages supprimés`, deleted_count: deletedCount });
    } catch (error) {
        console.error('Erreur lors de la suppression des messages:', error);
        res.status(500).json({ success: false, message: 'Erreur lors de la suppression des messages', error: error.message });
    }
}
module.exports = {
    createMessage,
    generateResponse,
    analyzeText,
    getMessagesByUserId,
    getMessagesBySession,
    createSession,
    deactivateSession,
    getActiveSessions,
    getUserPreferences,
    updateUserPreferences,
    getUsageStats,
    cleanupOldMessages,
    deleteMessagesBySession
};