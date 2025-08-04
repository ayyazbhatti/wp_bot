const DatabaseService = require('./service');

async function setupDatabase() {
  console.log('🚀 Setting up PostgreSQL database...');
  
  try {
    const dbService = new DatabaseService();
    await dbService.initialize();
    
    console.log('✅ Database setup completed successfully!');
    console.log('');
    console.log('📊 Database Configuration:');
    console.log(`   Host: ${process.env.DB_HOST || 'localhost'}`);
    console.log(`   Port: ${process.env.DB_PORT || 5432}`);
    console.log(`   Database: ${process.env.DB_NAME || 'whatsapp_bot'}`);
    console.log(`   User: ${process.env.DB_USER || 'postgres'}`);
    console.log('');
    console.log('📋 Available tables:');
    console.log('   - users (stores user sessions and registration data)');
    console.log('');
    console.log('🔄 You can now start the bot with: npm start');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('1. Make sure PostgreSQL is installed and running');
    console.log('2. Create the database: createdb whatsapp_bot');
    console.log('3. Check your .env file for database credentials');
    console.log('4. Ensure PostgreSQL user has proper permissions');
    process.exit(1);
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase; 