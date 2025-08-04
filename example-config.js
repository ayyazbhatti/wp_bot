// Example configuration file
// Copy this to config.js and customize as needed

module.exports = {
  // API Configuration
  API_BASE_URL: 'https://v2.dtrader.tech/api/quick-register',
  
  // Bot Identity
  BOT_NAME: 'Trading Bot',
  
  // Messages (Italian)
  WELCOME_MESSAGE: 'Ciao 👋 Benvenuto nel servizio di trading con bot automatico. Alla registrazione ottieni 20€ di bonus e il bot si attiva subito. Vuoi registrarti ora? Rispondi "Sì".',
  NAME_REQUEST: 'Perfetto. Inviami nome e cognome in un unico messaggio (es. "Marco Rossi").',
  EMAIL_REQUEST: 'Ora scrivi la tua email che userai per accedere (es. nome@dominio.com).',
  SUCCESS_MESSAGE: 'Fatto ✅ Il tuo account è stato creato. Bonus 20€ attivo e bot operativo.',
  LOGIN_BUTTON_TEXT: '🔗 Accedi al Trading Platform',
  SUPPORT_MESSAGE: 'Se ti serve aiuto, scrivi "supporto"',
  
  // Error Messages
  INVALID_NAME_MESSAGE: 'Per favore inserisci un nome valido (almeno 2 caratteri).',
  INVALID_EMAIL_MESSAGE: 'Per favore inserisci un indirizzo email valido (es. nome@dominio.com).',
  WRONG_CONFIRMATION_MESSAGE: 'Per favore rispondi "Sì" per continuare con la registrazione.',
  API_ERROR_MESSAGE: 'Registration service is temporarily unavailable. Please try again later.',
  EMAIL_EXISTS_MESSAGE: 'An account with this email already exists. Please use a different email.',
  
  // Validation Settings
  MIN_NAME_LENGTH: 2,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  
  // Support Keywords
  SUPPORT_KEYWORDS: ['supporto', 'aiuto', 'help'],
  
  // Session Settings
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes in milliseconds
}; 