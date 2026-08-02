const express = require('express');
const router = express.Router();

const controller = require('../controllers/chatbot.controller');

router.post('/message', controller.createMessage);
router.post('/generate', controller.generateResponse);
router.post('/analyze', controller.analyzeText);

// Utilisée par le frontend pour vérifier si le chatbot est en ligne
// (toutes les 30 secondes, voir ChatbotWidget.jsx / checkOnlineStatus)
router.get('/health', (req, res) => {
    res.json({ success: true, status: 'ok' });
});

// Routes retirées temporairement (le code derrière n'existe pas encore) :
// - POST /voice        -> nécessite un vrai service de transcription + multer configuré
// - GET  /trends        -> nécessite un middleware d'auth + un controller.getTrends
// - POST /resume        -> nécessite un middleware d'auth + un controller.resume
// - POST /assistant-rh  -> nécessite un middleware d'auth + un controller.assistantRH
// - DELETE /delete-user-data/:userId -> nécessite un controller.deleteUserData
// Dis-moi si tu veux qu'on les développe, je les rajouterai proprement.

router.get('/messages/user/:userId', controller.getMessagesByUserId);

router.get('/messages/session/:sessionId', controller.getMessagesBySession);

router.post('/session', controller.createSession);

router.put('/session/:sessionId/close', controller.deactivateSession);

router.get('/sessions/active', controller.getActiveSessions);

router.get('/preferences/:userId', controller.getUserPreferences);

router.put('/preferences/:userId', controller.updateUserPreferences);

router.get('/stats', controller.getUsageStats);

router.delete('/cleanup', controller.cleanupOldMessages);

router.delete('/session/:sessionId/messages', controller.deleteMessagesBySession);


module.exports = router;