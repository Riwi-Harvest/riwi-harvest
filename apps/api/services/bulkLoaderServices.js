// services/uploadService.js
import csv from "csv-parser";
import admin from "../../../packages/firebase/admin.js";
import db from "../db.js";
import {
    clans_id_array,
    success_courses_array,
    success_tasks_array,
    success_users_array
} from "../script/loadCsv.js";

export async function loadCsvToTable(table, storagePath) {
    return new Promise((resolve, reject) => {
        const results = [];
        const bucket = admin.storage().bucket();

        bucket.file(storagePath)
            .createReadStream()
            .pipe(csv())
            .on("data", (row) => {
                const cleanRow = {};
                for (let [key, value] of Object.entries(row)) {
                    let cleanKey = key.trim().replace(/\uFEFF/g, "");
                    let cleanValue = value.trim();

                    if (cleanValue === "") {
                        cleanValue = null;
                    } else if (cleanValue.toLowerCase() === "true") {
                        cleanValue = 1;
                    } else if (cleanValue.toLowerCase() === "false") {
                        cleanValue = 0;
                    } else if (!isNaN(cleanValue)) {
                        cleanValue = Number(cleanValue);
                    }

                    cleanRow[cleanKey] = cleanValue;
                }

                // Normalización para coders Medellín
                if (table === "coders" && cleanRow.id_clan) {
                    cleanRow.id_clan = cleanRow.id_clan
                        .replace(/^G\d+_\(/, "") // elimina prefijo tipo G4_(
                        .replace(/\)/, "");      // elimina )
                }

                // Filtros por tabla
                if (table === "tasks" && !cleanRow.id_module) return;
                if (table === "coders" && !clans_id_array.includes(cleanRow.id_clan)) return;
                if (table === "courses_coders" &&
                    (!success_users_array.includes(cleanRow.id_coder) ||
                     !success_courses_array.includes(cleanRow.id_course))) return;
                if (table === "tasks_coders" &&
                    (!cleanRow.id_coder ||
                     !cleanRow.id_task ||
                     !success_users_array.includes(cleanRow.id_coder) ||
                     !success_tasks_array.includes(cleanRow.id_task))) return;

                results.push(cleanRow);
            })
            .on("end", async () => {
                try {
                    let inserted = 0;
                    const batchSize = 1000;

                    await db.query("START TRANSACTION");

                    for (let i = 0; i < results.length; i += batchSize) {
                        const batch = results.slice(i, i + batchSize);

                        const columns = Object.keys(batch[0]).join(",");
                        const placeholders = batch
                            .map(() => `(${Object.keys(batch[0]).map(() => "?").join(",")})`)
                            .join(",");
                        const values = batch.flatMap(row => Object.values(row));

                        let query;
                        if (table === "tasks_coders") {
                            const updates = Object.keys(batch[0])
                                .map(col => `${col}=VALUES(${col})`)
                                .join(",");
                            query = `INSERT INTO ${table} (${columns}) VALUES ${placeholders} ON DUPLICATE KEY UPDATE ${updates}`;
                        } else {
                            query = `INSERT INTO ${table} (${columns}) VALUES ${placeholders}`;
                        }

                        const [result] = await db.query(query, values);
                        inserted += result.affectedRows;

                        // Actualización de arrays de éxito
                        for (let row of batch) {
                            if (table === "tasks" && row.id_task) success_tasks_array.push(row.id_task);
                            if (table === "courses" && row.id_course) success_courses_array.push(row.id_course);
                            if (table === "clans" && row.id_clan) clans_id_array.push(row.id_clan);
                            if (table === "coders" && row.id_coder) success_users_array.push(row.id_coder);
                        }
                    }

                    await db.query("COMMIT");
                    resolve(inserted);
                } catch (err) {
                    await db.query("ROLLBACK");
                    reject(err);
                }
            });
    });
}
