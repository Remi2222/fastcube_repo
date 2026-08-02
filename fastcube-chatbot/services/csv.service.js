const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const TRAINING_DATA_PATH = path.join(
    __dirname,
    "../data/training-data.csv"
);

let csvKnowledge = [];

async function loadCSVKnowledge() {
    return new Promise((resolve, reject) => {

        if (csvKnowledge.length > 0) {
            return resolve(csvKnowledge);
        }

        if (!fs.existsSync(TRAINING_DATA_PATH)) {
            console.warn("⚠️ training-data.csv introuvable");
            csvKnowledge = [];
            return resolve([]);
        }

        const results = [];

        fs.createReadStream(TRAINING_DATA_PATH)
            .pipe(csv())
            .on("data", row => results.push(row))
            .on("end", () => {

                csvKnowledge = results;

                console.log(
                    `📚 ${csvKnowledge.length} connaissances chargées`
                );

                resolve(csvKnowledge);
            })
            .on("error", reject);

    });
}

async function searchInCSVKnowledge(query, limit = 3) {

    if (!query) return [];

    if (csvKnowledge.length === 0) {
        await loadCSVKnowledge();
    }

    const words = query
        .toLowerCase()
        .split(/\s+/)
        .filter(w => w.length > 2);

    const matches = csvKnowledge
        .map(item => {

            let score = 0;

            const question = (item.question || "").toLowerCase();
            const answer = (item.reponse || "").toLowerCase();
            const category = (item.categorie || "").toLowerCase();

            words.forEach(word => {

                if (question.includes(word))
                    score += 2;

                if (answer.includes(word))
                    score += 1;

                if (category.includes(word))
                    score += 3;

            });

            return {
                ...item,
                score
            };

        })
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

    return matches;
}

module.exports = {
    loadCSVKnowledge,
    searchInCSVKnowledge
};