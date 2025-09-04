import pool from "../db.js";

// 📌 Helper para crear errores personalizados con un código HTTP
export function createError(status, message) {
    const err = new Error(message); // Crea un objeto Error con el mensaje
    err.status = status;            // Añade un campo status (código HTTP)
    return err;                     // Devuelve el error para ser lanzado
}

// Obtener todos los registros de una tabla
export async function getAll(table) {
    try {
        const [rows] = await pool.query(`SELECT * FROM ${table}`);
        return rows;
    } catch (error) {
        console.error("Database error getAll:", error);
        throw error;
    }
}

// Obtener registro por id
export async function getById(table, idColumn, id) {
    try {
        const [rows] = await pool.query(
            `SELECT * FROM ${table} WHERE ${idColumn} = ?`,
            [id]
        );
        return rows[0];
    } catch (error) {
        console.error("Database error getById:", error);
        throw error;
    }
}

// Crear un registro
export async function insert(table, data) {
    try {
        const columns = Object.keys(data).join(", ");
        const placeholders = Object.keys(data).map(() => "?").join(", ");
        const values = Object.values(data);

        const [rows] = await pool.query(
            `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`,
            values
        );

        return { id: rows.insertId, ...data };
    } catch (error) {
        console.error("Database error insert:", error);
        throw error;
    }
}

// Actualizar un registro
export async function update(table, idColumn, id, data) {
    try {
        const updates = Object.keys(data).map(key => `${key} = ?`).join(", ");
        const values = [...Object.values(data), id];

        await pool.query(
            `UPDATE ${table} SET ${updates} WHERE ${idColumn} = ?`,
            values
        );

        return { id, ...data };
    } catch (error) {
        console.error("Database error update:", error);
        throw error;
    }
}

// Eliminar un registro
export async function remove(table, idColumn, id) {
    try {
        const [result] = await pool.query(
            `DELETE FROM ${table} WHERE ${idColumn} = ?`,
            [id]
        );
        return result.affectedRows > 0; // true / false como en el schema
    } catch (error) {
        console.error("Database error remove:", error);
        throw error;
    }
}