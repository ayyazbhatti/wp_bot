const User = require('./models/User');
const sequelize = require('./config');

class DatabaseService {
  constructor() {
    this.sequelize = sequelize;
  }

  async initialize() {
    try {
      await this.sequelize.authenticate();
      console.log('✅ Database connection established successfully.');
      
      // Sync models with database - force recreation to avoid conflicts
      await this.sequelize.sync({ force: true });
      console.log('✅ Database models synchronized.');
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      throw error;
    }
  }

  async getUserSession(chatId) {
    try {
      const user = await User.findOne({ where: { chatId } });
      return user;
    } catch (error) {
      console.error('Error getting user session:', error);
      return null;
    }
  }

  async createUserSession(chatId, whatsappName = null) {
    try {
      const user = await User.create({
        chatId,
        whatsappName,
        currentState: 'welcome',
        lastActivity: new Date()
      });
      console.log(`[DB] Created new user session for ${chatId}`);
      return user;
    } catch (error) {
      console.error('Error creating user session:', error);
      return null;
    }
  }

  async updateUserSession(chatId, updateData) {
    try {
      const user = await User.findOne({ where: { chatId } });
      if (!user) {
        return await this.createUserSession(chatId, updateData.whatsappName);
      }

      // Update user data
      const updatedUser = await user.update({
        ...updateData,
        lastActivity: new Date()
      });

      console.log(`[DB] Updated user session for ${chatId}`);
      return updatedUser;
    } catch (error) {
      console.error('Error updating user session:', error);
      return null;
    }
  }

  async updateUserState(chatId, state) {
    try {
      const user = await User.findOne({ where: { chatId } });
      if (user) {
        await user.update({
          currentState: state,
          lastActivity: new Date()
        });
        console.log(`[DB] Updated user state to ${state} for ${chatId}`);
      }
    } catch (error) {
      console.error('Error updating user state:', error);
    }
  }

  async updateUserData(chatId, data) {
    try {
      const user = await User.findOne({ where: { chatId } });
      if (user) {
        await user.update({
          ...data,
          lastActivity: new Date()
        });
        console.log(`[DB] Updated user data for ${chatId}`);
      }
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  }

  async getAllUsers() {
    try {
      const users = await User.findAll({
        order: [['lastActivity', 'DESC']]
      });
      return users;
    } catch (error) {
      console.error('Error getting all users:', error);
      return [];
    }
  }

  async getUsersByState(state) {
    try {
      const users = await User.findAll({
        where: { currentState: state },
        order: [['lastActivity', 'DESC']]
      });
      return users;
    } catch (error) {
      console.error('Error getting users by state:', error);
      return [];
    }
  }

  async getCompletedRegistrations() {
    try {
      const users = await User.findAll({
        where: { registrationComplete: true },
        order: [['createdAt', 'DESC']]
      });
      return users;
    } catch (error) {
      console.error('Error getting completed registrations:', error);
      return [];
    }
  }

  async deleteUser(chatId) {
    try {
      const user = await User.findOne({ where: { chatId } });
      if (user) {
        await user.destroy();
        console.log(`[DB] Deleted user ${chatId}`);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }

  async getStats() {
    try {
      const totalUsers = await User.count();
      const completedRegistrations = await User.count({ where: { registrationComplete: true } });
      const pendingRegistrations = await User.count({ where: { registrationComplete: false } });
      
      const stateStats = await User.findAll({
        attributes: [
          'currentState',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['currentState']
      });

      return {
        totalUsers,
        completedRegistrations,
        pendingRegistrations,
        stateStats
      };
    } catch (error) {
      console.error('Error getting stats:', error);
      return {
        totalUsers: 0,
        completedRegistrations: 0,
        pendingRegistrations: 0,
        stateStats: []
      };
    }
  }
}

module.exports = DatabaseService; 