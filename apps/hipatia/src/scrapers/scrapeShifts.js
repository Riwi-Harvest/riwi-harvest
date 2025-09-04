import { setTimeout } from "node:timers/promises";

export const scrapeShifts = async (page, shiftUrl) => {
  await page.goto(shiftUrl, { waitUntil: "networkidle2" });
  await page.click(".collapseexpand.aabtn");
  await setTimeout(3000);

  return await page.evaluate(() => {
    const parseId = (url) => new URL(url).searchParams.get("categoryid");
    const parseCourseId = (url) => new URL(url).searchParams.get("id");

    return [...document.querySelectorAll(".category.with_children")]
      .map((cat) => {
        const a = cat.querySelector("h3 a");
        if (!a) return null;

        const jname = a.innerText.trim();
        const jid = parseId(a.href);

        const courses = [...cat.querySelectorAll(".courses .coursename a")].map(
          (ca) => ({
            name: ca.innerText.trim(),
            id: parseCourseId(ca.href),
            link: ca.href,
          })
        );

        return { name: jname, id: jid, courses };
      })
      .filter(Boolean);
  });
};
