const { DataTypes } = require('sequelize');
const sequelize = require('../config');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  chatId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: 'WhatsApp chat ID'
  },
  whatsappName: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'WhatsApp profile name'
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'User full name'
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true
    },
    comment: 'User email address'
  },
  registrationComplete: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Whether registration is complete'
  },
  autoLoginUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Auto-login URL from trading platform'
  },
  currentState: {
    type: DataTypes.ENUM('welcome', 'waiting_for_yes', 'waiting_for_name', 'waiting_for_email', 'completed'),
    defaultValue: 'welcome',
    comment: 'Current conversation state'
  },
  lastActivity: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    comment: 'Last user activity timestamp'
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'users',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['chatId']
    },
    {
      fields: ['email']
    },
    {
      fields: ['currentState']
    },
    {
      fields: ['lastActivity']
    }
  ]
});

module.exports = User; 