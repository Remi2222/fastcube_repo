
function classifyDocumentType(message = '') {
    const msg = message.toLowerCase();

    if (
        msg.includes('remerciement') ||
        msg.includes('merci') ||
        (msg.includes('email') && msg.includes('remerciement'))
    ) {
        return 'thank_you_email';
    }

    if (
        msg.includes('cybersécurité') ||
        msg.includes('sécurité informatique') ||
        msg.includes('audit de sécurité') ||
        msg.includes('vulnérabilité') ||
        msg.includes('incident de sécurité') ||
        msg.includes('breach') ||
        msg.includes('piratage') ||
        msg.includes('malware') ||
        msg.includes('phishing') ||
        msg.includes('ransomware') ||
        msg.includes('conformité rgpd') ||
        msg.includes('protection des données') ||
        msg.includes('chiffrement') ||
        msg.includes('authentification') ||
        msg.includes('firewall') ||
        msg.includes('antivirus') ||
        msg.includes('sécurisation') ||
        msg.includes('pentest') ||
        msg.includes('test de pénétration')
    ) {
        return 'cybersecurity_document';
    }

    if (
        msg.includes('problème technique') ||
        msg.includes('support technique') ||
        msg.includes('aide technique') ||
        msg.includes('résolution de problème') ||
        msg.includes('bug') ||
        msg.includes('erreur technique') ||
        msg.includes('dépannage') ||
        msg.includes('maintenance')
    ) {
        return 'technical_support';
    }

    if (
        msg.includes('email professionnel') ||
        msg.includes('mail professionnel') ||
        msg.includes('email commercial') ||
        msg.includes('email marketing') ||
        msg.includes('email de relance') ||
        msg.includes('email de prospection') ||
        msg.includes('courrier professionnel')
    ) {
        return 'professional_email';
    }

    if (
        msg.includes('proposition commerciale') ||
        msg.includes('devis') ||
        msg.includes('facture') ||
        msg.includes('contrat') ||
        msg.includes('rapport') ||
        msg.includes('memo') ||
        msg.includes('mémorandum') ||
        msg.includes('lettre de démission') ||
        msg.includes('lettre de recommandation') ||
        msg.includes('lettre de présentation')
    ) {
        return 'business_document';
    }

    return 'motivation_letter';
}

module.exports = {
    classifyDocumentType
};