import admin from "../../../../packages/firebase/admin.js";

export async function saveToCSV(data, filename) {
  try {
    let headers, rows;

    if (Array.isArray(data)) {
      if (Array.isArray(data[0]) && typeof data[0][0] === "object") {
        data = data.flat();
      }

      if (typeof data[0] === "object" && !Array.isArray(data[0])) {
        headers = Object.keys(data[0] || {});
        rows = data.map((obj) => headers.map((h) => obj[h]));
      } else {
        throw new Error("Formato de array no soportado");
      }
    } else if (data.headers && data.rows) {
      headers = data.headers;
      rows = data.rows;
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

    const bucket = admin.storage().bucket();
    const file = bucket.file(`csv/${filename}`);

    await file.save(buffer, {
      gzip: true,
      metadata: {
        contentType: "text/csv",
        cacheControl: "no-cache",
      },
    });

    console.log(`Archivo ${filename} guardado en bucket ${bucket.name}`);
    return `gs://${bucket.name}/csv/${filename}`;
  } catch (err) {
    console.error("Error al guardar CSV en Firebase:", err);
    throw err;
  }
}
