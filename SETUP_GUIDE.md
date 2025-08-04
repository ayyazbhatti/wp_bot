# Quick Setup Guide

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Bot
```bash
npm start
# OR
./start.sh
```

### 3. Scan QR Code
- The bot will display a QR code in the terminal
- Open WhatsApp on your phone
- Go to Settings > Linked Devices > Link a Device
- Scan the QR code

## 📱 How to Use

1. **Send any message** to the bot number
2. **Follow the conversation**:
   - Reply "Sì" to start registration
   - Enter your full name
   - Enter your email
   - Get login link automatically

## 🔧 Configuration

Edit `config.js` to customize:
- Bot messages
- API endpoints
- Support contact

## 🧪 Test API

Test the API integration:
```bash
node test-api.js
```

## 📁 Files Overview

- `bot.js` - Main bot logic
- `api.js` - API integration service
- `config.js` - Bot configuration
- `start.sh` - Easy startup script
- `test-api.js` - API testing script

## 🆘 Support

- Type "supporto" anytime during conversation
- Check logs in terminal for errors
- Ensure stable internet connection

## 🔒 Security

- Email validation included
- Input sanitization
- Error handling
- Session management

## ✅ Ready to Use!

The bot is now ready to collect user information and integrate with your trading platform API. 