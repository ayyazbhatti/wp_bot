const express = require('express');
const path = require('path');
const fs = require('fs');
const DatabaseService = require('./database/service');

class AdminPanel {
  constructor() {
    this.app = express();
    this.port = 3001;
    this.dbService = new DatabaseService();
    this.setupRoutes();
  }

  setupRoutes() {
    this.app.use(express.json());
    this.app.use(express.static('public'));

    // API endpoint to get all user data
    this.app.get('/api/users', async (req, res) => {
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

    // API endpoint to get statistics
    this.app.get('/api/stats', async (req, res) => {
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

    // API endpoint to get users by state
    this.app.get('/api/users/state/:state', async (req, res) => {
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

    // API endpoint to get completed registrations
    this.app.get('/api/registrations/completed', async (req, res) => {
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

    // API endpoint to delete a user
    this.app.delete('/api/users/:chatId', async (req, res) => {
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

    // API endpoint to update user sessions (called from bot)
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

    // Serve the admin panel HTML
    this.app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'admin.html'));
    });

    // Health check
    this.app.get('/health', (req, res) => {
      res.json({ status: 'Admin panel is running', timestamp: new Date().toISOString() });
    });
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`🚀 Admin Panel running on http://localhost:${this.port}`);
    });
  }
}

module.exports = AdminPanel; 