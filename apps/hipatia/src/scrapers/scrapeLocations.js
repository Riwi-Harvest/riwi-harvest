import { setTimeout } from "node:timers/promises";

export const scrapeLocations = async (page) => {
  try {
    console.log(`Locations: Scrapeando: ${page}`);

    await page.goto("https://riwi-test.unhosting.site/course/index.php", {
      waitUntil: "networkidle2",
    });

    console.log("Locations: Esperando expand btn");
    await page.waitForSelector(".collapseexpand.aabtn", { timeout: 5000 });
    console.log("Locations: Click expand btn");
    await page.click(".collapseexpand.aabtn");

    console.log("Locations: Timeout 3s");
    await setTimeout(3000);

    console.log("Locations: Evaluando DOM");
    const data = await page.evaluate(() => {
      try {
        const parseId = (url) => new URL(url).searchParams.get("categoryid");

        const targets = ["Sede Barranquilla", "Sede Medellín"];
        const cohortsWanted = {
          "Sede Barranquilla": ["Cohorte 3"],
          "Sede Medellín": ["Cohorte 4"],
        };

        console.log("Locations: Buscando categorías principales...");
        const cats = [...document.querySelectorAll(".category.with_children")];
        console.log(`Locations: Encontradas ${cats.length} categorías`);

        return cats
          .map((cat, i) => {
            const a = cat.querySelector("h3 a");
            if (!a) {
              console.log(`Locations: Cat[${i}] sin enlace h3`);
              return null;
            }

            const name = a.innerText.trim();
            console.log(`Locations: Cat[${i}] name="${name}"`);

            if (!targets.includes(name)) {
              console.log(`Locations: Cat[${i}] ignorada (no en targets)`);
              return null;
            }

            const id = parseId(a.href);
            console.log(`Locations: Cat[${i}] id=${id}`);

            const subAs = [...cat.querySelectorAll(".subcategories .category .info a")];
            console.log(`Locations: Cat[${i}] subcategorías=${subAs.length}`);

            const cohorts = subAs
              .map((a, j) => {
                const cname = a.innerText.trim();
                console.log(`Locations: Sub[${i}.${j}] cname="${cname}"`);
                if (!cohortsWanted[name].includes(cname)) {
                  console.log(`Locations: Sub[${i}.${j}] ignorada`);
                  return null;
                }
                const cid = parseId(a.href);
                console.log(`Locations: Sub[${i}.${j}] match, id=${cid}`);
                return {
                  name: cname,
                  id: cid,
                  link: a.href,
                };
              })
              .filter(Boolean);

            return { name, id, cohorts };
          })
          .filter(Boolean);
      } catch (err) {
        console.error("Locations: Error en evaluate", err);
        return [];
      }
    });

    console.log("Locations: Resultado final:", JSON.stringify(data, null, 2));
    return data;
  } catch (err) {
    console.error("Locations: Error en scrapeLocations", err);
    return [];
  }
};
