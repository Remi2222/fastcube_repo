const { pool } = require('../config/database');

class ChatbotMemoryModel {

    static async createOrGetSession(sessionId, userId = null, ipAddress = null, userAgent = null, metadata = {}) {
        try {
            const existingSession = await this.getSession(sessionId);
            if (existingSession) {
                await this.updateSessionActivity(sessionId);
                return existingSession;
            }

            const [result] = await pool.execute(`
                INSERT INTO chatbot_sessions (session_id, user_id, user_ip, user_agent, session_metadata, is_active, created_at, last_activity)
                VALUES (?, ?, ?, ?, ?, TRUE, NOW(), NOW())
            `, [sessionId, userId, ipAddress, userAgent, JSON.stringify(metadata)]);

            return {
                id: result.insertId,
                session_id: sessionId,
                user_id: userId,
                user_ip: ipAddress,
                user_agent: userAgent,
                session_metadata: metadata,
                created_at: new Date(),
                is_active: true,
                total_messages: 0
            };

        } catch (error) {
            console.error('Erreur lors de la création/récupération de session:', error);
            throw error;
        }
    }

    static async getSession(sessionId) {
        try {
            const [rows] = await pool.execute('SELECT * FROM chatbot_sessions WHERE session_id = ? AND is_active = TRUE', [sessionId]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error('Erreur lors de la récupération de session:', error);
            throw error;
        }
    }

    static async updateSessionActivity(sessionId) {
        try {
            await pool.execute('UPDATE chatbot_sessions SET last_activity = NOW() WHERE session_id = ?', [sessionId]);
        } catch (error) {
            console.error('Erreur lors de la mise à jour d\'activité:', error);
            throw error;
        }
    }

    static async closeSession(sessionId) {
        try {
            await pool.execute('UPDATE chatbot_sessions SET is_active = FALSE WHERE session_id = ?', [sessionId]);
        } catch (error) {
            console.error('Erreur lors de la fermeture de session:', error);
            throw error;
        }
    }

    static async addShortTermMemory(sessionId, turnNumber, userMessage, botResponse, intent = null, confidenceScore = 0, entities = null, contextData = null, processingTime = null) {
        try {
            const [result] = await pool.execute(`
                INSERT INTO chatbot_short_term_memory
                (session_id, turn_number, user_message, bot_response, intent, confidence_score, entities, context_data, processing_time_ms)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                sessionId,
                turnNumber,
                userMessage,
                botResponse,
                intent,
                confidenceScore,
                JSON.stringify(entities),
                JSON.stringify(contextData),
                processingTime
            ]);

            await this.cleanupOldShortTermMemory(sessionId);

            return result.insertId;

        } catch (error) {
            console.error('Erreur lors de l\'ajout en mémoire à court terme:', error);
            throw error;
        }
    }

    static async getShortTermMemory(sessionId, limit = 10) {
        try {
            const [rows] = await pool.execute(`
                SELECT * FROM chatbot_short_term_memory
                WHERE session_id = ?
                ORDER BY turn_number DESC
                LIMIT ?
            `, [sessionId, limit]);

            return rows.map(row => ({
                ...row,
                entities: row.entities ? JSON.parse(row.entities) : null,
                context_data: row.context_data ? JSON.parse(row.context_data) : null
            }));

        } catch (error) {
            console.error('Erreur lors de la récupération de la mémoire à court terme:', error);
            throw error;
        }
    }

    static async cleanupOldShortTermMemory(sessionId) {
        try {
            await pool.execute(`
                DELETE FROM chatbot_short_term_memory
                WHERE session_id = ?
                AND id NOT IN (
                    SELECT id FROM (
                        SELECT id FROM chatbot_short_term_memory
                        WHERE session_id = ?
                        ORDER BY turn_number DESC
                        LIMIT 20
                    ) AS recent_turns
                )
            `, [sessionId, sessionId]);
        } catch (error) {
            console.error('Erreur lors du nettoyage de la mémoire à court terme:', error);
        }
    }

    static async addLongTermMemory(sessionId, userId, memoryType, memoryKey, memoryValue, confidenceScore = 0, sourceSession = null, metadata = null) {
        try {
            const existing = await this.getLongTermMemory(sessionId, userId, memoryType, memoryKey);

            if (existing) {
                return await this.updateLongTermMemory(existing.id, memoryValue, confidenceScore, metadata);
            }

            const [result] = await pool.execute(`
                INSERT INTO chatbot_long_term_memory
                (session_id, user_id, memory_type, memory_key, memory_value, confidence_score, source_session, metadata)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                sessionId,
                userId,
                memoryType,
                memoryKey,
                memoryValue,
                confidenceScore,
                sourceSession,
                JSON.stringify(metadata)
            ]);

            return result.insertId;

        } catch (error) {
            console.error('Erreur lors de l\'ajout en mémoire à long terme:', error);
            throw error;
        }
    }

