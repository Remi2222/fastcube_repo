function normalizeUserInput(input) {
    if (!input || typeof input !== 'string') return '';

    let normalized = input.trim().toLowerCase();

    const quickFixes = {
        cava: 'ça va',
        'ca va': 'ça va',
        cc: 'coucou',
        slt: 'salut',
        bjr: 'bonjour',
        'est ce que': 'est-ce que',
        serivces: 'services',
        fatscube: 'fastcube',
        fastcub: 'fastcube',
        fastcubee: 'fastcube'
    };

    Object.entries(quickFixes).forEach(([wrong, correct]) => {
        normalized = normalized.replace(new RegExp(`\\b${wrong}\\b`, 'g'), correct);
    });

    return normalized;
}

function formatResponse(response = '') {
    return response
        .replace(/\[AI:.*?\]/g, '')
        .replace(/\[Utilisateur:.*?\]/g, '')
        .replace(/\[.*?\]/g, '')
        .replace(/Question:.*?$/gm, '')
        .replace(/Answer:.*?$/gm, '')
        .replace(/User:.*?$/gm, '')
        .replace(/Assistant:.*?$/gm, '')
        .replace(/\n\s*\n/g, '\n\n')
        .replace(/\s+$/gm, '')
        .trim();
}

function getCurrentContext() {
    const now = new Date();

    return {
        date: now.toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }),
        time: now.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
        }),
        year: now.getFullYear(),
        timestamp: now.toISOString()
    };
}

module.exports = {
    normalizeUserInput,
    formatResponse,
    getCurrentContext
};