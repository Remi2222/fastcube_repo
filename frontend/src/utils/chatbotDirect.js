import { CHATBOT_BASE_URL } from '../config/api';
export const CHATBOT_DIRECT_CONFIG = {
  
  useDirectMode: true,
  fallbackApiUrl: CHATBOT_BASE_URL,
  endpoints: {
    chat: '/chat',
    health: '/health',
    stats: '/stats'
  }
};


export const FASTCUBE_CONTEXT = {
  company: "FASTCUBE",
  domain: "Solutions technologiques innovantes",
  services: [
    "Développement web",
    "Applications mobiles", 
    "Cybersécurité",
    "Consulting IT",
    "Solutions cloud",
    "Formation"
  ],
  experience: "Plus de 10 ans d'expérience",
  projects: "500+ projets réalisés",
  clients: "100+ clients satisfaits"
};


export const buildConversationContext = (history = []) => {
  const context = `Tu es l'assistant IA de ${FASTCUBE_CONTEXT.company}, spécialisé dans ${FASTCUBE_CONTEXT.domain}. 
  Nous avons ${FASTCUBE_CONTEXT.experience} et avons réalisé ${FASTCUBE_CONTEXT.projects} pour ${FASTCUBE_CONTEXT.clients}.
  
  Nos services incluent : ${FASTCUBE_CONTEXT.services.join(', ')}.
  
  Historique de la conversation :
  ${history.map(msg => `${msg.role}: ${msg.content}`).join('\n')}
  
  Réponds de manière professionnelle et amicale en français.`;
  
  return context;
};


export const detectAction = (response) => {
  const actionMatch = response.match(/\[ACTION:(\w+)\]/);
  return actionMatch ? actionMatch[1] : null;
};


export const executeAction = (action) => {
  const actions = {
    'CONTACT_TEAM': () => {
      return 'Je vous redirige vers notre page contact. Vous pouvez y trouver nos coordonnées et nous envoyer un message.';
    },
    'REQUEST_QUOTE': () => {
      return 'Je vous redirige vers notre formulaire de devis. Remplissez-le et nous vous répondrons rapidement.';
    },
    'SHOW_SERVICES': () => {
      return 'Je vous redirige vers notre page services. Découvrez toutes nos solutions technologiques.';
    },
    'SHOW_PORTFOLIO': () => {
      return 'Je vous redirige vers notre portfolio. Découvrez nos réalisations et projets.';
    },
    'SHOW_TENDERS': () => {
      return 'Je vous redirige vers nos appels d\'offre. Consultez les opportunités disponibles.';
    },
    'SHOW_ABOUT': () => {
      return 'Je vous redirige vers notre page à propos. En savoir plus sur FASTCUBE.';
    }
  };
  
  return actions[action] ? actions[action]() : null;
};


export const getInteractiveActions = () => {
  return {
    'SERVICES': {
      title: 'Nos Services',
      description: 'Découvrez nos services technologiques',
      options: [
        { text: '📋 Voir la page Services', action: 'SHOW_SERVICES', url: '/services' },
        { text: '💬 Discuter des services', action: 'DISCUSS_SERVICES' }
      ]
    },
    'SOLUTIONS': {
      title: 'Nos Solutions',
      description: 'Explorez nos réalisations',
      options: [
        { text: '📋 Voir le Portfolio', action: 'SHOW_PORTFOLIO', url: '/solutions' },
        { text: '💬 Discuter des solutions', action: 'DISCUSS_SOLUTIONS' }
      ]
    },
    'CONTACT': {
      title: 'Nous Contacter',
      description: 'Entrez en contact avec notre équipe',
      options: [
        { text: '📋 Voir la page Contact', action: 'CONTACT_TEAM', url: '/contact' },
        { text: '💬 Discuter du contact', action: 'DISCUSS_CONTACT' }
      ]
    },
    'QUOTE': {
      title: 'Demande de Devis',
      description: 'Obtenez un devis personnalisé',
      options: [
        { text: '📋 Formulaire de devis', action: 'REQUEST_QUOTE', url: '/contact?category=devis' },
        { text: '💬 Discuter du devis', action: 'DISCUSS_QUOTE' }
      ]
    },
    'TENDERS': {
      title: 'Appels d\'Offre',
      description: 'Consultez nos appels d\'offre',
      options: [
        { text: '📋 Voir les appels d\'offre', action: 'SHOW_TENDERS', url: '/appel-offre' },
        { text: '💬 Discuter des appels d\'offre', action: 'DISCUSS_TENDERS' }
      ]
    },
    'ABOUT': {
      title: 'À Propos',
      description: 'En savoir plus sur FASTCUBE',
      options: [
        { text: '📋 Voir la page À Propos', action: 'SHOW_ABOUT', url: '/about' },
        { text: '💬 Discuter de l\'entreprise', action: 'DISCUSS_ABOUT' }
      ]
    }
  };
};


export const detectUserIntent = (userMessage) => {
  const message = userMessage.toLowerCase();
  
  if (message.includes('service') || message.includes('services')) {
    return 'SERVICES';
  }
  if (message.includes('solution') || message.includes('portfolio') || message.includes('projet') || message.includes('réalisations')) {
    return 'SOLUTIONS';
  }
  if (message.includes('contact') || message.includes('contacter') || message.includes('équipe')) {
    return 'CONTACT';
  }
  if (message.includes('devis') || message.includes('prix') || message.includes('tarif') || message.includes('coût')) {
    return 'QUOTE';
  }
  if (message.includes('appel') || message.includes('offre') || message.includes('tender')) {
    return 'TENDERS';
  }
  if (message.includes('propos') || message.includes('entreprise') || message.includes('fastcube') || message.includes('qui êtes-vous')) {
    return 'ABOUT';
  }
  
  return null;
};


export const sendMessageToChatbot = async (message) => {
  try {
    
    const response = await fetch(`${CHATBOT_DIRECT_CONFIG.fallbackApiUrl}${CHATBOT_DIRECT_CONFIG.endpoints.chat}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: message
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error);
    
    
    return {
      success: false,
      response: 'Désolé, je rencontre des difficultés techniques. Veuillez vérifier que l\'API Ollama est démarrée et réessayer.',
      error: error.message,
      confidence: 0.0
    };
  }
}; 