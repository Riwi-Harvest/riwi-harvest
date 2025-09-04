export const login = async (page) => {
  await page.goto("https://riwi-test.unhosting.site/login/index.php", {
    waitUntil: "networkidle2",
  });

  await page.type('input[name="username"]', process.env.MOODLE_USER);
  await page.type('input[name="password"]', process.env.MOODLE_PASS);

  await Promise.all([
    page.click("#loginbtn"),
    page.waitForNavigation({ waitUntil: "networkidle2" }),
  ]);
};
