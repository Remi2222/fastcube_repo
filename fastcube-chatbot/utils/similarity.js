function calculateSimilarity(str1, str2) {
    if (!str1 || !str2) return 0;

    str1 = str1.toLowerCase().trim();
    str2 = str2.toLowerCase().trim();

    if (str1 === str2) return 1;

    return tokenSimilarity(str1, str2);
}

function tokenSimilarity(str1, str2) {
    const words1 = str1.split(/\s+/);
    const words2 = str2.split(/\s+/);

    let common = 0;

    words1.forEach(word => {
        if (words2.includes(word)) common++;
    });

    return common / Math.max(words1.length, words2.length);
}

function levenshteinDistance(a, b) {
    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }

    return matrix[b.length][a.length];
}

function cosineSimilarity(str1, str2) {
    const words1 = str1.toLowerCase().split(/\s+/);
    const words2 = str2.toLowerCase().split(/\s+/);

    const vocabulary = [...new Set([...words1, ...words2])];

    const vec1 = vocabulary.map(word => words1.filter(w => w === word).length);
    const vec2 = vocabulary.map(word => words2.filter(w => w === word).length);

    let dot = 0;
    let mag1 = 0;
    let mag2 = 0;

    for (let i = 0; i < vocabulary.length; i++) {
        dot += vec1[i] * vec2[i];
        mag1 += vec1[i] * vec1[i];
        mag2 += vec2[i] * vec2[i];
    }

    if (mag1 === 0 || mag2 === 0) return 0;

    return dot / (Math.sqrt(mag1) * Math.sqrt(mag2));
}

function calculateScore(question, candidate) {
    if (!candidate) return 0;

    return (
        calculateSimilarity(question, candidate) * 0.5 +
        cosineSimilarity(question, candidate) * 0.3 +
        (
            1 -
            levenshteinDistance(question, candidate) /
            Math.max(question.length, candidate.length, 1)
        ) * 0.2
    );
}

function findBestMatch(question, list  = []) {
    let best = null;
    let bestScore = 0;

    for (const item of list) {
        const score = calculateScore(question, item.question || "");

        if (score > bestScore) {
            bestScore = score;
            best = item;
        }
    }

    return {
        match: best,
        score: bestScore
    };
}

module.exports = {
    calculateSimilarity,
    cosineSimilarity,
    levenshteinDistance,
    findBestMatch,
    calculateScore,
    tokenSimilarity
};