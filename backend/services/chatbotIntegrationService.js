const ServicesModel = require('../models/services.model');
const SolutionsModel = require('../models/solutions.model');
const { ChatbotMessagesModel } = require('../models/chatbot.model');

class ChatbotIntegrationService {
  constructor() {
    this.services = [];
    this.solutions = [];
    this.categories = [];
    this.lastUpdate = null;
  }

  
  async loadData() {
    try {
      console.log('🔄 Chargement des données pour le chatbot...');
      
      
      this.services = await ServicesModel.getAllServices();
      console.log(`✅ ${this.services.length} services chargés`);

      
      this.solutions = await SolutionsModel.getAllSolutions();
      console.log(`✅ ${this.solutions.length} solutions chargées`);

      
      this.categories = await ServicesModel.getServiceCategories();
      console.log(`✅ ${this.categories.length} catégories chargées`);

      this.lastUpdate = new Date();
      return true;
    } catch (error) {
      console.error('❌ Erreur lors du chargement des données:', error);
      return false;
    }
  }

  
  async ensureDataFresh() {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    
    if (!this.lastUpdate || this.lastUpdate < oneHourAgo) {
      await this.loadData();
    }
  }

  
  async searchRelevantServices(query, limit = 5) {
    await this.ensureDataFresh();
    
    const queryLower = query.toLowerCase();
    
    
    const searchTerms = queryLower.split(' ').filter(term => term.length > 2);
    const synonyms = {
      'site': ['web', 'internet', 'site web', 'développement web'],
      'app': ['application', 'mobile', 'application mobile'],
      'securite': ['cybersécurité', 'sécurité', 'protection', 'audit'],
      'cloud': ['migration', 'infrastructure', 'serveur'],
      'formation': ['apprentissage', 'cours', 'training']
    };
    
    
    const expandedTerms = [...searchTerms];
    searchTerms.forEach(term => {
      Object.entries(synonyms).forEach(([key, values]) => {
        if (key.includes(term) || term.includes(key)) {
          expandedTerms.push(...values);
        }
      });
    });
    
    const relevantServices = this.services.filter(service => {
      const title = service.title.toLowerCase();
      const description = service.description.toLowerCase();
      const category = service.category.toLowerCase();
      
      
      if (title.includes(queryLower) || description.includes(queryLower) || category.includes(queryLower)) {
        return true;
      }
      
      
      return expandedTerms.some(term => 
        title.includes(term) || description.includes(term) || category.includes(term)
      );
    }).slice(0, limit);

    return relevantServices;
  }

  
  async searchRelevantSolutions(query, limit = 5) {
    await this.ensureDataFresh();
    
    const queryLower = query.toLowerCase();
    
    
    const searchTerms = queryLower.split(' ').filter(term => term.length > 2);
    const solutionSynonyms = {
      'suite': ['solution', 'package', 'ensemble'],
      'migration': ['cloud', 'transfert', 'déplacement'],
      'monitoring': ['surveillance', 'suivi', 'contrôle'],
      'security': ['sécurité', 'cybersécurité', 'protection'],
      'pro': ['professionnel', 'avancé', 'entreprise']
    };
    
    
    const expandedTerms = [...searchTerms];
    searchTerms.forEach(term => {
      Object.entries(solutionSynonyms).forEach(([key, values]) => {
        if (key.includes(term) || term.includes(key)) {
          expandedTerms.push(...values);
        }
      });
    });
    
    const relevantSolutions = this.solutions.filter(solution => {
      const title = solution.title.toLowerCase();
      const description = solution.description.toLowerCase();
      const category = solution.category.toLowerCase();
      const benefits = solution.benefits ? solution.benefits.toLowerCase() : '';
      const useCases = solution.use_cases ? solution.use_cases.toLowerCase() : '';
      
      
      if (title.includes(queryLower) || description.includes(queryLower) || 
          category.includes(queryLower) || benefits.includes(queryLower) || 
          useCases.includes(queryLower)) {
        return true;
      }
      
      
      return expandedTerms.some(term => 
        title.includes(term) || description.includes(term) || category.includes(term) ||
        benefits.includes(term) || useCases.includes(term)
      );
    }).slice(0, limit);

    return relevantSolutions;
  }

  
  getCompanyInfo() {
    return {
      name: 'FastCube',
      description: 'Expert en cybersécurité et solutions IT pour les entreprises',
      services: this.services.length,
      solutions: this.solutions.length,
      categories: this.categories,
      specialties: ['Cybersécurité', 'Infrastructure', 'Cloud', 'Formation'],
      contact: {
        email: 'contact@fastcube.com',
        phone: '01 23 45 67 89',
        address: 'Paris, France'
      }
    };
  }

  
  async generateContextualResponse(intent, query, userName = '') {
    await this.ensureDataFresh();

    switch (intent) {
      case 'services':
        const relevantServices = await this.searchRelevantServices(query, 3);
        return await this.formatServicesResponse(relevantServices, query, userName);

      case 'solutions':
        const relevantSolutions = await this.searchRelevantSolutions(query, 3);
        return await this.formatSolutionsResponse(relevantSolutions, query, userName);

      case 'pricing':
        return await this.formatPricingResponse(query, userName);

      case 'contact':
        return this.formatContactResponse(userName);

      case 'general':
        return this.formatGeneralResponse(query, userName);

      default:
        return this.formatDefaultResponse(query, userName);
    }
  }

  
  async formatServicesResponse(services, query, userName) {
    if (services.length === 0) {
      
      await this.ensureDataFresh();
      const allServices = this.services.slice(0, 4);
      
      
      const greetings = [
        `Salut${userName ? ` ${userName}` : ''} !`,
        `Hey${userName ? ` ${userName}` : ''} !`,
        `Coucou${userName ? ` ${userName}` : ''} !`,
        `Salut${userName ? ` ${userName}` : ''} !`
      ];
      
      const intros = [
        `Je n'ai pas trouvé de service spécifique pour "${query}", mais voici ce qu'on fait chez FastCube :`,
        `Pour "${query}", je vais te montrer nos principaux services :`,
        `Laisse-moi te présenter nos services qui pourraient t'intéresser :`,
        `Voici nos services qui correspondent à ta demande :`
      ];
      
      const greetings_random = greetings[Math.floor(Math.random() * greetings.length)];
      const intro_random = intros[Math.floor(Math.random() * intros.length)];
      
      let response = `${greetings_random} ${intro_random}\n\n`;
      
      allServices.forEach((service, index) => {
        response += `**${index + 1}. ${service.title}**\n`;
        response += `${service.description}\n`;
        response += `📂 Catégorie : ${service.category}\n\n`;
      });

      const endings = [
        `Tu veux plus de détails sur un service en particulier ?`,
        `Qu'est-ce qui t'intéresse le plus ?`,
        `Tu as des questions sur un de ces services ?`,
        `Dis-moi ce qui te plaît !`
      ];
      
      response += endings[Math.floor(Math.random() * endings.length)];
      return response;
    }

    
    const foundGreetings = [
      `Parfait${userName ? ` ${userName}` : ''} !`,
      `Super${userName ? ` ${userName}` : ''} !`,
      `Génial${userName ? ` ${userName}` : ''} !`,
      `Cool${userName ? ` ${userName}` : ''} !`
    ];
    
    const foundIntros = [
      `J'ai trouvé ${services.length} service${services.length > 1 ? 's' : ''} qui correspond${services.length > 1 ? 'ent' : ''} à ta recherche :`,
      `Voici ${services.length} service${services.length > 1 ? 's' : ''} qui pourraient t'intéresser :`,
      `J'ai déniché ${services.length} service${services.length > 1 ? 's' : ''} parfait${services.length > 1 ? 's' : ''} pour toi :`,
      `Regarde, j'ai trouvé ${services.length} service${services.length > 1 ? 's' : ''} qui matchent avec ta demande :`
    ];
    
    const foundGreeting = foundGreetings[Math.floor(Math.random() * foundGreetings.length)];
    const foundIntro = foundIntros[Math.floor(Math.random() * foundIntros.length)];
    
    let response = `${foundGreeting} ${foundIntro}\n\n`;
    
    services.forEach((service, index) => {
      response += `**${index + 1}. ${service.title}**\n`;
      response += `${service.description}\n`;
      response += `📂 Catégorie : ${service.category}\n`;
      if (service.image_url) {
        
        let cleanUrl = service.image_url
          .replace(/fit==crop/g, 'fit=crop')
          .replace(/ffit=crop/g, 'fit=crop')
          .replace(/forrmat/g, 'format')
          .replace(/auto=forrmat/g, 'auto=format');
        response += `🖼️ Voir : ${cleanUrl}\n`;
      }
      response += `\n`;
    });

    const foundEndings = [
      `Tu veux plus de détails sur un service en particulier ?`,
      `Qu'est-ce qui te plaît le plus ?`,
      `Tu as des questions sur un de ces services ?`,
      `Dis-moi ce qui t'intéresse !`,
      `Tu veux qu'on parle d'un service en détail ?`
    ];
    
    response += foundEndings[Math.floor(Math.random() * foundEndings.length)];
    return response;
  }

  
  async formatSolutionsResponse(solutions, query, userName) {
    if (solutions.length === 0) {
      
      await this.ensureDataFresh();
      const allSolutions = this.solutions.slice(0, 3);
      
      
      const solGreetings = [
        `Salut${userName ? ` ${userName}` : ''} !`,
        `Hey${userName ? ` ${userName}` : ''} !`,
        `Coucou${userName ? ` ${userName}` : ''} !`
      ];
      
      const solIntros = [
        `Je n'ai pas trouvé de solution spécifique pour "${query}", mais voici ce qu'on propose :`,
        `Pour "${query}", laisse-moi te montrer nos solutions :`,
        `Voici nos solutions qui pourraient t'aider :`
      ];
      
      const solGreeting = solGreetings[Math.floor(Math.random() * solGreetings.length)];
      const solIntro = solIntros[Math.floor(Math.random() * solIntros.length)];
      
      let response = `${solGreeting} ${solIntro}\n\n`;
      
      allSolutions.forEach((solution, index) => {
        response += `**${index + 1}. ${solution.title}**\n`;
        response += `${solution.description}\n`;
        response += `📂 Catégorie : ${solution.category}\n`;
        if (solution.benefits) {
          response += `✨ Avantages : ${solution.benefits}\n`;
        }
        response += `\n`;
      });

      const solEndings = [
        `Tu veux plus de détails sur une solution ?`,
        `Qu'est-ce qui t'intéresse le plus ?`,
        `Tu as des questions sur une de ces solutions ?`,
        `Dis-moi ce qui te plaît !`
      ];
      
      response += solEndings[Math.floor(Math.random() * solEndings.length)];
      return response;
    }

    
    const foundSolGreetings = [
      `Excellent${userName ? ` ${userName}` : ''} !`,
      `Parfait${userName ? ` ${userName}` : ''} !`,
      `Super${userName ? ` ${userName}` : ''} !`,
      `Génial${userName ? ` ${userName}` : ''} !`
    ];
    
    const foundSolIntros = [
      `J'ai trouvé ${solutions.length} solution${solutions.length > 1 ? 's' : ''} qui correspond${solutions.length > 1 ? 'ent' : ''} à ta recherche :`,
      `Voici ${solutions.length} solution${solutions.length > 1 ? 's' : ''} parfaite${solutions.length > 1 ? 's' : ''} pour toi :`,
      `J'ai déniché ${solutions.length} solution${solutions.length > 1 ? 's' : ''} qui vont t'aider :`
    ];
    
    const foundSolGreeting = foundSolGreetings[Math.floor(Math.random() * foundSolGreetings.length)];
    const foundSolIntro = foundSolIntros[Math.floor(Math.random() * foundSolIntros.length)];
    
    let response = `${foundSolGreeting} ${foundSolIntro}\n\n`;
    
    solutions.forEach((solution, index) => {
      response += `**${index + 1}. ${solution.title}**\n`;
      response += `${solution.description}\n`;
      response += `📂 Catégorie : ${solution.category}\n`;
      if (solution.benefits) {
        response += `✨ Avantages : ${solution.benefits}\n`;
      }
      if (solution.use_cases) {
        response += `🎯 Cas d'usage : ${solution.use_cases}\n`;
      }
      if (solution.pricing_info) {
        response += `💰 Tarifs : ${solution.pricing_info}\n`;
      }
      response += `\n`;
    });

    const foundSolEndings = [
      `Tu veux plus de détails sur une solution ?`,
      `Qu'est-ce qui te plaît le plus ?`,
      `Tu as des questions sur une de ces solutions ?`,
      `Dis-moi ce qui t'intéresse !`,
      `Tu veux qu'on parle d'une solution en détail ?`
    ];
    
    response += foundSolEndings[Math.floor(Math.random() * foundSolEndings.length)];
    return response;
  }

  
  async formatPricingResponse(query, userName) {
    await this.ensureDataFresh();
    const companyInfo = this.getCompanyInfo();
    
    let response = `Salut${userName ? ` ${userName}` : ''} !\n\n`;
    
    
    const solutionsWithPricing = this.solutions.filter(sol => sol.pricing_info);
    
    if (solutionsWithPricing.length > 0) {
      response += `Voici nos tarifs basés sur nos solutions actuelles :\n\n`;
      
      solutionsWithPricing.forEach((solution, index) => {
        response += `**${solution.title}**\n`;
        response += `💰 ${solution.pricing_info}\n`;
        response += `📂 ${solution.category}\n\n`;
      });
    } else {
      response += `Les prix dépendent vraiment de ce que tu veux faire :\n\n` +
                 `• **Services** : À partir de 299€/mois\n` +
                 `• **Solutions** : À partir de 199€/mois\n` +
                 `• **Formation** : Sur devis personnalisé\n\n`;
    }
    
    response += `Pour avoir un devis précis, dis-moi :\n` +
               `- Quel type de service t'intéresse ?\n` +
               `- Quelle est la taille de ton entreprise ?\n` +
               `- Quels sont tes besoins spécifiques ?\n\n` +
               `Ou contacte-nous directement : ${companyInfo.contact.email}`;
    
    return response;
  }

  
  formatContactResponse(userName) {
    const companyInfo = this.getCompanyInfo();
    return `Salut${userName ? ` ${userName}` : ''} !\n\n` +
           `Tu peux nous contacter facilement :\n\n` +
           `📧 **Email** : ${companyInfo.contact.email}\n` +
           `📞 **Téléphone** : ${companyInfo.contact.phone}\n` +
           `📍 **Adresse** : ${companyInfo.contact.address}\n\n` +
           `Tu veux qu'on parle de ton projet ?`;
  }

  
  formatGeneralResponse(query, userName) {
    const companyInfo = this.getCompanyInfo();
    return `Salut${userName ? ` ${userName}` : ''} !\n\n` +
           `Je suis l'assistant de ${companyInfo.name} !\n\n` +
           `On peut t'aider avec :\n` +
           `• Nos services (${companyInfo.services} disponibles)\n` +
           `• Nos solutions (${companyInfo.solutions} disponibles)\n` +
           `• Des conseils en cybersécurité\n` +
           `• Des informations sur nos tarifs\n\n` +
           `Dis-moi ce qui t'intéresse !`;
  }

  
  formatDefaultResponse(query, userName) {
    return `Salut${userName ? ` ${userName}` : ''} !\n\n` +
           `Je vois pas trop ce que tu veux dire... Tu peux reformuler ?\n\n` +
           `Ou dis-moi si tu cherches :\n` +
           `• Nos services\n` +
           `• Nos solutions\n` +
           `• Nos tarifs\n` +
           `• Nos coordonnées`;
  }

  
  async getChatbotStats() {
    try {
      const messageStats = await ChatbotMessagesModel.getMessageStats();
      const companyInfo = this.getCompanyInfo();
      
      return {
        ...messageStats,
        company: companyInfo,
        dataLastUpdate: this.lastUpdate
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      return null;
    }
  }

  
  async searchAll(query, limit = 5) {
    await this.ensureDataFresh();
    
    const services = await this.searchRelevantServices(query, limit);
    const solutions = await this.searchRelevantSolutions(query, limit);
    
    return {
      services,
      solutions,
      total: services.length + solutions.length
    };
  }
}

module.exports = new ChatbotIntegrationService();
