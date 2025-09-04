import { parseGradesTable } from "./parseGradesTable.js";

export async function getCourseGrades(page, taskId, shortName) {
  console.log("Procesando notas de:", taskId);
  try {
    const gradeUrl = `${process.env.MOODLE_BASE_URL}/grade/report/grader/index.php?id=${taskId}`;
    await page.goto(gradeUrl, { waitUntil: "networkidle2" });

    await page.waitForSelector("#user-grades", { timeout: 10000 });

    const gradesHtml = await page.content();
    return {
      courseId: taskId,
      grades: await parseGradesTable(gradesHtml, taskId),
    };
  } catch (err) {
    console.warn(
      `Error al obtener calificaciones del curso ${taskId}: ${err.message}`
    );
    return {};
  }
}
