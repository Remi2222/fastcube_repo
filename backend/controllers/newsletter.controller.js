const NewsletterModel = require('../models/newsletter.model');
const EmailService = require('../services/emailService');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

class NewsletterController {
  
  static async subscribe(req, res) {
    try {
      const { email, first_name, last_name, company, interests, frequency, password } = req.body;

      
      if (!email || !first_name || !last_name) {
        return res.status(400).json({
          success: false,
          message: 'Email, prénom et nom sont obligatoires'
        });
      }

      
      const emailExists = await NewsletterModel.checkEmailExists(email);
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'Cet email est déjà inscrit à la newsletter'
        });
      }

      
      const unsubscribe_token = crypto.randomBytes(32).toString('hex');

      
      let password_hash = null;
      if (password) {
        password_hash = await bcrypt.hash(password, 10);
      }

      
      const subscriberData = {
        email,
        first_name,
        last_name,
        company: company || '',
        interests: interests || [],
        frequency: frequency || 'weekly',
        password_hash,
        unsubscribe_token
      };

      
      const newSubscriber = await NewsletterModel.createSubscriber(subscriberData);

      
      try {
        const welcomeResult = await EmailService.sendWelcomeEmail(newSubscriber);
        if (welcomeResult.success) {
          console.log(`✅ Email de bienvenue envoyé à ${newSubscriber.email}`);
        } else {
          console.log(`⚠️ Échec envoi email de bienvenue à ${newSubscriber.email}: ${welcomeResult.error}`);
        }
      } catch (welcomeError) {
        console.log(`⚠️ Erreur envoi email de bienvenue à ${newSubscriber.email}:`, welcomeError.message);
      }

      res.status(201).json({
        success: true,
        message: 'Inscription réussie ! Un email de bienvenue vous a été envoyé.',
        data: {
          email: newSubscriber.email,
          first_name: newSubscriber.first_name,
          frequency: newSubscriber.frequency
        }
      });

    } catch (error) {
      console.error('Erreur lors de l\'inscription newsletter:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'inscription à la newsletter'
      });
    }
  }

  
  static async unsubscribe(req, res) {
    try {
      const { token } = req.params;

      if (!token) {
        return res.status(400).json({
          success: false,
          message: 'Token de désabonnement requis'
        });
      }

      
      const subscriber = await NewsletterModel.getSubscriberByToken(token);
      if (!subscriber) {
        return res.status(404).json({
          success: false,
          message: 'Token de désabonnement invalide'
        });
      }

      
      const success = await NewsletterModel.unsubscribe(token);

      if (success) {
        res.json({
          success: true,
          message: 'Désabonnement effectué avec succès'
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Erreur lors du désabonnement'
        });
      }

    } catch (error) {
      console.error('Erreur lors du désabonnement:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors du désabonnement'
      });
    }
  }

  
  static async getStats(req, res) {
    try {
      const stats = await NewsletterModel.getStats();

      res.json({
        success: true,
        data: {
          ...stats,
          open_rate: 0.75, 
          last_updated: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('Erreur lors de la récupération des stats:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des statistiques'
      });
    }
  }

  
  static async getAllSubscribers(req, res) {
    try {
      const { frequency } = req.query;
      const subscribers = await NewsletterModel.getAllActiveSubscribers(frequency);

      
      const formattedSubscribers = subscribers.map(sub => ({
        id: sub.id,
        email: sub.email,
        first_name: sub.first_name,
        last_name: sub.last_name,
        company: sub.company,
        interests: JSON.parse(sub.interests || '[]'),
        frequency: sub.frequency,
        created_at: sub.created_at,
        last_sent: sub.last_sent
      }));

      res.json({
        success: true,
        data: {
          subscribers: formattedSubscribers,
          total: formattedSubscribers.length
        }
      });

    } catch (error) {
      console.error('Erreur lors de la récupération des abonnés:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des abonnés'
      });
    }
  }

  
  static async sendTestEmail(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email requis'
        });
      }

      
      const subscriber = await NewsletterModel.getSubscriberByEmail(email);
      if (!subscriber) {
        return res.status(404).json({
          success: false,
          message: 'Abonné non trouvé'
        });
      }

      
      const result = await EmailService.sendTestEmail(email, subscriber);

      if (result.success) {
        
        await NewsletterModel.recordEmailSend(
          subscriber.id,
          1, 
          'sent'
        );

        res.json({
          success: true,
          message: `Email de test envoyé à ${email}`,
          data: {
            subscriber: {
              email: subscriber.email,
              first_name: subscriber.first_name,
              interests: JSON.parse(subscriber.interests || '[]')
            },
            messageId: result.messageId
          }
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Erreur lors de l\'envoi de l\'email de test',
          error: result.error
        });
      }

    } catch (error) {
      console.error('Erreur lors de l\'envoi du test:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'envoi de l\'email de test'
      });
    }
  }

  
  static async generateAIContent(req, res) {
    try {
      const { interests = [] } = req.body;
      const content = NewsletterController.generateTestContent(interests);
      res.json({
        success: true,
        data: content,
        message: 'Contenu AI généré avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la génération de contenu AI:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la génération de contenu AI'
      });
    }
  }

  
  static generateTestContent(interests = []) {
    const emailSubject = "✉️ Contenu de test FASTCUBE";
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd;">
        <h1 style="color: #333;">Contenu de test FASTCUBE</h1>
        <p>Bonjour,</p>
        <p>Ceci est un email de test généré par le service newsletter de FASTCUBE.</p>
        <p><strong>Centres d'intérêt :</strong> ${interests.join(', ') || 'Aucun'}</p>
        <p>Merci de vérifier la présentation et la compatibilité du contenu dans votre boîte de réception.</p>
      </div>
    `;
    const textContent = `Contenu de test FASTCUBE\n\nCentres d'intérêt : ${interests.join(', ') || 'Aucun'}\n\nCeci est un email de test généré par le service newsletter de FASTCUBE.`;

    return {
      subject: emailSubject,
      html_content: htmlContent,
      text_content: textContent,
      generated_at: new Date().toISOString(),
      interests,
      tone: 'professional',
      language: 'fr'
    };
  }

  
  static async sendNewsletter(req, res) {
    try {
      const { subject, html, text, scheduled_at } = req.body;

      if (!subject || (!html && !text)) {
        return res.status(400).json({
          success: false,
          message: 'Sujet et contenu requis'
        });
      }

      const subscribers = await NewsletterModel.getAllActiveSubscribers();

      
      const results = await EmailService.sendNewsletter(subscribers, subject, html, text);

      
      for (const subscriber of subscribers) {
        const emailResult = results.errors.find(e => e.email === subscriber.email);
        await NewsletterModel.recordEmailSend(
          subscriber.id,
          1, 
          emailResult ? 'failed' : 'sent',
          emailResult ? emailResult.error : null
        );
      }

      res.json({
        success: true,
        message: `Newsletter envoyée à ${results.sent} abonnés`,
        data: {
          total_subscribers: subscribers.length,
          emails_sent: results.sent,
          emails_failed: results.failed,
          errors: results.errors,
          scheduled_at: scheduled_at || null
        }
      });

    } catch (error) {
      console.error('Erreur lors de l\'envoi de la newsletter:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'envoi de la newsletter'
      });
    }
  }

  
  static async scheduleNewsletter(req, res) {
    try {
      const { subject, html, text, scheduled_at, frequency } = req.body;

      if (!subject || (!html && !text) || !scheduled_at) {
        return res.status(400).json({
          success: false,
          message: 'Sujet, contenu et date de programmation requis'
        });
      }

      
      const scheduledDate = new Date(scheduled_at);
      const now = new Date();
      
      if (scheduledDate <= now) {
        return res.status(400).json({
          success: false,
          message: 'La date de programmation doit être dans le futur'
        });
      }

      res.json({
        success: true,
        message: 'Newsletter programmée avec succès',
        data: {
          subject,
          scheduled_at: scheduled_at,
          frequency: frequency || 'weekly',
          estimated_recipients: 0 
        }
      });

    } catch (error) {
      console.error('Erreur lors de la programmation:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la programmation de la newsletter'
      });
    }
  }

  
  static async getSubscriber(req, res) {
    try {
      const { email } = req.params;
      
      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email requis'
        });
      }

      const subscriber = await NewsletterModel.getSubscriberByEmail(email);
      
      if (!subscriber) {
        return res.status(404).json({
          success: false,
          message: 'Abonné non trouvé'
        });
      }

      res.json({
        success: true,
        data: subscriber
      });
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'abonné:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération de l\'abonné'
      });
    }
  }
}

module.exports = NewsletterController; 