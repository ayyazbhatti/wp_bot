# WhatsApp Trading Bot

A sophisticated WhatsApp bot for automated trading service registration with PostgreSQL database integration.

## 🚀 Features

### Core Bot Features
- **WhatsApp Integration**: Seamless WhatsApp Web integration
- **Conversation Flow**: Intelligent conversation state management
- **Registration Process**: Automated user registration with trading platform
- **Multi-language Support**: Italian language support with customizable messages

### Database Features (NEW!)
- **PostgreSQL Integration**: Persistent data storage with Sequelize ORM
- **User Session Management**: Persistent user sessions across server restarts
- **Registration Tracking**: Complete registration status tracking
- **Activity Analytics**: Real-time user activity monitoring
- **Data Integrity**: ACID compliance ensures data consistency
- **Backup & Recovery**: Easy database backup and restoration

### Admin Panel Features
- **Real-time Dashboard**: Live user statistics and analytics
- **User Management**: View and manage all registered users
- **State Filtering**: Filter users by conversation state
- **Registration Analytics**: Track completion rates and trends
- **Database Operations**: Direct database management interface

## 📊 Database Schema

### Users Table
| Column | Type | Description |
|--------|------|-------------|
| `id` | INTEGER | Primary key, auto-increment |
| `chatId` | STRING | WhatsApp chat ID (unique) |
| `whatsappName` | STRING | WhatsApp profile name |
| `fullName` | STRING | User's full name |
| `email` | STRING | User's email address |
| `registrationComplete` | BOOLEAN | Registration status |
| `autoLoginUrl` | TEXT | Trading platform login URL |
| `currentState` | ENUM | Conversation state |
| `lastActivity` | TIMESTAMP | Last user activity |
| `createdAt` | TIMESTAMP | Record creation time |
| `updatedAt` | TIMESTAMP | Record update time |

## 🛠️ Installation

### Prerequisites
- Node.js (version 16 or higher)
- PostgreSQL (version 12 or higher)
- npm package manager

### Quick Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/ayyazbhatti/wp_bot.git
   cd wp_bot
   ```

2. **Install PostgreSQL**
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   sudo systemctl start postgresql
   sudo systemctl enable postgresql
   ```

3. **Run automated setup**
   ```bash
   chmod +x setup-postgres.sh
   ./setup-postgres.sh
   ```

4. **Start the bot**
   ```bash
   npm start
   ```

### Manual Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp env.example .env
   # Edit .env with your database credentials
   ```

3. **Setup database**
   ```bash
   npm run db:setup
   ```

4. **Start the bot**
   ```bash
   npm start
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=whatsapp_bot
DB_USER=postgres
DB_PASSWORD=your_password_here

# Application Configuration
NODE_ENV=development

# API Configuration
API_BASE_URL=https://v2.dtrader.tech/api/quick-register
```

### Database Setup

1. **Create database**
   ```bash
   sudo -u postgres createdb whatsapp_bot
   ```

2. **Set password**
   ```bash
   sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'password';"
   ```

3. **Initialize tables**
   ```bash
   npm run db:setup
   ```

## 📱 Usage

### Starting the Bot

```bash
# Start with PostgreSQL
npm start

# Development mode with auto-restart
npm run dev
```

### Access Points

- **Admin Panel**: `http://localhost:3001`
- **Health Check**: `http://localhost:3001/health`
- **User Statistics**: `http://localhost:3001/api/stats`

### WhatsApp Authentication

1. Start the bot: `npm start`
2. Scan the QR code with your WhatsApp mobile app
3. The bot will be ready to receive messages

## 📊 Admin Panel

### Available Endpoints

- **GET** `/api/users` - Get all users
- **GET** `/api/stats` - Get statistics
- **GET** `/api/users/state/:state` - Get users by state
- **GET** `/api/registrations/completed` - Get completed registrations
- **DELETE** `/api/users/:chatId` - Delete user

### Features

