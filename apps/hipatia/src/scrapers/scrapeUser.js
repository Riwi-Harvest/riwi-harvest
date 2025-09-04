import { getTaskType } from '../utils/getTaskType.js';
import { linkModulesToTasks } from '../utils/linkModulesToTask.js';
import { mergeStudents } from '../utils/mergeStudents.js';
import { normalizeProgress } from '../utils/normalizeProgress.js';
import { parseGradesTable } from '../utils/parseGradesTable.js';
import { normalizeDate } from '../utils/parseHtmlTable.js';
import { scrapeReport } from './scrapeReport.js';

/**
 *
 * @param {import('puppeteer').Browser} browser
 * @param {import('puppeteer').Page} page
 * @returns
 */
export async function scrapeUsers(browser, page, modules, validClanIds) {
    try {
        let { tableData, htmlContent } = await scrapeReport(browser, process.env.MOODLE_CODERS_REPORT_ID, "full");

        const usersCoursesMap = new Map();

        const headers = tableData.headers.reduce((a,v,i) => {
            a[v] = i;
            return a;
        }, {})

        console.log(tableData.rows.map((coder) => coder).slice(0,5))

        console.log(headers)

        const coders_map = new Map();

        tableData.rows.forEach((coder) => {
            const cleanName = coder[headers['group_name']].replace(/^Cambio jornada, \s*/i, '').trim();
            const cohort = coder[headers['cohort']];
            const shift = coder[headers['shift']];

            const id_clan = `${cleanName.replace(/\s+/g, '_')}-Coh${cohort.split(' ')[1]}-${shift.toLowerCase()}`;

            // Verificar si el clan es válido usando el Set generado
            if (!validClanIds.has(id_clan)) {
                console.log(`Clan ignorado: ${id_clan} (no está en los clanes válidos generados)`);
                return; // Ignorar este coder si el clan no es válido
            }

            const cleanUrl = coder[headers['full_name_link_image']] ? coder[headers['full_name_link_image']].split('/icon')[0] + "/icon" : '';

            const coderObj = {
                id_coder: coder[headers['full_name_link_image - ID']],
                full_name: coder[headers['full_name']],
                name: coder[headers['name']],
                lastname: coder[headers['lastname']],
                id: coder[headers['number_id']],
                email: coder[headers['email']],
                phone: coder[headers['phone']],
                gender: coder[headers['gender']].toLowerCase(),
                inscription_status: coder[headers['inscription_status']],
                city: coder[headers['city']],
                inscription_date_begin: normalizeDate(coder[headers['inscription_date_begin']]),
                inscription_date_end: normalizeDate(coder[headers['inscription_date_end']]),
                photo: cleanUrl,
                id_clan,
                id_role: 1
            };

            // Solo guarda si no existe ya ese ID
            if (!coders_map.has(coderObj.id) || coders_map.has(coderObj.id) !== '577661987654321') {
                coders_map.set(coderObj.id, coderObj);
            }
        });

        const coders_table = Array.from(coders_map.values());


        for (const row of tableData.rows) {
            const courseId = row[headers['course_full_name_link - ID']];
            const courseName = row[headers['course_full_name_link']];

            if (courseId) { // Asegurarnos de que el ID no sea nulo o indefinido
                usersCoursesMap.set(courseId, { id: courseId, name: courseName });
            }
        }

        const usersCoursesArray = Array.from(usersCoursesMap.values());
        console.log(usersCoursesArray);

        const usersGradesMap = new Map();

        let tasks = [];
        let tasks_table = [];

        for (const scrapedCourse of usersCoursesArray) {
            const gradeUrl = `${process.env.MOODLE_BASE_URL}/grade/report/grader/index.php?id=${scrapedCourse.id}`;

            const gradePage = await browser.newPage();
            await gradePage.goto(gradeUrl, { waitUntil: "networkidle2" });

            await gradePage.waitForSelector("#user-grades", { timeout: 10000 });

            const gradesHtml = await gradePage.content();

            const { activityHeaders, grades } = await parseGradesTable(gradesHtml, scrapedCourse.id, true);

            const gradesArray = Object.values(grades);

            usersGradesMap.set(scrapedCourse.id, gradesArray);

            tasks = [...tasks, ...activityHeaders.map((task) => ({
                id_task: task.id,
                name: task.name,
                type: getTaskType(task.name),
                course_id: task.course
            }))]


            tasks_table = linkModulesToTasks(modules, tasks)

            gradePage.close();
        }

        const usersGradesArray = Array.from(usersGradesMap.values())

        console.log(usersGradesArray)
        let task_coders_schema = mergeStudents(usersGradesArray);

        console.log('TASK_TABlE', tasks_table);

        let tasks_coders_table = task_coders_schema.flatMap(coder =>
            Object.values(coder.grades).map(grade => ({
                id_task: grade.activityId || grade.linkId,
                id_coder: coder.id_coder,
                grade: grade.value === '-' ? null : grade.value,
                feedback: null
            }))
        )

        // courses_coders

        const courses_coders_table = tableData.rows.map(c => ({
            id_coder: c[headers['full_name_link_image - ID']],
            id_course: c[headers['course_full_name_link - ID']],
            student_progress: normalizeProgress(c[headers['student_progress']]),
            student_grade: c[headers['student_grade']]
        }))

        return {
            tasks_table,
            tasks_coders_table,
            courses_coders_table,
            coders_table
        }

    } catch (err) {
        console.log('Error al scrapear coders:', err);
        browser.close();
    }
}
