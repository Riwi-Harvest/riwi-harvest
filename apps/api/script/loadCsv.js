import { loadCsvToTable } from "../services/bulkLoaderServices.js";

const tablesOrder = [
    "institutions",
    "cohorts",
    "shifts",
    "categories",
    "courses",
    "modules",
    "tasks",
    "roles",
    "clans",
    "coders",
    "courses_coders",
    "tasks_coders"
];

// const tablesOrder = [
//     "tasks_coders"
// ];

export let clans_id_array = [];
export let success_users_array = [];
export let success_courses_array = [];
export let success_tasks_array = [];

export async function loadAll() {

    try {
        for (let table of tablesOrder) {
            console.log(`Cargando ${table}.csv desde Firebase...`);

            const rows = await loadCsvToTable(table, `csv/${table}.csv`);
            console.log(`${rows} filas insertadas en ${table}`);
        }

        console.log("Carga masiva completada");

    } catch (err) {
        console.error("Error durante la carga masiva:", err);
    }
}

