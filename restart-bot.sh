#!/bin/bash

echo "🔄 Restarting WhatsApp Bot with debug logging..."

# Kill any existing bot processes
echo "🛑 Stopping existing bot processes..."
pkill -f "node bot.js" 2>/dev/null
pkill -f "node debug-bot.js" 2>/dev/null
sleep 2

# Clear any existing sessions
echo "🧹 Clearing existing sessions..."
rm -rf .wwebjs_auth 2>/dev/null

# Start the debug bot
echo "🚀 Starting debug bot..."
echo "📱 Scan the QR code when it appears"
echo "💬 Send a message to test the bot"
echo "🔍 Check the logs for detailed information"
echo "=================================="

node debug-bot.js 