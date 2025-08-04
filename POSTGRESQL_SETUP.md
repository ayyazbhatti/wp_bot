# PostgreSQL Database Integration

This guide explains how to set up PostgreSQL database for the WhatsApp Trading Bot to provide persistent data storage.

## 🎯 Benefits of PostgreSQL Integration

- **Persistent Data**: User sessions survive server restarts
- **Data Analytics**: Track registration statistics and user behavior
- **Scalability**: Handle multiple concurrent users efficiently
- **Data Integrity**: ACID compliance ensures data consistency
- **Backup & Recovery**: Easy database backup and restoration

## 📋 Prerequisites

1. **PostgreSQL Server** (version 12 or higher)
2. **Node.js** (version 16 or higher)
3. **npm** package manager

## 🚀 Quick Setup

### 1. Install PostgreSQL

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**CentOS/RHEL:**
```bash
sudo yum install postgresql postgresql-server
sudo postgresql-setup initdb
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

### 2. Create Database and User

```bash
# Connect to PostgreSQL as superuser
sudo -u postgres psql

# Create database
CREATE DATABASE whatsapp_bot;

# Create user (optional, you can use postgres user)
CREATE USER whatsapp_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE whatsapp_bot TO whatsapp_user;

# Exit PostgreSQL
\q
```

### 3. Run Setup Script

```bash
# Make script executable
chmod +x setup-postgres.sh

# Run setup
./setup-postgres.sh
```

## ⚙️ Manual Configuration

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

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
API_BASE_URL=https://backoffice.comgestfx.com/api/quick-register
```

### 3. Initialize Database

```bash
npm run db:setup
```

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

### Conversation States

- `welcome` - Initial welcome state
- `waiting_for_yes` - Waiting for user confirmation
- `waiting_for_name` - Waiting for user's name
- `waiting_for_email` - Waiting for user's email
- `completed` - Registration completed

## 🔧 Database Operations

### User Session Management

```javascript
// Get user session
const user = await dbService.getUserSession(chatId);

// Create new session
const user = await dbService.createUserSession(chatId, whatsappName);

// Update user data
await dbService.updateUserData(chatId, { fullName: 'John Doe' });

// Update user state
await dbService.updateUserState(chatId, 'waiting_for_email');
```

### Analytics and Statistics

```javascript
// Get all users
const users = await dbService.getAllUsers();

// Get users by state
const users = await dbService.getUsersByState('completed');

// Get completed registrations
const registrations = await dbService.getCompletedRegistrations();

// Get statistics
const stats = await dbService.getStats();
```

## 📈 Admin Panel Features

The admin panel now includes:

- **User Management**: View all users and their registration status
- **Statistics Dashboard**: Real-time registration statistics
- **State Filtering**: Filter users by conversation state
- **Completed Registrations**: View successful registrations
- **User Deletion**: Remove users from database
- **Activity Tracking**: Monitor user activity timestamps

## 🔍 API Endpoints

### Get All Users
```
GET /api/users
```

### Get Statistics
```
GET /api/stats
```

### Get Users by State
```
GET /api/users/state/:state
```

### Get Completed Registrations
```
GET /api/registrations/completed
```

### Delete User
```
DELETE /api/users/:chatId
```

## 🛠️ Troubleshooting

### Database Connection Issues

1. **Check PostgreSQL Service:**
   ```bash
   sudo systemctl status postgresql
   ```

2. **Verify Database Exists:**
   ```bash
   psql -U postgres -l
   ```

3. **Test Connection:**
   ```bash
   psql -U postgres -d whatsapp_bot
   ```

### Permission Issues

1. **Check User Permissions:**
   ```sql
   \du
   ```

2. **Grant Permissions:**
   ```sql
   GRANT ALL PRIVILEGES ON DATABASE whatsapp_bot TO your_user;
   ```

### Environment Variables

1. **Check .env File:**
   ```bash
   cat .env
   ```

2. **Verify Database Credentials:**
   - Host: localhost
   - Port: 5432
   - Database: whatsapp_bot
   - User: postgres (or your custom user)
   - Password: your_password

## 🔄 Migration from In-Memory Storage

The bot automatically migrates from in-memory storage to PostgreSQL:

1. **No Data Loss**: Existing sessions are preserved
2. **Automatic Migration**: No manual intervention required
3. **Backward Compatibility**: Bot continues working during migration

## 📦 Backup and Recovery

### Database Backup

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

## 🚀 Performance Optimization

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

## 📝 Environment Variables Reference

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_HOST` | localhost | Database host |
| `DB_PORT` | 5432 | Database port |
| `DB_NAME` | whatsapp_bot | Database name |
| `DB_USER` | postgres | Database user |
| `DB_PASSWORD` | password | Database password |
| `NODE_ENV` | development | Application environment |

## 🎉 Success Indicators

After successful setup, you should see:

1. **Database Connection**: "✅ Database connection established successfully"
2. **Model Synchronization**: "✅ Database models synchronized"
3. **Bot Startup**: "WhatsApp Bot started successfully!"
4. **Admin Panel**: "🚀 Admin Panel running on http://localhost:3001"

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify PostgreSQL installation and configuration
3. Review database logs: `sudo tail -f /var/log/postgresql/postgresql-*.log`
4. Check application logs for detailed error messages 