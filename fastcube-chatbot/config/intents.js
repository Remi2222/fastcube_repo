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

module.exports = {
    handleIntent,
    
};