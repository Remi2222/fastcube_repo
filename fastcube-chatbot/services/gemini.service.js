require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = process.env.GOOGLE_GEMINI_API_KEY;

if (!API_KEY) {
    throw new Error("GOOGLE_GEMINI_API_KEY is missing in your .env file.");
}

const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({
    model: MODEL_NAME
});

function convertMessages(messages = []) {
    if (!Array.isArray(messages)) return [];

    return messages
        .filter(msg => msg && msg.content)
        .filter(msg => msg.role !== "system")
        .map(msg => ({
            role: msg.role === "assistant" ? "model" : "user",
            parts: [{ text: String(msg.content) }]
        }));
}

async function generateContent(messages = [], options = {}) {
    try {
        const {
            temperature = 0.7,
            topP = 0.95,
            maxOutputTokens = 2048
        } = options;

        const systemMessage = Array.isArray(messages)
            ? messages.find(m => m.role === "system")
            : null;

        const body = {
            contents: convertMessages(messages),
            generationConfig: {
                temperature,
                topP,
                maxOutputTokens
            }
        };

        if (systemMessage?.content) {
            body.systemInstruction = {
                parts: [
                    {
                        text: systemMessage.content
                    }
                ]
            };
        }

        const result = await model.generateContent(body);

        const text = result?.response?.text?.();

        if (!text || !text.trim()) {
            throw new Error("Gemini returned an empty response.");
        }

        return text.trim();

    } catch (err) {
        console.error("❌ Gemini Error:", err.message);

        throw new Error(
            `Gemini request failed: ${err.message}`
        );
    }
}

async function generateFromPrompt(prompt, options = {}) {
    return generateContent(
        [
            {
                role: "user",
                content: prompt
            }
        ],
        options
    );
}

async function healthCheck() {
    try {
        const response = await generateFromPrompt("Reply only with OK");

        return response.toUpperCase().includes("OK");
    } catch {
        return false;
    }
}

module.exports = {
    MODEL_NAME,
    generateContent,
    generateFromPrompt,
    healthCheck
};