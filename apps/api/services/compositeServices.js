import pool from "../db.js";

// Buscar por clave compuesta
export async function getByIdComposite(table, keys) {
    const where = Object.keys(keys).map(k => `${k} = ?`).join(" AND ");
    const values = Object.values(keys);
    const [rows] = await pool.query(`SELECT * FROM ${table} WHERE ${where}`, values);
    return rows[0];
}

// Insertar en tabla con clave compuesta
export async function insertComposite(table, data) {
    const columns = Object.keys(data).join(", ");
    const placeholders = Object.keys(data).map(() => "?").join(", ");
    const values = Object.values(data);

    await pool.query(
        `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`,
        values
    );

    return { ...data };
}

// Actualizar por clave compuesta
export async function updateComposite(table, keys, data) {
    const set = Object.keys(data).map(k => `${k} = ?`).join(", ");
    const setValues = Object.values(data);

    const where = Object.keys(keys).map(k => `${k} = ?`).join(" AND ");
    const whereValues = Object.values(keys);

    const [result] = await pool.query(
        `UPDATE ${table} SET ${set} WHERE ${where}`,
        [...setValues, ...whereValues]
    );
    return result;
}

// Eliminar por clave compuesta
export async function removeComposite(table, keys) {
    const where = Object.keys(keys).map(k => `${k} = ?`).join(" AND ");
    const values = Object.values(keys);
    const [result] = await pool.query(`DELETE FROM ${table} WHERE ${where}`, values);
    return result;
}