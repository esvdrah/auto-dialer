export const SELECTORS = {
  ENTRY_BUTTON: 'button[onclick*="i=1"]',
  EXIT_BUTTON: 'button[onclick*="i=0"]',
  DIALS_LIST: '.dials',
  DIGIT_ITEMS: 'li.digits',
  DIGIT_STRONG: 'strong',
  DNI_DISPLAY: '#rut',
  SEND_BUTTON: 'li.digits.pad-action',
  CONFIRM_ENTRY_BUTTON: '.btn.btn-lg.btn-block.btn-success',
  CONFIRM_EXIT_BUTTON: '.btn.btn-lg.btn-block.btn-danger'
};

// Type of action buttons
export const ACTION_BUTTONS = {
  ENTRY: SELECTORS.ENTRY_BUTTON,
  EXIT: SELECTORS.EXIT_BUTTON
};

export const CONFIRM_BUTTONS = {
  ENTRY: SELECTORS.CONFIRM_ENTRY_BUTTON,
  EXIT: SELECTORS.CONFIRM_EXIT_BUTTON
};