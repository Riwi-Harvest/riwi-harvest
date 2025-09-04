import * as cheerio from 'cheerio';

export async function scrapeGrades(htmlContent, tableData) {
  const $ = cheerio.load('../downloads/get_coders.html');

  const headerIndex = {};
  tableData.headers.forEach((h, i) => (headerIndex[h] = i));

  console.log(headerIndex);

  const domRows = [];
  $("table tbody tr").each((i, tr) => {
    const $tr = $(tr);
    const userAnchor = $tr.find("td").eq(0).find("a").first();
    const userLink = userAnchor.attr("href") || null;

    // Second column -> Possible img
    const col2 = $tr.find("td").eq(1);
    const img = col2.find("img").first();
    const photo = img.length ? img.attr("src") : null;

    // Course anchor
    const courseAnchor = $tr.find("a[href*='course/view.php']").first();
    const courseLink = courseAnchor.length ? courseAnchor.attr("href") : null;
    const courseFullName = courseAnchor.length ? courseAnchor.text().trim() : null;

    // Short name
    const courseShorName =
      headerIndex["course_short_name"] != null
        ? $tr.find("td").eq(headerIndex["course_short_name"]).text().trim()
        : null;

    domRows.push({
      userLink,
      photo,
      courseLink,
      courseFullName,
      courseShorName,
    });
  });

  console.log(domRows);
}
