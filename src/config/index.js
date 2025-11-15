export const CONFIG = {
  dniNumbers: Bun.env.DNI_NUMBER ? Bun.env.DNI_NUMBER : "99999999",
  dialUrl: Bun.env.DIAL_URL || 'https://app.ctrlit.cl/ctrl/dial/web/KqpFkRElr7',
  chromiumPath: Bun.env.CHROMIUM_PATH || '/usr/bin/chromium-browser',
  schedules: {
    entry: Bun.env.SCHEDULE_ENTRY || '0 8 * * *,0 14 * * *', // 08:00 - 14:00, Monday to Friday
    exit: Bun.env.SCHEDULE_EXIT || '0 13 * * *,0 18 * * *'  // At 13:00 - 18:00, Monday to Friday
  }

}