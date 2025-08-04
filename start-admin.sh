#!/bin/bash

echo "🚀 Starting WhatsApp Bot Admin Panel..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the bot (which includes admin panel)
echo "🤖 Starting WhatsApp Bot with Admin Panel..."
npm start

echo "✅ Admin Panel should be running at http://localhost:3001"
echo "📱 WhatsApp Bot is also running"
echo ""
echo "To access admin panel:"
echo "🌐 Open: http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop both bot and admin panel" 