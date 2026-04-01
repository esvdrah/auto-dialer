/**
 * Settings and configuration for the Auto Dialer application
 * Environment variables can override these default values
 */

const BASE_URL = Bun.env.BASE_DIAL_URL || 'https://app.ctrlit.cl/ctrl/dial/';
const USER_DNI = Bun.env.DNI_NUMBER || '99999999';
const API_KEY = 'KqpFkRElr7'; // Consider moving to .env if sensitive

export const CONFIG = {
  // URLs for entry marking
  dialUrlsEntry: {
    REGISTRATION: `${BASE_URL}registrarweb/${API_KEY}?sentido=1&latitud=&longitud=&rut=${USER_DNI}`,
    WORK_INFO: `${BASE_URL}infotrab/${API_KEY}?sentido=1&rut=${USER_DNI}`
  },

  // URLs for exit marking
  dialUrlsExit: {
    REGISTRATION: `${BASE_URL}registrarweb/${API_KEY}?sentido=0&latitud=&longitud=&rut=${USER_DNI}`,
    WORK_INFO: `${BASE_URL}infotrab/${API_KEY}?sentido=0&rut=${USER_DNI}`
  },

  // Execution schedules (cron format)
  schedules: {
    // Entry: 08:00 and 14:00 from Monday to Friday
    entry: Bun.env.SCHEDULE_ENTRY || '0 8 * * 1-5,0 14 * * 1-5',
    // Exit: 13:00 and 18:00 from Monday to Friday
    exit: Bun.env.SCHEDULE_EXIT || '0 13 * * 1-5,0 18 * * 1-5'
  }
};
