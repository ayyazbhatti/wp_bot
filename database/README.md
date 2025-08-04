# Database Files

This directory contains all database-related files for the WhatsApp Trading Bot.

## 📁 File Structure

```
database/
├── README.md              # This file
├── config.js              # Database connection configuration
├── models/
│   └── User.js           # User model definition
├── service.js             # Database operations service
├── setup.js               # Database initialization script
├── database_schema.sql    # Database schema (structure only)
└── backups/
    └── database_backup.sql # Complete database backup with data
```

## 📊 Database Files

### `database_schema.sql`
- **Purpose**: Database structure definition
- **Contains**: Table schemas, indexes, constraints, and types
- **Use**: For creating new database instances
- **Size**: Schema only (no data)

### `backups/database_backup.sql`
- **Purpose**: Complete database backup
- **Contains**: Schema + all data + sequences
- **Use**: For full database restoration
- **Size**: Complete backup with all user data

## 🔧 Database Schema

### Users Table
```sql
CREATE TABLE public.users (
    id integer NOT NULL,
    "chatId" character varying(255) NOT NULL,
    "whatsappName" character varying(255),
    "fullName" character varying(255),
    email character varying(255),
    "registrationComplete" boolean DEFAULT false,
    "autoLoginUrl" text,
    "currentState" public."enum_users_currentState" DEFAULT 'welcome',
    "lastActivity" timestamp with time zone,
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone
);
```

### Indexes
- `users_chat_id` (UNIQUE) - Fast user lookup by chat ID
- `users_email` - Email-based queries
- `users_current_state` - State-based filtering
- `users_last_activity` - Activity-based sorting

### Enum Types
```sql
CREATE TYPE public."enum_users_currentState" AS ENUM (
    'welcome',
    'waiting_for_yes',
    'waiting_for_name',
    'waiting_for_email',
    'completed'
);
```

## 🚀 Usage

### Restore Database from Backup
```bash
# Restore complete database (schema + data)
psql -U postgres whatsapp_bot < database/backups/database_backup.sql

# Restore schema only
psql -U postgres whatsapp_bot < database/database_schema.sql
```

### Create New Database
```bash
# Create database
sudo -u postgres createdb whatsapp_bot

# Restore schema
psql -U postgres whatsapp_bot < database/database_schema.sql
```

### Backup Database
```bash
# Create new backup
sudo -u postgres pg_dump whatsapp_bot > database/backups/backup_$(date +%Y%m%d).sql

# Create schema-only backup
sudo -u postgres pg_dump --schema-only whatsapp_bot > database/database_schema.sql
```

## 📈 Current Data

The database currently contains:
- **1 user record**: Muhammad Ayyaz Bhatti (923046542614@c.us)
- **State**: waiting_for_yes
- **Last Activity**: 2025-08-04 16:39:02

## 🔒 Security Notes

- Database credentials are stored in `.env` file
- Backup files contain sensitive user data
- Keep backup files secure and restrict access
- Consider encrypting backup files for production

## 📝 Maintenance

### Regular Backups
```bash
# Add to crontab for daily backups
0 2 * * * sudo -u postgres pg_dump whatsapp_bot > /var/www/html/wp_bot/database/backups/backup_$(date +\%Y\%m\%d).sql
```

### Cleanup Old Backups
```bash
# Remove backups older than 30 days
find database/backups/ -name "*.sql" -mtime +30 -delete
```

## 🆘 Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL service
sudo systemctl status postgresql

# Test connection
psql -U postgres -d whatsapp_bot

# Check database exists
sudo -u postgres psql -l
```

### Restore Issues
```bash
# Drop and recreate database
sudo -u postgres dropdb whatsapp_bot
sudo -u postgres createdb whatsapp_bot

# Restore from backup
psql -U postgres whatsapp_bot < database/backups/database_backup.sql
```

---

**Last Updated**: 2025-08-04
**Database Version**: PostgreSQL 14.18
**Backup Size**: 9.3 KB 