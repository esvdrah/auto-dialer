import puppeteer from "puppeteer";
import { CONFIG } from "../config/index.js";
import { logger } from "../helpers/index.js";
import { SELECTORS } from "../constants/selectors.js";

export class DialerService {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async initialize() {
    logger("📂", "Launching browser...");
    this.browser = await puppeteer.launch({
      executablePath: CONFIG.chromiumPath,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    this.page = await this.browser.newPage();
    this.page.on('console', msg => logger("📄", `BROWSER LOG: ${msg.text()}`));
  }

  async navigateToDialUrl() {
    logger("🌐", `Navigating to: ${CONFIG.dialUrl}`);
    await this.page.goto(CONFIG.dialUrl, { waitUntil: 'networkidle2' });
    logger("✅", `Page loaded successfully`);
  }

  async clickActionButton(actionType) {
    const buttonSelector = actionType === "entry"
      ? SELECTORS.ENTRY_BUTTON
      : SELECTORS.EXIT_BUTTON;
    await this.page.click(buttonSelector);
    logger("🔘", `Button ${actionType} clicked`);
  }

  async markDniNumbers(dniNumbers) {
    await this.page.waitForSelector(SELECTORS.DIALS_LIST, { timeout: 5000 });

    let successfullyMarkedNumbers = "";

    for (const dniNumber of dniNumbers) {
      const marked = await this.page.evaluate((dni, selectors) => {
        const digits = Array.from(document.querySelectorAll(selectors.DIGIT_ITEMS));
        const digitItem = digits.find(digit => {
          const strong = digit.querySelector(selectors.DIGIT_STRONG);
          return strong && strong.innerText.trim() === dni;
        });

        if (digitItem) {
          digitItem.click();
          return { success: true, number: dni };
        }
        return { success: false, number: dni };
      }, dniNumber, SELECTORS);

      successfullyMarkedNumbers += marked.success ? marked.number : "";
      logger(
        marked.success ? "✅" : "❌",
        `${marked.success ? "Marked" : "Not found"}: ${marked.number}`
      );
    }

    return successfullyMarkedNumbers;
  }

  async getDisplayValue() {
    return await this.page.evaluate((selectors) => {
      return document.querySelector(selectors.DNI_DISPLAY).textContent.trim();
    }, SELECTORS);
  }

  async takeScreenshot(actionType) {
    const fileName = `screenshot_${actionType}_${Date.now()}.png`;
    await this.page.screenshot({ path: fileName });
    logger("💾", `Screenshot saved: ${fileName}`);
    return fileName;
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      logger("🚪", "Browser closed");
    }
  }
}