- **Real-time Statistics**: Live user count and registration rates
- **User Management**: View, filter, and manage users
- **State Tracking**: Monitor conversation states
- **Activity Monitoring**: Track user activity timestamps
- **Database Operations**: Direct database management

## 🔍 API Reference

### Database Service

```javascript
// Get user session
const user = await dbService.getUserSession(chatId);

// Create new session
const user = await dbService.createUserSession(chatId, whatsappName);

// Update user data
await dbService.updateUserData(chatId, { fullName: 'John Doe' });

// Get statistics
const stats = await dbService.getStats();
```

### Conversation States

- `welcome` - Initial welcome state
- `waiting_for_yes` - Waiting for user confirmation
- `waiting_for_name` - Waiting for user's name
- `waiting_for_email` - Waiting for user's email
- `completed` - Registration completed

## 🗄️ Database Operations

### Backup and Recovery

```bash
# Create backup
pg_dump -U postgres whatsapp_bot > backup.sql

# Restore backup
psql -U postgres whatsapp_bot < backup.sql
```

### Automated Backups

Add to crontab for daily backups:

```bash
# Edit crontab
crontab -e

# Add backup job (daily at 2 AM)
0 2 * * * pg_dump -U postgres whatsapp_bot > /path/to/backups/backup_$(date +\%Y\%m\%d).sql
```

## 📈 Performance

### Database Indexes

The following indexes are automatically created:

- `chatId` (unique) - Fast user lookup
- `email` - Email-based queries
- `currentState` - State-based filtering
- `lastActivity` - Activity-based sorting

### Connection Pooling

Sequelize automatically manages connection pooling:

- **Max Connections**: 5
- **Min Connections**: 0
- **Acquire Timeout**: 30 seconds
- **Idle Timeout**: 10 seconds

## 🔒 Security

### Environment Variables
- Database credentials are stored in `.env` file
- `.env` is excluded from git repository
- Use strong passwords for database access

### Database Security
- Use dedicated database user with limited permissions
- Enable SSL connections for production
- Regular security updates for PostgreSQL

## 🚀 Deployment

### Production Setup

1. **Install PostgreSQL**
   ```bash
   sudo apt install postgresql postgresql-contrib
   ```

2. **Configure database**
   ```bash
   sudo -u postgres createdb whatsapp_bot
   sudo -u postgres psql -c "CREATE USER bot_user WITH PASSWORD 'secure_password';"
   sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE whatsapp_bot TO bot_user;"
   ```

3. **Setup environment**
   ```bash
   cp env.example .env
   # Edit .env with production credentials
   ```

4. **Start the bot**
   ```bash
   npm start
   ```

### Docker Support

```dockerfile
FROM node:16-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run db:setup

EXPOSE 3001
CMD ["npm", "start"]
```

## 📝 Logs

### Database Logs
```bash
# PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-*.log
```

### Application Logs
```bash
# Bot logs
npm start 2>&1 | tee bot.log

# Admin panel logs
curl -s http://localhost:3001/health
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

### Troubleshooting

1. **Database Connection Issues**
   - Check PostgreSQL service: `sudo systemctl status postgresql`
   - Verify database exists: `psql -U postgres -l`
   - Test connection: `psql -U postgres -d whatsapp_bot`

2. **Bot Not Starting**
   - Check environment variables in `.env`
   - Verify database credentials
   - Check Node.js version: `node --version`

3. **Admin Panel Not Accessible**
   - Check if bot is running: `ps aux | grep "node bot.js"`
   - Verify port 3001 is not blocked
   - Check firewall settings

### Getting Help

- Check the [POSTGRESQL_SETUP.md](POSTGRESQL_SETUP.md) for detailed setup instructions
- Review the database logs for error messages
- Ensure all prerequisites are installed correctly

## 🎯 Roadmap

- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Email notifications
- [ ] Automated backups
- [ ] Docker containerization
- [ ] Kubernetes deployment
- [ ] Load balancing
- [ ] Redis caching
- [ ] API rate limiting
- [ ] Webhook integrations

---

**Made with ❤️ for automated trading registration** 