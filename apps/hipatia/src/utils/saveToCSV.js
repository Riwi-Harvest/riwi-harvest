
import { createClient } from '@supabase/supabase-js';
import { dotenvLoad } from 'dotenv-mono';

dotenvLoad();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export async function saveToCSV(csvData, filename) {
  try {
    let headers, rows;

    if (Array.isArray(csvData)) {
      if (Array.isArray(csvData[0]) && typeof csvData[0][0] === "object") {
        csvData = csvData.flat();
      }

      if (typeof csvData[0] === "object" && !Array.isArray(csvData[0])) {
        headers = Object.keys(csvData[0] || {});
        rows = csvData.map((obj) => headers.map((h) => obj[h]));
      } else {
        throw new Error("Formato de array no soportado");
      }
    } else if (csvData.headers && csvData.rows) {
      headers = csvData.headers;
      rows = csvData.rows;
    } else {
      throw new Error("Formato de datos no soportado");
    }

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((cell) => {
            const cellStr = String(cell ?? "");
            if (
              cellStr.includes(",") ||
              cellStr.includes('"') ||
              cellStr.includes("\n")
            ) {
              return `"${cellStr.replace(/"/g, '""')}"`;
            }
            return cellStr;
          })
          .join(",")
      ),
    ].join("\n");

    const csvWithBOM = "\uFEFF" + csvContent;
    const buffer = Buffer.from(csvWithBOM, "utf8");

    const { data, error } = await supabase.storage.from('csv').upload(filename, buffer, {
      upsert: true
    });

    if (error) {
      throw new Error(error);
    }

    console.log(data);

    return `uploaded ${filename}`;
  } catch (err) {
    console.error("Error al guardar CSV en Firebase:", err);
    throw err;
  }
}
