/**
 * Simple logger utility for the Auto Dialer application
 * @param {string} level - Log level: 'info', 'success', 'warning', 'error'
 * @param {string} message - Message to log
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