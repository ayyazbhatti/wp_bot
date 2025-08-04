const express = require('express');
const session = require('express-session');
const path = require('path');
const fs = require('fs');
const DatabaseService = require('./database/service');
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
    this.dbService = new DatabaseService();
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

    // Protected API endpoints
    this.app.get('/api/users', requireAuth, async (req, res) => {
      try {
        const users = await this.dbService.getAllUsers();
        const formattedUsers = users.map(user => ({
          chatId: user.chatId.replace('@c.us', ''),
          whatsappName: user.whatsappName || 'N/A',
          fullName: user.fullName || 'N/A',
          email: user.email || 'N/A',
          registrationComplete: user.registrationComplete || false,
          autoLoginUrl: user.autoLoginUrl || 'N/A',
          lastActivity: user.lastActivity || 'N/A',
          state: user.currentState || 'N/A'
        }));
        
        res.json({
          success: true,
          totalUsers: formattedUsers.length,
          users: formattedUsers
        });
      } catch (error) {
        console.error('Error getting users:', error);
        res.status(500).json({ success: false, error: 'Database error' });
      }
    });

    this.app.get('/api/stats', requireAuth, async (req, res) => {
      try {
        const stats = await this.dbService.getStats();
        res.json({
          success: true,
          stats: stats
        });
      } catch (error) {
        console.error('Error getting stats:', error);
        res.status(500).json({ success: false, error: 'Database error' });
      }
    });

    this.app.get('/api/users/state/:state', requireAuth, async (req, res) => {
      try {
        const state = req.params.state;
        const users = await this.dbService.getUsersByState(state);
        const formattedUsers = users.map(user => ({
          chatId: user.chatId.replace('@c.us', ''),
          whatsappName: user.whatsappName || 'N/A',
          fullName: user.fullName || 'N/A',
          email: user.email || 'N/A',
          registrationComplete: user.registrationComplete || false,
          autoLoginUrl: user.autoLoginUrl || 'N/A',
          lastActivity: user.lastActivity || 'N/A',
          state: user.currentState || 'N/A'
        }));
        
        res.json({
          success: true,
          state: state,
          totalUsers: formattedUsers.length,
          users: formattedUsers
        });
      } catch (error) {
        console.error('Error getting users by state:', error);
        res.status(500).json({ success: false, error: 'Database error' });
      }
    });

    this.app.get('/api/registrations/completed', requireAuth, async (req, res) => {
      try {
        const users = await this.dbService.getCompletedRegistrations();
        const formattedUsers = users.map(user => ({
          chatId: user.chatId.replace('@c.us', ''),
          whatsappName: user.whatsappName || 'N/A',
          fullName: user.fullName || 'N/A',
          email: user.email || 'N/A',
          autoLoginUrl: user.autoLoginUrl || 'N/A',
          createdAt: user.createdAt,
          lastActivity: user.lastActivity || 'N/A'
        }));
        
        res.json({
          success: true,
          totalRegistrations: formattedUsers.length,
          registrations: formattedUsers
        });
      } catch (error) {
        console.error('Error getting completed registrations:', error);
        res.status(500).json({ success: false, error: 'Database error' });
      }
    });

    this.app.delete('/api/users/:chatId', requireAuth, async (req, res) => {
      try {
        const chatId = req.params.chatId;
        const success = await this.dbService.deleteUser(chatId);
        
        if (success) {
          res.json({ success: true, message: 'User deleted successfully' });
        } else {
          res.status(404).json({ success: false, error: 'User not found' });
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ success: false, error: 'Database error' });
      }
    });

    // API endpoint to update user sessions (called from bot) - no auth required
    this.app.post('/api/update-session', async (req, res) => {
      try {
        const { chatId, sessionData } = req.body;
        if (chatId && sessionData) {
          await this.dbService.updateUserSession(chatId, sessionData);
          res.json({ success: true });
        } else {
          res.status(400).json({ success: false, error: 'Missing data' });
        }
      } catch (error) {
        console.error('Error updating session:', error);
        res.status(500).json({ success: false, error: 'Database error' });
      }
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
    });
  }
}

module.exports = AdminPanel; 