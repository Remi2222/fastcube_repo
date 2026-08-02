const { processChatbotMessage } = require("./chatbot.service");

/**
 * Transcrit un fichier audio.
 * Pour l'instant cette fonction est un placeholder.
 * Elle pourra être remplacée par :
 * - Google Speech-to-Text
 * - Whisper
 * - Gemini Audio
 */
async function speechToText(audioBuffer, mimeType) {

    // TODO : intégrer un vrai moteur Speech-to-Text

    return {
        success: true,
        transcript: "Bonjour, quels sont vos services de cybersécurité ?",
        confidence: 1
    };

}

/**
 * Traite un message vocal
 */
async function processVoiceInput(audioBuffer, mimeType, sessionId = null) {

    try {

        const speech = await speechToText(audioBuffer, mimeType);

        if (!speech.success) {
            return speech;
        }

        const chatbot = await processChatbotMessage(
            speech.transcript,
            sessionId
        );

        return {

            success: true,

            transcript: speech.transcript,

            confidence: speech.confidence,

            chatbot

        };

    } catch (error) {

        console.error("Voice Service:", error);

        return {

            success: false,

            error: error.message

        };

    }

}

module.exports = {

    speechToText,

    processVoiceInput

};