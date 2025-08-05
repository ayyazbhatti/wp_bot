const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const ApiService = require('./api');
const config = require('./config');
const AdminPanel = require('./admin-panel');
const DatabaseService = require('./database/service');

// Initialize admin panel
const adminPanel = new AdminPanel();

// Initialize database service
const dbService = new DatabaseService();

// Conversation states
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
    
    this.apiService = new ApiService();
    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.client.on('qr', (qr) => {
      console.log('QR RECEIVED', qr);
      qrcode.generate(qr, { small: true });
    });

    this.client.on('ready', () => {
      console.log('Client is ready!');
    });

    this.client.on('message', async (message) => {
      if (message.from === 'status@broadcast') return;
      
      try {
        await this.handleMessage(message);
      } catch (error) {
        console.error('Error handling message:', error);
      }
    });

    this.client.on('disconnected', (reason) => {
      console.log('Client was disconnected', reason);
    });
  }

  async handleMessage(message) {
    const chatId = message.from;
    const userInput = message.body.trim().toLowerCase();
    
    console.log(`[BOT] Received message from ${chatId}: "${message.body}"`);
    console.log(`[BOT] User input (lowercase): "${userInput}"`);
    
    // Get or create user session from database
    let user = await dbService.getUserSession(chatId);
    if (!user) {
      // Get user's WhatsApp profile name
      let whatsappName = null;
      try {
        const contact = await this.client.getContactById(chatId);
        if (contact && contact.pushname) {
          whatsappName = contact.pushname;
          console.log(`[BOT] WhatsApp profile name: ${contact.pushname}`);
        }
      } catch (error) {
        console.log(`[BOT] Could not get WhatsApp profile name: ${error.message}`);
      }
      
      user = await dbService.createUserSession(chatId, whatsappName);
      if (!user) {
        console.error(`[BOT] Failed to create user session for ${chatId}`);
        await message.reply('Mi dispiace, si è verificato un errore tecnico. Riprova più tardi.');
        return;
      }
      console.log(`[BOT] Created new database session for ${chatId}`);
    }
    
    // Check if user object is valid
    if (!user) {
      console.error(`[BOT] User object is null for ${chatId}`);
      await message.reply('Mi dispiace, si è verificato un errore tecnico. Riprova più tardi.');
      return;
    }
    
    console.log(`[BOT] Current user state: ${user.currentState}`);
    console.log(`[BOT] User data:`, {
      whatsappName: user.whatsappName,
      fullName: user.fullName,
      email: user.email,
      registrationComplete: user.registrationComplete
    });

    // Handle support/options message
    if (userInput === 'supporto' || userInput === 'nuovo' || userInput === 'esci') {
      console.log(`[BOT] Support/options requested: "${userInput}"`);
      
      if (userInput === 'nuovo') {
        // Reset session and start new registration
        await dbService.updateUserSession(chatId, {
          currentState: STATES.WELCOME,
          fullName: null,
          email: null,
          registrationComplete: false,
          autoLoginUrl: null
        });
        console.log(`[BOT] Starting new registration`);
        await this.handleWelcome(chatId);
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
    switch (user.currentState) {
      case STATES.WELCOME:
        console.log(`[BOT] Handling WELCOME state`);
        await this.handleWelcome(chatId);
        break;
      
      case STATES.WAITING_FOR_YES:
        console.log(`[BOT] Handling WAITING_FOR_YES state`);
        await this.handleYesResponse(chatId, userInput);
        break;
      
      case STATES.WAITING_FOR_NAME:
        console.log(`[BOT] Handling WAITING_FOR_NAME state`);
        await this.handleNameInput(chatId, message.body);
        break;
      
      case STATES.WAITING_FOR_EMAIL:
        console.log(`[BOT] Handling WAITING_FOR_EMAIL state`);
        await this.handleEmailInput(chatId, message.body);
        break;
      
      case STATES.COMPLETED:
        console.log(`[BOT] Handling COMPLETED state`);
        await this.handleCompletedState(chatId, userInput);
        break;
    }
  }

  async handleWelcome(chatId) {
    await this.sendMessage(chatId, config.WELCOME_MESSAGE);
    await dbService.updateUserState(chatId, STATES.WAITING_FOR_YES);
  }

  async handleYesResponse(chatId, userInput) {
    if (userInput === 'sì' || userInput === 'si' || userInput === 'yes') {
      await this.sendMessage(chatId, config.NAME_REQUEST);
      await dbService.updateUserState(chatId, STATES.WAITING_FOR_NAME);
    } else {
      await this.sendMessage(chatId, 'Per favore rispondi "Sì" per continuare con la registrazione.');
    }
  }

  async handleNameInput(chatId, name) {
    const trimmedName = name.trim();
    
    if (trimmedName.length < 2) {
      await this.sendMessage(chatId, 'Per favore inserisci un nome valido (almeno 2 caratteri).');
      return;
    }

    await dbService.updateUserData(chatId, { fullName: trimmedName });
    await this.sendMessage(chatId, config.EMAIL_REQUEST);
    await dbService.updateUserState(chatId, STATES.WAITING_FOR_EMAIL);
  }

  async handleEmailInput(chatId, email) {
    const trimmedEmail = email.trim();
    
    console.log(`[DEBUG] Email input received: ${trimmedEmail}`);
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      console.log(`[DEBUG] Email validation failed for: ${trimmedEmail}`);
      await this.sendMessage(chatId, 'Per favore inserisci un indirizzo email valido (es. nome@dominio.com).');
      return;
    }

    console.log(`[DEBUG] Email validation passed: ${trimmedEmail}`);
    
    // Get current user data
    const user = await dbService.getUserSession(chatId);
    if (!user) {
      console.log(`[DEBUG] User not found in database`);
      await this.sendMessage(chatId, 'Errore: sessione utente non trovata. Inizia di nuovo con "nuovo".');
      return;
    }
    
    // Call API to register user
    console.log(`[DEBUG] Calling API with: ${user.fullName}, ${trimmedEmail}`);
    const result = await this.apiService.registerUser(user.fullName, trimmedEmail);
    
    console.log(`[DEBUG] API result:`, result);
    
    if (result.success) {
      // Update user data with email and registration completion
      await dbService.updateUserData(chatId, {
        email: trimmedEmail,
        registrationComplete: true,
        autoLoginUrl: result.data.auto_login_url
      });
      
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
      
      await dbService.updateUserState(chatId, STATES.COMPLETED);
      console.log(`[DEBUG] Registration completed successfully`);
    } else {
      console.log(`[DEBUG] API call failed: ${result.message}`);
      await this.sendMessage(chatId, result.message);
      // Stay in email input state
    }
  }

  async handleCompletedState(chatId, userInput) {
    console.log(`🏁 User in completed state, input: "${userInput}"`);
    if (userInput === 'supporto' || userInput === 'nuovo' || userInput === 'esci') {
      if (userInput === 'nuovo') {
        // Reset session and start new registration
        await dbService.updateUserSession(chatId, {
          currentState: STATES.WELCOME,
          fullName: null,
          email: null,
          registrationComplete: false,
          autoLoginUrl: null
        });
        console.log(`[BOT] Starting new registration from completed state`);
        await this.handleWelcome(chatId);
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
      // Initialize database first
      console.log('🔌 Initializing database connection...');
      await dbService.initialize();
      
      // Start WhatsApp client
      console.log('📱 Starting WhatsApp client...');
      await this.client.initialize();
      console.log('WhatsApp Bot started successfully!');
      
      // Start admin panel
      adminPanel.start();
      
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

  // Update admin panel with user session
  async updateAdminPanel(chatId, session) {
    try {
      await fetch('http://localhost:3001/api/update-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatId: chatId,
          sessionData: session
        })
      });
    } catch (error) {
      console.error('Error updating admin panel:', error);
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