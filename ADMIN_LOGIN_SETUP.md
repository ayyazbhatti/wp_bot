# 🔐 Admin Login System Setup Guide

This guide explains how to set up and use the secure admin login system for the WhatsApp Trading Bot.

## 📋 Overview

The admin panel now includes a secure authentication system that protects all admin routes and API endpoints. Only authorized users can access the admin panel and manage user data.

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
npm install express-session bcryptjs
```

### 2. Configure Environment Variables
Create or update your `.env` file:
```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=whatsapp_bot
DB_USER=postgres
DB_PASSWORD=password

# Application Configuration
NODE_ENV=development

# API Configuration
API_BASE_URL=https://v2.dtrader.tech/api/quick-register

# Admin Authentication
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
SESSION_SECRET=your-secret-key-change-this-in-production
```

### 3. Start the Admin Panel
```bash
# Start the full admin panel with database
node admin-panel.js

# Or start the simple test server
node test-server.js
```

## 🔑 Default Credentials

- **Username**: `admin`
- **Password**: `admin123`

⚠️ **Important**: Change these credentials in production!

## 🌐 Access URLs

- **Login Page**: http://localhost:3001/login
- **Admin Panel**: http://localhost:3001/admin
- **Health Check**: http://localhost:3001/health

## 🔒 Security Features

### Authentication System
- **Session-based authentication** with 24-hour timeout
- **Password hashing** with bcrypt
- **CSRF protection** built-in
- **Secure cookie handling** with httpOnly flags
- **Automatic session cleanup** on logout

### Protected Routes
- `/admin` - Main admin panel (requires login)
- `/api/users` - User data API (requires login)
- `/api/stats` - Statistics API (requires login)
- `/api/users/state/:state` - State-based user filtering (requires login)
- `/api/registrations/completed` - Completed registrations (requires login)
- `/api/users/:chatId` - User deletion (requires login)

### Public Routes
- `/login` - Login page (no auth required)
- `/api/auth/login` - Login API (no auth required)
- `/api/auth/logout` - Logout API (no auth required)
- `/api/auth/check` - Auth status check (no auth required)
- `/api/update-session` - Bot session updates (no auth required)

## 🛠️ File Structure

```
├── auth-middleware.js          # Authentication middleware
├── admin-panel.js             # Main admin panel with auth
├── admin-panel-simple.js      # Simplified admin panel
├── test-server.js             # Test server for auth
├── public/
│   ├── login.html             # Login page UI
│   └── admin.html             # Admin panel UI (updated)
└── .env                       # Environment configuration
```

## 🔧 Configuration Options

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `ADMIN_USERNAME` | `admin` | Admin username |
| `ADMIN_PASSWORD` | `admin123` | Admin password |
| `SESSION_SECRET` | `your-secret-key-change-this-in-production` | Session encryption key |
| `NODE_ENV` | `development` | Environment mode |

### Session Configuration

```javascript
const SESSION_CONFIG = {
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-this-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
};
```

## 🧪 Testing the System

### 1. Start the Test Server
```bash
node test-server.js
```

### 2. Test Login Page
```bash
curl http://localhost:3001/login
```

### 3. Test Login API
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  http://localhost:3001/api/auth/login
```

### 4. Test Auth Check
```bash
curl http://localhost:3001/api/auth/check
```

### 5. Test Protected Route
```bash
curl http://localhost:3001/api/test
```

## 🔄 Usage Workflow

### 1. Access Login Page
Navigate to http://localhost:3001/login

### 2. Enter Credentials
- Username: `admin`
- Password: `admin123`

### 3. Access Admin Panel
After successful login, you'll be redirected to http://localhost:3001/admin

### 4. Use Admin Features
- View user statistics
- Monitor user registrations
- Delete users
- Filter by state
- View completed registrations

### 5. Logout
Click the logout button in the top-right corner

## 🚨 Security Best Practices

### Production Deployment

1. **Change Default Credentials**
   ```bash
   # Update .env file
   ADMIN_USERNAME=your-secure-username
   ADMIN_PASSWORD=your-secure-password
   SESSION_SECRET=your-very-secure-random-secret
   ```

