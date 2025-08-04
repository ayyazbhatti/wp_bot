const express = require('express');
const session = require('express-session');
const path = require('path');
const { 
    requireAuth, 
    handleLogin, 
    handleLogout, 
    checkAuth, 
    SESSION_CONFIG 
} = require('./auth-middleware');

class AdminPanel {
  constructor() {
    this.app = express();
    this.port = 3001;
    this.setupMiddleware();
    this.setupRoutes();
  }

  setupMiddleware() {
    // Session middleware
    this.app.use(session(SESSION_CONFIG));
    
    // Body parsing middleware
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    
    // Static files
    this.app.use(express.static('public'));
  }

  setupRoutes() {
    // Authentication routes (no auth required)
    this.app.get('/login', (req, res) => {
      if (req.session && req.session.isAuthenticated) {
        return res.redirect('/admin');
      }
      res.sendFile(path.join(__dirname, 'public', 'login.html'));
    });

    this.app.post('/api/auth/login', handleLogin);
    this.app.post('/api/auth/logout', handleLogout);
    this.app.get('/api/auth/check', checkAuth);

    // Protected admin panel route
    this.app.get('/admin', requireAuth, (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'admin.html'));
    });

    // Redirect root to admin panel
    this.app.get('/', (req, res) => {
      if (req.session && req.session.isAuthenticated) {
        res.redirect('/admin');
      } else {
        res.redirect('/login');
      }
    });

    // Test API endpoints (protected)
    this.app.get('/api/test', requireAuth, (req, res) => {
      res.json({ 
        success: true, 
        message: 'Protected API working',
        user: req.session.username 
      });
    });

    // Health check
    this.app.get('/health', (req, res) => {
      res.json({ 
        status: 'Admin panel is running', 
        timestamp: new Date().toISOString(),
        authenticated: req.session && req.session.isAuthenticated
      });
    });
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`🚀 Admin Panel running on http://localhost:${this.port}`);
      console.log(`🔐 Login required at http://localhost:${this.port}/login`);
      console.log(`📊 Admin panel at http://localhost:${this.port}/admin`);
      console.log(`🧪 Test API at http://localhost:${this.port}/api/test`);
    });
  }
}

module.exports = AdminPanel; 