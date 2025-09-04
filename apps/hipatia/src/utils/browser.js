import puppeteer from "puppeteer";

export const launchBrowser = async () => {
  return puppeteer.launch({ headless: true });
};
