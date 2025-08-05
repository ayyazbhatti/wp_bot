// Temporary in-memory database service for when PostgreSQL is not available
class MemoryDatabaseService {
  constructor() {
    this.users = new Map(); // Store users in memory
    console.log('⚠️  Using in-memory storage (data will be lost on restart)');
  }

  async initialize() {
    console.log('✅ Memory database initialized successfully.');
    console.log('💡 To use PostgreSQL, install it and update your .env file');
  }

  async getUserSession(chatId) {
    return this.users.get(chatId) || null;
  }

  async createUserSession(chatId, whatsappName = null) {
    const user = {
      id: Date.now(),
      chatId,
      whatsappName,
      currentState: 'welcome',
      lastActivity: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      fullName: null,
      email: null,
      registrationComplete: false,
      autoLoginUrl: null
    };
    
    this.users.set(chatId, user);
    console.log(`[MEMORY] Created new user session for ${chatId}`);
    return user;
  }

  async updateUserSession(chatId, updateData) {
    let user = this.users.get(chatId);
    if (!user) {
      return await this.createUserSession(chatId, updateData.whatsappName);
    }

    // Update user data
    user = {
      ...user,
      ...updateData,
      lastActivity: new Date(),
      updatedAt: new Date()
    };
    
    this.users.set(chatId, user);
    console.log(`[MEMORY] Updated user session for ${chatId}`);
    return user;
  }

  async updateUserState(chatId, state) {
    const user = this.users.get(chatId);
    if (user) {
      user.currentState = state;
      user.lastActivity = new Date();
      user.updatedAt = new Date();
      this.users.set(chatId, user);
      console.log(`[MEMORY] Updated user state to ${state} for ${chatId}`);
    }
  }

  async updateUserData(chatId, data) {
    const user = this.users.get(chatId);
    if (user) {
      Object.assign(user, data, {
        lastActivity: new Date(),
        updatedAt: new Date()
      });
      this.users.set(chatId, user);
      console.log(`[MEMORY] Updated user data for ${chatId}`);
    }
  }

  async getAllUsers() {
    const users = Array.from(this.users.values());
    return users.sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity));
  }

  async getUsersByState(state) {
    const users = Array.from(this.users.values()).filter(user => user.currentState === state);
    return users.sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity));
  }

  async getCompletedRegistrations() {
    const users = Array.from(this.users.values()).filter(user => user.registrationComplete);
    return users.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async deleteUser(chatId) {
    if (this.users.has(chatId)) {
      this.users.delete(chatId);
      console.log(`[MEMORY] Deleted user ${chatId}`);
      return true;
    }
    return false;
  }

  async getStats() {
    const users = Array.from(this.users.values());
    const totalUsers = users.length;
    const completedRegistrations = users.filter(user => user.registrationComplete).length;
    const pendingRegistrations = totalUsers - completedRegistrations;
    
    // Count by state
    const stateStats = {};
    users.forEach(user => {
      stateStats[user.currentState] = (stateStats[user.currentState] || 0) + 1;
    });

    const stateStatsArray = Object.entries(stateStats).map(([state, count]) => ({
      currentState: state,
      count: count
    }));

    return {
      totalUsers,
      completedRegistrations,
      pendingRegistrations,
      stateStats: stateStatsArray
    };
  }
}

module.exports = MemoryDatabaseService;