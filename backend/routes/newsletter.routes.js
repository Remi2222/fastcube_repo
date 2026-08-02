const express = require('express');
const router = express.Router();
const NewsletterController = require('../controllers/newsletter.controller');


router.post('/subscribe', NewsletterController.subscribe);


router.get('/unsubscribe/:token', NewsletterController.unsubscribe);


router.get('/stats', NewsletterController.getStats);


router.get('/subscribers', NewsletterController.getAllSubscribers);


router.post('/test-email', NewsletterController.sendTestEmail);


router.post('/generate-content', NewsletterController.generateAIContent);


router.post('/send', NewsletterController.sendNewsletter);


router.post('/schedule', NewsletterController.scheduleNewsletter);


router.get('/subscriber/:email', NewsletterController.getSubscriber);

module.exports = router; 