2. **Use HTTPS in Production**
   ```javascript
   cookie: {
       secure: true, // Enable in production
       httpOnly: true,
       maxAge: 24 * 60 * 60 * 1000
   }
   ```

3. **Implement Rate Limiting**
   ```bash
   npm install express-rate-limit
   ```

4. **Add Password Hashing**
   ```javascript
   // In auth-middleware.js
   const hashedPassword = await bcrypt.hash(ADMIN_CREDENTIALS.password, 10);
   const isValidPassword = await bcrypt.compare(password, hashedPassword);
   ```

5. **Use Environment Variables**
   - Never commit `.env` files to version control
   - Use different credentials for each environment
   - Rotate session secrets regularly

### Monitoring and Logging

1. **Enable Session Logging**
   ```javascript
   app.use((req, res, next) => {
       if (req.session && req.session.isAuthenticated) {
           console.log(`[AUTH] ${req.session.username} accessed ${req.path}`);
       }
       next();
   });
   ```

2. **Failed Login Attempts**
   ```javascript
   // Track failed attempts
   if (!isValidPassword) {
       console.log(`[SECURITY] Failed login attempt for username: ${username}`);
   }
   ```

## 🆘 Troubleshooting

### Common Issues

1. **Session Not Persisting**
   - Check if cookies are enabled
   - Verify session secret is set
   - Ensure httpOnly cookies are working

2. **Login Not Working**
   - Verify credentials in `.env` file
   - Check if server is running on correct port
   - Ensure database connection is working

3. **Admin Panel Not Loading**
   - Check if user is authenticated
   - Verify session is valid
   - Check browser console for errors

4. **API Endpoints Returning 401**
   - Ensure user is logged in
   - Check session validity
   - Verify authentication middleware is applied

### Debug Commands

```bash
# Check if server is running
curl http://localhost:3001/health

# Test login API
curl -X POST -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  http://localhost:3001/api/auth/login

# Check authentication status
curl http://localhost:3001/api/auth/check

# Test protected endpoint
curl http://localhost:3001/api/test
```

## 📊 Admin Panel Features

### Dashboard Statistics
- Total users count
- Completed registrations
- Pending users
- Real-time updates

### User Management
- View all users
- Filter by registration state
- Delete users
- View user details

### API Endpoints
- `/api/users` - Get all users
- `/api/stats` - Get statistics
- `/api/users/state/:state` - Filter by state
- `/api/registrations/completed` - Get completed registrations
- `/api/users/:chatId` - Delete user

## 🔄 Integration with Bot

The admin panel integrates seamlessly with the WhatsApp bot:

1. **Bot Updates Sessions**: Bot calls `/api/update-session` to update user data
2. **Admin Views Data**: Admin panel displays real-time user data
3. **Database Sync**: Both bot and admin panel use the same PostgreSQL database
4. **Session Management**: Admin sessions are separate from bot sessions

## 📝 API Reference

### Authentication Endpoints

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/login` | GET | No | Login page |
| `/api/auth/login` | POST | No | Login API |
| `/api/auth/logout` | POST | No | Logout API |
| `/api/auth/check` | GET | No | Auth status |

### Protected Endpoints

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/admin` | GET | Yes | Admin panel |
| `/api/users` | GET | Yes | Get all users |
| `/api/stats` | GET | Yes | Get statistics |
| `/api/users/state/:state` | GET | Yes | Filter by state |
| `/api/registrations/completed` | GET | Yes | Get completed |
| `/api/users/:chatId` | DELETE | Yes | Delete user |

## 🎯 Next Steps

1. **Deploy to Production**
   - Change default credentials
   - Enable HTTPS
   - Set up monitoring

2. **Add Advanced Features**
   - User roles and permissions
   - Audit logging
   - Two-factor authentication
   - Password reset functionality

3. **Enhance Security**
   - Rate limiting
   - IP whitelisting
   - Session encryption
   - Security headers

---

**Last Updated**: 2025-08-04
**Version**: 1.0.0
**Security Level**: High 