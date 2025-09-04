import { dotenvLoad } from "dotenv-mono";
import { scrapeCohorts } from "./scrapers/ScrapeCohorts.js";
import { scrapeCourse } from "./scrapers/scrapeCourse.js";
import { scrapeLocations } from "./scrapers/scrapeLocations.js";
import { scrapeReport } from "./scrapers/scrapeReport.js";
import { scrapeShifts } from "./scrapers/scrapeShifts.js";
import { scrapeUsers } from "./scrapers/scrapeUser.js";
import { launchBrowser } from "./utils/browser.js";
import { __joindirname } from "./utils/dirname.js";
import { login } from "./utils/login.js";
import { saveToCSV } from "./utils/saveToCSV.js";

const dotenv = dotenvLoad();

const uploadFolder = '../downloads';

/**
 * Ejecuta el proceso de scraping, extracción de datos y guardado en CSV.
 *
 * @returns {Promise<{
 *   status: number,
 *   ok: boolean,
 *   files: {
 *     file_path: string,
 *     uploaded: Array<{ filename: string }> | void
 *   }
 * } | void>} Retorna un objeto con el estado de la ejecución y detalles de los
 * archivos generados si todo sale bien, o `void` en caso de error.
 */
export const runHipatia = async () => {
  let browser;

  let clans_table = [];

  let institutions_table = [];
  let cohorts_table = [];
  let shifts_table = [];
  let categories_table = [];
  let courses_table = [];
  let modules_table = [];
  let roles_table = [];

  /* return {
      status: 200,
      ok: true,
      files: {
        file_path: __joindirname(import.meta.url, uploadFolder),
      }
    } */

  try {
    browser = await launchBrowser();
    const page = await browser.newPage();

    console.log("Iniciando login...");
    await login(page);
    console.log("Login exitoso.");

    const clanRes = await scrapeReport(browser, process.env.MOODLE_CLANS_REPORT_ID)

    const clans = Array.from(
      new Map(
        clanRes.rows
          .filter(([name, cohort]) => /Cohorte (3|4)/.test(cohort))
          .map(([name, cohort, shift]) => {
            const cleanName = name.replace(/^Cambio jornada, \s*/i, '').trim();
            return [
              `${cleanName}-${cohort}-${shift}`,
              {
                id_clan: `${cleanName.replace(/\s+/g, '_')}-Coh${cohort.split(' ')[1]}-${shift.toLowerCase()}`,
                name: cleanName,
              }
            ];
          })
      ).values()
    );

    const validClanIds = new Set(clans.map(clan => clan.id_clan));

    clans_table = [...clans_table, ...clans]

    const roles = [{
      id_role: 1,
      name: 'Estudiante'
    }]

    roles_table = [...roles_table, roles];


    console.log("Scrapeando sedes y cohortes...");
    const locations = await scrapeLocations(page);
    // console.log(`Encontradas ${locations.length} sedes`);

    const institutionsTable = locations.map((l) => ({ id_institution: l.id, name: l.name }));
    institutions_table = institutionsTable;

    // Process locations sequentially to avoid overwhelming the server
    for (const location of locations) {
      console.log(`Procesando sede: ${location.name}`);

      console.log(location);

      if (!location.cohorts || location.cohorts.length === 0) {
        console.log(`  No hay cohortes para ${location.name}`);
        continue;
      }

      const cohortsTable = location.cohorts.map((c) => ({
        id_cohort: c.id,
        name: c.name,
        id_institution: location.id
      }));

      cohorts_table = [...cohorts_table, ...cohortsTable];

      // console.log('COHORST_TABLE:', cohortsTable)

      // Process cohorts sequentially with delay
      for (const cohort of location.cohorts) {
        try {
          console.log(`  Procesando cohorte: ${cohort.name || cohort.link}`);
          const shiftRes = await scrapeCohorts(page, cohort.link);
          // console.log(`  Resultado:`, shiftRes);

          // Add small delay between requests to be respectful to the server
          await new Promise((resolve) => setTimeout(resolve, 1000));

          const shiftTables = shiftRes.map((s) => ({
            id_shift: s.id,
            name: s.name,
            id_cohort: cohort.id
          }));

          shifts_table = [...shifts_table, ...shiftTables];

          // console.log('SHIFT_TABLE:', shiftTables);

          for (const shift of shiftRes) {
            try {
              console.log(`Procesando Jornada ${shift.name}`);

              const categorieRes = await scrapeShifts(page, shift.link);

              console.log(categorieRes);

              const categoriesTable = categorieRes.map((c) => ({
                id_category: c.id,
                name: c.name,
                id_shift: shift.id
              }));

              categories_table = [...categories_table, ...categoriesTable];

              for (const courses of categorieRes) {
                console.log(`${courses.name}:`, courses.courses);

                const courseDataRes = await scrapeReport(browser, process.env.MOODLE_COURSES_REPORT_ID)
                // console.log('courseDataRes', courseDataRes.rows);

                for (const course of courses.courses) {
                  try {
                    console.log(`Procesando curso ${course.name}`);
                    const courseRes = await scrapeCourse(page, course.link);

                    // console.log('courseRes', courseRes);

                    const coursesTable = courseDataRes.rows
                      .filter(r => r[0] === course.name)
                      .map(r => ({
                        id_course: course.id,
                        name: course.name,
                        short_name: r[1],
                        date_begin: r[2] || null,
                        date_end: r[3] || null,
                        created_at: r[4] || null,
                        id_category: courses.id
                      }));

                    courses_table = [...courses_table, ...coursesTable];

                    const modulesTable = courseRes.map((c) => ({
                      id_module: c.id,
                      name: c.name,
                      restricted: c.restricted,
                      hidden: c.hidden,
                      id_course: course.id
                    }));

                    modules_table = [...modules_table, modulesTable];
                  } catch (err) {
                    console.log("Error procesando curso", err);
                  }
                }

              }
            } catch (err) {
              console.log("Error procesando jornada", err);
            }
          }
        } catch (error) {
          console.error(
            `  Error procesando cohorte ${cohort.link}:`,
            error
          );
        }
      }
    }

    let modules_scheme = [];

    for (const module_course of modules_table) {
      for (const module of module_course) {
        modules_scheme.push(module);
      }
    }

    const { tasks_table, tasks_coders_table, courses_coders_table, coders_table } = await scrapeUsers(browser, page, modules_scheme, validClanIds);


    const CSVUploads = [
      {
        file: institutions_table,
        filename: 'institutions',
      },
      {
        file: cohorts_table,
        filename: 'cohorts',
      },
      {
        file: shifts_table,
        filename: 'shifts',
      },
      {
        file: categories_table,
        filename: 'categories',
      },
      {
        file: courses_table,
        filename: 'courses',
      },
      {
        file: modules_table,
        filename: 'modules',
      },
      {
        file: roles_table,
        filename: 'roles',
      },
      {
        file: clans_table,
        filename: 'clans',
      },
      {
        file: tasks_table,
        filename: 'tasks',
      },
      {
        file: coders_table,
        filename: 'coders',
      },
      {
        file: tasks_coders_table,
        filename: 'tasks_coders',
      },
      {
        file: courses_coders_table,
        filename: 'courses_coders',
      },
    ]

    CSVUploads.forEach(async (csv) => {
      try {
        console.log(`${csv.filename.toUpperCase()}_TABLE`);
        await saveToCSV(csv.file, `${csv.filename}.csv`);
      } catch (err) {
        return;
      }
    })

    return {
      status: 200,
      ok: true,
      files: {
        file_path: __joindirname(import.meta.url, uploadFolder),
      }
    }
  } catch (err) {
    console.error("Error general:", err);
    return {
      status: 500,
      ok: false,
      error: err
    };
  } finally {
    // Always close the browser, even if there's an error
    if (browser) {
      await browser.close();
      console.log("Browser cerrado.");
    }
  }
};
