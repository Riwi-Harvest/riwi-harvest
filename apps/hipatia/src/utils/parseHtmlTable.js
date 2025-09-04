import * as cheerio from "cheerio";
import { format, parse } from "date-fns";
import { es } from "date-fns/locale";
import { extractStudentData } from "./extractStudentData.js";

/**
 * Normaliza valores de fecha desde español al formato MySQL
 * @param {string} cellText Texto original de la celda
 * @returns {string} Fecha formateada (YYYY-MM-DD o YYYY-MM-DD HH:mm:ss)
 */
export function normalizeDate(cellText) {
    try {
        // Intentar parsear con formato español largo
        const parsed = parse(
            cellText,
            "EEEE, d 'de' MMMM 'de' yyyy, HH:mm",
            new Date(),
            { locale: es }
        );

        // Si necesitas DATE (solo fecha)
        return format(parsed, "yyyy-MM-dd");

        // 👉 Si prefieres DATETIME, cambia por:
        // return format(parsed, "yyyy-MM-dd HH:mm:ss");
    } catch (err) {
        return cellText; // Si no se pudo parsear, devolver original
    }
}

/**
 * Parsea una tabla HTML y devuelve los headers + filas
 * @param {string} htmlContent Contenido HTML con la tabla
 */
async function parseHTMLTable(htmlContent) {
    console.log("Analizando tabla HTML descargada...");

    const $ = cheerio.load(htmlContent);
    const table = $("table").first();

    if (!table.length) {
        throw new Error("No se encontró tabla en el HTML descargado");
    }

    // Extraer headers
    const headers = [];
    const linkColumns = new Set();
    const studentColumns = new Set();

    table.find("thead th, tr:first-child th").each((index, element) => {
        const $th = $(element);
        const text = $th.text().trim().replace(/\s+/g, " ");

        headers.push(text);

        let isLinkColumn =
            text.toLowerCase().includes("link") ||
            text.toLowerCase().includes("enlace");

        // Verifica si alguna celda en esa columna tiene un href con /mod/assign/
        if (!isLinkColumn) {
            const hasAssignHref =
                table.find(
                    `tbody tr td:nth-child(${index + 1}) a[href*="/mod/assign/"]`
                ).length > 0;

            if (hasAssignHref) {
                isLinkColumn = true;
            }
        }

        if (isLinkColumn) {
            headers.push(`${text} - ID`);
            linkColumns.add(index);

            const isStudentColumn = text.toLowerCase().includes("user");

            if (!isStudentColumn) {
                studentColumns.add(index);
            }
        }
    });

    // Extraer filas de datos
    const rows = [];
    table.find("tbody tr").each((rowIndex, rowElement) => {
        const $row = $(rowElement);
        const rowData = [];

        $row.find("td").each((cellIndex, cellElement) => {
            const $cell = $(cellElement);
            let cellText = $cell.text().trim().replace(/\s+/g, " ");
            const $link = $cell.find("a").first();

            // 🔎 Detectar si es fecha en español y normalizar
            if (/^\w+,\s\d{1,2}\sde\s\w+\sde\s\d{4},\s\d{2}:\d{2}$/.test(cellText)) {
                cellText = normalizeDate(cellText);
            }

            if (studentColumns.has(cellIndex)) {
                const studentData = extractStudentData($cell);

                if (studentData.linkType !== "simple") {
                    rowData.push(studentData.studentCover);
                } else {
                    rowData.push(studentData.text);
                }
                rowData.push(studentData.id);
            } else if (linkColumns.has(cellIndex)) {
                // Siempre empujar dos columnas: texto + ID
                let extractedId = "";
                if ($link.length) {
                    const href = $link.attr("href");
                    const idMatch = href ? href.match(/id=(\d+)/) : null;
                    extractedId = idMatch ? idMatch[1] : "";
                }
                rowData.push(cellText);
                rowData.push(extractedId);
            } else {
                rowData.push(cellText);
            }
        });

        if (rowData.length > 0) {
            rows.push(rowData);
        }
    });

    console.log(`Se extrajeron ${rows.length} filas de datos de la tabla HTML`);

    return {
        headers,
        rows,
        totalRows: rows.length,
        timestamp: new Date().toISOString(),
    };
}

export { parseHTMLTable };