    static async getLongTermMemory(sessionId, userId, memoryType, memoryKey) {
        try {
            const [rows] = await pool.execute(`
                SELECT * FROM chatbot_long_term_memory
                WHERE session_id = ? AND user_id = ? AND memory_type = ? AND memory_key = ? AND is_active = TRUE
            `, [sessionId, userId, memoryType, memoryKey]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error('Erreur lors de la récupération de mémoire à long terme:', error);
            throw error;
        }
    }

    static async getAllLongTermMemory(sessionId, userId = null) {
        try {
            let sql = `
                SELECT * FROM chatbot_long_term_memory
                WHERE session_id = ? AND is_active = TRUE
            `;
            let params = [sessionId];

            if (userId) {
                sql += ' AND user_id = ?';
                params.push(userId);
            }

            sql += ' ORDER BY access_count DESC, last_accessed DESC';

            const [rows] = await pool.execute(sql, params);

            return rows.map(row => ({
                ...row,
                metadata: row.metadata ? JSON.parse(row.metadata) : null
            }));

        } catch (error) {
            console.error('Erreur lors de la récupération des mémoires à long terme:', error);
            throw error;
        }
    }

    static async updateLongTermMemory(memoryId, memoryValue, confidenceScore, metadata = null) {
        try {
            await pool.execute(`
                UPDATE chatbot_long_term_memory
                SET memory_value = ?, confidence_score = ?, metadata = ?, last_accessed = NOW()
                WHERE id = ?
            `, [
                memoryValue,
                confidenceScore,
                JSON.stringify(metadata),
                memoryId
            ]);

            return memoryId;
        } catch (error) {
            console.error('Erreur lors de la mise à jour de mémoire à long terme:', error);
            throw error;
        }
    }

    static async addSemanticMemory(sessionId, userId, entityType, entityName, entityValue, entityContext = null, confidenceScore = 0, extractionMethod = null, sourceMessage = null, metadata = null) {
        try {
            const existing = await this.getSemanticMemory(sessionId, entityType, entityName);

            if (existing) {
                return await this.updateSemanticMemory(existing.id, entityValue, entityContext, confidenceScore, metadata);
            }

            const [result] = await pool.execute(`
                INSERT INTO chatbot_semantic_memory
                (session_id, user_id, entity_type, entity_name, entity_value, entity_context, confidence_score, extraction_method, source_message, metadata)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                sessionId,
                userId,
                entityType,
                entityName,
                entityValue,
                entityContext,
                confidenceScore,
                extractionMethod,
                sourceMessage,
                JSON.stringify(metadata)
            ]);

            return result.insertId;

        } catch (error) {
            console.error('Erreur lors de l\'ajout en mémoire sémantique:', error);
            throw error;
        }
    }

    static async getSemanticMemory(sessionId, entityType, entityName) {
        try {
            const [rows] = await pool.execute(`
                SELECT * FROM chatbot_semantic_memory
                WHERE session_id = ? AND entity_type = ? AND entity_name = ?
            `, [sessionId, entityType, entityName]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error('Erreur lors de la récupération de mémoire sémantique:', error);
            throw error;
        }
    }

    static async getAllSemanticMemory(sessionId, userId = null, entityType = null) {
        try {
            let sql = `
                SELECT * FROM chatbot_semantic_memory
                WHERE session_id = ?
            `;
            let params = [sessionId];

            if (userId) {
                sql += ' AND user_id = ?';
                params.push(userId);
            }

            if (entityType) {
                sql += ' AND entity_type = ?';
                params.push(entityType);
            }

            sql += ' ORDER BY last_accessed DESC, access_count DESC';

            const [rows] = await pool.execute(sql, params);

            return rows.map(row => ({
                ...row,
                metadata: row.metadata ? JSON.parse(row.metadata) : null
            }));

        } catch (error) {
            console.error('Erreur lors de la récupération des mémoires sémantiques:', error);
            throw error;
        }
    }

    static async updateSemanticMemory(entityId, entityValue, entityContext, confidenceScore, metadata = null) {
        try {
            await pool.execute(`
                UPDATE chatbot_semantic_memory
                SET entity_value = ?, entity_context = ?, confidence_score = ?, metadata = ?, last_accessed = NOW()
                WHERE id = ?
            `, [
                entityValue,
                entityContext,
                confidenceScore,
                JSON.stringify(metadata),
                entityId
            ]);

            return entityId;
        } catch (error) {
            console.error('Erreur lors de la mise à jour de mémoire sémantique:', error);
            throw error;
        }
    }

    static async getSessionContext(sessionId, userId = null) {
        try {
            const [shortTerm, longTerm, semantic] = await Promise.all([
                this.getShortTermMemory(sessionId, 10),
                this.getAllLongTermMemory(sessionId, userId),
                this.getAllSemanticMemory(sessionId, userId)
            ]);

            return {
                session_id: sessionId,
                short_term_memory: shortTerm,
                long_term_memory: longTerm,
                semantic_memory: semantic,
                context_summary: {
                    recent_turns: shortTerm.length,
                    long_term_facts: longTerm.length,
                    entities_extracted: semantic.length
                }
            };

        } catch (error) {
            console.error('Erreur lors de la récupération du contexte de session:', error);
            throw error;
        }
    }

    static async cleanupInactiveSessions(daysInactive = 7) {
        try {
            const [result] = await pool.execute(`
                UPDATE chatbot_sessions
                SET is_active = FALSE
                WHERE last_activity < DATE_SUB(NOW(), INTERVAL ? DAY)
                AND is_active = TRUE
            `, [daysInactive]);
            return result.affectedRows;

        } catch (error) {
            console.error('Erreur lors du nettoyage des sessions inactives:', error);
            throw error;
        }
    }

    static async getMemoryStats() {
        try {
            const [sessionStats, shortTermStats, longTermStats, semanticStats] = await Promise.all([
                pool.execute('SELECT COUNT(*) as total_sessions, SUM(total_messages) as total_messages FROM chatbot_sessions WHERE is_active = TRUE'),
                pool.execute('SELECT COUNT(*) as total_turns FROM chatbot_short_term_memory'),
                pool.execute('SELECT COUNT(*) as total_memories FROM chatbot_long_term_memory WHERE is_active = TRUE'),
                pool.execute('SELECT COUNT(*) as total_entities FROM chatbot_semantic_memory')
            ]);

            return {
                sessions: sessionStats[0][0],
                short_term_memory: shortTermStats[0][0],
                long_term_memory: longTermStats[0][0],
                semantic_memory: semanticStats[0][0]
            };

        } catch (error) {
            console.error('Erreur lors de la récupération des statistiques:', error);
            throw error;
        }
    }
}
module.exports = ChatbotMemoryModel;