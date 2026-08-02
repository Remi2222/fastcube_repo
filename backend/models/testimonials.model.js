const { pool } = require('../config/database-unified');

class Testimonial {

    static async create(data) {
        const {
            user_id = null,
            user_name,
            message,
            rating,
            approved = 0
        } = data;

        const [result] = await pool.execute(
            `INSERT INTO testimonials
            (user_id, user_name, message, rating, approved)
            VALUES (?, ?, ?, ?, ?)`,
            [
                user_id,
                user_name,
                message,
                rating,
                approved
            ]
        );

        return result.insertId;
    }

    static async getApproved(limit = 10) {

    console.log("LIMIT =", limit);
    console.log("TYPE =", typeof limit);

    const sql = `
        SELECT
            id,
            user_id,
            user_name,
            message,
            rating,
            approved,
            created_at
        FROM testimonials
        WHERE approved = 1
        ORDER BY created_at DESC
        LIMIT ${Number(limit)}
    `;

    console.log(sql);

    const [rows] = await pool.query(sql);

    return rows;
}
    static async getAll() {
        const [rows] = await pool.execute(
            `SELECT
                id,
                user_id,
                user_name,
                message,
                rating,
                approved,
                created_at
             FROM testimonials
             ORDER BY created_at DESC`
        );

        return rows;
    }

    static async getPending(limit = 10) {

    limit = Number(limit);

    if (!Number.isInteger(limit) || limit <= 0) {
        limit = 10;
    }

    const sql = `
        SELECT *
        FROM testimonials
        WHERE approved = 0
        ORDER BY created_at DESC
        LIMIT ${limit}
    `;

    const [rows] = await pool.query(sql);

    return rows;
}

    static async getById(id) {
        const [rows] = await pool.execute(
            `SELECT *
             FROM testimonials
             WHERE id = ?`,
            [id]
        );

        return rows[0] || null;
    }

    static async getByUserId(userId) {
        const [rows] = await pool.execute(
            `SELECT *
             FROM testimonials
             WHERE user_id = ?`,
            [userId]
        );

        return rows;
    }

    static async updateStatus(id, approved) {
        const [result] = await pool.execute(
            `UPDATE testimonials
             SET approved = ?
             WHERE id = ?`,
            [approved, id]
        );

        return result.affectedRows > 0;
    }

    static async update(id, userId, data) {

        const {
            user_name,
            message,
            rating
        } = data;

        const [result] = await pool.execute(
            `UPDATE testimonials
             SET
                user_name = ?,
                message = ?,
                rating = ?
             WHERE id = ?
             AND (user_id = ? OR user_id IS NULL)`,
            [
                user_name,
                message,
                rating,
                id,
                userId
            ]
        );

        return result.affectedRows > 0;
    }

    static async delete(id) {

        const [result] = await pool.execute(
            `DELETE FROM testimonials
             WHERE id = ?`,
            [id]
        );

        return result.affectedRows > 0;
    }

    static async getStats() {

        const [rows] = await pool.execute(`
            SELECT
                COUNT(*) total,
                SUM(CASE WHEN approved = 1 THEN 1 ELSE 0 END) approved,
                SUM(CASE WHEN approved = 0 THEN 1 ELSE 0 END) pending,
                AVG(rating) avg_rating
            FROM testimonials
        `);

        return rows[0];
    }

    static async search(keyword) {

        const [rows] = await pool.execute(
            `SELECT *
             FROM testimonials
             WHERE user_name LIKE ?
             OR message LIKE ?
             ORDER BY created_at DESC`,
            [
                `%${keyword}%`,
                `%${keyword}%`
            ]
        );

        return rows;
    }

}

module.exports = Testimonial;