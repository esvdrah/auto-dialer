import cron from "node-cron";
import { CONFIG } from "./config/index.js";
import { logger } from "./helpers/index.js";

/**
 * Run an HTTP request safely with logging
 * @param {string} url - URL to make the request to
 * @param {number} startTime - Timestamp of the process start
 * @returns {Promise<string>} - Response text
 */
const executeDialRequest = async (url, startTime) => {
  try {
    const response = await fetch(url);
    const duration = Date.now() - startTime;
    logger("info", `GET ${url} - Status: ${response.status} (${duration}ms)`);
    return await response.text();
  } catch (err) {
    logger("error", `Error in request to ${url}: ${err.message}`);
    throw err;
  }
};

/**
 * Executes the entry/exit dial calls sequentially
 * @param {string[]} dialUrlList - List of dial URLs to execute in order
 */
const executeDialSequence = async (dialUrlList) => {
  logger("info", `Starting sequential dial: ${dialUrlList.length} endpoints`);
  
  const startTime = Date.now();
  const responses = [];

  for (let i = 0; i < dialUrlList.length; i++) {
    try {
      const responseText = await executeDialRequest(dialUrlList[i], startTime);
      responses.push(responseText);
    } catch (err) {
      logger("error", `Endpoint ${i + 1}/${dialUrlList.length} failed: ${err.message}`);
      throw err;
    }
  }
  
  logger("success", `Dial sequence completed successfully. Results: ${responses.join(", ")}`);
  return responses;
};

/**
 * Registers cron jobs for a specific type (entry/exit)
 * @param {string} jobType - Type of job ('ENTRY' or 'EXIT')
 * @param {string[]} cronSchedules - Array of cron expressions
 * @param {Object} urlEndpoints - Object with dial URLs to execute for this job type
 */
const registerCronJobGroup = (jobType, cronSchedules, urlEndpoints) => {
  cronSchedules.forEach((cronExpression, index) => {
    const jobLabel = `${jobType.toUpperCase()} #${index + 1}`;
    
    cron.schedule(cronExpression.trim(), () => {
      logger("info", `Executing job: ${jobLabel}`);
      executeDialSequence(Object.values(urlEndpoints)).catch(err =>
        logger("error", `Job ${jobLabel} failed: ${err.message}`)
      );
    });

    logger("info", `Job registered: ${jobLabel} with cron "${cronExpression}"`);
  });
};

/**
 * Initializes all configured cron jobs
 */
const initializeCronJobs = () => {
  const entrySchedules = CONFIG.schedules.entry.split(',');
  const exitSchedules = CONFIG.schedules.exit.split(',');

  registerCronJobGroup('ENTRY', entrySchedules, CONFIG.dialUrlsEntry);
  registerCronJobGroup('EXIT', exitSchedules, CONFIG.dialUrlsExit);
  
  logger("success", "Automatic dial system initialized successfully ✓");
};

// Initialize system
initializeCronJobs();

// Manual test functions (uncomment if needed)
// executeDialSequence(Object.values(CONFIG.dialUrlsEntry));
// executeDialSequence(Object.values(CONFIG.dialUrlsExit));
