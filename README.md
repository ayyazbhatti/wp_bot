# WhatsApp Trading Bot

A WhatsApp bot for automatic trading service registration that collects user information and integrates with the trading platform API.

## Features

- 🤖 Automated conversation flow in Italian
- 📝 Collects user name and email
- 🔗 Integrates with trading platform API
- 🎁 Offers €20 bonus on registration
- 🔐 One-time login button with auto-login URL
- 💬 Support system with "supporto" command

## Conversation Flow

1. **Welcome**: Greets user and offers €20 bonus
2. **Confirmation**: User responds "Sì" to continue
3. **Name Collection**: Collects full name
4. **Email Collection**: Collects email address
5. **Registration**: Calls API to create account
6. **Login**: Provides one-time login button

## API Integration

The bot integrates with the trading platform API:
- **Endpoint**: `https://v2.dtrader.tech/api/quick-register`
- **Method**: POST
- **Headers**: Content-Type: application/json, Accept: application/json
- **Payload**: `{ "full_name": "John Doe", "email": "john@example.com" }`

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd wp_bot
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the bot**:
   ```bash
   npm start
   ```

## Usage

1. **Start the bot**:
   ```bash
   npm start
   ```

2. **Scan QR Code**: When the bot starts, it will display a QR code in the terminal. Scan this with your WhatsApp mobile app.

3. **Bot is ready**: Once connected, the bot will automatically respond to messages.

## Development

For development with auto-restart:
```bash
npm run dev
```

## Configuration

Edit `config.js` to customize:
- API endpoints
- Bot messages
- Support contact information

## Dependencies

- `whatsapp-web.js`: WhatsApp Web API client
- `qrcode-terminal`: QR code display in terminal
- `axios`: HTTP client for API calls
- `dotenv`: Environment variable management

## File Structure

```
wp_bot/
├── bot.js          # Main bot logic
├── api.js          # API service module
├── config.js       # Configuration settings
├── package.json    # Dependencies and scripts
└── README.md       # This file
```

## API Response Handling

The bot handles various API responses:
- ✅ **Success**: Account created, login URL provided
- ❌ **400**: Invalid email format
- ❌ **409**: Email already exists
- ❌ **500**: Service unavailable

## Security Features

- Email validation
- Input sanitization
- Error handling
- Session management
- One-time login URLs

## Support

For support, users can type "supporto" at any time during the conversation.

## License

MIT License 