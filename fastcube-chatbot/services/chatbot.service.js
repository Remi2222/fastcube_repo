const { generateFromPrompt } = require("./gemini.service");
const { searchInCSVKnowledge } = require("./csv.service");
const { retrieveContext } = require("./rag.service");

async function askGemini(question) {
    try {
        // Recherche dans le CSV
        const csvResults = await searchInCSVKnowledge(question, 3);

        // Recherche vectorielle
        const { vectorResults } = await retrieveContext(question);

        let context = "";

        csvResults.forEach(item => {
            context += `Question: ${item.question}\nRéponse: ${item.reponse}\n\n`;
        });

        vectorResults.forEach(item => {
            context += `Question: ${item.document}\nRéponse: ${item.metadata.reponse}\n\n`;
        });

        const prompt = `
Tu es l'assistant IA de FastCube.

Utilise uniquement les informations suivantes si elles sont pertinentes.

${context}

Question :
${question}

Réponds uniquement en français de façon professionnelle.
`;

        return await generateFromPrompt(prompt);

    } catch (error) {
        console.error("Erreur chatbot :", error);

        return "Je suis désolé, une erreur est survenue lors du traitement de votre demande.";
    }
}

function generateFallbackResponse(question) {
    return "Merci pour votre message. Pouvez-vous donner plus de détails afin que je puisse vous aider ?";
}

function formatResponse(text) {
    return text
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}

function getCurrentContext() {
    const now = new Date();

    return {
        date: now.toLocaleDateString("fr-FR"),
        time: now.toLocaleTimeString("fr-FR"),
        year: now.getFullYear()
    };
}

module.exports = {
    askGemini,
    generateFallbackResponse,
    formatResponse,
    getCurrentContext
};