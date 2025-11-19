import cron from "node-cron";
import { CONFIG } from "./config/index.js";
import { logger } from "./helpers/index.js";
import { DialerService } from "./services/dialer.service.js";
import { validateMarkedNumbers } from "./helpers/validator.js";

const markDniNumbers = async (dniNumbers, actionType) => {
  logger("📍", `Starting marking: ${actionType} - DNI: ${dniNumbers}`);

  const dialerService = new DialerService();

  try {
    await dialerService.initialize();
    await dialerService.navigateToDialUrl();
    await dialerService.clickActionButton(actionType);

    const successfullyMarkedNumbers = await dialerService.markDniNumbers(dniNumbers);
    const displayValue = await dialerService.getDisplayValue();

    logger("📝", `Marked results: ${successfullyMarkedNumbers}`);
    logger("📄", `Display value: ${displayValue}`);

    if (!validateMarkedNumbers(successfullyMarkedNumbers, displayValue)) {
      logger("❌", "Validation failed");
    } else {
      logger("✅", "Validation succeeded");
    }

    await dialerService.clickSendButton();
    await dialerService.clickConfirmationButton(actionType);
    await dialerService.takeScreenshot(actionType);
  } catch (error) {
    logger("❌", `Error: ${error.message}`);
  } finally {
    await dialerService.close();
  }
};

const registerCronJobs = () => {
  const entrySchedules = CONFIG.schedules.entry.split(',');
  const exitSchedules = CONFIG.schedules.exit.split(',');

  entrySchedules.forEach((schedule, index) => {
    cron.schedule(schedule.trim(), () => {
      logger("⏰", `Job ENTRY #${index + 1} executed`);
      markDniNumbers(CONFIG.dniNumbers, "ENTRY").catch(err =>
        logger("❌", `Job ENTRY fail: ${err.message}`)
      );
    });
  });

  exitSchedules.forEach((schedule, index) => {
    cron.schedule(schedule.trim(), () => {
      logger("⏰", `Job EXIT #${index + 1} executed`);
      markDniNumbers(CONFIG.dniNumbers, "EXIT").catch(err =>
        logger("❌", `Job EXIT fail: ${err.message}`)
      );
    });
  });

  logger("✅", "Cron jobs registered successfully");
};

// Uncomment to enable cron jobs
registerCronJobs();

// Manual test
// markDniNumbers(CONFIG.dniNumbers, "ENTRY");