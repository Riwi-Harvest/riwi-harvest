import { setTimeout } from "node:timers/promises";

export const scrapeCourse = async (page, courseUrl) => {
  await page.goto(courseUrl, { waitUntil: "networkidle2" });
  await setTimeout(3000);

  return await page.evaluate(() => {
    const parseId = (url) => new URL(url).searchParams.get("id");

    return [...document.querySelectorAll("ul.tiles > li.tile")]
      .map((tile) => {
        const a = tile.querySelector("a.tile-link");
        if (!a) return null;

        const id = parseId(a.href);
        const name = tile.querySelector("h3")?.innerText.trim() || null;
        const restricted = tile.classList.contains("tile-restricted");
        const hidden = tile.classList.contains("tile-hidden");

        return {
          id,
          name,
          url: a.href,
          restricted,
          hidden,
        };
      })
      .filter(Boolean);
  });
};
