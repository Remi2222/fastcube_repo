from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from decouple import config
from pathlib import Path
from typing import Optional

# Configuration email
conf = ConnectionConfig(
    MAIL_USERNAME=config("MAIL_USERNAME"),
    MAIL_PASSWORD=config("MAIL_PASSWORD"),
    MAIL_FROM=config("MAIL_FROM"),
    MAIL_PORT=int(config("MAIL_PORT", default=587)),
    MAIL_SERVER=config("MAIL_SERVER", default="smtp.gmail.com"),
    MAIL_TLS=config("MAIL_TLS", default=True, cast=bool),
    MAIL_SSL=config("MAIL_SSL", default=False, cast=bool),
    USE_CREDENTIALS=True,
    TEMPLATE_FOLDER=Path(__file__).parent / "email_templates"
)

fastmail = FastMail(conf)

async def send_verification_email(email: str, token: str, first_name: Optional[str] = None):
    """Envoyer un email de vérification"""
    frontend_url = config("FRONTEND_URL", default="http://localhost:3000")
    verification_url = f"{frontend_url}/verify-email?token={token}"
    
    # Nom d'affichage
    display_name = first_name if first_name else "Utilisateur"
    
    # Contenu HTML de l'email
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Vérification de votre email</title>
        <style>
            body {{
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }}
            .header {{
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                text-align: center;
                border-radius: 10px 10px 0 0;
            }}
            .content {{
                background: #f9f9f9;
                padding: 30px;
                border-radius: 0 0 10px 10px;
            }}
            .button {{
                display: inline-block;
                background: #667eea;
                color: white;
                padding: 15px 30px;
                text-decoration: none;
                border-radius: 5px;
                margin: 20px 0;
                font-weight: bold;
            }}
            .footer {{
                text-align: center;
                margin-top: 30px;
                color: #666;
                font-size: 12px;
            }}
            .warning {{
                background: #fff3cd;
                border: 1px solid #ffeaa7;
                padding: 15px;
                border-radius: 5px;
                margin: 20px 0;
            }}
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🔐 Vérification de votre email</h1>
            <p>Bienvenue sur notre plateforme !</p>
        </div>
        <div class="content">
            <h2>Bonjour {display_name} !</h2>
            <p>Merci de vous être inscrit sur notre plateforme. Pour finaliser votre inscription, 
            veuillez vérifier votre adresse email en cliquant sur le bouton ci-dessous :</p>
            
            <div style="text-align: center;">
                <a href="{verification_url}" class="button">Vérifier mon email</a>
            </div>
            
            <div class="warning">
                <strong>⚠️ Important :</strong> Ce lien expire dans 24 heures. 
                Si vous ne pouvez pas cliquer sur le bouton, copiez et collez ce lien dans votre navigateur :
                <br><br>
                <code>{verification_url}</code>
            </div>
            
            <p>Si vous n'avez pas créé de compte sur notre plateforme, vous pouvez ignorer cet email.</p>
            
            <p>Cordialement,<br><strong>L'équipe de développement</strong></p>
        </div>
        <div class="footer">
            <p>Cet email a été envoyé à {email}</p>
            <p>© 2024 - Tous droits réservés</p>
        </div>
    </body>
    </html>
    """
    
    # Contenu texte de l'email
    text_content = f"""
    Vérification de votre email
    
    Bonjour {display_name} !
    
    Merci de vous être inscrit sur notre plateforme. Pour finaliser votre inscription, 
    veuillez vérifier votre adresse email en visitant le lien suivant :
    
    {verification_url}
    
    ⚠️ Important : Ce lien expire dans 24 heures.
    
    Si vous n'avez pas créé de compte sur notre plateforme, vous pouvez ignorer cet email.
    
    Cordialement,
    L'équipe de développement
    
    ---
    Cet email a été envoyé à {email}
    """
    
    # Créer le message
    message = MessageSchema(
        subject="Vérification de votre email - Confirmation d'inscription",
        recipients=[email],
        body=html_content,
        subtype="html"
    )
    
    # Envoyer l'email
    try:
        await fastmail.send_message(message)
        return True
    except Exception as e:
        print(f"Erreur lors de l'envoi de l'email: {e}")
        return False

async def send_welcome_email(email: str, first_name: Optional[str] = None):
    """Envoyer un email de bienvenue après vérification"""
    display_name = first_name if first_name else "Utilisateur"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Bienvenue !</title>
        <style>
            body {{
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }}
            .header {{
                background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
                color: white;
                padding: 30px;
                text-align: center;
                border-radius: 10px 10px 0 0;
            }}
            .content {{
                background: #f9f9f9;
                padding: 30px;
                border-radius: 0 0 10px 10px;
            }}
            .button {{
                display: inline-block;
                background: #28a745;
                color: white;
                padding: 15px 30px;
                text-decoration: none;
                border-radius: 5px;
                margin: 20px 0;
                font-weight: bold;
            }}
            .footer {{
                text-align: center;
                margin-top: 30px;
                color: #666;
                font-size: 12px;
            }}
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🎉 Bienvenue !</h1>
            <p>Votre compte a été vérifié avec succès</p>
        </div>
        <div class="content">
            <h2>Félicitations {display_name} !</h2>
            <p>Votre adresse email a été vérifiée avec succès. Votre compte est maintenant actif 
            et vous pouvez vous connecter à notre plateforme.</p>
            
            <div style="text-align: center;">
                <a href="{config('FRONTEND_URL', default='http://localhost:3000')}/login" class="button">
                    Se connecter
                </a>
            </div>
            
            <p>Vous pouvez maintenant :</p>
            <ul>
                <li>✅ Accéder à toutes les fonctionnalités</li>
                <li>✅ Modifier votre profil</li>
                <li>✅ Utiliser nos services</li>
                <li>✅ Recevoir nos notifications</li>
            </ul>
            
            <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
            
            <p>Cordialement,<br><strong>L'équipe de développement</strong></p>
        </div>
        <div class="footer">
            <p>Cet email a été envoyé à {email}</p>
            <p>© 2024 - Tous droits réservés</p>
        </div>
    </body>
    </html>
    """
    
    message = MessageSchema(
        subject="Bienvenue ! Votre compte est maintenant vérifié",
        recipients=[email],
        body=html_content,
        subtype="html"
    )
    
    try:
        await fastmail.send_message(message)
        return True
    except Exception as e:
        print(f"Erreur lors de l'envoi de l'email de bienvenue: {e}")
        return False 