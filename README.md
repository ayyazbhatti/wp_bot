# WhatsApp Trading Bot

A WhatsApp bot for collecting user information and registering users with a trading platform API.

## Features

- 🤖 **WhatsApp Integration** - Uses whatsapp-web.js for WhatsApp Web API
- 📝 **User Registration** - Collects full name and email from users
- 🔗 **API Integration** - Registers users with external trading platform
- 🔐 **One-time Login Links** - Provides secure one-time access links
- 📊 **Admin Panel** - Real-time monitoring of user interactions
- 🔄 **Session Management** - Tracks user conversation states
- 🌐 **Modern Web Interface** - Beautiful admin dashboard

## Admin Panel Features

- 📈 **Real-time Statistics** - Total users, completed registrations, pending users
- 📋 **User Data Table** - Complete user information with status tracking
- 🔄 **Auto-refresh** - Updates every 30 seconds automatically
- 📱 **Responsive Design** - Works on desktop and mobile devices
- 🎨 **Modern UI** - Beautiful gradient design with smooth animations

## Quick Start

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- WhatsApp account for the bot

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ayyazbhatti/wp_bot.git
   cd wp_bot
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the bot and admin panel:**
   ```bash
   ./start-admin.sh
   ```

4. **Access the admin panel:**
   - Open your browser and go to: `http://localhost:3001`
   - The admin panel will show real-time user data

## Usage

### Starting the Bot

```bash
# Start both bot and admin panel
npm start

# Or use the convenience script
./start-admin.sh
```

### Admin Panel Access

Once the bot is running, access the admin panel at:
- **URL:** `http://localhost:3001`
- **Features:**
  - View all user interactions
  - Monitor registration status
  - Track user data in real-time
  - Auto-refresh every 30 seconds

### WhatsApp Bot Flow

1. **Welcome Message** - Bot greets user and asks if they want to register
2. **Name Collection** - User provides full name
3. **Email Collection** - User provides email address
4. **API Registration** - Bot calls external API to register user
5. **Success Message** - Confirmation with one-time login link
6. **Options Menu** - User can create new account or exit

## Configuration

### Bot Messages (config.js)

```javascript
module.exports = {
  API_BASE_URL: 'https://v2.dtrader.tech/api/quick-register',
  WELCOME_MESSAGE: 'Ciao 👋 Benvenuto nel servizio di trading...',
  SUPPORT_MESSAGE: 'Crea nuovo account o esci?...',
  EXIT_MESSAGE: 'Grazie per aver utilizzato il nostro servizio! 👋'
};
```

### Admin Panel Port

The admin panel runs on port 3001 by default. You can change this in `admin-panel.js`:

```javascript
this.port = 3001; // Change this to your preferred port
```

## File Structure

```
wp_bot/
├── bot.js                 # Main WhatsApp bot logic
├── api.js                 # API service for user registration
├── config.js              # Configuration and messages
├── admin-panel.js         # Admin panel server
├── package.json           # Dependencies and scripts
├── start-admin.sh         # Convenience start script
├── public/
│   └── admin.html        # Admin panel web interface
├── README.md             # This file
├── CONVERSATION_EXAMPLE.md
├── SETUP_GUIDE.md
└── example-config.js
```

## API Integration

The bot integrates with the trading platform API:

- **Endpoint:** `https://v2.dtrader.tech/api/quick-register`
- **Method:** POST
- **Payload:** `{ full_name, email }`
- **Response:** `{ success, auto_login_url, password }`

## Admin Panel Data

The admin panel displays:

- **Phone Number** - User's WhatsApp number
- **Full Name** - User's provided name
- **Email** - User's email address
- **Status** - Registration completion status
- **Last Activity** - Timestamp of last interaction
- **Login URL** - Availability of one-time login link

## Conversation States

The bot manages these conversation states:

- `WELCOME` - Initial greeting
- `WAITING_FOR_YES` - Waiting for user confirmation
- `WAITING_FOR_NAME` - Collecting user's name
- `WAITING_FOR_EMAIL` - Collecting user's email
- `COMPLETED` - Registration finished

## Commands

Users can interact with the bot using these commands:

- `"si"` - Confirm registration
- `"nuovo"` - Start new registration
- `"esci"` - Exit the bot
- `"supporto"` - Show options menu

## Troubleshooting

### Common Issues

1. **QR Code not appearing:**
   - Check internet connection
   - Restart the bot

2. **Admin panel not loading:**
   - Ensure bot is running
   - Check if port 3001 is available
   - Try accessing `http://localhost:3001/health`

3. **API registration failing:**
   - Check API endpoint availability
   - Verify network connectivity
   - Check console logs for errors

### Debug Mode

For detailed logging, check the console output when running the bot. All interactions are logged with timestamps.

## Security

- ✅ **One-time login links** - Links expire after use
- ✅ **Input validation** - Email format validation
- ✅ **Session management** - Secure user session tracking
- ✅ **Error handling** - Graceful error management

## Support

For issues or questions:
1. Check the console logs for error messages
2. Verify all dependencies are installed
3. Ensure WhatsApp Web is accessible
4. Check API endpoint availability

## License

MIT License - see LICENSE file for details.

---

**Note:** This bot requires a WhatsApp account and QR code authentication to function. The admin panel provides real-time monitoring of all user interactions. 