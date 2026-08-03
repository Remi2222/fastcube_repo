async function handleIntent(message, user) {
    const msg = (message || '').toLowerCase();

    const resumeTriggers = [
        'peux-tu résumer', 'peux tu résumer', 'peut-on résumer', 'peut on résumer',
        'résume-moi', 'résume moi', 'fais un résumé', 'résumé de'
    ];
    if (resumeTriggers.some(t => msg.includes(t))) {
        return handleResumeIntent(message, user);
    }

    const rhTriggers = [
        'lettre de motivation', 'email de remerciement', 'email professionnel',
        'devis', 'facture', 'contrat', 'rapport', 'proposition commerciale',
        'support technique', 'audit de sécurité', 'cybersécurité'
    ];
    if (rhTriggers.some(t => msg.includes(t))) {
        return handleRHIntent(message, user);
    }

    const response = await processChatbotMessage(message, user);
    return {
        success: true,
        message: 'Réponse générée avec succès',
        response,
        type: 'general_chat'
    };
}
function classifyDocumentType(message) {
    const msg = message.toLowerCase();

    if (msg.includes('remerciement') || msg.includes('merci') ||
        (msg.includes('email') && msg.includes('remerciement'))) {
        return 'thank_you_email';
    }

    if (msg.includes('cybersécurité') || msg.includes('sécurité informatique') ||
        msg.includes('audit de sécurité') || msg.includes('vulnérabilité') ||
        msg.includes('incident de sécurité') || msg.includes('breach') ||
        msg.includes('piratage') || msg.includes('malware') || msg.includes('phishing') ||
        msg.includes('ransomware') || msg.includes('conformité rgpd') ||
        msg.includes('protection des données') || msg.includes('chiffrement') ||
        msg.includes('authentification') || msg.includes('firewall') ||
        msg.includes('antivirus') || msg.includes('sécurisation') ||
        msg.includes('pentest') || msg.includes('test de pénétration')) {
        return 'cybersecurity_document';
    }

    if (msg.includes('problème technique') || msg.includes('support technique') ||
        msg.includes('aide technique') || msg.includes('résolution de problème') ||
        msg.includes('bug') || msg.includes('erreur technique') ||
        msg.includes('dépannage') || msg.includes('maintenance')) {
        return 'technical_support';
    }

    if (msg.includes('email professionnel') || msg.includes('mail professionnel') ||
        msg.includes('email commercial') || msg.includes('email marketing') ||
        msg.includes('email de relance') || msg.includes('email de prospection') ||
        msg.includes('courrier professionnel')) {
        return 'professional_email';
    }

    if (msg.includes('proposition commerciale') || msg.includes('devis') ||
        msg.includes('facture') || msg.includes('contrat') || msg.includes('rapport') ||
        msg.includes('memo') || msg.includes('mémorandum') ||
        msg.includes('lettre de démission') || msg.includes('lettre de recommandation') ||
        msg.includes('lettre de présentation')) {
        return 'business_document';
    }

    return 'motivation_letter';
}


module.exports = {
    handleIntent,
    
};