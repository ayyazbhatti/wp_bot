const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const ApiService = require('./api');
const config = require('./config');

// Initialize API service
const apiService = new ApiService();

// User session storage
const userSessions = new Map();

// Bot states
const STATES = {
  WELCOME: 'welcome',
  WAITING_FOR_YES: 'waiting_for_yes',
  WAITING_FOR_NAME: 'waiting_for_name',
  WAITING_FOR_EMAIL: 'waiting_for_email',
  COMPLETED: 'completed'
};

class WhatsAppBot {
  constructor() {
    this.client = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      }
    });

    this.setupEventHandlers();
  }

  setupEventHandlers() {
    // QR Code generation
    this.client.on('qr', (qr) => {
      console.log('QR RECEIVED', qr);
      qrcode.generate(qr, { small: true });
    });

    // Ready event
    this.client.on('ready', () => {
      console.log('Client is ready!');
    });

    // Message handling
    this.client.on('message', async (message) => {
      if (message.from === 'status@broadcast') return; // Ignore status messages
      
      await this.handleMessage(message);
    });

    // Authentication failure
    this.client.on('auth_failure', (msg) => {
      console.error('Authentication failed:', msg);
    });

    // Disconnected
    this.client.on('disconnected', (reason) => {
      console.log('Client was disconnected:', reason);
    });
  }

  async handleMessage(message) {
    const chatId = message.from;
    const userInput = message.body.trim().toLowerCase();
    
    console.log(`[BOT] Received message from ${chatId}: "${message.body}"`);
    console.log(`[BOT] User input (lowercase): "${userInput}"`);
    
    // Get or create user session
    let session = userSessions.get(chatId);
    if (!session) {
      session = {
        state: STATES.WELCOME,
        data: {}
      };
      userSessions.set(chatId, session);
      console.log(`[BOT] Created new session for ${chatId}`);
    }
    
    console.log(`[BOT] Current session state: ${session.state}`);
    console.log(`[BOT] Session data:`, session.data);

    // Handle support/options message
    if (userInput === 'supporto' || userInput === 'nuovo' || userInput === 'esci') {
      console.log(`[BOT] Support/options requested: "${userInput}"`);
      
      if (userInput === 'nuovo') {
        // Reset session and start new registration
        session.state = STATES.WELCOME;
        session.data = {};
        console.log(`[BOT] Starting new registration`);
        await this.handleWelcome(chatId, session);
        return;
      } else if (userInput === 'esci') {
        // Send exit message
        console.log(`[BOT] User chose to exit`);
        await this.sendMessage(chatId, config.EXIT_MESSAGE);
        return;
      } else {
        // Show options menu
        console.log(`[BOT] Showing options menu`);
        await this.sendMessage(chatId, config.SUPPORT_MESSAGE);
        return;
      }
    }

    // Handle conversation flow
    switch (session.state) {
      case STATES.WELCOME:
        console.log(`[BOT] Handling WELCOME state`);
        await this.handleWelcome(chatId, session);
        break;
      
      case STATES.WAITING_FOR_YES:
        console.log(`[BOT] Handling WAITING_FOR_YES state`);
        await this.handleYesResponse(chatId, userInput, session);
        break;
      
      case STATES.WAITING_FOR_NAME:
        console.log(`[BOT] Handling WAITING_FOR_NAME state`);
        await this.handleNameInput(chatId, message.body, session);
        break;
      
      case STATES.WAITING_FOR_EMAIL:
        console.log(`[BOT] Handling WAITING_FOR_EMAIL state`);
        await this.handleEmailInput(chatId, message.body, session);
        break;
      
      case STATES.COMPLETED:
        console.log(`[BOT] Handling COMPLETED state`);
        await this.handleCompletedState(chatId, userInput, session);
        break;
    }
  }

  async handleWelcome(chatId, session) {
    await this.sendMessage(chatId, config.WELCOME_MESSAGE);
    session.state = STATES.WAITING_FOR_YES;
  }

  async handleYesResponse(chatId, userInput, session) {
    if (userInput === 'sì' || userInput === 'si' || userInput === 'yes') {
      await this.sendMessage(chatId, config.NAME_REQUEST);
      session.state = STATES.WAITING_FOR_NAME;
    } else {
      await this.sendMessage(chatId, 'Per favore rispondi "Sì" per continuare con la registrazione.');
    }
  }

  async handleNameInput(chatId, name, session) {
    const trimmedName = name.trim();
    
    if (trimmedName.length < 2) {
      await this.sendMessage(chatId, 'Per favore inserisci un nome valido (almeno 2 caratteri).');
      return;
    }

    session.data.fullName = trimmedName;
    await this.sendMessage(chatId, config.EMAIL_REQUEST);
    session.state = STATES.WAITING_FOR_EMAIL;
  }

  async handleEmailInput(chatId, email, session) {
    const trimmedEmail = email.trim();
    
    console.log(`[DEBUG] Email input received: ${trimmedEmail}`);
    console.log(`[DEBUG] Session data:`, session.data);
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      console.log(`[DEBUG] Email validation failed for: ${trimmedEmail}`);
      await this.sendMessage(chatId, 'Per favor e inserisci un indirizzo email valido (es. nome@dominio.com).');
      return;
    }

    console.log(`[DEBUG] Email validation passed: ${trimmedEmail}`);
    session.data.email = trimmedEmail;
    
    // Call API to register user
    console.log(`[DEBUG] Calling API with: ${session.data.fullName}, ${trimmedEmail}`);
    const result = await apiService.registerUser(session.data.fullName, trimmedEmail);
    
    console.log(`[DEBUG] API result:`, result);
    
    if (result.success) {
      // Send success message
      console.log(`[DEBUG] Sending success message...`);
      await this.sendMessage(chatId, result.message);
      
      // Send login button with auto_login_url
      if (result.data.auto_login_url) {
        console.log(`[DEBUG] Sending login button with URL: ${result.data.auto_login_url}`);
        await this.sendLoginButton(chatId, result.data.auto_login_url);
      } else {
        console.log(`[DEBUG] No auto_login_url found in response`);
      }
      
      session.state = STATES.COMPLETED;
      session.data.registrationComplete = true;
      session.data.autoLoginUrl = result.data.auto_login_url;
      console.log(`[DEBUG] Registration completed successfully`);
    } else {
      console.log(`[DEBUG] API call failed: ${result.message}`);
      await this.sendMessage(chatId, result.message);
      // Reset to email input state
      session.state = STATES.WAITING_FOR_EMAIL;
    }
  }

  async handleCompletedState(chatId, userInput, session) {
    console.log(`🏁 User in completed state, input: "${userInput}"`);
    if (userInput === 'supporto' || userInput === 'nuovo' || userInput === 'esci') {
      if (userInput === 'nuovo') {
        // Reset session and start new registration
        session.state = STATES.WELCOME;
        session.data = {};
        console.log(`[BOT] Starting new registration from completed state`);
        await this.handleWelcome(chatId, session);
      } else if (userInput === 'esci') {
        // Send exit message
        console.log(`[BOT] User chose to exit from completed state`);
        await this.sendMessage(chatId, config.EXIT_MESSAGE);
      } else {
        // Show options menu
        console.log(`[BOT] Showing options menu from completed state`);
        await this.sendMessage(chatId, config.SUPPORT_MESSAGE);
      }
    } else {
      await this.sendMessage(chatId, config.SUPPORT_MESSAGE);
    }
  }

  async sendMessage(chatId, message) {
    try {
      await this.client.sendMessage(chatId, message);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  async sendLoginButton(chatId, loginUrl) {
    try {
      // Create a button message with the login URL
      const buttonMessage = {
        body: config.LOGIN_BUTTON_TEXT,
        buttons: [
          {
            buttonId: 'login',
            buttonText: { displayText: '🔗 Accedi Ora' },
            type: 1
          }
        ],
        sections: [
          {
            title: 'Trading Platform',
            rows: [
              {
                id: 'login',
                title: '🔗 Accedi al Trading Platform',
                description: 'Clicca per accedere direttamente al tuo account',
                url: loginUrl
              }
            ]
          }
        ]
      };

      await this.client.sendMessage(chatId, buttonMessage);

      // Also send the URL as a simple message for compatibility with clear one-time warning
      await this.sendMessage(chatId, `⚠️ IMPORTANTE: Questo è un link di accesso per uso unico!\n\n🔗 Link di accesso: ${loginUrl}\n\n⚠️ Il link funziona solo una volta. Non condividerlo con altri.`);

    } catch (error) {
      console.error('Error sending login button:', error);
      // Fallback to simple URL message with clear one-time warning
      await this.sendMessage(chatId, `⚠️ IMPORTANTE: Questo è un link di accesso per uso unico!\n\n🔗 Accedi al Trading Platform: ${loginUrl}\n\n⚠️ Il link funziona solo una volta. Non condividerlo con altri.`);
    }
  }

  async start() {
    try {
      await this.client.initialize();
      console.log('WhatsApp Bot started successfully!');
    } catch (error) {
      console.error('Failed to start WhatsApp Bot:', error);
    }
  }

  async stop() {
    try {
      await this.client.destroy();
      console.log('WhatsApp Bot stopped.');
    } catch (error) {
      console.error('Error stopping WhatsApp Bot:', error);
    }
  }
}

// Handle process termination
process.on('SIGINT', async () => {
  console.log('\nShutting down WhatsApp Bot...');
  if (bot) {
    await bot.stop();
  }
  process.exit(0);
});

// Start the bot
const bot = new WhatsAppBot();
bot.start(); 