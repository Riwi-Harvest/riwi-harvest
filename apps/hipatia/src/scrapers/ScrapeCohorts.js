import { setTimeout } from "node:timers/promises";

export const scrapeCohorts = async (page, cohortUrl) => {
  await page.goto(cohortUrl, { waitUntil: "networkidle2" });
  await page.click(".collapseexpand.aabtn");
  await setTimeout(3000);

  return await page.evaluate(() => {
    const parseId = (url) => new URL(url).searchParams.get("categoryid");

    return [...document.querySelectorAll(".category.with_children")]
      .map((cat) => {
        const a = cat.querySelector("h3 a");
        if (!a) return null;

        const jname = a.innerText.trim();
        if (!/AM|PM/i.test(jname)) return null; // ignorar Reseteo

        const jid = parseId(a.href);

        return { name: jname, id: jid, link: a.href };
      })
      .filter(Boolean);
  });
};
