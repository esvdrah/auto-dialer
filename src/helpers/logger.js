/**
 * Logger con soporte para diferentes niveles de información
 * @param {string} level - Nivel de log: 'info', 'success', 'warning', 'error'
 * @param {string} message - Mensaje a registrar
 */
export const logger = (level = 'info', message = '') => {
  const timestamp = new Date().toISOString();
  
  const levelIcons = {
    'info': '🔵',
    'success': '✅',
    'warning': '⚠️',
    'error': '❌'
  };

  const icon = levelIcons[level] || '📌';
  console.log(`[${timestamp}] ${icon} ${message}`);
};