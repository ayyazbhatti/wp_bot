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

class DebugWhatsAppBot {
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
      console.log('🔐 QR RECEIVED - Scan this with WhatsApp');
      qrcode.generate(qr, { small: true });
    });

    // Ready event
    this.client.on('ready', () => {
      console.log('✅ WhatsApp Bot is ready and connected!');
    });

    // Message handling
    this.client.on('message', async (message) => {
      console.log(`\n📨 NEW MESSAGE RECEIVED:`);
      console.log(`From: ${message.from}`);
      console.log(`Body: "${message.body}"`);
      console.log(`Timestamp: ${message.timestamp}`);
      
      if (message.from === 'status@broadcast') {
        console.log('❌ Ignoring status message');
        return;
      }
      
      try {
        await this.handleMessage(message);
      } catch (error) {
        console.error('❌ Error handling message:', error);
        await this.sendMessage(message.from, 'Si è verificato un errore. Riprova.');
      }
    });

    // Authentication failure
    this.client.on('auth_failure', (msg) => {
      console.error('❌ Authentication failed:', msg);
    });

    // Disconnected
    this.client.on('disconnected', (reason) => {
      console.log('❌ Client was disconnected:', reason);
    });

    // Loading screen
    this.client.on('loading_screen', (percent, message) => {
      console.log(`🔄 Loading: ${percent}% - ${message}`);
    });
  }

  async handleMessage(message) {
    const chatId = message.from;
    const userInput = message.body.trim().toLowerCase();
    
    console.log(`\n🤖 PROCESSING MESSAGE:`);
    console.log(`Chat ID: ${chatId}`);
    console.log(`Original: "${message.body}"`);
    console.log(`Processed: "${userInput}"`);
    
    // Get or create user session
    let session = userSessions.get(chatId);
    if (!session) {
      session = {
        state: STATES.WELCOME,
        data: {}
      };
      userSessions.set(chatId, session);
      console.log(`📝 Created new session for ${chatId}`);
    }
    
    console.log(`📊 Current state: ${session.state}`);
    console.log(`📊 Session data:`, session.data);

    // Handle support message
    if (userInput === 'supporto') {
      console.log(`🆘 Support requested`);
      await this.sendMessage(chatId, config.SUPPORT_MESSAGE);
      return;
    }

    // Handle conversation flow
    switch (session.state) {
      case STATES.WELCOME:
        console.log(`🎯 Handling WELCOME state`);
        await this.handleWelcome(chatId, session);
        break;
      
      case STATES.WAITING_FOR_YES:
        console.log(`🎯 Handling WAITING_FOR_YES state`);
        await this.handleYesResponse(chatId, userInput, session);
        break;
      
      case STATES.WAITING_FOR_NAME:
        console.log(`🎯 Handling WAITING_FOR_NAME state`);
        await this.handleNameInput(chatId, message.body, session);
        break;
      
      case STATES.WAITING_FOR_EMAIL:
        console.log(`🎯 Handling WAITING_FOR_EMAIL state`);
        await this.handleEmailInput(chatId, message.body, session);
        break;
      
      case STATES.COMPLETED:
        console.log(`🎯 Handling COMPLETED state`);
        await this.handleCompletedState(chatId, userInput, session);
        break;
    }
  }

  async handleWelcome(chatId, session) {
    console.log(`📤 Sending welcome message`);
    await this.sendMessage(chatId, config.WELCOME_MESSAGE);
    session.state = STATES.WAITING_FOR_YES;
    console.log(`🔄 State changed to: ${session.state}`);
  }

  async handleYesResponse(chatId, userInput, session) {
    console.log(`🤔 Checking yes response: "${userInput}"`);
    if (userInput === 'sì' || userInput === 'si' || userInput === 'yes') {
      console.log(`✅ Yes confirmed, requesting name`);
      await this.sendMessage(chatId, config.NAME_REQUEST);
      session.state = STATES.WAITING_FOR_NAME;
      console.log(`🔄 State changed to: ${session.state}`);
    } else {
      console.log(`❌ Not yes, asking again`);
      await this.sendMessage(chatId, 'Per favore rispondi "Sì" per continuare con la registrazione.');
    }
  }

  async handleNameInput(chatId, name, session) {
    const trimmedName = name.trim();
    console.log(`📝 Name input: "${trimmedName}"`);
    
    if (trimmedName.length < 2) {
      console.log(`❌ Name too short`);
      await this.sendMessage(chatId, 'Per favore inserisci un nome valido (almeno 2 caratteri).');
      return;
    }

    console.log(`✅ Name accepted: "${trimmedName}"`);
    session.data.fullName = trimmedName;
    await this.sendMessage(chatId, config.EMAIL_REQUEST);
    session.state = STATES.WAITING_FOR_EMAIL;
    console.log(`🔄 State changed to: ${session.state}`);
  }

  async handleEmailInput(chatId, email, session) {
    const trimmedEmail = email.trim();
    console.log(`📧 Email input: "${trimmedEmail}"`);
    console.log(`📊 Session data before email:`, session.data);
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      console.log(`❌ Email validation failed: "${trimmedEmail}"`);
      await this.sendMessage(chatId, 'Per favore inserisci un indirizzo email valido (es. nome@dominio.com).');
      return;
    }

    console.log(`✅ Email validation passed: "${trimmedEmail}"`);
    session.data.email = trimmedEmail;
    
    // Show typing indicator
    console.log(`⏳ Showing typing indicator...`);
    try {
      await this.client.sendStateTyping(chatId);
    } catch (error) {
      console.log(`⚠️ Typing indicator failed:`, error.message);
    }
    
    // Call API to register user
    console.log(`🌐 Calling API with: "${session.data.fullName}", "${trimmedEmail}"`);
    const result = await apiService.registerUser(session.data.fullName, trimmedEmail);
    
    console.log(`📡 API result:`, result);
    
    if (result.success) {
      // Send success message
      console.log(`✅ Sending success message...`);
      await this.sendMessage(chatId, result.message);
      
      // Send login button with auto_login_url
      if (result.data.auto_login_url) {
        console.log(`🔗 Sending login button with URL: ${result.data.auto_login_url}`);
        await this.sendLoginButton(chatId, result.data.auto_login_url);
      } else {
        console.log(`⚠️ No auto_login_url found in response`);
      }
      
      session.state = STATES.COMPLETED;
      session.data.registrationComplete = true;
      session.data.autoLoginUrl = result.data.auto_login_url;
      console.log(`🎉 Registration completed successfully`);
    } else {
      console.log(`❌ API call failed: ${result.message}`);
      await this.sendMessage(chatId, result.message);
      // Reset to email input state
      session.state = STATES.WAITING_FOR_EMAIL;
      console.log(`🔄 State reset to: ${session.state}`);
    }
  }

  async handleCompletedState(chatId, userInput, session) {
    console.log(`🏁 User in completed state, input: "${userInput}"`);
    if (userInput === 'supporto') {
      await this.sendMessage(chatId, config.SUPPORT_MESSAGE);
    } else {
      await this.sendMessage(chatId, 'Il tuo account è già stato creato. Se hai bisogno di aiuto, scrivi "supporto".');
    }
  }

  async sendMessage(chatId, message) {
    try {
      console.log(`📤 Sending message to ${chatId}: "${message}"`);
      await this.client.sendMessage(chatId, message);
      console.log(`✅ Message sent successfully`);
    } catch (error) {
      console.error(`❌ Error sending message:`, error);
    }
  }

  async sendLoginButton(chatId, loginUrl) {
    try {
      console.log(`🔗 Creating login button with URL: ${loginUrl}`);
      
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
      console.log(`✅ Login button sent successfully`);
      
      // Also send the URL as a simple message for compatibility
      await this.sendMessage(chatId, `🔗 Link di accesso: ${loginUrl}`);
      
    } catch (error) {
      console.error(`❌ Error sending login button:`, error);
      // Fallback to simple URL message
      await this.sendMessage(chatId, `🔗 Accedi al Trading Platform: ${loginUrl}`);
    }
  }

  async start() {
    try {
      console.log('🚀 Starting WhatsApp Bot...');
      await this.client.initialize();
      console.log('✅ WhatsApp Bot started successfully!');
    } catch (error) {
      console.error('❌ Failed to start WhatsApp Bot:', error);
    }
  }

  async stop() {
    try {
      await this.client.destroy();
      console.log('🛑 WhatsApp Bot stopped.');
    } catch (error) {
      console.error('❌ Error stopping WhatsApp Bot:', error);
    }
  }
}

// Handle process termination
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down WhatsApp Bot...');
  if (bot) {
    await bot.stop();
  }
  process.exit(0);
});

// Start the bot
const bot = new DebugWhatsAppBot();
bot.start(); 