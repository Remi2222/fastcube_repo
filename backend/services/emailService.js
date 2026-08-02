const nodemailer = require('nodemailer');
require('dotenv').config();

class EmailService {
  constructor() {
    this.transporter = null;
    this.isConfigured = false;
    this.initializeTransporter();
  }

  initializeTransporter() {
    
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    
    if (!emailUser || !emailPass) {
      console.log('⚠️ Variables d\'environnement email manquantes');
      console.log('ℹ️ Ajoutez EMAIL_USER et EMAIL_PASSWORD dans votre fichier .env');
      console.log('ℹ️ L\'envoi d\'emails est désactivé');
      return;
    }

    
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, 
      auth: {
        user: emailUser,
        pass: emailPass.trim() 
      },
      tls: {
        rejectUnauthorized: false 
      }
    });

    
    this.transporter.verify((error, success) => {
      if (error) {
        console.log('❌ Erreur de configuration email:', error.message);
        console.log('ℹ️ Vérifiez vos identifiants dans le fichier .env');
        console.log('ℹ️ Pour Gmail, utilisez un mot de passe d\'application');
        this.isConfigured = false;
      } else {
        console.log('✅ Service email configuré avec succès');
        console.log(`📧 Email configuré: ${emailUser}`);
        this.isConfigured = true;
      }
    });
  }

  
  async sendEmail(to, subject, html, text) {
    try {
      if (!this.isConfigured || !this.transporter) {
        throw new Error('Service email non configuré. Vérifiez vos identifiants dans .env');
      }

      const mailOptions = {
        from: {
          name: 'FASTCUBE Newsletter',
          address: process.env.EMAIL_USER
        },
        to: to,
        subject: subject,
        html: html,
        text: text,
        replyTo: process.env.EMAIL_USER
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email envoyé:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('❌ Erreur envoi email:', error.message);
      return { success: false, error: error.message };
    }
  }

  
  async sendNewsletter(subscribers, subject, html, text) {
    if (!this.isConfigured) {
      console.log('⚠️ Service email non configuré, simulation de l\'envoi...');
      return {
        sent: 0,
        failed: subscribers.length,
        errors: subscribers.map(sub => ({
          email: sub.email,
          error: 'Service email non configuré'
        }))
      };
    }

    const results = {
      sent: 0,
      failed: 0,
      errors: []
    };

    console.log(`📧 Envoi de newsletter à ${subscribers.length} abonnés...`);

    for (const subscriber of subscribers) {
      try {
        
        const personalizedHtml = this.personalizeContent(html, subscriber);
        const personalizedText = this.personalizeContent(text, subscriber);

        const result = await this.sendEmail(
          subscriber.email,
          subject,
          personalizedHtml,
          personalizedText
        );

        if (result.success) {
          results.sent++;
          console.log(`✅ Email envoyé à ${subscriber.email}`);
        } else {
          results.failed++;
          results.errors.push({
            email: subscriber.email,
            error: result.error
          });
          console.log(`❌ Échec envoi à ${subscriber.email}: ${result.error}`);
        }

        
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        results.failed++;
        results.errors.push({
          email: subscriber.email,
          error: error.message
        });
        console.log(`❌ Erreur envoi à ${subscriber.email}: ${error.message}`);
      }
    }

    console.log(`📊 Résultat: ${results.sent} envoyés, ${results.failed} échoués`);
    return results;
  }

  
  personalizeContent(content, subscriber) {
    return content
      .replace(/\{first_name\}/g, subscriber.first_name || '')
      .replace(/\{last_name\}/g, subscriber.last_name || '')
      .replace(/\{company\}/g, subscriber.company || '')
      .replace(/\{email\}/g, subscriber.email || '')
      .replace(/\{interests\}/g, subscriber.interests ? (typeof subscriber.interests === 'string' ? JSON.parse(subscriber.interests) : subscriber.interests).join(', ') : 'Aucun');
  }

  
  async sendWelcomeEmail(subscriber) {
    if (!this.isConfigured) {
      console.log('⚠️ Service email non configuré, email de bienvenue non envoyé');
      return {
        success: false,
        error: 'Service email non configuré'
      };
    }

    const subject = `🎉 Bienvenue chez FASTCUBE, ${subscriber.first_name} !`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">🎉 Bienvenue chez FASTCUBE !</h1>
          <p style="margin: 15px 0 0 0; opacity: 0.9; font-size: 16px;">Votre inscription a été confirmée avec succès</p>
        </div>
        
        <div style="background: white; padding: 40px;">
          <h2 style="color: #333; margin-bottom: 25px;">Bonjour ${subscriber.first_name} ${subscriber.last_name} !</h2>
          
          <p style="color: #666; line-height: 1.6; font-size: 16px; margin-bottom: 25px;">
            Nous sommes ravis de vous accueillir dans notre communauté FASTCUBE ! 
            Votre inscription à notre newsletter a été confirmée avec succès.
          </p>
          
          <div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #667eea;">
            <h3 style="color: #495057; margin-top: 0; margin-bottom: 15px;">📋 Vos informations d'inscription :</h3>
            <ul style="color: #6c757d; line-height: 1.8; margin: 0; padding-left: 20px;">
              <li><strong>Nom complet :</strong> ${subscriber.first_name} ${subscriber.last_name}</li>
              <li><strong>Email :</strong> ${subscriber.email}</li>
              <li><strong>Entreprise :</strong> ${subscriber.company || 'Non spécifiée'}</li>
              <li><strong>Centres d'intérêt :</strong> ${subscriber.interests ? (typeof subscriber.interests === 'string' ? JSON.parse(subscriber.interests) : subscriber.interests).join(', ') : 'Aucun'}</li>
              <li><strong>Fréquence d'envoi :</strong> ${subscriber.frequency === 'daily' ? 'Quotidienne' : subscriber.frequency === 'weekly' ? 'Hebdomadaire' : 'Mensuelle'}</li>
              <li><strong>Date d'inscription :</strong> ${new Date().toLocaleDateString('fr-FR')}</li>
            </ul>
          </div>
          
          <div style="background: #e3f2fd; padding: 25px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #2196f3;">
            <h3 style="color: #1976d2; margin-top: 0; margin-bottom: 15px;">🚀 Que pouvez-vous attendre ?</h3>
            <ul style="color: #1565c0; line-height: 1.8; margin: 0; padding-left: 20px;">
              <li>📧 Des newsletters personnalisées selon vos centres d'intérêt</li>
              <li>🔒 Les dernières actualités en cybersécurité</li>
              <li>☁️ Des conseils sur le cloud computing</li>
              <li>💻 Des articles sur le développement web</li>
              <li>🤖 Des insights sur l'intelligence artificielle</li>
              <li>🎯 Des offres exclusives et des événements</li>
            </ul>
          </div>
          
          <div style="background: #d4edda; padding: 20px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #28a745;">
            <h3 style="color: #155724; margin-top: 0; margin-bottom: 10px;">✅ Prochaines étapes :</h3>
            <p style="color: #155724; margin: 0; line-height: 1.6;">
              Vous recevrez votre première newsletter dans les prochaines heures. 
              En attendant, n'hésitez pas à explorer notre site web et à nous suivre sur nos réseaux sociaux !
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://fastcube.com" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; margin: 5px;">
              🌐 Visiter notre site
            </a>
            <a href="https://fastcube.com/contact" style="background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; margin: 5px;">
              📞 Nous contacter
            </a>
          </div>
          
          <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #ffc107;">
            <h3 style="color: #856404; margin-top: 0; margin-bottom: 10px;">⚠️ Important :</h3>
            <p style="color: #856404; margin: 0; line-height: 1.6;">
              Si vous souhaitez vous désabonner à tout moment, vous pouvez utiliser le lien de désabonnement 
              présent dans chaque email ou nous contacter directement.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 14px; margin: 0;">
              Merci de votre confiance !<br>
              L'équipe FASTCUBE
            </p>
            <p style="color: #ccc; font-size: 12px; margin: 10px 0 0 0;">
              Cet email a été envoyé automatiquement suite à votre inscription à notre newsletter.
            </p>
          </div>
        </div>
      </div>
    `;

    const text = `
      🎉 Bienvenue chez FASTCUBE, ${subscriber.first_name} !
      
      Bonjour ${subscriber.first_name} ${subscriber.last_name} !
      
      Nous sommes ravis de vous accueillir dans notre communauté FASTCUBE ! 
      Votre inscription à notre newsletter a été confirmée avec succès.
      
      📋 Vos informations d'inscription :
      - Nom complet : ${subscriber.first_name} ${subscriber.last_name}
      - Email : ${subscriber.email}
      - Entreprise : ${subscriber.company || 'Non spécifiée'}
      - Centres d'intérêt : ${subscriber.interests ? (typeof subscriber.interests === 'string' ? JSON.parse(subscriber.interests) : subscriber.interests).join(', ') : 'Aucun'}
      - Fréquence d'envoi : ${subscriber.frequency === 'daily' ? 'Quotidienne' : subscriber.frequency === 'weekly' ? 'Hebdomadaire' : 'Mensuelle'}
      - Date d'inscription : ${new Date().toLocaleDateString('fr-FR')}
      
      🚀 Que pouvez-vous attendre ?
      - Des newsletters personnalisées selon vos centres d'intérêt
      - Les dernières actualités en cybersécurité
      - Des conseils sur le cloud computing
      - Des articles sur le développement web
      - Des insights sur l'intelligence artificielle
      - Des offres exclusives et des événements
      
      ✅ Prochaines étapes :
      Vous recevrez votre première newsletter dans les prochaines heures. 
      En attendant, n'hésitez pas à explorer notre site web !
      
      🌐 Visitez notre site : https://fastcube.com
      📞 Contactez-nous : https://fastcube.com/contact
      
      ⚠️ Important :
      Si vous souhaitez vous désabonner à tout moment, vous pouvez utiliser le lien de désabonnement 
      présent dans chaque email ou nous contacter directement.
      
      Merci de votre confiance !
      L'équipe FASTCUBE
      
      ---
      Cet email a été envoyé automatiquement suite à votre inscription à notre newsletter.
    `;

    return await this.sendEmail(subscriber.email, subject, html, text);
  }

  
  async sendTestEmail(to, subscriber) {
    if (!this.isConfigured) {
      console.log('⚠️ Service email non configuré, simulation de l\'envoi...');
      return {
        success: false,
        error: 'Service email non configuré. Vérifiez vos identifiants dans .env'
      };
    }

    const subject = '🧪 Test Newsletter FASTCUBE - ' + new Date().toLocaleDateString('fr-FR');
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">🧪 Test Newsletter FASTCUBE</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Email de test envoyé avec succès !</p>
        </div>
        <div style="background: white; padding: 30px;">
          <h2 style="color: #333; margin-bottom: 20px;">Bonjour {first_name} {last_name} !</h2>
          <p style="color: #666; line-height: 1.6;">Ceci est un email de test pour vérifier que notre système d'envoi fonctionne correctement.</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
            <h3 style="color: #495057; margin-top: 0;">📊 Vos informations :</h3>
            <ul style="color: #6c757d; line-height: 1.6;">
              <li><strong>Email :</strong> {email}</li>
              <li><strong>Entreprise :</strong> {company}</li>
              <li><strong>Intérêts :</strong> {interests}</li>
              <li><strong>Date du test :</strong> ${new Date().toLocaleString('fr-FR')}</li>
            </ul>
          </div>
          
          <div style="background: #d4edda; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
            <p style="color: #155724; margin: 0; font-weight: bold;">✅ Test réussi !</p>
            <p style="color: #155724; margin: 5px 0 0 0;">Si vous recevez cet email, cela signifie que notre système de newsletter fonctionne parfaitement !</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://fastcube.com" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              🚀 Visiter FASTCUBE
            </a>
          </div>
          
          <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              Cet email a été envoyé automatiquement par le système de test FASTCUBE
            </p>
          </div>
        </div>
      </div>
    `;

    const text = `
      🧪 Test Newsletter FASTCUBE - ${new Date().toLocaleDateString('fr-FR')}
      
      Bonjour {first_name} {last_name} !
      
      Ceci est un email de test pour vérifier que notre système d'envoi fonctionne correctement.
      
      📊 Vos informations :
      - Email : {email}
      - Entreprise : {company}
      - Intérêts : {interests}
      - Date du test : ${new Date().toLocaleString('fr-FR')}
      
      ✅ Test réussi !
      Si vous recevez cet email, cela signifie que notre système de newsletter fonctionne parfaitement !
      
      🚀 Visitez FASTCUBE : https://fastcube.com
      
      ---
      Cet email a été envoyé automatiquement par le système de test FASTCUBE
    `;

    return await this.sendEmail(to, subject, html, text);
  }
}

module.exports = new EmailService();