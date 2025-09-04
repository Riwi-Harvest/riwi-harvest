import * as cheerio from "cheerio";

export async function parseGradesTable(gradesHtml, taskId, returnTaks = false) {
  console.log(`Parseando tabla de calificaciones del curso ${taskId}...`);

  const $ = cheerio.load(gradesHtml);
  const grades = {};

  const activityHeaders = [];

  $("#user-grades thead th.item, #user-grades tr.heading th.item").each(
    (index, element) => {
      const $th = $(element);
      const columnIndex = $th.index();
      let activityName = null;
      let href = null;
      let itemId = $th.attr("data-itemid") || null;

      const $link = $th.find('a[href*="mod/"]');
      if ($link.length > 0) {
        activityName = $link.text().trim();
        href = $link.attr("href");
      } else {
        // Buscar primer link en las celdas de la misma columna (fallback)
        const $cellLink = $(
          `#user-grades tbody tr td:nth-child(${
            columnIndex + 1
          }) a[href*="/mod/"]`
        ).first();
        if ($cellLink.length > 0) {
          activityName = $cellLink.text().trim();
          href = $cellLink.attr("href");
        }

        // Si no hay itemId en el th, intentar obtenerlo de alguna celda
        if (!itemId) {
          const $cellWithItem = $(
            `#user-grades tbody tr td:nth-child(${columnIndex + 1})`
          )
            .filter((i, el) => $(el).attr("data-itemid"))
            .first();

          if ($cellWithItem && $cellWithItem.length) {
            itemId = $cellWithItem.attr("data-itemid") || null;
          }
        }
      }

      // Capturar id del header (link mod/assign, mod/quiz, etc.)
      const idMatch = href ? href.match(/id=(\d+)/) : null;
      const activityId = idMatch ? idMatch[1] : "";

      if (activityName || itemId) {
        activityHeaders.push({
          name:
            activityName ||
            $th.text().trim().replace(/\s+/g, " ") ||
            `activity_${columnIndex}`,
          id: activityId, // <-- id sacado del header
          itemId: itemId || "",
          columnIndex,
          course: taskId
        });
      }
    }
  );

  /* console.log(
    `Actividades individuales encontradas en curso ${taskId}:`,
    activityHeaders.map(
      (h) =>
        `${h.name} (itemId: ${h.itemId}, id: ${h.id}, col: ${h.columnIndex})`
    )
  ); */

  console.log(
    `Actividades individuales encontradas en curso ${taskId}:`,
    activityHeaders);

  // Extraer calificaciones por estudiante
  $("#user-grades tbody tr.userrow").each((index, element) => {
    const $row = $(element);

    const $studentLink = $row.find("a.username").first();
    if ($studentLink.length === 0) return;

    const studentName = $studentLink
      .contents()
      .filter((i, el) => el.type === 'text')
      .map((i, el) => $(el).text())
      .get()
      .join('')
      .trim();

    const studentHref = $studentLink.attr("href");
    const studentIdMatch = studentHref ? studentHref.match(/id=(\d+)/) : null;
    const studentId = studentIdMatch ? studentIdMatch[1] : "";


    if (!studentId) {
      console.warn(`No se pudo extraer ID del estudiante: ${studentName}`);
      return;
    }

    const studentGrades = {
      studentId: studentId,
      studentName: studentName,
      taskId: taskId,
      grades: {},
    };

    activityHeaders.forEach((activity) => {
      const $gradeCell = $row.find(`td[data-itemid="${activity.itemId}"]`);

      let gradeValue = null;
      if ($gradeCell.length > 0) {
        gradeValue = $gradeCell.find(".gradevalue").text().trim();
        if (gradeValue === "-" || gradeValue === "dimmed_text" || !gradeValue) {
          gradeValue = "-";
        }
      }

      studentGrades.grades[activity.name] = {
        value: gradeValue,
        activityId: activity.id, // id desde el header
        itemId: activity.itemId,
        linkId: activity.id, // mismo id exportado al CSV
        course: taskId
      };
    });

    grades[studentId] = studentGrades;
    console.log(
      `Estudiante procesado: ID=${studentId}, Nombre="${studentName}", Actividades=${
        Object.keys(studentGrades.grades).length
      }`
    );
  });

  console.log(
    `Calificaciones extraídas para ${
      Object.keys(grades).length
    } estudiantes del curso ${taskId}`
  );

  if (returnTaks) {
    return {
        activityHeaders,
        grades
    }
  }

  return grades;
}
