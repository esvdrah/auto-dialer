/**
 * Configuración centralizada del sistema de marcaje automático
 * Las variables de entorno pueden sobreescribir estos valores por defecto
 */

const BASE_URL = Bun.env.BASE_DIAL_URL || 'https://app.ctrlit.cl/ctrl/dial/';
const USER_DNI = Bun.env.DNI_NUMBER || '99999999';
const API_KEY = 'KqpFkRElr7'; // Considerar mover a .env si es sensible

export const CONFIG = {
  // URLs de marcaje para entrada
  dialUrlsEntry: {
    REGISTRATION: `${BASE_URL}registrarweb/${API_KEY}?sentido=1&latitud=&longitud=&rut=${USER_DNI}`,
    WORK_INFO: `${BASE_URL}infotrab/${API_KEY}?sentido=1&rut=${USER_DNI}`
  },

  // URLs de marcaje para salida
  dialUrlsExit: {
    REGISTRATION: `${BASE_URL}registrarweb/${API_KEY}?sentido=0&latitud=&longitud=&rut=${USER_DNI}`,
    WORK_INFO: `${BASE_URL}infotrab/${API_KEY}?sentido=0&rut=${USER_DNI}`
  },

  // Horarios de ejecución (formato cron)
  schedules: {
    // Entrada: 08:00 y 14:00 de lunes a viernes
    entry: Bun.env.SCHEDULE_ENTRY || '0 8 * * 1-5,0 14 * * 1-5',
    // Salida: 13:00 y 18:00 de lunes a viernes
    exit: Bun.env.SCHEDULE_EXIT || '0 13 * * 1-5,0 18 * * 1-5'
  }
};
