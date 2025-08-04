#!/bin/bash

echo "🚀 Setting up PostgreSQL for WhatsApp Bot..."
echo "=============================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Install dependencies
echo "📦 Installing PostgreSQL dependencies..."
npm install

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed."
    echo "📋 Please install PostgreSQL:"
    echo "   Ubuntu/Debian: sudo apt install postgresql postgresql-contrib"
    echo "   CentOS/RHEL: sudo yum install postgresql postgresql-server"
    echo "   macOS: brew install postgresql"
    echo ""
    echo "After installation, run this script again."
    exit 1
fi

# Check if PostgreSQL service is running
if ! pg_isready &> /dev/null; then
    echo "❌ PostgreSQL service is not running."
    echo "📋 Please start PostgreSQL:"
    echo "   Ubuntu/Debian: sudo systemctl start postgresql"
    echo "   CentOS/RHEL: sudo systemctl start postgresql"
    echo "   macOS: brew services start postgresql"
    echo ""
    echo "After starting PostgreSQL, run this script again."
    exit 1
fi

echo "✅ PostgreSQL is installed and running."

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
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
EOF
    echo "✅ Created .env file. Please update the database password."
else
    echo "✅ .env file already exists."
fi

# Setup database
echo "🔧 Setting up database..."
node database/setup.js

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 PostgreSQL setup completed successfully!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Update the database password in .env file"
    echo "2. Start the bot: npm start"
    echo "3. Access admin panel: http://localhost:3001"
    echo ""
    echo "📊 Database features:"
    echo "   - Persistent user sessions"
    echo "   - Registration tracking"
    echo "   - Statistics and analytics"
    echo "   - Data backup and recovery"
else
    echo ""
    echo "❌ Database setup failed."
    echo "📋 Please check:"
    echo "1. PostgreSQL is running"
    echo "2. Database credentials in .env file"
    echo "3. Database user has proper permissions"
    exit 1
fi 