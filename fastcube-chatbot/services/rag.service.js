const VectorDatabase = require("./vector-db.service");
const { searchInCSVKnowledge } = require("./csv.service");

let vectorDB = null;

async function initializeRAG() {
    try {
        vectorDB = new VectorDatabase();
        await vectorDB.initialize();

        console.log("✅ RAG initialisé");
    } catch (error) {
        console.error("❌ Erreur lors de l'initialisation du RAG :", error);
        vectorDB = null;
    }
}

async function retrieveContext(question) {
    try {
        const csvResults = await searchInCSVKnowledge(question, 3);

        let vectorResults = [];

        if (vectorDB?.initialized) {
            vectorResults = await vectorDB.semanticSearch(question, 2);
        }

        return {
            csvResults,
            vectorResults
        };
    } catch (error) {
        console.error("❌ Erreur retrieveContext :", error);

        return {
            csvResults: [],
            vectorResults: []
        };
    }
}

function getVectorDB() {
    return vectorDB;
}

module.exports = {
    initializeRAG,
    retrieveContext,
    getVectorDB
};