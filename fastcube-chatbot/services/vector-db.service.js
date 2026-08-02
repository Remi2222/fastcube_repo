const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const csv = require('csv-parser');

const TRAINING_DATA_PATH = path.join(
    __dirname,
    "../data/training-data.csv"
);
class VectorDatabase {
    constructor() {
        this.documents = [];
        this.embeddings = [];
        this.metadata = [];
        this.initialized = false;
    }

    async initialize() {
        try {
            console.log('🔄 Initialisation de la base vectorielle simplifiée...');
            await this.loadTrainingData();
            await this.generateEmbeddings();
            this.initialized = true;
            console.log('✅ Base vectorielle simplifiée initialisée avec succès');
        } catch (error) {
            console.error('❌ Erreur lors de l\'initialisation de la base vectorielle:', error);
            this.initialized = false;
        }
    }

    async loadTrainingData() {
        return new Promise((resolve, reject) => {
            const results = [];

            if (!fs.existsSync(TRAINING_DATA_PATH)) {
                console.warn('⚠️ Fichier de données d\'entraînement non trouvé, utilisation de données par défaut');
                this.documents = this.getDefaultDocuments();
                this.metadata = this.getDefaultMetadata();
                resolve();
                return;
            }

            fs.createReadStream(TRAINING_DATA_PATH)
                .pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', () => {
                    this.documents = results.map(row => row.question);
                    this.metadata = results.map(row => ({
                        question: row.question,
                        reponse: row.reponse,
                        categorie: row.categorie,
                        action: row.action
                    }));
                    console.log(`📚 ${results.length} documents chargés depuis le CSV`);
                    resolve();
                })
                .on('error', reject);
        });
    }

    async generateEmbeddings() {
        try {
            console.log('🔄 Génération des embeddings...');
            const embeddings = await this.generateEmbeddingsWithPython(this.documents);

            if (embeddings && embeddings.length > 0) {
                this.embeddings = embeddings;
                console.log(`✅ ${embeddings.length} embeddings générés`);
            } else {
                this.embeddings = this.generateRandomEmbeddings(this.documents.length);
                console.log('⚠️ Utilisation d\'embeddings aléatoires (fallback)');
            }

        } catch (error) {
            console.error('❌ Erreur lors de la génération des embeddings:', error);
            this.embeddings = this.generateRandomEmbeddings(this.documents.length);
        }
    }

    async generateEmbeddingsWithPython(documents) {
        if (documents.length <= 1) {
            return this.generateRandomEmbeddings(documents.length);
        }

        const pythonCode = `
import json
import sys
import numpy as np
from sentence_transformers import SentenceTransformer

try:
    model = SentenceTransformer('all-MiniLM-L6-v2')
    documents = json.loads(sys.stdin.read())
    embeddings = model.encode(documents).tolist()
    print(json.dumps(embeddings))
except Exception as e:
    print(json.dumps([]))
`;

        return new Promise((resolve) => {
            const py = spawn('python', ['-c', pythonCode], { cwd: __dirname });
            let stdout = '';
            let stderr = '';

            const timeout = setTimeout(() => {
                py.kill('SIGKILL');
                console.warn('⚠️ Timeout lors de la génération des embeddings Python');
                resolve(this.generateRandomEmbeddings(documents.length));
            }, 10000);

            py.stdout.on('data', (d) => (stdout += d.toString()));
            py.stderr.on('data', (d) => (stderr += d.toString()));
            py.on('close', () => {
                clearTimeout(timeout);
                try {
                    const embeddings = JSON.parse(stdout.trim() || '[]');
                    resolve(embeddings.length > 0 ? embeddings : this.generateRandomEmbeddings(documents.length));
                } catch (e) {
                    console.warn('⚠️ Erreur lors du parsing des embeddings Python:', e.message);
                    resolve(this.generateRandomEmbeddings(documents.length));
                }
            });

            py.stdin.write(JSON.stringify(documents));
            py.stdin.end();
        });
    }

    generateRandomEmbeddings(count) {
    return Array.from({ length: count }, () =>
        Array.from({ length: 384 }, () => Math.random() * 2 - 1)
    );
    }

    async semanticSearch(query, topK = 5) {

    if (!this.initialized)
        return [];

    return this.fallbackSearch(query, topK);

    }

    fallbackSearch(query, topK = 5) {

    if (!query) return [];

    const words = query
        .toLowerCase()
        .split(/\s+/)
        .filter(word => word.length > 2);

    const results = [];

    for (let i = 0; i < this.documents.length; i++) {

        const document = (this.documents[i] || "").toLowerCase();
        const metadata = this.metadata[i] || {};

        let score = 0;

        for (const word of words) {

            if (document.includes(word))
                score += 2;

            if (
                metadata.categorie &&
                metadata.categorie.toLowerCase().includes(word)
            )
                score += 3;

            if (
                metadata.reponse &&
                metadata.reponse.toLowerCase().includes(word)
            )
                score += 1;

        }

        if (score > 0) {
            results.push({
                document: this.documents[i],
                metadata,
                similarity: score,
                index: i
            });
        }
    }

    return results
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, topK);
    }

    getDefaultDocuments() {
        return [
            "Bonjour, je cherche une entreprise pour développer notre site web",
            "Qui êtes-vous et que faites-vous ?",
            "Nous avons besoin de sécuriser nos données, que proposez-vous ?",
            "Comment vous contacter pour un projet ?",
            "Combien coûte un site web professionnel ?",
            "Pouvez-vous nous aider à migrer vers le cloud ?",
            "Nous avons des problèmes de performance sur notre application",
            "Recherchons un développeur pour notre équipe",
            "Avez-vous des références dans notre secteur ?"
        ];
    }

    getDefaultMetadata() {
        return [
            { question: "Bonjour, je cherche une entreprise pour développer notre site web", reponse: "Bonjour ! FASTCUBE est spécialisée dans le développement web sur mesure.", categorie: "accueil", action: "SHOW_SERVICES" },
            { question: "Qui êtes-vous et que faites-vous ?", reponse: "FASTCUBE est une entreprise de conseil en technologies innovantes.", categorie: "presentation", action: "SHOW_ABOUT" },
            { question: "Nous avons besoin de sécuriser nos données, que proposez-vous ?", reponse: "Nous proposons des solutions complètes de cybersécurité.", categorie: "securite", action: "SHOW_SERVICES" },
            { question: "Comment vous contacter pour un projet ?", reponse: "Vous pouvez nous contacter par téléphone au 01 23 45 67 89.", categorie: "contact", action: "CONTACT_TEAM" },
            { question: "Combien coûte un site web professionnel ?", reponse: "Nos tarifs varient selon la complexité.", categorie: "devis", action: "REQUEST_QUOTE" },
            { question: "Pouvez-vous nous aider à migrer vers le cloud ?", reponse: "Absolument ! Nous accompagnons votre migration cloud étape par étape.", categorie: "cloud", action: "SHOW_SERVICES" },
            { question: "Nous avons des problèmes de performance sur notre application", reponse: "Nous réalisons des audits de performance complets.", categorie: "audit", action: "SHOW_SERVICES" },
            { question: "Recherchons un développeur pour notre équipe", reponse: "Nous proposons des services de développement sur mesure.", categorie: "development", action: "SHOW_SERVICES" },
            { question: "Avez-vous des références dans notre secteur ?", reponse: "Nous avons accompagné plus de 200 clients dans divers secteurs.", categorie: "presentation", action: "SHOW_PORTFOLIO" }
        ];
    }

    getStats() {
    return {
        initialized: this.initialized,
        documents_count: this.documents.length,
        embeddings_count: this.embeddings.length,
        model: "all-MiniLM-L6-v2",
        vector_store: "memory"
    };
}
    }
module.exports = VectorDatabase;