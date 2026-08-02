
import fs from 'fs';
import path from 'path';


const frenchTexts = [
  
  { text: 'Rechercher', key: 'common.search' },
  { text: 'Filtrer', key: 'common.filter' },
  { text: 'Tous', key: 'common.all' },
  { text: 'Détails', key: 'common.details' },
  { text: 'Modifier', key: 'common.edit' },
  { text: 'Supprimer', key: 'common.delete' },
  { text: 'Sauvegarder', key: 'common.save' },
  { text: 'Annuler', key: 'common.cancel' },
  { text: 'Confirmer', key: 'common.confirm' },
  { text: 'Fermer', key: 'common.close' },
  
  
  { text: 'Nom', key: 'form.name' },
  { text: 'Prénom', key: 'form.firstName' },
  { text: 'Email', key: 'form.email' },
  { text: 'Téléphone', key: 'form.phone' },
  { text: 'Adresse', key: 'form.address' },
  { text: 'Ville', key: 'form.city' },
  { text: 'Pays', key: 'form.country' },
  { text: 'Sujet', key: 'form.subject' },
  { text: 'Message', key: 'form.message' },
  { text: 'Description', key: 'form.description' },
  { text: 'Prix', key: 'form.price' },
  { text: 'Durée', key: 'form.duration' },
  { text: 'Catégorie', key: 'form.category' },
  { text: 'Priorité', key: 'form.priority' },
  { text: 'Statut', key: 'form.status' },
  
  
  { text: 'Votre nom', key: 'placeholder.yourName' },
  { text: 'Votre email', key: 'placeholder.yourEmail' },
  { text: 'Votre message', key: 'placeholder.yourMessage' },
  { text: 'Rechercher...', key: 'placeholder.search' },
  { text: 'Sélectionner...', key: 'placeholder.select' },
  { text: 'Décrivez...', key: 'placeholder.describe' },
  
  
  { text: 'Chargement...', key: 'common.loading' },
  { text: 'Erreur', key: 'common.error' },
  { text: 'Succès', key: 'common.success' },
  { text: 'Aucun résultat trouvé', key: 'common.noResults' },
  { text: 'Aucune donnée disponible', key: 'common.noData' },
  
  
  { text: 'Nos Services', key: 'services.title' },
  { text: 'Nos Solutions', key: 'solutions.title' },
  { text: 'Cybersécurité', key: 'services.cybersecurity' },
  { text: 'Infrastructure', key: 'services.infrastructure' },
  { text: 'Cloud', key: 'services.cloud' },
  { text: 'Développement', key: 'services.development' },
  { text: 'Intelligence Artificielle', key: 'services.ai' },
  
  
  { text: 'Accueil', key: 'nav.home' },
  { text: 'À propos', key: 'nav.about' },
  { text: 'Services', key: 'nav.services' },
  { text: 'Solutions', key: 'nav.solutions' },
  { text: 'Blog', key: 'nav.blog' },
  { text: 'Contact', key: 'nav.contact' },
  { text: 'Partenaires', key: 'nav.partners' },
  { text: 'Tickets', key: 'nav.tickets' },
  { text: 'Appels d\'offre', key: 'nav.tenders' },
  
  
  { text: 'Tableau de bord', key: 'dashboard.title' },
  { text: 'Mon Compte', key: 'account.title' },
  { text: 'Mes Tickets', key: 'account.tickets' },
  { text: 'Créer un ticket', key: 'tickets.create' },
  { text: 'Nouveau ticket', key: 'tickets.new' },
  
  
  { text: 'Appels d\'offre', key: 'tenders.title' },
  { text: 'Télécharger', key: 'tenders.download' },
  { text: 'Soumettre une proposition', key: 'tenders.submit' },
  { text: 'Date limite', key: 'tenders.deadline' },
  { text: 'Budget', key: 'tenders.budget' },
  
  
  { text: 'Blog', key: 'blog.title' },
  { text: 'Articles', key: 'blog.articles' },
  { text: 'Lire la suite', key: 'blog.readMore' },
  { text: 'Publié le', key: 'blog.published' },
  { text: 'Auteur', key: 'blog.author' },
  
  
  { text: 'Contactez-nous', key: 'contact.title' },
  { text: 'Demander un devis', key: 'contact.quote' },
  { text: 'Support technique', key: 'contact.support' },
  { text: 'Envoyer', key: 'contact.send' },
  { text: 'Votre message a été envoyé', key: 'contact.sent' },
];


function analyzeFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const issues = [];
    
    
    frenchTexts.forEach(({ text, key }) => {
      const regex = new RegExp(`["']${text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`, 'g');
      const matches = content.match(regex);
      if (matches) {
        issues.push({
          text,
          key,
          count: matches.length,
          lines: getLineNumbers(content, text)
        });
      }
    });
    
    return issues;
  } catch (error) {
    console.error(`Erreur lors de l'analyse de ${filePath}:`, error.message);
    return [];
  }
}


function getLineNumbers(content, text) {
  const lines = content.split('\n');
  const lineNumbers = [];
  
  lines.forEach((line, index) => {
    if (line.includes(text)) {
      lineNumbers.push(index + 1);
    }
  });
  
  return lineNumbers;
}


function analyzeProject() {
  const srcDir = './src';
  const results = {};
  
  function walkDir(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        walkDir(filePath);
      } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
        const issues = analyzeFile(filePath);
        if (issues.length > 0) {
          results[filePath] = issues;
        }
      }
    });
  }
  
  walkDir(srcDir);
  return results;
}


const results = analyzeProject();

console.log('🔍 ANALYSE DES TEXTES NON TRADUITS');
console.log('=====================================\n');

let totalIssues = 0;
Object.entries(results).forEach(([filePath, issues]) => {
  console.log(`📁 ${filePath}`);
  issues.forEach(issue => {
    console.log(`  ❌ "${issue.text}" (${issue.count}x) → ${issue.key}`);
    console.log(`     Lignes: ${issue.lines.join(', ')}`);
    totalIssues += issue.count;
  });
  console.log('');
});

console.log(`\n📊 RÉSUMÉ:`);
console.log(`   Fichiers avec problèmes: ${Object.keys(results).length}`);
console.log(`   Total des textes à traduire: ${totalIssues}`);


const report = {
  summary: {
    filesWithIssues: Object.keys(results).length,
    totalTextsToTranslate: totalIssues
  },
  files: results
};

fs.writeFileSync('./translation-analysis.json', JSON.stringify(report, null, 2));
console.log('\n📄 Rapport détaillé sauvegardé dans: translation-analysis.json');







