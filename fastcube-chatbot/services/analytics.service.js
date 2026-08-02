const { pool } = require("../config/database");

/**
 * Enregistre une interaction utilisateur
 */
async function logUserInteraction({
    userId = null,
    sessionId,
    message,
    intent = "unknown",
    confidence = 0,
    responseTime = 0,
    userAgent = null,
    ipAddress = null
}) {
    try {
        await pool.execute(
            `
            INSERT INTO chatbot_logs (
                user_id,
                session_id,
                message,
                intent,
                confidence,
                response_time_ms,
                user_agent,
                ip_address
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                userId,
                sessionId,
                message,
                intent,
                confidence,
                responseTime,
                userAgent,
                ipAddress
            ]
        );

    } catch (error) {
        console.error("Analytics Error:", error.message);
    }
}

/**
 * Statistiques des 30 derniers jours
 */
async function analyzeTrends() {

    try {

        const [intentStats] = await pool.execute(`
            SELECT
                intent,
                COUNT(*) AS count,
                ROUND(AVG(confidence),2) AS avg_confidence
            FROM chatbot_logs
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            GROUP BY intent
            ORDER BY count DESC
        `);

        const [globalStats] = await pool.execute(`
            SELECT
                COUNT(*) AS total_messages,
                COUNT(DISTINCT user_id) AS active_users,
                COUNT(DISTINCT session_id) AS sessions,
                ROUND(AVG(response_time_ms),0) AS avg_response_time
            FROM chatbot_logs
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        `);

        const [serviceStats] = await pool.execute(`
            SELECT
                CASE
                    WHEN message LIKE '%développement%' OR message LIKE '%site web%'
                        THEN 'Développement Web'

                    WHEN message LIKE '%mobile%' OR message LIKE '%application%'
                        THEN 'Applications Mobiles'

                    WHEN message LIKE '%cloud%'
                        THEN 'Cloud'

                    WHEN message LIKE '%cybersécurité%'
                        THEN 'Cybersécurité'

                    WHEN message LIKE '%IA%' OR message LIKE '%intelligence artificielle%'
                        THEN 'Intelligence Artificielle'

                    ELSE 'Autres'
                END AS service,

                COUNT(*) AS total

            FROM chatbot_logs

            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)

            GROUP BY service

            ORDER BY total DESC;
        `);

        return {

            success: true,

            data: {

                period: "30 jours",

                generatedAt: new Date(),

                totals: globalStats[0],

                intents: intentStats,

                services: serviceStats

            }

        };

    } catch (error) {

        console.error(error);

        return {

            success: false,

            error: error.message

        };

    }

}

module.exports = {

    logUserInteraction,

    analyzeTrends

};