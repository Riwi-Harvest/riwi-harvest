import * as cheerio from 'cheerio'

export function extractCourseIds(htmlContent) {
    const $ = cheerio.load(htmlContent);
    const courseIds = new Set();

    // Buscar enlaces a cursos en la tabla
    $('a[href*="course/view.php?id="]').each((index, element) => {
        const href = $(element).attr("href");
        const idMatch = href ? href.match(/id=(\d+)/) : null;
        if (idMatch) {
            courseIds.add(idMatch[1]);
        }
    });

    return Array.from(courseIds);
}