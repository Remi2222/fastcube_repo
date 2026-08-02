import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem('language');
    return saved || 'fr';
  });

  useEffect(() => {
    localStorage.setItem('language', lang);
  }, [lang]);

  const translations = {
    fr: {
      
      'nav.home': 'Accueil',
      'nav.about': 'À propos',
      'nav.services': 'Services',
      'nav.solutions': 'Solutions',
      'nav.partners': 'Partenaires',
      'nav.blog': 'Blog',
      'nav.tenders': 'Appels d\'offre',
      'nav.contact': 'Contact',
      'nav.tickets': 'Tickets',
      'nav.login': 'Connexion',
      'nav.register': 'Inscription',
      'nav.dashboard': 'Tableau de bord',
      'nav.account': 'Mon Compte',
      'nav.logout': 'Déconnexion',
      
      
      'home': 'Accueil',
      'about': 'À propos',
      'services': 'Services',
      'solutions': 'Solutions',
      'partners': 'Partenaires',
      'blog': 'Blog',
      'tenders': 'Appels d\'offre',
      'contact': 'Contact',
      'tickets': 'Tickets',
      'login': 'Connexion',
      'register': 'Inscription',
      'dashboard': 'Tableau de bord',
      'account': 'Mon Compte',
      'logout': 'Déconnexion',
      'search': 'Rechercher',
      'menu': 'Menu',
      'confirmLogout': 'Êtes-vous sûr de vouloir vous déconnecter ?',
      
      
      'aboutUs': 'À propos de nous',
      'aboutTitle': 'Votre partenaire de confiance en',
      'digitalTransformation': 'transformation digitale',
      'aboutDescription': 'FastCube est votre expert en cybersécurité, réseaux et solutions cloud. Nous accompagnons votre transformation digitale avec des solutions innovantes et sécurisées depuis plus de 12 ans.',
      'learnMore': 'En savoir plus',
      'contactUs': 'Contactez-nous',
      'ourNumbers': 'Nos chiffres parlent d\'eux-mêmes',
      'statsDescription': 'Plus de 12 ans d\'expertise au service de votre réussite',
      'ourServices': 'Nos services',
      'servicesTitle': 'Nos services',
      'servicesDescription': 'Des solutions complètes pour sécuriser et optimiser votre infrastructure IT',
      'viewAllServices': 'Voir tous les services',
      'latestNews': 'Dernières actualités',
      'blogTitle': 'Dernières actualités',
      'blogDescription': 'Restez informé des dernières tendances en cybersécurité et technologies',
      'viewAllArticles': 'Voir tous les articles',
      'contactCTATitle': 'Un projet ? Besoin d\'un',
      'advice': 'conseil',
      'contactCTAQuestion': '?',
      'contactCTADescription': 'Nos experts FastCube sont là pour vous accompagner dans tous vos projets IT. Contactez-nous pour un audit gratuit et personnalisé.',
      'callForTenders': 'Appels d\'offre',
      
      
      'priority.low': 'Basse',
      'priority.medium': 'Moyenne',
      'priority.high': 'Haute',
      'priority.critical': 'Critique',
      'ticket.category.technical': 'Problème Technique',
      'ticket.category.billing': 'Facturation',
      'ticket.category.account': 'Compte Utilisateur',
      'ticket.category.feature': 'Demande de Fonctionnalité',
      'ticket.category.other': 'Autre',

      
      'account.title': 'Mon Compte',
      'account.profile': 'Profil',
      'account.tickets': 'Mes Tickets',
      'account.preferences': 'Préférences',
      'account.back_dashboard': '← Retour au dashboard',
      'account.loading': 'Chargement de votre compte...',
      
      
      'account.full_name': 'Nom complet',
      'account.email': 'Email',
      'account.phone': 'Téléphone',
      'account.address': 'Adresse',
      'account.city': 'Ville',
      'account.country': 'Pays',
      'account.not_provided': 'Non renseigné',
      'account.edit': 'Modifier',
      'account.save': 'Sauvegarder',
      'account.cancel': 'Annuler',
      
      
      'account.change_password': 'Changer le mot de passe',
      'account.logout': 'Se déconnecter',
      'account.create_ticket': 'Créer un nouveau ticket',
      'account.no_tickets': 'Aucun ticket trouvé',
      'account.loading_tickets': 'Chargement des tickets...',
      
      
      'tickets.title': 'Mes Tickets de Support',
      'tickets.status.open': 'Ouvert',
      'tickets.status.in_progress': 'En cours',
      'tickets.status.resolved': 'Résolu',
      'tickets.status.closed': 'Fermé',
      
      
      'preferences.title': 'Préférences',
      'preferences.language': 'Langue',
      'preferences.email_notifications': 'Notifications par email',
      'preferences.email_notifications_desc': 'Recevoir des notifications par email',
      'preferences.dark_mode': 'Mode sombre',
      'preferences.dark_mode_desc': 'Activer le thème sombre',
      
      
      'modal.edit_info': 'Modifier mes informations',
      'modal.change_password': 'Changer le mot de passe',
      'modal.current_password': 'Mot de passe actuel',
      'modal.new_password': 'Nouveau mot de passe',
      'modal.confirm_password': 'Confirmer le nouveau mot de passe',
      'modal.password_changed': 'Mot de passe modifié avec succès !',
      'modal.info_updated': 'Informations mises à jour avec succès !',
      'modal.error_update': 'Erreur lors de la mise à jour',
      'modal.error_password': 'Erreur lors du changement de mot de passe',
      'modal.passwords_dont_match': 'Les mots de passe ne correspondent pas',
      'modal.password_too_short': 'Le nouveau mot de passe doit contenir au moins 6 caractères',
      
      
      'auth.login': 'Connexion',
      'auth.register': 'Inscription',
      'auth.email': 'Email',
      'auth.password': 'Mot de passe',
      'auth.confirm_password': 'Confirmer le mot de passe',
      'auth.name': 'Nom complet',
      'auth.login_success': 'Connexion réussie !',
      'auth.register_success': 'Inscription réussie !',
      'auth.logout_success': 'Déconnexion réussie !',
      'auth.invalid_credentials': 'Email ou mot de passe incorrect',
      'auth.user_exists': 'Un utilisateur avec cet email existe déjà',
      'auth.passwords_dont_match': 'Les mots de passe ne correspondent pas',
      
      
      'dashboard.welcome': 'Bienvenue',
      'dashboard.create_ticket': 'Créer un nouveau ticket',
      'dashboard.my_tickets': 'Mes Tickets',
      'dashboard.my_account': 'Mon Compte',
      
      
      'common.loading': 'Chargement...',
      'common.error': 'Erreur',
      'common.success': 'Succès',
      'common.cancel': 'Annuler',
      'common.save': 'Sauvegarder',
      'common.edit': 'Modifier',
      'common.delete': 'Supprimer',
      'common.view': 'Voir',
      'common.back': 'Retour',
      'common.next': 'Suivant',
      'common.previous': 'Précédent',
      'common.search': 'Rechercher',
      'common.filter': 'Filtrer',
      'common.sort': 'Trier',
      'common.actions': 'Actions',
      'common.date': 'Date',
      'common.status': 'Statut',
      'common.priority': 'Priorité',
      'common.category': 'Catégorie',
      'common.reference': 'Référence',
      'common.subject': 'Sujet',
      'common.description': 'Description',
      'common.contact_email': 'Email de contact',
      'common.contact_phone': 'Téléphone de contact',
      
      
      'about.hero.title': 'Votre partenaire de confiance en',
      'about.hero.digital_transformation': 'transformation digitale',
      'about.hero.description': 'Depuis 2012, FASTCUBE MAROC accompagne les entreprises dans leur transformation digitale avec des solutions innovantes et sécurisées.',
      'about.hero.contact_us': 'Nous contacter',
      'about.hero.our_services': 'Nos services',
      
      
      'about.mission.title': 'Notre Mission',
      'about.mission.heading': 'Accompagner votre réussite digitale',
      'about.mission.description': 'Notre mission est de garantir la performance, la sécurité et la transformation digitale de nos clients grâce à des technologies de pointe et un accompagnement personnalisé. Nous nous engageons à fournir des solutions sur-mesure qui répondent aux défis spécifiques de chaque entreprise.',
      'about.mission.custom_solutions': 'Solutions sur-mesure',
      'about.mission.support_24_7': 'Support 24/7',
      
      'about.vision.title': 'Notre Vision',
      'about.vision.heading': 'Devenir le leader africain de la cybersécurité',
      'about.vision.description': 'Nous aspirons à devenir le partenaire de référence en cybersécurité et transformation digitale en Afrique, en créant un écosystème d\'innovation qui propulse la croissance économique du continent tout en garantissant la sécurité numérique des entreprises.',
      'about.vision.african_leader': 'Leader africain',
      'about.vision.continuous_innovation': 'Innovation continue',
      
      
      'about.values.title': 'Nos Valeurs',
      'about.values.heading': 'Ce qui nous anime au quotidien',
      'about.values.description': 'Nos valeurs guident chacune de nos décisions et façonnent notre culture d\'entreprise',
      'about.values.commitment.title': 'Engagement',
      'about.values.commitment.description': 'Nous nous engageons à fournir des solutions fiables et innovantes à nos clients.',
      'about.values.security.title': 'Sécurité',
      'about.values.security.description': 'La sécurité de vos données et de vos infrastructures est notre priorité absolue.',
      'about.values.innovation.title': 'Innovation',
      'about.values.innovation.description': 'Nous intégrons les dernières technologies pour booster votre transformation digitale.',
      'about.values.excellence.title': 'Excellence',
      'about.values.excellence.description': 'Nous visons l\'excellence dans chaque projet et chaque interaction client.',
      
      
      'about.timeline.title': 'Notre Histoire',
      'about.timeline.heading': 'Un parcours d\'excellence depuis 2012',
      'about.timeline.description': 'Découvrez les étapes clés qui ont fait de FASTCUBE le leader qu\'elle est aujourd\'hui',
      'about.timeline.2012.title': 'Création de FASTCUBE MAROC',
      'about.timeline.2012.description': 'Fondation de l\'entreprise à Casablanca avec une vision claire de la transformation digitale.',
      'about.timeline.2014.title': 'Premiers projets majeurs',
      'about.timeline.2014.description': 'Déploiement de solutions réseau pour des entreprises du CAC40.',
      'about.timeline.2016.title': 'Lancement du pôle cybersécurité',
      'about.timeline.2016.description': 'Création du SOC (Security Operations Center) et obtention des certifications ISO 27001.',
      'about.timeline.2019.title': 'Expansion régionale',
      'about.timeline.2019.description': 'Ouverture de bureaux à Rabat et Marrakech. Début de l\'expansion en Afrique.',
      'about.timeline.2022.title': 'Innovation & IA',
      'about.timeline.2022.description': 'Déploiement de solutions cloud avancées et intégration de l\'IA dans nos services.',
      'about.timeline.2024.title': 'Leader du marché',
      'about.timeline.2024.description': 'FASTCUBE devient le leader marocain en cybersécurité et transformation digitale.',
      
      
      'about.stats.heading': 'Nos chiffres parlent d\'eux-mêmes',
      'about.stats.description': 'Plus de 12 ans d\'expertise au service de votre réussite',
      'about.stats.years_experience': 'Années d\'expérience',
      'about.stats.certified_experts': 'Experts certifiés',
      'about.stats.satisfied_clients': 'Clients satisfaits',
      'about.stats.soc_support': 'SOC & Support',
      'about.stats.completed_projects': 'Projets réalisés',
      'about.stats.tech_partners': 'Partenaires technologiques',
      
      
      'about.team.title': 'Notre Équipe',
      'about.team.heading': 'Des experts passionnés à votre service',
      'about.team.description': 'Rencontrez les talents qui font de FASTCUBE un partenaire de confiance',
      'about.team.ceo_role': 'CEO & Fondateur',
      'about.team.cto_role': 'Directrice Technique',
      'about.team.security_director_role': 'Directeur Cybersécurité',
      'about.team.innovation_manager_role': 'Responsable Innovation',
      'about.team.ceo_bio': 'Expert en cybersécurité avec 15+ ans d\'expérience. Ancien consultant chez Deloitte et Cisco.',
      'about.team.cto_bio': 'Spécialiste en architecture cloud et transformation digitale. Certifiée AWS et Azure.',
      'about.team.security_director_bio': 'Expert en SOC et gestion des incidents. Certifié CISSP, CISM et CEH.',
      'about.team.innovation_manager_bio': 'Pionnière en IA et machine learning. Doctorat en informatique de l\'INPT.',
      
      
      'about.accreditations.title': 'Accréditations & Partenaires',
      'about.accreditations.heading': 'Des certifications reconnues',
      'about.accreditations.description': 'Nos partenariats et certifications témoignent de notre expertise et de notre engagement qualité',
      'about.accreditations.iso27001': 'Certification sécurité de l\'information',
      'about.accreditations.cisco_partner': 'Partenaire certifié Cisco',
      'about.accreditations.microsoft_partner': 'Partenaire Microsoft Gold',
      'about.accreditations.fortinet_partner': 'Partenaire Fortinet',
      'about.accreditations.aws_partner': 'Partenaire AWS Advanced',
      'about.accreditations.google_cloud_partner': 'Partenaire Google Cloud',
      
      
      'about.cta.heading': 'Prêt à transformer votre entreprise ?',
      'about.cta.description': 'Rejoignez les centaines d\'entreprises qui nous font confiance pour leur transformation digitale',
      
      
      'services.title': 'Nos Services',
      'services.subtitle': 'Découvrez nos solutions sur-mesure pour votre transformation digitale',
      
      
      'solutions.title': 'Nos Solutions',
      'solutions.subtitle': 'Des solutions innovantes pour la performance et la sécurité de votre entreprise',
      'solutions.network_infrastructure.title': 'Infrastructure Réseau',
      'solutions.network_infrastructure.description': 'Conception, déploiement et sécurisation de réseaux performants pour entreprises.',
      'solutions.cybersecurity.title': 'Cybersécurité',
      'solutions.cybersecurity.description': 'Protection contre les menaces, SOC, audits, sensibilisation et conformité.',
      'solutions.data_center_cloud.title': 'Data Center & Cloud',
      'solutions.data_center_cloud.description': 'Solutions cloud, hébergement sécurisé, continuité d\'activité et sauvegarde.',
    },
    en: {
      
      'nav.home': 'Home',
      'nav.about': 'About',
      'nav.services': 'Services',
      'nav.solutions': 'Solutions',
      'nav.partners': 'Partners',
      'nav.blog': 'Blog',
      'nav.tenders': 'Call for Tenders',
      'nav.contact': 'Contact',
      'nav.tickets': 'Tickets',
      'nav.login': 'Login',
      
      
      'home': 'Home',
      'about': 'About',
      'services': 'Services',
      'solutions': 'Solutions',
      'partners': 'Partners',
      'blog': 'Blog',
      'tenders': 'Call for Tenders',
      'contact': 'Contact',
      'tickets': 'Tickets',
      'login': 'Login',
      'register': 'Register',
      'dashboard': 'Dashboard',
      'account': 'My Account',
      'logout': 'Logout',
      'search': 'Search',
      'menu': 'Menu',
      'confirmLogout': 'Are you sure you want to logout?',
      
      
      'aboutUs': 'About us',
      'aboutTitle': 'Your trusted partner in',
      'digitalTransformation': 'digital transformation',
      'aboutDescription': 'FastCube is your expert in cybersecurity, networks and cloud solutions. We support your digital transformation with innovative and secure solutions for over 12 years.',
      'learnMore': 'Learn more',
      'contactUs': 'Contact us',
      'ourNumbers': 'Our numbers speak for themselves',
      'statsDescription': 'Over 12 years of expertise at your service',
      'ourServices': 'Our services',
      'servicesTitle': 'Our services',
      'servicesDescription': 'Complete solutions to secure and optimize your IT infrastructure',
      'viewAllServices': 'View all services',
      'latestNews': 'Latest news',
      'blogTitle': 'Latest news',
      'blogDescription': 'Stay informed about the latest trends in cybersecurity and technologies',
      'viewAllArticles': 'View all articles',
      'contactCTATitle': 'A project? Need',
      'advice': 'advice',
      'contactCTAQuestion': '?',
      'contactCTADescription': 'Our FastCube experts are here to support you in all your IT projects. Contact us for a free and personalized audit.',
      'callForTenders': 'Call for Tenders',
      
      
      'priority.low': 'Low',
      'priority.medium': 'Medium',
      'priority.high': 'High',
      'priority.critical': 'Critical',
      'ticket.category.technical': 'Technical Issue',
      'ticket.category.billing': 'Billing',
      'ticket.category.account': 'User Account',
      'ticket.category.feature': 'Feature Request',
      'ticket.category.other': 'Other',
      'nav.register': 'Register',
      'nav.dashboard': 'Dashboard',
      'nav.account': 'My Account',
      'nav.logout': 'Logout',

      
      'account.title': 'My Account',
      'account.profile': 'Profile',
      'account.tickets': 'My Tickets',
      'account.preferences': 'Preferences',
      'account.back_dashboard': '← Back to dashboard',
      'account.loading': 'Loading your account...',
      
      
      'account.full_name': 'Full Name',
      'account.email': 'Email',
      'account.phone': 'Phone',
      'account.address': 'Address',
      'account.city': 'City',
      'account.country': 'Country',
      'account.not_provided': 'Not provided',
      'account.edit': 'Edit',
      'account.save': 'Save',
      'account.cancel': 'Cancel',
      
      
      'account.change_password': 'Change Password',
      'account.logout': 'Logout',
      'account.create_ticket': 'Create New Ticket',
      'account.no_tickets': 'No tickets found',
      'account.loading_tickets': 'Loading tickets...',
      
      
      'tickets.title': 'My Support Tickets',
      'tickets.status.open': 'Open',
      'tickets.status.in_progress': 'In Progress',
      'tickets.status.resolved': 'Resolved',
      'tickets.status.closed': 'Closed',
      
      
      'preferences.title': 'Preferences',
      'preferences.language': 'Language',
      'preferences.email_notifications': 'Email Notifications',
      'preferences.email_notifications_desc': 'Receive email notifications',
      'preferences.dark_mode': 'Dark Mode',
      'preferences.dark_mode_desc': 'Enable dark theme',
      
      
      'modal.edit_info': 'Edit My Information',
      'modal.change_password': 'Change Password',
      'modal.current_password': 'Current Password',
      'modal.new_password': 'New Password',
      'modal.confirm_password': 'Confirm New Password',
      'modal.password_changed': 'Password changed successfully!',
      'modal.info_updated': 'Information updated successfully!',
      'modal.error_update': 'Error updating information',
      'modal.error_password': 'Error changing password',
      'modal.passwords_dont_match': 'Passwords do not match',
      'modal.password_too_short': 'New password must be at least 6 characters',
      
      
      'auth.login': 'Login',
      'auth.register': 'Register',
      'auth.email': 'Email',
      'auth.password': 'Password',
      'auth.confirm_password': 'Confirm Password',
      'auth.name': 'Full Name',
      'auth.login_success': 'Login successful!',
      'auth.register_success': 'Registration successful!',
      'auth.logout_success': 'Logout successful!',
      'auth.invalid_credentials': 'Invalid email or password',
      'auth.user_exists': 'A user with this email already exists',
      'auth.passwords_dont_match': 'Passwords do not match',
      
      
      'dashboard.welcome': 'Welcome',
      'dashboard.create_ticket': 'Create New Ticket',
      'dashboard.my_tickets': 'My Tickets',
      'dashboard.my_account': 'My Account',
      
      
      'common.loading': 'Loading...',
      'common.error': 'Error',
      'common.success': 'Success',
      'common.cancel': 'Cancel',
      'common.save': 'Save',
      'common.edit': 'Edit',
      'common.delete': 'Delete',
      'common.view': 'View',
      'common.back': 'Back',
      'common.next': 'Next',
      'common.previous': 'Previous',
      'common.search': 'Search',
      'common.filter': 'Filter',
      'common.sort': 'Sort',
      'common.actions': 'Actions',
      'common.date': 'Date',
      'common.status': 'Status',
      'common.priority': 'Priority',
      'common.category': 'Category',
      'common.reference': 'Reference',
      'common.subject': 'Subject',
      'common.description': 'Description',
      'common.contact_email': 'Contact Email',
      'common.contact_phone': 'Contact Phone',
      
      
      'about.hero.title': 'Your trusted partner in',
      'about.hero.digital_transformation': 'digital transformation',
      'about.hero.description': 'Since 2012, FASTCUBE MOROCCO has been supporting companies in their digital transformation with innovative and secure solutions.',
      'about.hero.contact_us': 'Contact Us',
      'about.hero.our_services': 'Our Services',
      
      
      'about.mission.title': 'Our Mission',
      'about.mission.heading': 'Supporting your digital success',
      'about.mission.description': 'Our mission is to ensure the performance, security, and digital transformation of our clients through cutting-edge technologies and personalized support. We are committed to providing customized solutions that address the specific challenges of each company.',
      'about.mission.custom_solutions': 'Custom Solutions',
      'about.mission.support_24_7': '24/7 Support',
      
      'about.vision.title': 'Our Vision',
      'about.vision.heading': 'Becoming the African leader in cybersecurity',
      'about.vision.description': 'We aspire to become the reference partner in cybersecurity and digital transformation in Africa, creating an innovation ecosystem that drives the continent\'s economic growth while ensuring the digital security of companies.',
      'about.vision.african_leader': 'African Leader',
      'about.vision.continuous_innovation': 'Continuous Innovation',
      
      
      'about.values.title': 'Our Values',
      'about.values.heading': 'What drives us every day',
      'about.values.description': 'Our values guide every decision we make and shape our corporate culture',
      'about.values.commitment.title': 'Commitment',
      'about.values.commitment.description': 'We are committed to providing reliable and innovative solutions to our clients.',
      'about.values.security.title': 'Security',
      'about.values.security.description': 'The security of your data and infrastructure is our absolute priority.',
      'about.values.innovation.title': 'Innovation',
      'about.values.innovation.description': 'We integrate the latest technologies to boost your digital transformation.',
      'about.values.excellence.title': 'Excellence',
      'about.values.excellence.description': 'We strive for excellence in every project and every client interaction.',
      
      
      'about.timeline.title': 'Our History',
      'about.timeline.heading': 'A journey of excellence since 2012',
      'about.timeline.description': 'Discover the key milestones that made FASTCUBE the leader it is today',
      'about.timeline.2012.title': 'Creation of FASTCUBE MOROCCO',
      'about.timeline.2012.description': 'Foundation of the company in Casablanca with a clear vision of digital transformation.',
      'about.timeline.2014.title': 'First major projects',
      'about.timeline.2014.description': 'Deployment of network solutions for CAC40 companies.',
      'about.timeline.2016.title': 'Launch of cybersecurity division',
      'about.timeline.2016.description': 'Creation of the SOC (Security Operations Center) and obtaining ISO 27001 certifications.',
      'about.timeline.2019.title': 'Regional expansion',
      'about.timeline.2019.description': 'Opening offices in Rabat and Marrakech. Beginning of expansion in Africa.',
      'about.timeline.2022.title': 'Innovation & AI',
      'about.timeline.2022.description': 'Deployment of advanced cloud solutions and integration of AI in our services.',
      'about.timeline.2024.title': 'Market leader',
      'about.timeline.2024.description': 'FASTCUBE becomes the Moroccan leader in cybersecurity and digital transformation.',
      
      
      'about.stats.heading': 'Our numbers speak for themselves',
      'about.stats.description': 'Over 12 years of expertise at the service of your success',
      'about.stats.years_experience': 'Years of experience',
      'about.stats.certified_experts': 'Certified experts',
      'about.stats.satisfied_clients': 'Satisfied clients',
      'about.stats.soc_support': 'SOC & Support',
      'about.stats.completed_projects': 'Completed projects',
      'about.stats.tech_partners': 'Technology partners',
      
      
      'about.team.title': 'Our Team',
      'about.team.heading': 'Passionate experts at your service',
      'about.team.description': 'Meet the talents that make FASTCUBE a trusted partner',
      'about.team.ceo_role': 'CEO & Founder',
      'about.team.cto_role': 'Technical Director',
      'about.team.security_director_role': 'Cybersecurity Director',
      'about.team.innovation_manager_role': 'Innovation Manager',
      'about.team.ceo_bio': 'Cybersecurity expert with 15+ years of experience. Former consultant at Deloitte and Cisco.',
      'about.team.cto_bio': 'Specialist in cloud architecture and digital transformation. AWS and Azure certified.',
      'about.team.security_director_bio': 'Expert in SOC and incident management. CISSP, CISM and CEH certified.',
      'about.team.innovation_manager_bio': 'Pioneer in AI and machine learning. PhD in computer science from INPT.',
      
      
      'about.accreditations.title': 'Accreditations & Partners',
      'about.accreditations.heading': 'Recognized certifications',
      'about.accreditations.description': 'Our partnerships and certifications testify to our expertise and quality commitment',
      'about.accreditations.iso27001': 'Information security certification',
      'about.accreditations.cisco_partner': 'Certified Cisco Partner',
      'about.accreditations.microsoft_partner': 'Microsoft Gold Partner',
      'about.accreditations.fortinet_partner': 'Fortinet Partner',
      'about.accreditations.aws_partner': 'AWS Advanced Partner',
      'about.accreditations.google_cloud_partner': 'Google Cloud Partner',
      
      
      'about.cta.heading': 'Ready to transform your company?',
      'about.cta.description': 'Join the hundreds of companies that trust us for their digital transformation',
      
      
      'services.title': 'Our Services',
      'services.subtitle': 'Discover our tailor-made solutions for your digital transformation',
      
      
      'solutions.title': 'Our Solutions',
      'solutions.subtitle': 'Innovative solutions for the performance and security of your company',
      'solutions.network_infrastructure.title': 'Network Infrastructure',
      'solutions.network_infrastructure.description': 'Design, deployment and securing of high-performance networks for businesses.',
      'solutions.cybersecurity.title': 'Cybersecurity',
      'solutions.cybersecurity.description': 'Threat protection, SOC, audits, awareness and compliance.',
      'solutions.data_center_cloud.title': 'Data Center & Cloud',
      'solutions.data_center_cloud.description': 'Cloud solutions, secure hosting, business continuity and backup.',
    }
  };

  const getTranslation = (key) => {
    return translations[lang]?.[key] || key;
  };

  const changeLanguage = (newLang) => {
    setLang(newLang);
  };

  const value = {
    lang,
    changeLanguage,
    getTranslation
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}; 