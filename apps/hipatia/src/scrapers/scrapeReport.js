import { setTimeout } from "node:timers/promises";
import { downloadHTMLTable } from "../utils/downloadHtml.js";
import { parseHTMLTable } from "../utils/parseHtmlTable.js";

export const scrapeReport = async (browser, reportId, returnMode = "default") => {
  const url = `${process.env.MOODLE_BASE_URL}/reportbuilder/view.php?id=${reportId}`;
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "networkidle2" });
  await setTimeout(3000);

  const htmlContent = await downloadHTMLTable(
    page,
    process.env.MOODLE_BASE_URL,
    reportId
  );

  try{
    if (returnMode === "html") {
      return htmlContent;
    }

    let tableData = await parseHTMLTable(htmlContent);

    if (returnMode === "full") {
      return {
        tableData,
        htmlContent,
      };
    }

    if (returnMode === "default") {
      return tableData;
    }

    throw new Error('Invalid returnMode. Use "defaul", "full" or "html".')
  } catch (err) {
    console.error(err.message);
  } finally {
    page.close();
  }
};
